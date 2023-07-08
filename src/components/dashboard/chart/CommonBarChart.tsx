import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface Props {
    data:any[]
    angle?:number
    tickMargin?:number
    minTickGap?:number
    fontSize?:number
    marginBottom?:number
}
const CommonBarChart = ({data,angle,tickMargin,minTickGap,fontSize,marginBottom=10}:Props) =>{
    return(
        <ResponsiveContainer width="100%" height={300}>
        <BarChart width={150} height={40} data={data}
        margin={{
            bottom:marginBottom,
            top:10
        }}>
      <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" angle={angle}  tickMargin={tickMargin} minTickGap={minTickGap} style={{fontSize:fontSize}}/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="pv" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    )
}

export default CommonBarChart;