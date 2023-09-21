import DialogLayout from "@/components/util/dialog/DialogLayout"
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Datepicker, { DateRangeType, DateValueType } from "react-tailwindcss-datepicker";
import FilterChartHeader from "./FilterChartHeader";
import { TypeOfChart, TypeOfDate } from "@/core/type/enums";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import CommonPieChart from "./CommonPieChart";
import Loading from "@/components/util/loaders/Loading";
import CommonBarChart from "./CommonBarChart";
import LineChartConnectNulls from "./LineChartConnectNulls";
import StackedBarChart from "./StackedBarChart";
import { chartActions } from "@/context/slices/chartSlice";
import { FilterChartData } from "@/core/type/chart";

const ChartDialog = ({open,close,CustomToolTip,getNewData,showLegend,legendLabels,singleColor,
keyValue2}:{
    open:boolean
    close:()=>void
    getNewData:(data:FilterChartData)=>void
    CustomToolTip:({ active, payload, label }: any) => React.JSX.Element | null
    singleColor:boolean
    showLegend:boolean
    legendLabels:string[]
    keyValue2?:string
}) =>{
    const dispatch = useAppDispatch()
    const [typeDate,setTypeDate] = useState(TypeOfDate.day)
    const [hideHeader,setHideHeader] = useState(false)
    const chartState = useAppSelector(state=>state.chart)

    
    return(
        <>
        <Transition appear show={open} as={Fragment}>
    <Dialog as='div' className='relative z-10' open={open} onClose={close}>
        <div className='fixed top-0  w-screen h-screen'>
      <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-out duration-200"
                leaveFrom="opacity-0 scale-95"
                leaveTo="opacity-0 scale-0"
              >
      <Dialog.Panel>
                                   <div className='bg-gray-100 h-screen overflow-auto'>
            <div className={`border-[1px] bg-white  m-3 border-gray-400  
             ${hideHeader ? "mt-2" : "mt-20" }`}>
                            <FilterChartHeader
                            hideHeader={hideHeader}
                            chartType={chartState.typeOfChart}
                            filterData={chartState.filterData}
                            allowedCharts={chartState.allowedCharts}
                            close={close}
                            setTypeOfDate={(type_date)=>{
                                const data = {
                                    ...chartState.filterData,
                                    type_date:type_date
                                }
                                getNewData(data)
                                // dispatch(chartActions.setFilterData({
                                //     ...chartState.filterData,
                                //     type_date:type_date
                                // }))    
                            }}
                            getNewData={getNewData}
                            setHideHeader={(bool)=>setHideHeader(bool)}
                            applyTypeChart={(type:TypeOfChart)=>dispatch(chartActions.setTypeOfChart(type))}
                            />

               <div className='border-t-[1px] border-gray-400 p-3 relative'>
                    <div className='pb-5'>Total de casos creados</div>
                    {/* {JSON.stringify(chartState.data)} */}
                {chartState.typeOfChart == TypeOfChart.bar && 
                <CommonBarChart
                    data={chartState.data}
                    loading={chartState.loading}
                    barSize={80}
                    CustomToolTip={CustomToolTip}

                    keyValue2={keyValue2}
                    singleColor={singleColor}
                    legendLabels={legendLabels}
                    showLegend={showLegend}
                    //  angle={310}
                    //  minTickGap={-20}
                    fontSize={12}
                    //  marginBottom={25}
                    //  tickMargin={20}
                    /> 
                }
                {chartState.typeOfChart == TypeOfChart.line && 
                    <LineChartConnectNulls
                    data={chartState.data}
                    loading={chartState.loading}
                    CustomToolTip={CustomToolTip}

                    keyValue2={keyValue2}
                    legendLabels={legendLabels}
                    showLegend={showLegend}
                    // barSize={80}
                    //  angle={310}
                    //  minTickGap={-20}
                    fontSize={12}
                    //  marginBottom={25}
                    //  tickMargin={20}
                    /> 
                }
                {chartState.typeOfChart == TypeOfChart.pie && 
                <CommonPieChart
                    data={chartState.data}
                    loading={chartState.loading}
                />
                }
                {chartState.typeOfChart == TypeOfChart.stack && 
                <StackedBarChart
                data={chartState.data}
                firstKey={'pendiente'}
                secondKey={'resuelto'}
                thirdKey={'no_resuelto'}
                loading={chartState.loading}
                />
                }
             </div>
                            </div>
                        </div>
                        </Dialog.Panel>
            </Transition.Child>
            </div>
            </Dialog>
            </Transition>
        </>
    )
}

export default ChartDialog;