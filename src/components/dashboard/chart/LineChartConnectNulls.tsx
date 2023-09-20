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
// import Loader from '../../Loader';


interface Props{
  data:any[]
  loading:boolean
  angle?:number
  tickMargin?:number
  minTickGap?:number
  fontSize?:number
  marginBottom?:number
}
const CustomYAxisTick = ({x,y,payload}:any)=>{
      // const { x, y, payload } = this.props;
      return (<g transform={`translate(${0},${y})`}>
          <text x={0} y={0}
              textAnchor="start"
              fill="#666">{payload.value}</text>
      </g>)
}
const LineChartConnectNulls = ({data,loading,
  angle,tickMargin,minTickGap,fontSize,marginBottom=10}:Props) => {
    const CustomizedTooltip = ({ active, payload, label }:any) => {
        // console.log(active, payload, label);
      
        if (active) {
          return (
            <>
                {(payload != null && payload.length > 0) &&
            <div className="p-2 border-2 rounded-lg bg-white  border-gray-600 max-w-[150px]">
                <span className='text-primary font-medium'>{payload[0].payload.value} casos</span>
                <span> creados el {payload[0].payload.name}</span>
                </div>
              }
              </>
          );
        }
      
        return null;
      };

    return(
        <>
        <ResponsiveContainer width="100%" height={300}>
        {loading ?
       <Loader/>
        :
          <LineChart
            width={500}
            height={200}
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: marginBottom,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={angle}  tickMargin={tickMargin} minTickGap={minTickGap} axisLine={false}
            style={{fontSize:fontSize}} />
            <YAxis />
            {/* <Tooltip/> */}
            <Tooltip content={<CustomizedTooltip/>}/>

            <Line connectNulls type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
          </LineChart>
            }
        </ResponsiveContainer>
        </>
    )
}

export default  LineChartConnectNulls;