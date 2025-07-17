export interface WeatherData {
    temperature: number;
    weatherCode: number;
    time: string;
  }
  
  export interface DailyForecast {
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number
  }