import React, { Context, useMemo } from "react";
import ReactDOM from "react-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Text,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

// import "./styles.css";

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



const BAR_AXIS_SPACE = 10;
interface Props {
  data:any[]
  yKey:string
  xKey:string
  title:string
  subtitle:string
}
export const GenderChart = ({ data, yKey, xKey,title,subtitle }:Props) => {

  return (
    <div className="col-start-1 col-span-4 border-[1px] border-gray-500 rounded-lg p-2">
    <div className='grid pb-4'>
        <span className='title'>{title}</span>
        <span className=" text-xs">{subtitle}</span>
    </div>
    <ResponsiveContainer width={"100%"} height={300} debounce={50}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 30, right:0 ,top:30,bottom:10}}
      >
         <CartesianGrid strokeDasharray="3 3" />
        <XAxis hide axisLine={false} type="number" />
        <YAxis
          yAxisId={0}
          dataKey={xKey}
          type="category"
          // orientation="left"
          axisLine={false}
          tickLine={false}
          // tick={YAxisLeftTick}
        />
        <YAxis
          orientation="right"
          yAxisId={1}
          dataKey={yKey}
          type="category"
          axisLine={false}
          tickLine={false}
          // tickFormatter={value => value.toLocaleString()}
          // mirror
          // tick={{
            //   transform: `translate(${maxTextWidth + BAR_AXIS_SPACE}, 0)`
          // }}
        />
          <Tooltip />
          {/* <Legend /> */}
        <Bar dataKey={yKey} minPointSize={2} barSize={32}>
          {data.map((d, idx) => {
            return <Cell key={d[xKey]} fill={getColor(data.length, idx)} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}