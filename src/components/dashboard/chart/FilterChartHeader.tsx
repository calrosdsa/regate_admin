import Loading from "@/components/util/loaders/Loading";
import { ChartTypeData, FilterChartData } from "@/core/type/chart";
import { TypeOfChart, TypeOfDate } from "@/core/type/enums";
import { groupByToMap } from "@/core/util";
import { Disclosure, Menu, Popover, Transition } from "@headlessui/react";
import { Button, ButtonGroup, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Radio, Typography } from "@mui/material";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ExpandMore from "@/components/util/button/ExpandMore";
import RefreshIcon from '@mui/icons-material/Refresh';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DialogCalendar from "@/components/util/dialog/DialogCalendar";
type InstalacionGroup = {
  instalaciones:Instalacion[]
  category:string
}

const FilterChartHeader = ({hideHeader,setTypeOfDate,setHideHeader,close,applyTypeChart,filterData,
chartType,getNewData,allowedCharts,label,exportData,instalaciones,getInstalaciones,loadingInstalaciones,
chartTypeData}:{
    close:()=>void
    hideHeader:boolean
    chartType:TypeOfChart
    setHideHeader:(bool:boolean)=>void
    getNewData:(data:FilterChartData)=>void
    filterData:FilterChartData
    allowedCharts:TypeOfDate[]
    setTypeOfDate:(type_date:TypeOfDate)=>void
    applyTypeChart:(typeOfChart:TypeOfChart)=>void
    label:string
    instalaciones:Instalacion[]
    exportData:()=>void
    getInstalaciones:()=>void
    loadingInstalaciones:boolean
    chartTypeData:ChartTypeData
}) =>{
    const [initialData,setInitialData ] = useState<FilterChartData | null>(null)
    const [typeChart,setTypeChart] = useState(chartType)
    const [startDate,setStartDate] = useState<moment.Moment | null>(null)
    const [endDate,setEndDate] = useState<moment.Moment | null>(null)
    const [openStartCalendar,setOpenStartCalendar] = useState(false)
    const [openEndCalendar,setOpenEndCalendar] = useState(false)
    const [instalacionGroups,setInstalacionGroups] = useState<InstalacionGroup[]>([])
    const [selectedIds,setSelectedIds] = useState<number[]>([])
    
    const handleValueChange = (endDate:moment.Moment) => {
        const data:FilterChartData = {
          ...filterData,
          start_date:startDate?.format("YYYY-MM-DD"),
          end_date:endDate?.format("YYYY-MM-DD"),
        }
        setStartDate(null)
        setEndDate(null)
        getNewData(data)
    };

    const reset = () =>{
      if(initialData != null){ 
        const data:FilterChartData = {
          ...initialData,
        }
        filterData = initialData
        getNewData(data)
      }
    }

    const groupInstalaciones = () =>{
      setInstalacionGroups([])
      const d = groupByToMap<Instalacion,string>(instalaciones,(item)=>item.category_name)
      d.forEach((items,key)=>{
        setInstalacionGroups(e=>[...e,{
          category:key,
          instalaciones:items
        }])
      })
    }

    useEffect(()=>{
      console.log("FILTER DATA",filterData)
      setInitialData(filterData)
      groupInstalaciones()
    },[])

    useEffect(()=>{
      groupInstalaciones()
    },[instalaciones])

    return(
        <>
        {openStartCalendar &&
        <DialogCalendar
        label="Fecha Inicio"
        openModal={openStartCalendar}
        value={startDate}
        onAccept={(e)=>{
          setStartDate(e)
          setOpenEndCalendar(true)
        }}
        closeModal={()=>{
          setOpenStartCalendar(false)
        }}
        />
        }
        {openEndCalendar &&
        <DialogCalendar
        label="Fecha Fin"
        openModal={openEndCalendar}
        value={endDate}
        onAccept={(e)=>{
          if(e == null) return
          handleValueChange(e)
          setEndDate(e)
        }}
        closeModal={()=>{
          setOpenEndCalendar(false)
        }}
        />
        }
        <div className={` ${hideHeader? "hidden" :
        "fixed top-0 w-full left-0  z-20  overflow-auto"}`}>
        <Paper elevation={0}>
            <div className='flex w-full justify-between items-center  p-2 space-x-6 pb-3'>
              {/* {JSON.stringify(filterData)} */}
                  <div className='flex space-x-4'>
                      <Typography variant="h6">{label}</Typography>
                      {/* <span className=' whitespace-nowrap'>Casos Count</span> */}
                  </div>

                  <div className='flex space-x-3'>
                    
               <Button color="inherit" variant="outlined" className="px-2" onClick={()=>{
                   const data:FilterChartData = {
                    ...filterData,
                    start_date:moment(filterData.start_date).format(),
                    end_date:moment(filterData.end_date).format(),
                  }
                  getNewData(data)
                }}>
                 <RefreshIcon/>
                </Button>   
                    <Button color="inherit" variant="outlined"  onClick={()=>{reset()}}  className='smallButton h-9 grid place-content-center '>
                        <span>Reset</span>
                    </Button>
                    <IconButton size="small" onClick={close}>
                      <CloseIcon/>
                    </IconButton>
                  </div>
              </div>
                
              </Paper>
              </div>

              <div className="flex overflow-auto space-x-3 p-2">

                

                {/* <div className=" smallButton">
                  dasdas
                </div> */}
                <div>

                  <Button color="inherit" variant="outlined" onClick={()=>setOpenStartCalendar(true)}>
                    <span className=" whitespace-nowrap">
                    {moment(filterData.start_date).format("YYYY-MM-DD")} {" - "}
                    {moment(filterData.end_date).format("YYYY-MM-DD")}
                    </span>
                  </Button>                  
                </div>
      
              <div className="flex w-full">
              <ButtonGroup aria-label="Basic button group" color="inherit">

              {allowedCharts.includes(TypeOfDate.hour) &&
                <Button onClick={()=>setTypeOfDate(TypeOfDate.hour)}
                variant={TypeOfDate.hour == filterData.type_date ? "contained":"outlined"}>
                    Hora
                </Button>
                }
                {allowedCharts.includes(TypeOfDate.day) &&
                <Button onClick={()=>setTypeOfDate(TypeOfDate.day)}
                variant={TypeOfDate.day == filterData.type_date ? "contained":"outlined"}>
                  Dia
                </Button>
                }
                {allowedCharts.includes(TypeOfDate.week) &&
                <Button onClick={()=>setTypeOfDate(TypeOfDate.week)}
                variant={TypeOfDate.week == filterData.type_date ? "contained":"outlined"}>
                    Semana
                </Button>
                }
                {allowedCharts.includes(TypeOfDate.month) &&
                <Button onClick={()=>setTypeOfDate(TypeOfDate.month)}
                variant={TypeOfDate.month == filterData.type_date ? "contained":"outlined"}>
                    Mes
                </Button>
                }
                {allowedCharts.includes(TypeOfDate.year) &&
                <Button onClick={()=>setTypeOfDate(TypeOfDate.year)}
                variant={TypeOfDate.year == filterData.type_date ? "contained":"outlined"}>
                    Año
                </Button>
                }
            </ButtonGroup>
            </div>

            <Button 
            color="inherit"
            variant="outlined"
            onClick={()=>exportData()}
            >
           <DownloadIcon/>
          

            </Button>

            
            <Button color="inherit" variant="outlined" onClick={()=>setHideHeader(!hideHeader)}>  
            {hideHeader?
            <KeyboardDoubleArrowDownIcon/>
            :
            <KeyboardDoubleArrowUpIcon/>
            }
            </Button>

            <Popover className="">
      <Popover.Button>
        <Button color="inherit" variant="outlined">
                 <SettingsIcon/>
        </Button>
      </Popover.Button>
      <Popover.Panel className="absolute z-10 right-1 mt-1 w-40 shadow-xl ">
        {({close})=>(
          <Paper>
          <Typography variant="subtitle1" fontWeight={500} sx={{p:1}}>Chart Type</Typography>
          <List sx={{ width: '100%', maxWidth: 360}}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
               <ShowChartIcon/>
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined}  dense
             onClick={()=>{
              setTypeChart(TypeOfChart.line)
            }}>
              <ListItemIcon>
                <Checkbox
                  name="chart-type"
                  checked={typeChart == TypeOfChart.line}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={"Line"} />
            </ListItemButton>
          </ListItem>

          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
               <BarChartIcon/>
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined}  dense
            onClick={()=>{
              setTypeChart(TypeOfChart.bar)
            }}>
              <ListItemIcon>
                <Checkbox
                  name="chart-type"
                  checked={typeChart == TypeOfChart.bar}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={"Bars"} />
            </ListItemButton>
          </ListItem>

          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
               <PieChartIcon/>
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined}  dense
            onClick={()=>{
              setTypeChart(TypeOfChart.pie)
            }}>
              <ListItemIcon>
                <Checkbox
                  name="chart-type"
                  checked={typeChart == TypeOfChart.pie}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={"Pie"} />
            </ListItemButton>
          </ListItem>

          </List>
  

        <div className="px-2 py-1">
        <Button onClick={()=>{
            applyTypeChart(typeChart)
          close()
        }} variant="contained" size="small">Guardar</Button>     
                    </div>
         </Paper>
             )}
      </Popover.Panel>
    </Popover>

              </div>

              {chartTypeData != ChartTypeData.USUARIOS &&
              <div className="overflow-auto pb-3 space-x-3 px-2">
              <Popover className="">
              <Popover.Button onClick={()=>getInstalaciones()}>
                <Button color="inherit" variant="outlined" startIcon={<FilterAltIcon/>}>
                  Añadir filtro
                      </Button>
              </Popover.Button>

              

              <Popover.Panel className="absolute z-20 shadow-md w-64 ">
              {({ close }) => (
                <>
                <Paper elevation={4}>
                <ExpandMore title="Canchas">            
                              {loadingInstalaciones ?
                              <Loading
                              loading={loadingInstalaciones}
                              className="py-2"
                              />
                              : 
                             <List sx={{ width: '100%', maxWidth: 360 }}>

                             {instalacionGroups.map((item,idx)=>{
                               return(
                                <>
                                <ListItem
                                key={idx}
                                disablePadding
                              >
                                  <ListItemText  primary={item.category}
                                   primaryTypographyProps={{
                                    fontSize: 15,
                                    fontWeight: 'medium',
                                    lineHeight: '20px',
                                    mb: '2px',
                                  }} />
                              </ListItem>

                                 
                                    {item.instalaciones.map((instalacion,idx2)=>{
                                      return(
                                        <ListItemButton onClick={()=>{
                                          if(selectedIds.includes(instalacion.id)){
                                            const n = selectedIds.filter(t=>t != instalacion.id)
                                            setSelectedIds(n)
                                          }else{
                                            setSelectedIds(e=>[...e,instalacion.id])
                                          }
                                        }}
                                        selected={selectedIds.includes(instalacion.id)}
                                        key={idx2}>
                                          <ListItemText  primary={instalacion.name.slice(0,39)}
                                           primaryTypographyProps={{
                                            fontSize: 14,
                                            lineHeight: '15px',
                                          }}/>
                                        </ListItemButton>
                                      )
                                    })}
                                
                                </>
                              )
                            })
                          }
                          </List>

                            // groupByToMap<Instalacion,string>(instalaciones,(item)=>item.category_name).map((items,key)=>{
                            //   return(
                            //     <div>
                            //       {key}
                            //     </div>
                            //   )
                            // })
                            
                          }
                </ExpandMore>
                           
                            <div className="flex justify-end w-full border-t border-gray-400 p-2">
                            <Button 
                            variant="contained"
                            size="small"
                            onClick={()=>{
                              const data:FilterChartData = {
                                ...filterData,
                                instalaciones:selectedIds
                              }
                              getNewData(data)
                              close()
                            }}
                            >Aplicar filtros</Button>
                            </div>
                            </Paper>
                            </>
                            )}
              </Popover.Panel>
            </Popover>
     
        </div>
        }
                {/* <button className="smallButton h-9">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                  </svg>
                  <span>
                  Añadir filtro
                  </span>

                  </button> */}
            </>
    )
}

export default FilterChartHeader;