"use client"
import ChartDropMenu from '@/presentation/dashboard/chart/ChartDropMenu';
import AgeChart from '@/presentation/dashboard/chart/AgeChart';
import CommonBarChart from '@/presentation/dashboard/chart/CommonBarChart';
import CommonPieChart from '@/presentation/dashboard/chart/CommonPieChart';
import { GenderChart } from '@/presentation/dashboard/chart/GenderChart';
import LineChartConnectNulls from '@/presentation/dashboard/chart/LineChartConnectNulls';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks';
import { TypeOfChart, TypeOfDate } from '@/core/type/enums';
import { chartActions } from '@/context/slices/chartSlice';
import { useEffect } from 'react';
import { getChartData, getReservaAverageAmountBase, getReservaUserFrequency, getReservasAmountData, getReservasAverageAmount, getReservasHoursAverage, getReservasHoursData } from '@/context/actions/chart-actions';
import { ChartTypeData, FilterChartData } from '@/core/type/chart';
import moment from 'moment';
import TriangleBarChart from '@/presentation/dashboard/chart/TriangleBarChart';
import { PieChart } from 'recharts';
import { appendSerachParams } from '@/core/util/routes';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Paper, Typography } from '@mui/material';

const Page= ({params}:{params:{uuid:string}})=>{
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()))
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const now = moment(new Date()).utc()
  const accountState = useAppSelector(state=>state.account)
  const chartState = useAppSelector(state=>state.chart)
  const startDate =  now.startOf('month').format("MMM D")
  const endDate = now.endOf('month').format("MMM D")

  const SimpleToolTip = ({ active, payload, label }:any) => {
  
    if (active) {
      return (
        <>
            {(payload != null && payload.length > 0) &&
        <Paper className="p-2 border-2 rounded-lg  border-gray-600">
            <Typography className='font-medium'>{payload[0].payload.name}
            {" "}
            {payload[0].payload.value} 
            {/* {payload[0].payload.value == 1 ? " usuario":" usuarios"} */}
            </Typography>
            </Paper>
          }
          </>
      );
    }
    return null;
  };


  const CustomTooltip = ({ active, payload, label }:any) => {
  
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
        <Paper className="p-2 border-2 rounded-lg bg-white  border-gray-600 max-w-[150px]">
            <span className='text-primary font-medium'>{payload[0].payload.value} 
            {payload[0].payload.value == 1 ? " hora":" horas"}</span>
            {payload[0].payload.date &&
            <span>{payload[0].payload.value == 1 ? " reservada ":" reservadas "} de {payload[0].payload.name} 
            {' a'} {moment(payload[0].payload.date).add(1,'hours').utc().format('LT')}</span>
            }
            </Paper>
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
        <Paper className="p-2 border-2 rounded-lg bg-white  border-gray-600 ">
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
            </Paper>
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
        <Paper className="p-2 border-2 rounded-lg bg-white  border-gray-600 ">
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
            </Paper>
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
    start_date:now.startOf('month').toISOString(),
    end_date:now.endOf('month').toISOString()
  }))
    appendSerachParams("_dialog","1",router,current,pathname)
    // dispatch(chartActions.setAllowedCharts([TypeOfDate.day,TypeOfDate.week,TypeOfDate.month,TypeOfDate.year]))
    // dispatch(chartActions.setData(chartState.response?.reserva_amount || []))
  }

  useEffect(()=>{
    // console.log(now.startOf('week').format('YYYY-MM-DD'));
    // console.log(now.endOf('week').format('YYYY-MM-DD'));
    const filterData:FilterChartData = {
      type_date:TypeOfDate.day,
      // end_date:now.add(1,"days").toISOString(),
      // start_date:now.subtract(7,"days").toISOString(),
      uuid:params.uuid,
      start_date:now.startOf('month').toISOString(),
      end_date:now.endOf('month').toISOString(),
      // instalaciones:[1]
    }
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
        });
    };
  },[])
    return(
      <div className="flex flex-col lg:grid  lg:grid-cols-6 gap-3 p-4 pt-10 xl:pt-4 h-screen">

        
      <ChartDropMenu
      title="Ingresos"
      subtitle={`Ingresos recibidos (${startDate} - ${endDate})`}
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
        legendLabels={["Local","Eventos"]}
        showLegend={true}
        closeDialog={chartState.closeDialog}
        chartTypeData={ChartTypeData.INGRESOS_RESERVAS}
      >
        <CommonBarChart
          data={chartState.response?.reserva_amount || []}
          loading={chartState.loading}
          barSize={40}
          keyValue2='value2'
          singleColor={true}
          legendLabels={["Local","Eventos"]}
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
       subtitle={`Total de horas reservadas (${startDate} - ${endDate})`}
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
        legendLabels={["Local","Eventos"]}
        showLegend={true}
      closeDialog={chartState.closeDialog}
      chartTypeData={ChartTypeData.HORAS_RESERVAS}
      >
    <LineChartConnectNulls    
    data={chartState.response?.reserva_count_hours || []}
    loading={chartState.loading}
    fontSize={12}
    legendLabels={["Local","Eventos"]}
    keyValue2='value2'
    // CustomToolTip={CustomTooltip}
    CustomToolTip={CustomTooltipCountHoursStacked}
    />
    </ChartDropMenu>

    <ChartDropMenu
      title="Horas reservadas"
      subtitle={`Promedio de horas reservadas (${startDate} - ${endDate})`}
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
        dispatch(getReservaAverageAmountBase(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.pie,TypeOfDate.day)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.pie))
        dispatch(chartActions.setAllowedCharts([]))
        dispatch(chartActions.setData(chartState.response?.reserva_count_hours_base || []))
      }}
      closeDialog={chartState.closeDialog}
      chartTypeData={ChartTypeData.HORAS_RESERVADAS_AVERAGE}
      >
      <CommonPieChart
      data={chartState.response?.reserva_count_hours_base || []}
      loading={chartState.loading}
      />
      </ChartDropMenu>


    <ChartDropMenu
      title="Horas reservadas"
      subtitle={`Promedio de horas reservadas (${startDate} - ${endDate})`}
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
      chartTypeData={ChartTypeData.HORAS_RESERVADAS_AVERAGE}
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
      subtitle={`Promedio de ingresos (${startDate} - ${endDate})`}
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
        dispatch(getReservaAverageAmountBase(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.pie,TypeOfDate.day)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.pie))
        dispatch(chartActions.setAllowedCharts([]))
        dispatch(chartActions.setData(chartState.response?.reserva_amount_base || []))
      }}
      closeDialog={chartState.closeDialog}
      chartTypeData={ChartTypeData.INGRESOS_AVERAGE}
      >
      <CommonPieChart
      data={chartState.response?.reserva_amount_base || []}
      loading={chartState.loading}
      />
      </ChartDropMenu>


      <ChartDropMenu
      title="Ingresos por día"
      subtitle={`Ingresos por día (${startDate} - ${endDate})`}
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
        legendLabels={["Local","Eventos"]}
        showLegend={true}
        closeDialog={chartState.closeDialog}
        chartTypeData={ChartTypeData.INGRESOS_RESERVAS}
      >
        <CommonBarChart
          data={chartState.response?.reserva_amount_average || []}
          loading={chartState.loading}
          barSize={40}
          keyValue2='value2'
          singleColor={true}
          legendLabels={["Local","Eventos"]}
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
      subtitle={`Usuarios nuevos y usuarios repetidos (${startDate} - ${endDate})`}
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
        dispatch(getReservaUserFrequency(data))
      }}
      setData={()=>{
        resetFilterData(TypeOfChart.bar,TypeOfDate.day)
        // dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))
        dispatch(chartActions.setAllowedCharts([]))
        dispatch(chartActions.setData(chartState.response?.user_frequency || []))
      }}
      closeDialog={chartState.closeDialog}
      chartTypeData={ChartTypeData.USUARIOS}
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