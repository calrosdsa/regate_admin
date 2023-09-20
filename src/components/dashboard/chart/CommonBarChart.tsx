import Loader from '@/components/util/loaders/Loader';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const blues = [
  ["#457AA6"],
  ["#457AA6", "#E3EBF2"],
  ["#264F73", "#457AA6", "#A2BBD2", "#E3EBF2"], 
  ["#264F73", "#457AA6", "#E3EBF2"],
  ["#1A334A", "#264F73", "#457AA6", "#A2BBD2", "#E3EBF2"]
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
    angle?:number
    tickMargin?:number
    minTickGap?:number
    fontSize?:number
    barSize?:number
    marginBottom?:number
}


const CommonBarChart = ({data,keyName='name',keyValue='value',barSize,loading,
  angle,tickMargin,minTickGap,fontSize,marginBottom=10}:Props) =>{
    return(
        <ResponsiveContainer width="100%" height={300}>
          {loading?
          <Loader/>
          :
        <BarChart width={150} height={40} data={data}
        margin={{
            bottom:marginBottom,
            top:10
        }}>
      <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey={keyName} angle={angle}  tickMargin={tickMargin} minTickGap={minTickGap} style={{fontSize:fontSize}}
        // tick={{ dy: 10 }}
        />
          <YAxis />
          <Tooltip />
          <Bar barSize={barSize} dataKey={keyValue}>
          {data.map((d, idx) => {
            return <Cell key={idx} fill={getColor(data.length, idx)} />;
          })}
          </Bar>
        </BarChart>
      }
      </ResponsiveContainer>
    )
}

export default CommonBarChart;