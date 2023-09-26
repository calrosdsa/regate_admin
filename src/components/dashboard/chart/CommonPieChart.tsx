import Loader from '@/components/util/loaders/Loader';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';



const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }:any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
interface Props {
  data:any[]
  loading:boolean
}
const CommonPieChart = ({data,loading}:Props) =>{
    return(
        <ResponsiveContainer width="100%" height={300} className={`relative`}>
          {loading?
          <Loader className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
          :
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
          </Pie>
            <Tooltip />
            <Legend/>
        </PieChart>
       }
      </ResponsiveContainer>
    )
}

export default CommonPieChart;