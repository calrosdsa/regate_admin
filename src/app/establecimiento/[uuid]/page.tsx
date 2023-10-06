"use client"
import ChartDropMenu from '@/components/dashboard/chart/ChartDropMenu';
import AgeChart from '@/components/dashboard/chart/AgeChart';
import CommonBarChart from '@/components/dashboard/chart/CommonBarChart';
import CommonPieChart from '@/components/dashboard/chart/CommonPieChart';
import { GenderChart } from '@/components/dashboard/chart/GenderChart';
import LineChartConnectNulls from '@/components/dashboard/chart/LineChartConnectNulls';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks';
import { TypeOfChart, TypeOfDate } from '@/core/type/enums';
import { chartActions } from '@/context/slices/chartSlice';
import { useEffect } from 'react';
import { getChartData, getReservaAverageAmountBase, getReservaUserFrequency, getReservasAmountData, getReservasAverageAmount, getReservasHoursAverage, getReservasHoursData } from '@/context/actions/chart-actions';
import { FilterChartData } from '@/core/type/chart';
import moment from 'moment';
import TriangleBarChart from '@/components/dashboard/chart/TriangleBarChart';
import { PieChart } from 'recharts';
import { appendSerachParams } from '@/core/util/routes';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const Page= ({params}:{params:{uuid:string}})=>{
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()))
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const now = moment(new Date()).utc()
  const accountState = useAppSelector(state=>state.account)
  const chartState = useAppSelector(state=>state.chart)
  const lastDays = 7


  const SimpleToolTip = ({ active, payload, label }:any) => {
    // console.log(active, payload, label);
  
    if (active) {
      return (
        <>
            {(payload != null && payload.length > 0) &&
        <div className="p-2 border-2 rounded-lg bg-white  border-gray-600">
            <span className='font-medium'>{payload[0].payload.name}
            {" "}
            {payload[0].payload.value} 
            {/* {payload[0].payload.value == 1 ? " usuario":" usuarios"} */}
            </span>
            </div>
          }
          </>
      );
    }
    return null;
  };


  const CustomTooltip = ({ active, payload, label }:any) => {
    // console.log(active, payload, label);
  
    if (active) {
      return (
        <>
            {(payload != null && payload.length > 0) &&
        <div className="p-2 border-2 rounded-lg bg-white  border-gray-600 max-w-[150px]">
            <span className='text-primary font-medium'>{payload[0].payload.value} 
            {payload[0].payload.value == 1 ? " hora":" horas"}</span>
            <span> {payload[0].payload.value == 1 ? " reservada":" reservadas"} el {payload[0].payload.name}</span>
            </div>
          }
          </>
      );
    }
    return null;
  };

  
  const CustomTooltipAvergeHours = ({ active, payload, label }:any) => {
    if (active) {
      return (
        <>
            {(payload != null && payload.length > 0) &&
        <div className="p-2 border-2 rounded-lg bg-white  border-gray-600 max-w-[150px]">
            <span className='text-primary font-medium'>{payload[0].payload.value} 
            {payload[0].payload.value == 1 ? " hora":" horas"}</span>
            {payload[0].payload.date &&
            <span>{payload[0].payload.value == 1 ? " reservada ":" reservadas "} de {payload[0].payload.name} 
            {' a'} {moment(payload[0].payload.date).add(1,'hours').utc().format('LT')}</span>
            }
            </div>
          }
          </>
      );
    }

    return null;
  };

  const CustomTooltipAvergeHoursStacked = ({ active, payload, label }:any) => {
    if (active) {
      return (
        <>
            {(payload != null && payload.length > 0) &&
        <div className="p-2 border-2 rounded-lg bg-white  border-gray-600 ">
          <span className=' whitespace-nowrap'>{payload[0].payload.name}</span>
          {payload.map((item:any,idx:number)=>{
            return(
              <div key={idx}>
              <span style={{
                color:item.color,
                fontWeight:600
              }}>{item.value}Bs</span>
              </div>
          )
          })}
          <span>Total:{payload.map((item:any)=>item.value).reduce((partial:number,a:number)=>partial+a,0)}Bs</span>
            </div>
          }
          </>
      );
    }

    return null;
  };

  
  const CustomTooltipCountHoursStacked = ({ active, payload, label }:any) => {
    if (active) {
      return (
        <>
            {(payload != null && payload.length > 0) &&
        <div className="p-2 border-2 rounded-lg bg-white  border-gray-600 ">
          <span className=' whitespace-nowrap'>{payload[0].payload.name}</span>
          {payload.map((item:any,idx:number)=>{
            return(
              <div key={idx}>
              <span style={{
                color:item.color,
                fontWeight:600
              }}>{item.value} Horas</span>
              </div>
          )
          })}
          <span>Total:{payload.map((item:any)=>item.value).reduce((partial:number,a:number)=>partial+a,0)} Hrs</span>
            </div>
          }
          </>
      );
    }

    return null;
  };

  const resetFilterData = (typeOfChart:TypeOfChart,typeDate:TypeOfDate) => {
    dispatch(chartActions.setCloseDialog(false))
    dispatch(chartActions.setTypeOfChart(typeOfChart))
    dispatch(chartActions.setFilterData({...chartState.filterData,type_date:typeDate,
    end_date:now.add(1,"days").toISOString(),
    start_date:now.subtract(7,"days").toISOString()}))
    appendSerachParams("_dialog","1",router,current,pathname)
    // dispatch(chartActions.setAllowedCharts([TypeOfDate.day,TypeOfDate.week,TypeOfDate.month,TypeOfDate.year]))
    // dispatch(chartActions.setData(chartState.response?.reserva_amount || []))
  }

  useEffect(()=>{
    const filterData:FilterChartData = {
      type_date:TypeOfDate.day,
      end_date:now.add(1,"days").toISOString(),
      start_date:now.subtract(7,"days").toISOString(),
      uuid:params.uuid
    }
    console.log(filterData)
    dispatch(chartActions.setFilterData(filterData))
    
    // if(chartState.response == undefined){
      dispatch(getChartData(filterData))
    // }
  },[])

  useEffect(()=>{
      window.addEventListener("popstate",()=>{
          dispatch(chartActions.setCloseDialog(true))
      });
    return () => {
        window.removeEventListener("popstate", (e)=>{
            console.log("Remove listener")
        });
    };
  },[])
    return(
      <div className="flex flex-col lg:grid  lg:grid-cols-6 gap-3 p-4 pt-10 xl:pt-4 h-screen">

        
      <ChartDropMenu
      title="Ingresos"
      subtitle={`Ingresos recibidos en los últimos ${lastDays} días.`}
      className='col-start-1 col-span-3'
      setTypeOfChart={()=>dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))}
      CustomToolTip={CustomTooltipAvergeHoursStacked}
      getNewData={(data:FilterChartData)=>{
        const currentEstablecmiento = accountState.establecimientos.find(item=>item.uuid == params.uuid)
        if(currentEstablecmiento != undefined){
         data.establecimiento_id = currentEstablecmiento.id
        }
        data.uuid = params.uuid
        dispatch(chartActions.setFilterData(data))
        console.log("FINAL FILTER DATA",data)
        dispatch(getReservasAmountData(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.bar,TypeOfDate.day)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))
        // dispatch(chartActions.setFilterData({...chartState.filterData,type_date:TypeOfDate.day}))
        dispatch(chartActions.setAllowedCharts([TypeOfDate.day,TypeOfDate.week,TypeOfDate.month,TypeOfDate.year]))
        dispatch(chartActions.setData(chartState.response?.reserva_amount || []))
      }}
        singleColor={true}
        keyValue2='value2'
        legendLabels={["Local","App"]}
        showLegend={true}
        closeDialog={chartState.closeDialog}
      >
        <CommonBarChart
          data={chartState.response?.reserva_amount || []}
          loading={chartState.loading}
          barSize={40}
          keyValue2='value2'
          singleColor={true}
          legendLabels={["Local","App"]}
          showLegend={true}
          CustomToolTip={CustomTooltipAvergeHoursStacked}
          //  angle={310}
          //  minTickGap={-20}
          fontSize={12}
          //  marginBottom={25}
          //  tickMargin={20}
          /> 
      </ChartDropMenu>

      <ChartDropMenu
       title="Horas reservadas"
       subtitle={`Total de horas reservadas en los últimos ${lastDays} días`}
      setTypeOfChart={()=>dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))}
      // CustomToolTip={CustomTooltip}
      className='col-start-4 col-span-full'
      CustomToolTip={CustomTooltipCountHoursStacked}
      getNewData={(data:FilterChartData)=>{
         const currentEstablecmiento = accountState.establecimientos.find(item=>item.uuid == params.uuid)
         if(currentEstablecmiento != undefined){
          data.establecimiento_id = currentEstablecmiento.id
         }
         data.uuid = params.uuid
         dispatch(chartActions.setFilterData(data))
         dispatch(getReservasHoursData(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.line,TypeOfDate.day)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.line))
        // dispatch(chartActions.setFilterData({...chartState.filterData,type_date:TypeOfDate.day}))
        dispatch(chartActions.setAllowedCharts([TypeOfDate.day,TypeOfDate.week,TypeOfDate.month,TypeOfDate.year]))
        dispatch(chartActions.setData(chartState.response?.reserva_count_hours || []))
      }}
        singleColor={true}
        keyValue2='value2'
        legendLabels={["Local","App"]}
        showLegend={true}
      closeDialog={chartState.closeDialog}
      >
    <LineChartConnectNulls    
    data={chartState.response?.reserva_count_hours || []}
    loading={chartState.loading}
    fontSize={12}
    legendLabels={["Local","App"]}
    keyValue2='value2'
    // CustomToolTip={CustomTooltip}
    CustomToolTip={CustomTooltipCountHoursStacked}
    />
    </ChartDropMenu>

    <ChartDropMenu
      title="Horas reservadas"
      subtitle={`Promedio de horas reservadas en los últimos ${lastDays} días`}
      className='col-start-1 col-span-2'
      setTypeOfChart={()=>dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))}
      CustomToolTip={CustomTooltipAvergeHoursStacked}
      getNewData={(data:FilterChartData)=>{
        const currentEstablecmiento = accountState.establecimientos.find(item=>item.uuid == params.uuid)
        if(currentEstablecmiento != undefined){
         data.establecimiento_id = currentEstablecmiento.id
        }
        data.uuid = params.uuid
        dispatch(chartActions.setFilterData(data))
        console.log(data)
        dispatch(getReservaAverageAmountBase(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.pie,TypeOfDate.day)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.pie))
        dispatch(chartActions.setAllowedCharts([]))
        dispatch(chartActions.setData(chartState.response?.reserva_count_hours_base || []))
      }}
      closeDialog={chartState.closeDialog}
      >
      <CommonPieChart
      data={chartState.response?.reserva_count_hours_base || []}
      loading={chartState.loading}
      />
      </ChartDropMenu>


    <ChartDropMenu
      title="Horas reservadas"
      subtitle={`Promedio de horas reservadas en los últimos ${lastDays} días`}
      className='col-start-3 col-span-4'
      setTypeOfChart={()=>dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))}
      CustomToolTip={CustomTooltipAvergeHours}
      getNewData={(data:FilterChartData)=>{
        const currentEstablecmiento = accountState.establecimientos.find(item=>item.uuid == params.uuid)
        if(currentEstablecmiento != undefined){
         data.establecimiento_id = currentEstablecmiento.id
        }
        data.uuid = params.uuid
        dispatch(chartActions.setFilterData(data))
        console.log(data)
        dispatch(getReservasHoursAverage(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.bar,TypeOfDate.hour)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))
        // dispatch(chartActions.setFilterData({...chartState.filterData,type_date:TypeOfDate.hour}))
        dispatch(chartActions.setAllowedCharts([TypeOfDate.hour,TypeOfDate.day,TypeOfDate.month]))
        dispatch(chartActions.setData(chartState.response?.reserva_hour_average || []))
      }}
      closeDialog={chartState.closeDialog}
      >
        <CommonBarChart
          data={chartState.response?.reserva_hour_average || []}
          loading={chartState.loading}
          barSize={80}
          CustomToolTip={CustomTooltipAvergeHours}
          //  angle={310}
          //  minTickGap={-20}
          fontSize={11}
          //  marginBottom={25}
          //  tickMargin={20}
          /> 
      </ChartDropMenu>

      <ChartDropMenu
      title="Ingresos"
      subtitle={`Promedio de ingresos  en los últimos ${lastDays} días`}
      className='col-start-1 col-span-2'
      setTypeOfChart={()=>dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))}
      CustomToolTip={CustomTooltipAvergeHoursStacked}
      getNewData={(data:FilterChartData)=>{
        const currentEstablecmiento = accountState.establecimientos.find(item=>item.uuid == params.uuid)
        if(currentEstablecmiento != undefined){
         data.establecimiento_id = currentEstablecmiento.id
        }
        data.uuid = params.uuid
        dispatch(chartActions.setFilterData(data))
        console.log(data)
        dispatch(getReservaAverageAmountBase(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.pie,TypeOfDate.day)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.pie))
        dispatch(chartActions.setAllowedCharts([]))
        dispatch(chartActions.setData(chartState.response?.reserva_amount_base || []))
      }}
      closeDialog={chartState.closeDialog}
      >
      <CommonPieChart
      data={chartState.response?.reserva_amount_base || []}
      loading={chartState.loading}
      />
      </ChartDropMenu>


      <ChartDropMenu
      title="Ingresos"
      subtitle={`Ingresos en los últimos ${lastDays} días (días de la semana)`}
      className='col-start-3 col-span-2'
      setTypeOfChart={()=>dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))}
      CustomToolTip={CustomTooltipAvergeHoursStacked}
      getNewData={(data:FilterChartData)=>{
        const currentEstablecmiento = accountState.establecimientos.find(item=>item.uuid == params.uuid)
        if(currentEstablecmiento != undefined){
         data.establecimiento_id = currentEstablecmiento.id
        }
        data.uuid = params.uuid
        dispatch(chartActions.setFilterData(data))
        console.log(data)
        dispatch(getReservasAverageAmount(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.bar,TypeOfDate.day)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))
        // dispatch(chartActions.setFilterData({...chartState.filterData,type_date:TypeOfDate.day}))
        dispatch(chartActions.setAllowedCharts([TypeOfDate.hour,TypeOfDate.day,TypeOfDate.month]))
        dispatch(chartActions.setData(chartState.response?.reserva_amount_average || []))
      }}
        keyValue2='value2'
        singleColor={true}
        legendLabels={["Local","App"]}
        showLegend={true}
        closeDialog={chartState.closeDialog}
      >
        <CommonBarChart
          data={chartState.response?.reserva_amount_average || []}
          loading={chartState.loading}
          barSize={40}
          keyValue2='value2'
          singleColor={true}
          legendLabels={["Local","App"]}
          showLegend={true}
          CustomToolTip={CustomTooltipAvergeHoursStacked}
          //  angle={310}
          //  minTickGap={-20}
          fontSize={11}
          //  marginBottom={25}
          //  tickMargin={20}
          /> 
      </ChartDropMenu>


      <ChartDropMenu
      title="Usuarios"
      subtitle="Usuarios nuevos y usuarios repetidos"
      className='col-start-5 col-span-2'
      setTypeOfChart={()=>dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))}
      CustomToolTip={SimpleToolTip}
      getNewData={(data:FilterChartData)=>{
        const currentEstablecmiento = accountState.establecimientos.find(item=>item.uuid == params.uuid)
        if(currentEstablecmiento != undefined){
         data.establecimiento_id = currentEstablecmiento.id
        }
        data.uuid = params.uuid
        dispatch(chartActions.setFilterData(data))
        console.log(data)
        dispatch(getReservaUserFrequency(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.bar,TypeOfDate.day)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))
        dispatch(chartActions.setAllowedCharts([]))
        dispatch(chartActions.setData(chartState.response?.user_frequency || []))
      }}
      closeDialog={chartState.closeDialog}
      >
        <CommonBarChart
          data={chartState.response?.user_frequency || []}
          loading={chartState.loading}
          barSize={100}
          CustomToolTip={SimpleToolTip}
          //  angle={310}
          //  minTickGap={-20}
          fontSize={11}
          //  marginBottom={25}
          //  tickMargin={20}
          /> 
      </ChartDropMenu>

    </div>
    )
}

export default Page;