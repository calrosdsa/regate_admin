import Loader from '@/presentation/util/loaders/Loader';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const blues = [
  ["#457AA6"],
  ["#457AA6", "#c7dae9"],
  ["#264F73", "#457AA6", "#9abbda", "#c7dae9"], 
  ["#264F73", "#457AA6", "#c7dae9"],
  ["#1A334A", "#264F73", "#457AA6", "#9abbda", "#c7dae9"]
];
const getColor = (length:number, index:number) => {
  if (length <= blues.length) {
    return blues[length - 1][index];
  }

  return blues[blues.length - 1][index % blues.length];
};
interface Props {
    data:any[]
    loading:boolean
    keyName?:string
    keyValue?:string
    keyValue2?:string
    angle?:number
    singleColor?:boolean
    tickMargin?:number
    minTickGap?:number
    fontSize?:number
    barSize?:number
    showLegend?:boolean
    legendLabels?:string[]
    marginBottom?:number
    CustomToolTip?:({ active, payload, label }: any) => React.JSX.Element | null
}



export const renderLegend = (props:any,labels:string[]) => {
  const { payload } = props;

  return (
    <ul className='flex justify-center space-x-2 '>
      {
        payload.map((entry:any, index:any):any => {
          return(
            <div key={`item-${index}`} className={`flex space-x-2 items-center`}>
            <span style={{
              color:entry.color,
              fontWeight:600
            }} >{labels[index]}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={entry.color} className="w-4 h-4">
            <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
           </svg>
            </div>
            )
          })
      }
      
    </ul>
  );
}
const CommonBarChart = ({data,keyName='name',keyValue='value',barSize,loading,singleColor = false,showLegend = false,
  angle,tickMargin,minTickGap,fontSize,marginBottom=10,CustomToolTip,keyValue2,legendLabels=[]}:Props) =>{


  
    return(
        <ResponsiveContainer width="100%" height={300} className={"relative"}>
          {loading?
          <Loader className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
          :
        <BarChart width={150} height={40} data={data}
        margin={{
            bottom:marginBottom,
            top:10,
            left:-20,
            right:0
        }}>
      <CartesianGrid strokeDasharray="3 3"/>

        <XAxis dataKey={keyName} angle={angle}  tickMargin={tickMargin} minTickGap={minTickGap} style={{fontSize:fontSize}}
        // tick={{ dy: 10 }}
        />
          <YAxis 
          style={{fontSize:fontSize}}
          />
          {CustomToolTip != undefined ?
          <Tooltip content={<CustomToolTip/>}/>
          :
          <Tooltip/>
          }

          {showLegend &&
            <Legend content={(props)=>renderLegend(props,legendLabels)} />
          }  

          <Bar  barSize={barSize} dataKey={keyValue} stackId="a" fill="#8884d8" >
          {data.map((d, idx) => {
            return <Cell key={idx} fill={singleColor ? "#8884d8" : getColor(data.length, idx)} />;
          })}
          </Bar>
          {keyValue2 != undefined  &&
          <Bar barSize={barSize} dataKey={keyValue2} stackId="a" fill="#82ca9d" opacity={50}/>
          }
        </BarChart>
      }
      </ResponsiveContainer>
    )
}

export default CommonBarChart;