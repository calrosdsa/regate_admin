import { Menu } from "@headlessui/react";
import MenuLayout from "../../util/button/MenuLayout";
import { useEffect, useState } from "react";
import ChartDialog from "./ChartDialog";
import { TypeOfChart } from "@/core/type/enums";
import { FilterChartData } from "@/core/type/chart";

const ChartDropMenu = ({
    children,title,subtitle,setTypeOfChart,setData,className = "",CustomToolTip,getNewData,
    showLegend=false,legendLabels=[],singleColor=false,keyValue2,closeDialog
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
    closeDialog:boolean
}) => {
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
        open={openChartDialog}
        close={()=>setOpenChartDialog(false)}
        CustomToolTip={CustomToolTip}
        getNewData={getNewData}
        keyValue2={keyValue2}
        singleColor={singleColor}
        legendLabels={legendLabels}
        showLegend={showLegend}
        />
        }
        <div className={`${className} border-[1px] border-gray-500 rounded-lg p-2`}>
             <div className='flex justify-between'>
            <div className='grid pb-4'>
                <span className='title'>{title}</span>
                <span className=" text-xs">{subtitle}</span>
            </div>
            <MenuLayout>
            <Menu.Item>
              {({ active }) => (
                <button
                onClick={()=>{
                    setOpenChartDialog(true)
                    setTypeOfChart()
                    setData()
                }}
                className={classNames(
                    active ? 'bg-gray-200 text-gray-900' : 'text-gray-700',
                    'flex justify-between space-x-2 px-4 py-2 text-sm  text-left',
                    )}
                    >
                <span className=" whitespace-nowrap">Open Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
                </button>
              )}
            </Menu.Item>
            
            </MenuLayout>
              </div>
            {children}
        </div>
    </>
    )
}

export default ChartDropMenu;