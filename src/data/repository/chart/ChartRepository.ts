import { LOCAL_URL } from "@/context/config"

export class ChartRepository {
    dataSource:ChartDataSource
    constructor(d:ChartDataSource){
        this.dataSource = d
    }
    GetReservasHoursAverage = async(data:FilterChartData)=>{
        const res = await this.dataSource.GetReservasHoursAverage(data)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
    }
    
    GetReservasHoursData = async(data:FilterChartData)=>{
        const res = await this.dataSource.GetReservasHoursData(data)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
    }
    
    GetReservaAmount = async(data:FilterChartData)=>{
        const res = await this.dataSource.GetReservaAmount(data)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
    }
    
    GetReservaAmountAverage = async(data:FilterChartData)=>{
        const res = await this.dataSource.GetReservaAmountAverage(data)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
    }
    
    GetReservaCountHoursBase = async(data:FilterChartData)=>{
        const res = await this.dataSource.GetReservaCountHoursBase(data)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
    }
    
    GetReservaAverageAmountBase = async(data:FilterChartData)=>{
        const res = await fetch(`${LOCAL_URL}/api/establecimiento/chart/average-amount/base`,{
            method:'POST',
            body:JSON.stringify(data)
        })
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
    }
    
    GetUserFrequency = async(data:FilterChartData)=>{
        const res = await fetch(`${LOCAL_URL}/api/establecimiento/chart/user-frequency`,{
            method:'POST',
            body:JSON.stringify(data)
        })
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
    }
    
    GetE = async(data:FilterChartData)=>{
        const res = await fetch(`${LOCAL_URL}/api/establecimiento/chart/establecimiento`,{
            method:'POST',
            body:JSON.stringify(data)
        })
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
    }
    
    GetChartData = async(data:FilterChartData)=>{
        const res = await fetch(`${LOCAL_URL}/api/establecimiento/chart/establecimiento`,{
            method:'POST',
            body:JSON.stringify(data)
        })
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
    }
}