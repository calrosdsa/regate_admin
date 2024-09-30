
interface ChartDataSource {
    GetReservasHoursAverage(data: FilterChartData): Promise<Response>;
  
    GetReservasHoursData(data: FilterChartData): Promise<Response>;
  
    GetReservaAmount(data: FilterChartData): Promise<Response>;
  
    GetReservaAmountAverage(data: FilterChartData): Promise<Response>;
  
    GetReservaCountHoursBase(data: FilterChartData): Promise<Response>;
  
    GetReservaAverageAmountBase(data: FilterChartData): Promise<Response>;
  
    GetUserFrequency(data: FilterChartData): Promise<Response>;
  
    GetE(data: FilterChartData): Promise<Response>;
  
    GetChartData(data: FilterChartData): Promise<Response>;
  }