import Loader from "@/components/util/loaders/Loader";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props{
    data:any[]
    firstKey?:string
    secondKey?:string
    thirdKey?:string
    fontSize?:number
    loading:boolean
}
const StackedBarChart = ({data,firstKey,secondKey,thirdKey,fontSize=12,loading}:Props) => {
  const [state,setState] = useState({
    opacity:{
      pendiente:1,
      resuelto:1,
      no_resuelto:1
    }
  })

  const handleMouseEnter = (o:any) => {
    const { dataKey } = o;
    const { opacity } = state;
    setState({
      opacity: { ...opacity, [dataKey]: 0.3 },
    });
  };

  const handleMouseLeave = (o:any) => {
    const { dataKey } = o;
    const { opacity } = state;

    setState({
      opacity: { ...opacity, [dataKey]: 1 },
    });
  };

    return(
        <ResponsiveContainer width="100%" height={400}>
            {loading?
          <Loader/>
          :
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={fontSize}/>
          <YAxis />
          <Tooltip />
          <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>
          {firstKey != undefined &&
          <Bar dataKey={firstKey} stackId="a" fill="#8884d8" opacity={state.opacity.pendiente}/>
          }
          {secondKey != undefined && 
          <Bar dataKey={secondKey} stackId="a" fill="#82ca9d" opacity={state.opacity.resuelto}/>
          }
          {thirdKey != undefined && 
          <Bar dataKey={thirdKey} stackId="a" fill="#82ca1d" opacity={state.opacity.no_resuelto}/>
          }
        </BarChart>
}
      </ResponsiveContainer>
    )
}

export default StackedBarChart;