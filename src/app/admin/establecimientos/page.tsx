import Link from "next/link"

interface Establecimiento {
    name: string
    uuid:string
}

async function getData() {
    const res = await fetch('http://localhost:9090/v1/empresa/establecimientos/',{
        cache:'no-store',
        headers:{
            "Authorization":`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6IjQ2MTUzYjhlLTJiZWItNDg0Yy04YTczLTdiOTRhNjc0MzVlMyIsImVtYWlsIjoiam9yZ2VAZ21haWwuY29tIiwidXNlcm5hbWUiOiJqb3JnZSIsInJvbCI6MSwiZW1wcmVzYV9pZCI6MiwiZXhwIjoxNjg2NzA3Nzk4fQ.WJqUG_6ZyZSL7socqB841q4MED5xmeGMUE0OVts_LdA`
        }
    })
    
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    // Recommendation: handle errors
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    console.log(res)
    return res.json()
  }

  export default async function Page(){
    const data:Establecimiento[] = await getData()

    return (
        <div className="w-full  xl:w-10/12 mx-auto">
            
         <button className="button">Crear Establecimiento</button>   
         <div className="h-4"/>
    <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100  ">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Nombre del Establecimiento
                </th>
                <th scope="col" className="px-6 py-3">
                    Color
                </th>
               
            </tr>
        </thead>
        <tbody>
            {data.map((item)=>{
                return(
            <tr className="bg-white border-b">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <Link href={`./establecimiento/${item.uuid}`}>
                    {item.name}
                    </Link>
                </th>
                <td className="px-6 py-4">
                    Silver
                </td>
            </tr>
       )})}
           
        </tbody>
    </table>

        </div>
    )
}
