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
import { getChartData, getReservasHoursData } from '@/context/actions/chart-actions';
import { FilterChartData } from '@/core/type/chart';
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
const Page= ()=>{
  const dispatch = useAppDispatch()
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

  useEffect(()=>{
    
// {
//     "establecimiento_id":1,
//     "start_date":"2023-09-02 23:00:00",
//     "end_date":"2023-09-22 23:00:00",
//     "type_date":1
// }
    const filterData:FilterChartData = {
      type_date:TypeOfDate.day,
      start_date:"2023-08-22 00:00:00",
      end_date:"2023-09-22 00:00:00",
      establecimiento_id:1
    }
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
      title="Visit count"
      subtitle="Total visits for the last 30 days"
      typeOfChart={TypeOfChart.line}
      setData={()=>{
        dispatch(chartActions.setData(dataR))
      }}
      >
    <LineChartConnectNulls    
    data={chartState.response?.reserva_count_hours || []}
    loading={chartState.loading}
    fontSize={12}
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


<div className='col-start-1 col-span-2 border-[1px] border-gray-500 rounded-lg p-2'>
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