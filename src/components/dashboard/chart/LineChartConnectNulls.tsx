import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Page A', uv: 4000 },
  { name: 'Page B', uv: 3000 },
  { name: 'Page C', uv: 2000 },
  { name: 'Page D' },
  { name: 'Page E', uv: 1890 },
  { name: 'Page F', uv: 2390 },
  { name: 'Page G', uv: 3490 },
];
interface Props{
    title:string
    subtitle:string
}
const LineChartConnectNulls = ({title,subtitle}:Props) => {
    const CustomizedTooltip = ({ active, payload, label }:any) => {
        console.log(active, payload, label);
      
        if (active) {
          return (
            <div className="p-2 border-1 border-gray-600">
              <div className="">
                <span>{label} </span>
              </div>
              <div className="">
                {payload.length > 0 &&
                <span>Visitas: {payload[0].payload.uv}</span>
                }
              </div>
            </div>
          );
        }
      
        return null;
      };

    return(
        <div className='col-start-3 col-span-full border-[1px] border-gray-500 rounded-lg p-2'>
            <div className='grid pb-4'>
                <span className='title'>{title}</span>
                <span className=" text-xs">{subtitle}</span>
            </div>
        <div style={{ width: '100%' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            width={500}
            height={200}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"/>
            <YAxis />
            <Tooltip content={<CustomizedTooltip/>}/>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          </LineChart>
        </ResponsiveContainer>

        {/* <ResponsiveContainer width="100%" height={200}>
          <LineChart
            width={500}
            height={200}
            data={data}
            margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line connectNulls type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          </LineChart>
        </ResponsiveContainer> */}
      </div>
    </div>
    )
}

export default  LineChartConnectNulls;