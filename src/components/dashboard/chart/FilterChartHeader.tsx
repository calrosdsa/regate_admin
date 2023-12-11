import ButtonIcon from "@/components/util/button/ButtonIcon";
import MenuLayout from "@/components/util/button/MenuLayout";
import { chartActions } from "@/context/slices/chartSlice";
import { FilterChartData } from "@/core/type/chart";
import { TypeOfChart, TypeOfDate } from "@/core/type/enums";
import { Menu, Popover } from "@headlessui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

const FilterChartHeader = ({hideHeader,setTypeOfDate,setHideHeader,close,applyTypeChart,filterData,
chartType,getNewData,allowedCharts,label}:{
    close:()=>void
    hideHeader:boolean
    setHideHeader:(bool:boolean)=>void
    getNewData:(data:FilterChartData)=>void
    chartType:TypeOfChart
    filterData:FilterChartData
    allowedCharts:TypeOfDate[]
    setTypeOfDate:(type_date:TypeOfDate)=>void
    applyTypeChart:(typeOfChart:TypeOfChart)=>void
    label:string
}) =>{
    const [initialData,setInitialData ] = useState<FilterChartData | null>(null)
    const [typeChart,setTypeChart] = useState(chartType)
    const [value, setValue] = useState<DateValueType>({
        startDate: new Date(filterData.start_date as string) || new Date(),
        endDate: new Date(filterData.end_date as string) || new Date(),
    });
    
    const handleValueChange = (value:DateValueType) => {
        const data:FilterChartData = {
          ...filterData,
          start_date:value?.startDate?.toString(),
          end_date:value?.endDate?.toString(),
        }
        getNewData(data)
        setValue(value);
    };

    const reset = () =>{
      if(initialData != null){ 
        const data:FilterChartData = {
          ...initialData,
        }
        filterData = initialData
        setValue({
          startDate:new Date(filterData.start_date as string) || new Date(),
          endDate:new Date(filterData.end_date as string) || new Date(),
        })
        getNewData(data)
      }
    }

    useEffect(()=>{
      setInitialData(filterData)
    },[])

    return(
        <>
        <div className={`${hideHeader? "hidden" :
        "bg-white fixed top-0 w-full left-0  z-20 border-b-2 overflow-auto"}`}>
            <div className='flex w-full justify-between items-center  p-2 space-x-6 pb-3'>
              {/* {JSON.stringify(filterData)} */}
                  <div className='flex space-x-4'>
                      <span className='title whitespace-nowrap border-gray-400 pr-2'>{label}</span>
                      {/* <span className=' whitespace-nowrap'>Casos Count</span> */}
                  </div>

                  <div className='flex space-x-3'>
                    <button onClick={()=>{reset()}}  className='smallButton h-8 grid place-content-center text-primary border-primary
                    hover:bg-primary hover:bg-opacity-20'>
                        <span>Reset</span>
                    </button>
                  <button onClick={()=>{
                    close()
                    //   closeModal()
                    //   router.replace( {}, undefined, {})
                      }} className='smallButton h-8 grid place-content-center whitespace-nowrap'>
                      <span>Back to dashboard</span>
                  </button>
                  </div>
              </div>
                
              </div>

              <div className="flex overflow-auto pb-3 space-x-3 p-2">

                <div className="smallButton px-2" onClick={()=>{
                   const data:FilterChartData = {
                    ...filterData,
                    start_date:moment(value?.startDate?.toString()).utc().format(),
                    end_date:moment(value?.endDate?.toString()).utc().format(),
                  }
                  getNewData(data)
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-600">
  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                 </svg>
                </div>

                {/* <div className=" smallButton">
                  dasdas
                </div> */}

                <div className=" ">
              <Datepicker value={value} onChange={handleValueChange} 
                        // showFooter={true}
                        containerClassName={"w-full"}
                        i18n="es"
                        configs={{
                            shortcuts:{
                                today:"Hoy",
                                yesterday: "Ayer" ,
                                past: period => `Últimos ${period} días`,
                                currentMonth: "Este mes" ,
                                pastMonth: "El mes pasado",
                            }
                        }}
                        inputClassName={"w-[180px] smallButton outline-none text-sm p-2 cursor-pointer"}
                        toggleClassName={"hidden"}
                        showShortcuts={true}
                        primaryColor="indigo"
                        />
                        </div>
              <div className="flex w-full">
              {allowedCharts.includes(TypeOfDate.hour) &&
                <button onClick={()=>setTypeOfDate(TypeOfDate.hour)}
                 className={`smallButton px-2 ${TypeOfDate.hour == filterData.type_date && "border-primary text-primary"}`}>
                    Hora
                </button>
                }
                {allowedCharts.includes(TypeOfDate.day) &&
                <button onClick={()=>setTypeOfDate(TypeOfDate.day)}
                 className={`smallButton px-2 ${TypeOfDate.day == filterData.type_date && "border-primary text-primary"}`}>
                    Dia
                </button>
                }
                {allowedCharts.includes(TypeOfDate.week) &&
                <button onClick={()=>setTypeOfDate(TypeOfDate.week)}
                className={`smallButton px-2 ${TypeOfDate.week == filterData.type_date && "border-primary text-primary"}`}>
                    Semana
                </button>
                }
                {allowedCharts.includes(TypeOfDate.month) &&
                <button onClick={()=>setTypeOfDate(TypeOfDate.month)}
                className={`smallButton px-2 ${TypeOfDate.month == filterData.type_date && "border-primary text-primary"}`}>
                    Mes
                </button>
                }
                {allowedCharts.includes(TypeOfDate.year) &&
                <button onClick={()=>setTypeOfDate(TypeOfDate.year)}
                className={`smallButton px-2 ${TypeOfDate.year == filterData.type_date && "border-primary text-primary"}`}>
                    Año
                </button>
                }
            </div>

            
            <button className="smallButton" onClick={()=>setHideHeader(!hideHeader)}>  
            {hideHeader?
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
        </svg>  
            :
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
        </svg>
            }
            </button>

            <Popover className="">
      <Popover.Button className={`smallButton h-9 flex items-center px-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
      </Popover.Button>
      <Popover.Panel className="absolute z-10 right-1 mt-1 w-40 shadow-xl  bg-white">
        {({close})=>(
          <>
          <div className=" border-b-[1px] border-gray-400">
          <span className="text-sm font-semibold px-2 pt-2">Chart Type</span>
        <div onClick={()=>setTypeChart(TypeOfChart.line)} className="flex space-x-2 w-24 items-center p-2 cursor-default hover:bg-gray-200">
          <input onChange={(e)=>setTypeChart(Number(e.target.value))} type="radio" name="chart" value={TypeOfChart.line}
            checked={typeChart == TypeOfChart.line}/>
          <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Interface / Chart_Line">
        <path id="Vector" d="M3 15.0002V16.8C3 17.9201 3 18.4798 3.21799 18.9076C3.40973 19.2839 3.71547 19.5905 4.0918 19.7822C4.5192 20 5.07899 20 6.19691 20H21.0002M3 15.0002V5M3 15.0002L6.8534 11.7891L6.85658 11.7865C7.55366 11.2056 7.90288 10.9146 8.28154 10.7964C8.72887 10.6567 9.21071 10.6788 9.64355 10.8584C10.0105 11.0106 10.3323 11.3324 10.9758 11.9759L10.9822 11.9823C11.6357 12.6358 11.9633 12.9635 12.3362 13.1153C12.7774 13.2951 13.2685 13.3106 13.7207 13.1606C14.1041 13.0334 14.4542 12.7275 15.1543 12.115L21 7" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        </svg>
          <span>Line</span>
        </div>

        <div onClick={()=>setTypeChart(TypeOfChart.bar)} className="flex space-x-2 w-24 items-center p-2 cursor-default hover:bg-gray-200">
          <input onChange={(e)=>setTypeChart(Number(e.target.value))} type="radio" name="chart" value={TypeOfChart.bar}
          checked={typeChart == TypeOfChart.bar}/>
        <svg fill="#000000" width="22px" height="22px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" id="memory-chart-bar"><path d="M2 2H4V18H20V20H2V2M6 16V8H10V16H6M11 16V4H15V16H11M16 16V11H20V16H16Z" /></svg>  
          <span>Bars</span>
        </div>
        
        <div onClick={()=>setTypeChart(TypeOfChart.pie)} className="flex space-x-2 w-24 items-center p-2 cursor-default hover:bg-gray-200">
          <input onChange={(e)=>setTypeChart(Number(e.target.value))} type="radio" name="chart" value={TypeOfChart.pie}
          checked={typeChart == TypeOfChart.pie}/>
        {/* <svg fill="#000000" width="22px" height="22px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" id="memory-chart-bar"><path d="M2 2H4V18H20V20H2V2M6 16V8H10V16H6M11 16V4H15V16H11M16 16V11H20V16H16Z" /></svg>   */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path d="M12 9a1 1 0 01-1-1V3c0-.553.45-1.008.997-.93a7.004 7.004 0 015.933 5.933c.078.547-.378.997-.93.997h-5z" />
  <path d="M8.003 4.07C8.55 3.992 9 4.447 9 5v5a1 1 0 001 1h5c.552 0 1.008.45.93.997A7.001 7.001 0 012 11a7.002 7.002 0 016.003-6.93z" />
</svg>
          <span>Pie</span>
        </div>

        </div>
        <div className="px-2 py-1">
        <button onClick={()=>{
            applyTypeChart(typeChart)
          close()
        }}
         className="smallButton w-min bg-blue-500  hover:bg-blue-600 p-1 px-2
         text-white">Apply</button>     
                    </div>
         </>
             )}
      </Popover.Panel>
    </Popover>

              </div>
            </>
    )
}

export default FilterChartHeader;