import { LOCAL_URL } from "@/context/config"

class ChartDataSourceImpl implements ChartDataSource {

    GetReservasHoursAverage(data:FilterChartData){
        const res = fetch(`${LOCAL_URL}/api/establecimiento/chart/average-hours`,{
            method:'POST',
            body:JSON.stringify(data)
        })
          return res
    }
    
    GetReservasHoursData(data:FilterChartData){
        const res = fetch(`${LOCAL_URL}/api/establecimiento/chart/count-hours`,{
            method:'POST',
            body:JSON.stringify(data)
        })
          return res
    }
    
    GetReservaAmount(data:FilterChartData){
        const res = fetch(`${LOCAL_URL}/api/establecimiento/chart/amount`,{
            method:'POST',
            body:JSON.stringify(data)
        })
          return res
    }
    
    GetReservaAmountAverage(data:FilterChartData){
        const res = fetch(`${LOCAL_URL}/api/establecimiento/chart/average-amount`,{
            method:'POST',
            body:JSON.stringify(data)
        })
          return res
    }
    
    GetReservaCountHoursBase(data:FilterChartData){
        const res = fetch(`${LOCAL_URL}/api/establecimiento/chart/count-hours/base`,{
            method:'POST',
            body:JSON.stringify(data)
        })
          return res
    }
    
    GetReservaAverageAmountBase(data:FilterChartData){
        const res = fetch(`${LOCAL_URL}/api/establecimiento/chart/average-amount/base`,{
            method:'POST',
            body:JSON.stringify(data)
        })
          return res
    }
    
    GetUserFrequency(data:FilterChartData){
        const res = fetch(`${LOCAL_URL}/api/establecimiento/chart/user-frequency`,{
            method:'POST',
            body:JSON.stringify(data)
        })
          return res
    }
    
    GetE(data:FilterChartData){
        const res = fetch(`${LOCAL_URL}/api/establecimiento/chart/establecimiento`,{
            method:'POST',
            body:JSON.stringify(data)
        })
          return res
    }
    
    GetChartData(data:FilterChartData){
        const res = fetch(`${LOCAL_URL}/api/establecimiento/chart/establecimiento`,{
            method:'POST',
            body:JSON.stringify(data)
        })
          return res
    }
}

export default ChartDataSourceImpl;