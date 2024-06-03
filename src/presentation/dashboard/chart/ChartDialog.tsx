import DialogLayout from "@/presentation/util/dialog/DialogLayout"
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Datepicker, { DateRangeType, DateValueType } from "react-tailwindcss-datepicker";
import FilterChartHeader from "./FilterChartHeader";
import { TypeOfChart, TypeOfDate } from "@/core/type/enums";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import CommonPieChart from "./CommonPieChart";
import Loading from "@/presentation/util/loaders/Loading";
import CommonBarChart from "./CommonBarChart";
import LineChartConnectNulls from "./LineChartConnectNulls";
import StackedBarChart from "./StackedBarChart";
import { chartActions } from "@/context/slices/chartSlice";
import { ChartExportRequest, ChartTypeData, FilterChartData, TypeValueChart } from "@/core/type/chart";
import Loader from "@/presentation/util/loaders/Loader";
import { exportDashboardDataExcel } from "@/context/actions/download-actions";
import { useParams } from "next/navigation";
import { fetchInstalaciones } from "@/context/actions/data-actions";
import { Paper, Table, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "@/presentation/util/table/StyleTableCell";


const ChartDialog = ({open,close,CustomToolTip,getNewData,showLegend,legendLabels,singleColor,
keyValue2,label,chartTypeData}:{
    open:boolean
    close:()=>void
    getNewData:(data:FilterChartData)=>void
    CustomToolTip:({ active, payload, label }: any) => React.JSX.Element | null
    singleColor:boolean
    showLegend:boolean
    legendLabels:string[]
    keyValue2?:string
    label:string
    chartTypeData:ChartTypeData
}) =>{
    const dispatch = useAppDispatch()
    // const [typeDate,setTypeDate] = useState(TypeOfDate.day)
    const [hideHeader,setHideHeader] = useState(false)
    const chartState = useAppSelector(state=>state.chart)
    const loadingInstalaciones = useAppSelector(state=>state.ui.fetchLoading)
    const instalaciones = useAppSelector(state=>state.data.instalaciones)
    const [ shouldShowSecondLabel,setShowSecondLabel ]= useState(false)
    const [labelName,setLabelName] = useState("")
    const [valueName,setValueName] = useState("")
    const [typeValue,setTypeValue] = useState(TypeValueChart.NONE)
    const params = useParams()

    const getTypeValue = () =>{
        switch(typeValue){
            case TypeValueChart.HOURS:
                return "hrs."
            case TypeValueChart.INGRESOS:    
                return "BOB"
            default:
                return ""
        }
    }

    const getTypeOfDate = (typeDate:TypeOfDate) =>{
        switch(typeDate){
            case TypeOfDate.hour:
                setLabelName("Hora")
                break;
            case TypeOfDate.day:
                setLabelName("Dia")
                break;
            case TypeOfDate.week:
                setLabelName("Semana")
                break;
            case TypeOfDate.month:
                setLabelName("Mes")
                break;
            case TypeOfDate.year:
                setLabelName("Año")
                break;
            default:
                setLabelName("")
        }
    }

    const getLabel = ()=>{
        switch(chartTypeData){
            case ChartTypeData.INGRESOS_RESERVAS:
                setTypeValue(TypeValueChart.INGRESOS)
                setShowSecondLabel(true)
                setValueName("Local")
                setLabelName("Fecha")
                break;
            case ChartTypeData.HORAS_RESERVAS:
                setTypeValue(TypeValueChart.HOURS)
                setShowSecondLabel(true)
                setValueName("Local")
                setLabelName("Fecha")
                break;
            case ChartTypeData.HORAS_RESERVADAS_AVERAGE:
                setTypeValue(TypeValueChart.HOURS)
                setShowSecondLabel(false)    
                if(chartState.data.length > 2){
                    getTypeOfDate(chartState.filterData.type_date)
                }else{
                    setLabelName("Origen")
                    setValueName("Horas")
                }
                break;
            case ChartTypeData.INGRESOS_AVERAGE:
                setTypeValue(TypeValueChart.INGRESOS)
                setShowSecondLabel(false)    
                if(chartState.data.length > 2){
                    getTypeOfDate(chartState.filterData.type_date)
                }else{
                    setLabelName("Origen")
                    setValueName("Ingresos")
                }
                break; 
            case ChartTypeData.USUARIOS:
                setShowSecondLabel(false)    
                setLabelName("Usuarios")
                setValueName("Cantidad de usuarios")
                break;
            default:
                setShowSecondLabel(false)
                setValueName("Local")
                setLabelName("Fecha")
        }
    }

    const exportData = () =>{
        const hasSecondLabel = chartState.data[0].value2 != null
        const labels =hasSecondLabel? ["",labelName,valueName,"App"] : ["",labelName,valueName]
        const request:ChartExportRequest = {
            has_value_2:hasSecondLabel,
            data:chartState.data,
            labels:labels,
            type_value_chart:typeValue
        }
        dispatch(exportDashboardDataExcel(request))
    }

    useEffect(()=>{
        getLabel()
    },[])
    return(
        <>
        <Transition appear show={open} as={Fragment}>
    <Dialog as='div' className='relative z-50' open={open} onClose={close}>
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
      <Paper>
            <div className=' h-screen overflow-auto relative'>
            <div className={`border-[1px] md:m-3   border-gray-400  
             ${hideHeader ? "mt-2" : "mt-16 md:mt-16" }`}>
                            <FilterChartHeader
                            hideHeader={hideHeader}
                            chartType={chartState.typeOfChart}
                            filterData={chartState.filterData}
                            allowedCharts={chartState.allowedCharts}
                            close={close}
                            label={label}
                            setTypeOfDate={(type_date)=>{
                                const data = {
                                    ...chartState.filterData,
                                    type_date:type_date
                                }
                                getNewData(data)
                                getTypeOfDate(data.type_date)
                                // dispatch(chartActions.setFilterData({
                                //     ...chartState.filterData,
                                //     type_date:type_date
                                // }))    
                            }}
                            getNewData={getNewData}
                            setHideHeader={(bool)=>setHideHeader(bool)}
                            applyTypeChart={(type:TypeOfChart)=>dispatch(chartActions.setTypeOfChart(type))}
                            exportData={exportData}
                            instalaciones={instalaciones}
                            getInstalaciones={()=>{
                                dispatch(fetchInstalaciones(params.uuid as string))
                            }}
                            loadingInstalaciones={loadingInstalaciones}
                            chartTypeData={chartTypeData}
                            />

               <div className='border-t-[1px] border-gray-400 p-2 sm:p-3 relative'>
                    {/* <div className='pb-5'>Total de casos creados</div> */}
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

             <div className={`border-t-[1px] border-gray-400 sm:p-3 relative overflow-auto w-full `}>
                {/* {chartState.loading ?
          <Loader className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '/>
                : */}
                <Paper elevation={2}>
                <TableContainer>
                    <Table>
             {/* <table className="w-full shadow-xl"> */}

             <TableHead >
            <TableRow>
                <StyledTableCell>
                </StyledTableCell>
                <StyledTableCell>
                   {labelName}
                </StyledTableCell>
                <StyledTableCell>
                    {valueName}
                </StyledTableCell>        
                {shouldShowSecondLabel &&
                <StyledTableCell>
                    App
                </StyledTableCell>
                }
            </TableRow>
        </TableHead>
        <tbody>
            {chartState.data.map((item,index)=>{
                return(
                    <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}.-</StyledTableCell>
                        <StyledTableCell>{item.name}</StyledTableCell>
                        <StyledTableCell>{item.value} {getTypeValue()}</StyledTableCell>
                        {shouldShowSecondLabel &&
                            <StyledTableCell>{item.value2} {getTypeValue()}</StyledTableCell>
                        }
                    </StyledTableRow>
                )
            })}
        </tbody>
                </Table>
                </TableContainer>
                </Paper>

        {/* } */}
             </div>



                            </div>
                        </div>
                        </Paper>
            </Transition.Child>
            </div>
            </Dialog>
            </Transition>
        </>
    )
}

export default ChartDialog;