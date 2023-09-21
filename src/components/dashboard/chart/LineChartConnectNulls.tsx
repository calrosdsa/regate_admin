// import React, { PureComponent } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   { name: 'Page A', uv: 4000 },
//   { name: 'Page B', uv: 3000 },
//   { name: 'Page C', uv: 2000 },
//   { name: 'Page D' },
//   { name: 'Page E', uv: 1890 },
//   { name: 'Page F', uv: 2390 },
//   { name: 'Page G', uv: 3490 },
// ];
// interface Props{
    
// }
// const LineChartConnectNulls = ({}:Props) => {
//     const CustomizedTooltip = ({ active, payload, label }:any) => {
//         console.log(active, payload, label);
      
//         if (active) {
//           return (
//             <div className="p-2 border-1 border-gray-600">
//               <div className="">
//                 <span>{label} </span>
//               </div>
//               <div className="">
//                 {payload.length > 0 &&
//                 <span>Visitas: {payload[0].payload.uv}</span>
//                 }
//               </div>
//             </div>
//           );
//         }
      
//         return null;
//       };

//     return(
       
//         <div style={{ width: '100%' }}>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart
//             width={500}
//             height={200}
//             data={data}
//             margin={{
//               top: 10,
//               right: 30,
//               left: 0,
//               bottom: 0,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name"/>
//             <YAxis />
//             <Tooltip content={<CustomizedTooltip/>}/>
//             <Line type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
//           </LineChart>
//         </ResponsiveContainer>

//         {/* <ResponsiveContainer width="100%" height={200}>
//           <LineChart
//             width={500}
//             height={200}
//             data={data}
//             margin={{
//                 top: 10,
//                 right: 30,
//                 left: 0,
//                 bottom: 0,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Line connectNulls type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
//           </LineChart>
//         </ResponsiveContainer> */}
//       </div>
   
//     )
// }

// export default  LineChartConnectNulls;


import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { formatterMediumDate } from '../../../utils/helpers/formatter';
import { Dna } from 'react-loader-spinner';
import Loader from '@/components/util/loaders/Loader';
import { renderLegend } from './CommonBarChart';
// import Loader from '../../Loader';


interface Props{
  data:any[]
  loading:boolean
  angle?:number
  keyName?:string
    keyValue?:string
  tickMargin?:number
  minTickGap?:number
  fontSize?:number
  marginBottom?:number
  CustomToolTip:({ active, payload, label }: any) => React.JSX.Element | null

  showLegend?:boolean
  legendLabels?:string[]
  keyValue2?:string
}


const LineChartConnectNulls = ({data,keyName='name',keyValue='value',loading,CustomToolTip,
  angle,tickMargin,minTickGap,fontSize,marginBottom=10,showLegend = false,legendLabels=[],
keyValue2}:Props) => {
    

    return(
        <>
        <ResponsiveContainer width="100%" height={300} className={"relative"}>
        {loading ?
       <Loader className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
        :
          <LineChart
            width={500}
            height={200}
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -30,
              bottom: marginBottom,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={keyName} angle={angle}  tickMargin={tickMargin} minTickGap={minTickGap} axisLine={false}
            style={{fontSize:fontSize}} /> 
            <YAxis  style={{fontSize:fontSize}}/>
            {/* <Tooltip/> */}
            <Tooltip content={<CustomToolTip/>}/>

            {showLegend &&
            <Legend content={(props)=>renderLegend(props,legendLabels)} />
          }  

            <Line  connectNulls  type="monotone" dataKey={keyValue} stroke="#8884d8" fill="#8884d8" />
            {keyValue2 != undefined &&
            <Line  connectNulls  type="monotone" dataKey={keyValue2} stroke="#82ca9d" fill="#82ca9d" />
            }
          </LineChart>
            }
        </ResponsiveContainer>
        </>
    )
}

export default  LineChartConnectNulls;