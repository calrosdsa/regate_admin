interface Props{
  active:boolean
  payload:any
  label:any
}

export const CustomTooltip = ({ active, payload, label }:Props) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg">
          <span className=" font-medium">{label}</span>
        <div>
          {payload.map((pld:any,idx:number) => (
            <div key={idx} className="flex space-x-3">
              <span className=" font-medium text-primary">{pld.value}</span>
              <span>Likes</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};