import { WeatherData, DailyForecast } from '../types/Weather';

  export async function fetchWeatherData(latitude: number, longitude: number): Promise<{
    current: WeatherData;
    daily: DailyForecast[];
  }> {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
    );
    if (!response.ok) {
      throw new Error('Не удалось получить данные о погоде');
    }
    const data = await response.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        time: data.current.time,
      },
      daily: data.daily.time.map((time: string, index: number) => ({
        date: time,
        maxTemp: data.daily.temperature_2m_max[index],
        minTemp: data.daily.temperature_2m_min[index],
        weatherCode: data.daily.weather_code[index],
      })),
    };
  }

  export function getWeatherDescription(weatherCode: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Ясное небо',
      1: 'В основном ясно',
      2: 'Частичная облачность',
      3: 'Пасмурно',
      45: 'Туман',
      51: 'Легкая морось',
      61: 'Легкий дождь',
      63: 'Умеренный дождь',
      65: 'Сильный дождь',
      71: 'Легкий снег',
      73: 'Умеренный снег',
      75: 'Сильный снег',
      95: 'Гроза',
    };
    return weatherCodes[weatherCode] || 'Неизвестно';
  }