import { Menu } from "@headlessui/react";
import MenuLayout from "../../util/button/MenuLayout";
import { useEffect, useState } from "react";
import ChartDialog from "./ChartDialog";
import { TypeOfChart } from "@/data/model/types/enums";
import { ChartTypeData, FilterChartData } from "@/data/model/types/chart";
import ButtonIcon from "@/presentation/util/button/ButtonIcon";
import { Button, ListItemIcon, ListItemText, MenuItem, Paper, Typography } from "@mui/material";
import AssessmentIcon from '@mui/icons-material/Assessment';

const ChartDropMenu = ({
    children,title,subtitle,setTypeOfChart,setData,className = "",CustomToolTip,getNewData,
    showLegend=false,legendLabels=[],singleColor=false,keyValue2,closeDialog,chartTypeData
}:{
    children:React.ReactNode
    title:string
    subtitle:string
    setTypeOfChart:()=>void
    getNewData:(data:FilterChartData)=>void
    setData:()=>void
    className?:string
    CustomToolTip:({ active, payload, label }: any) => React.JSX.Element | null
    singleColor?:boolean
    showLegend?:boolean
    legendLabels?:string[]
    keyValue2?:string
    chartTypeData:ChartTypeData
    closeDialog:boolean
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openChartDialog,setOpenChartDialog] = useState(false)
    function classNames(...classes:any) {
        return classes.filter(Boolean).join(' ')
    }
    useEffect(()=>{
        if(closeDialog){
            setOpenChartDialog(false)
        }
    },[closeDialog])
    return (
        <>
        {openChartDialog&&
        <ChartDialog
        label={title}
        open={openChartDialog}
        close={()=>setOpenChartDialog(false)}
        CustomToolTip={CustomToolTip}
        getNewData={getNewData}
        keyValue2={keyValue2}
        singleColor={singleColor}
        legendLabels={legendLabels}
        showLegend={showLegend}
        chartTypeData={chartTypeData}
        />
        }
        <Paper elevation={4} className={`${className}  rounded-lg p-2`}>
             <div className='flex justify-between items-start'>
            <div className='grid pb-4'>
                <Typography variant="subtitle2">{title}</Typography>
                <Typography variant="caption">{subtitle}</Typography>
            </div>

            <div className="flex">
             {/* <ButtonIcon
             onClick={()=>{}}
             icon={()=>{
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                     className="w-8 h-8 p-[6px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                )
             }}
             />    */}
            <MenuLayout 
            anchorEl={anchorEl}
            setAnchorEl={(e)=>setAnchorEl(e)}
            >
            <MenuItem onClick={()=>{
                    setAnchorEl(null)
                    setOpenChartDialog(true)
                    setTypeOfChart()
                    setData()
            }} >                  
             <ListItemIcon>
            <AssessmentIcon/>
          </ListItemIcon>
          <ListItemText>Ver reporte</ListItemText>
            </MenuItem>
            
            </MenuLayout>
            </div>

              </div>
            {children}
        </Paper>
    </>
    )
}

export default ChartDropMenu;