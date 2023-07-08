import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    {
      name: 'Under 18',
      pv: 1400,
    },
    {
      name: '18 a 24',
      pv: 1398,
    },
    {
      name: '25 a 34',
      pv: 9800,
    },
    {
      name: '35 a 44',
      pv: 3908,
    },
    {
      name: '45 a 54',
      pv: 4800,
    },
    {
      name: '55 a 64',
      pv: 3800,
    },
    {
    name: '65 and over',
    pv: 3800,
    },
  ];
interface Props{
    title:string
    subtitle:string
}
  const AgeChart = ({title,subtitle}:Props) =>{
    return(
        <div className='col-start-5 col-span-full border-[1px] border-gray-500 rounded-lg p-2'>
        <div className='grid pb-4'>
            <span className='title'>{title}</span>
            <span className=" text-xs">{subtitle}</span>
        </div>
    <div style={{ width: '100%' }}>
    <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            bottom: 45,
          }}

        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" angle={310}  tickMargin={25} minTickGap={-20}/>
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="pv" fill="#8884d8" barSize={26}/>
        </BarChart>
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
      </LineChart>
    </ResponsiveContainer> */}
  </div>
</div>
    )
  }

  export default AgeChart;