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
    singleColor?:boolean
    tickMargin?:number
    minTickGap?:number
    fontSize?:number
    barSize?:number
    marginBottom?:number
    CustomToolTip:({ active, payload, label }: any) => React.JSX.Element | null
}



const TriangleBarChart = ({data,keyName='name',keyValue='value',barSize,loading,singleColor = false,
  angle,tickMargin,minTickGap,fontSize,marginBottom=10,CustomToolTip}:Props) =>{

    

    const getPath = (x:any, y:any, width:any, height:any) => {
      return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
      ${x + width / 2}, ${y}
      C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
      Z`;
    };
    
    const TriangleBar = (props:any) => {
      const { fill, x, y, width, height } = props;
    
      return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
    };
    
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
          <Tooltip content={<CustomToolTip/>}/>

          <Bar barSize={barSize} dataKey={keyValue} shape={<TriangleBar/>}>
          {data.map((d, idx) => {
            return <Cell key={idx} fill={singleColor ? "#8884d8" : getColor(data.length, idx)} />;
          })}
          </Bar>
          
        </BarChart>
      }
      </ResponsiveContainer>
    )
}

export default TriangleBarChart;