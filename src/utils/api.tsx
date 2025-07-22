import { WeatherData, DailyForecast } from '../types/Weather';

export async function fetchWeatherData(latitude: number, longitude: number): Promise<{
  current: WeatherData;
  daily: DailyForecast[];
}> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error('Неполные данные о погоде');
    }

    return {
      current: {
        temperature: Math.round(data.current.temperature_2m || 0),
        weatherCode: data.current.weather_code || 0,
        time: data.current.time || new Date().toISOString(),
      },
      daily: (data.daily.time || []).slice(0, 7).map((time: string, index: number) => ({
        date: time,
        maxTemp: Math.round(data.daily.temperature_2m_max?.[index] || 0),
        minTemp: Math.round(data.daily.temperature_2m_min?.[index] || 0),
        weatherCode: data.daily.weather_code?.[index] || 0,
      })),
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    throw new Error('Не удалось получить данные о погоде');
  }
}

export function getWeatherDescription(weatherCode: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: 'Ясное небо',
    1: 'В основном ясно',
    2: 'Частичная облачность',
    3: 'Пасмурно',
    45: 'Туман',
    48: 'Изморозь',
    51: 'Легкая морось',
    53: 'Умеренная морось',
    55: 'Сильная морось',
    61: 'Легкий дождь',
    63: 'Умеренный дождь',
    65: 'Сильный дождь',
    71: 'Легкий снег',
    73: 'Умеренный снег',
    75: 'Сильный снег',
    95: 'Гроза',
    96: 'Гроза с градом',
    99: 'Сильная гроза с градом',
  };
  return weatherCodes[weatherCode] || 'Неизвестная погода';
}