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
import { getChartData, getReservasAmountData, getReservasHoursAverage, getReservasHoursData } from '@/context/actions/chart-actions';
import { FilterChartData } from '@/core/type/chart';
import moment from 'moment';
import TriangleBarChart from '@/components/dashboard/chart/TriangleBarChart';
// import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
const data1 = [
  { name: "Masculino", pv: 24 },
  { name: "Femenino", pv: 15 },
  { name: "Sin definir", pv: 32 },
  { name: "No binario", pv: 4 },
  
];
const data = [
  {
    name: 'Nuevos',
    pv: 4000,
  },
  {
    name: 'Repetidos',
    pv: 3000,
  },
];
const data3 = [
  {
    name: '00:00',
    pv: 2400,
  },
  {
    name: '02:00',
    pv: 1398,
  },
  {
    name: '04:00',
    pv: 4800,
  },
  {
    name: '06:00',
    pv: 3908,
  },
  {
    name: '08:00',
    pv: 4800,
  },
  {
    name: '10:00',
    pv: 3800,
  },
  {
  name: '12:00',
  pv: 3800,
  },
  {
    name: '14:00',
    pv: 4800,
  },
  {
    name: '16:00',
    pv: 3800,
  },
  {
  name: '18:00',
  pv: 1500,
  },
  {
    name: '20:00',
    pv: 5800,
  },
  {
  name: '22:00',
  pv: 3800,
  },
 
];
const Page= ({params}:{params:{uuid:string}})=>{
  const dispatch = useAppDispatch()
  const accountState = useAppSelector(state=>state.account)
  const chartState = useAppSelector(state=>state.chart)
  const dataR = [
    {name:"13/10/2022",value:10},
    {name:"13/10/2022",value:50},
    {name:"13/10/2022",value:150},
    {name:"13/10/2022",value:30},
    {name:"13/10/2022",value:110},
    {name:"13/10/2022",value:20},
    {name:"13/10/2022",value:50},
  ]

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

  useEffect(()=>{
    
// {
//     "establecimiento_id":1,
//     "start_date":"2023-09-02 23:00:00",
//     "end_date":"2023-09-22 23:00:00",
//     "type_date":1
// }
    const now = moment(new Date()).utc()
  

    const filterData:FilterChartData = {
      type_date:TypeOfDate.day,
      end_date:now.toISOString(),
      start_date:now.subtract(7,"days").toISOString(),
      uuid:params.uuid
    }
    console.log(filterData)
    dispatch(chartActions.setFilterData(filterData))
    dispatch(getChartData(filterData))
  },[])
    return(
      <div className="flex flex-col lg:grid  lg:grid-cols-6 gap-3 p-4 pt-10 xl:pt-4 h-screen">
     
      <div className='relative col-start-1 col-span-2 border-[1px] border-gray-500 rounded-lg p-2'>
      <div className='flex justify-between pb-4'>
        <div className="grid">
            <span className='title'>Visitors Online Now</span>
            <span className=" text-xs">Last refreshed: 08:34 09/05/2023</span>
        </div>
        <button>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
        className="w-8 h-8 button2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
          </button>
        </div>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl text-gray-400 font-semibold">120</span>
      </div>
      <ChartDropMenu
       title="Horas reservadas"
       subtitle="Total de horas reservadas en los últimos 30 días"
      setTypeOfChart={()=>dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))}
      CustomToolTip={CustomTooltip}
      className='col-start-3 col-span-full'
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
        dispatch(chartActions.setTypeOfChart(TypeOfChart.line))
        dispatch(chartActions.setFilterData({...chartState.filterData,type_date:TypeOfDate.day}))
        dispatch(chartActions.setAllowedCharts([TypeOfDate.day,TypeOfDate.week,TypeOfDate.month,TypeOfDate.year]))
        dispatch(chartActions.setData(chartState.response?.reserva_count_hours || []))
      }}
      >
    <LineChartConnectNulls    
    data={chartState.response?.reserva_count_hours || []}
    loading={chartState.loading}
    fontSize={12}
    CustomToolTip={CustomTooltip}
    />
    </ChartDropMenu>


    <ChartDropMenu
      title="Horas reservadas"
      subtitle="Promedio de horas reservadas en los últimos 30 días"
      className='col-start-1 col-span-4'
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
        dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))
        dispatch(chartActions.setFilterData({...chartState.filterData,type_date:TypeOfDate.hour}))
        dispatch(chartActions.setAllowedCharts([TypeOfDate.hour,TypeOfDate.day,TypeOfDate.month]))
        dispatch(chartActions.setData(chartState.response?.reserva_hour_average || []))
      }}
      >
        <CommonBarChart
          data={chartState.response?.reserva_hour_average || []}
          loading={chartState.loading}
          barSize={80}
          CustomToolTip={CustomTooltipAvergeHours}
          //  angle={310}
          //  minTickGap={-20}
          fontSize={12}
          //  marginBottom={25}
          //  tickMargin={20}
          /> 
      </ChartDropMenu>


      <ChartDropMenu
      title="Visit count"
      subtitle="Total visits for the last 30 days"
      className='col-start-5 col-span-full'
      setTypeOfChart={()=>dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))}
      CustomToolTip={CustomTooltip}
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
        dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))
        dispatch(chartActions.setFilterData({...chartState.filterData,type_date:TypeOfDate.day}))
        dispatch(chartActions.setAllowedCharts([TypeOfDate.hour,TypeOfDate.day,TypeOfDate.month]))
        dispatch(chartActions.setData(chartState.response?.reserva_day_average || []))
      }}
      >
        <TriangleBarChart
          data={chartState.response?.reserva_day_average || []}
          loading={chartState.loading}
          barSize={60}
          angle={310}
           minTickGap={-20}
          CustomToolTip={CustomTooltip}
          fontSize={12}
           marginBottom={20}
           tickMargin={20}
          /> 
      </ChartDropMenu>


      <ChartDropMenu
      title="Horas reservadas"
      subtitle="Promedio de horas reservadas en los últimos 30 días"
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
        dispatch(getReservasAmountData(data))
      }}
      setData={()=>{
        dispatch(chartActions.setTypeOfChart(TypeOfChart.bar))
        dispatch(chartActions.setFilterData({...chartState.filterData,type_date:TypeOfDate.day}))
        dispatch(chartActions.setAllowedCharts([TypeOfDate.day,TypeOfDate.week,TypeOfDate.month,TypeOfDate.year]))
        dispatch(chartActions.setData(chartState.response?.reserva_amount || []))
      }}

        keyValue2='value2'
        singleColor={true}
        legendLabels={["Local","App"]}
        showLegend={true}
      >
        <CommonBarChart
          data={chartState.response?.reserva_amount || []}
          loading={chartState.loading}
          barSize={80}
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
      

        <GenderChart
        data={data1} xKey="name" yKey="pv"
        title="Gender"
        subtitle="Total visitors for the last 30 days"
        />

    <AgeChart
    title="Age"
    subtitle="Total visits for the last 30 days"
    />


<div className='col-start-1 col-span-2 border-[1px] border-gray-500 rounded-lg p-2 bg-[#A2BBD2]'>
        <div className='grid pb-4'>
            <span className='title'>New vs repeat</span>
            <span className=" text-xs">Total visitors for the last 30 days</span>
        </div>
        {/* <CommonBarChart data={data}/> */}
</div>

<div className='col-start-3 col-span-2 border-[1px] border-gray-500 rounded-lg p-2'>
        <div className='grid pb-4'>
            <span className='title'>Connection method</span>
            <span className=" text-xs">Total visitors for the last 30 days</span>
        </div>
        {/* <CommonPieChart/> */}
</div>

<div className='col-start-5 col-span-2 border-[1px] border-gray-500 rounded-lg p-2'>
        <div className='grid pb-4'>
            <span className='title'>Hour of day</span>
            <span className=" text-xs">Total visitors for the last 30 days</span>
        </div>
        {/* <CommonBarChart data={data3}
        angle={310}
        minTickGap={-25}
        fontSize={12}
        marginBottom={25}
        tickMargin={20}
        /> */}
</div>
    </div>
    )
}

export default Page;