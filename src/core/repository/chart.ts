import { FilterChartData } from "../type/chart"

export async function GetReservasHoursAverage(data:FilterChartData){
    const res = await fetch(`../../api/establecimiento/chart/average-hours`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}

export async function GetReservasHoursData(data:FilterChartData){
    const res = await fetch(`../../api/establecimiento/chart/count-hours`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}

export async function GetReservaAmount(data:FilterChartData){
    const res = await fetch(`../../api/establecimiento/chart/amount`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}

export async function GetReservaAmountAverage(data:FilterChartData){
    const res = await fetch(`../../api/establecimiento/chart/average-amount`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}


export async function GetReservaAverageAmountBase(data:FilterChartData){
    const res = await fetch(`../../api/establecimiento/chart/average-amount/base`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}


export async function GetE(data:FilterChartData){
    const res = await fetch(`../../api/establecimiento/chart/establecimiento`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}

export async function GetChartData(data:FilterChartData){
    const res = await fetch(`../../api/establecimiento/chart/establecimiento`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}