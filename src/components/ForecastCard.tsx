import { getWeatherDescription } from '../utils/api';

interface ForecastCardProps {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

export default function ForecastCard({ date, maxTemp, minTemp, weatherCode }: ForecastCardProps) {
  const getWeatherStyles = (code: number) => {
    if ([0, 1].includes(code)) return { color: 'text-yellow-600', icon: '☀️' }; // Clear, Mainly clear
    if ([2, 3].includes(code)) return { color: 'text-gray-600', icon: '☁️' }; // Cloudy
    if ([45, 48].includes(code)) return { color: 'text-gray-500', icon: '🌫️' }; // Fog
    if ([51, 53, 55, 61, 63, 65].includes(code)) return { color: 'text-blue-600', icon: '🌧️' }; // Rain, Drizzle
    if ([71, 73, 75].includes(code)) return { color: 'text-blue-700', icon: '❄️' }; // Snow
    if ([95, 96, 99].includes(code)) return { color: 'text-purple-600', icon: '⛈️' }; // Thunderstorm
    return { color: 'text-gray-600', icon: '🌥️' }; // Default
  };

  const { color, icon } = getWeatherStyles(weatherCode);

  return (
    <div className="forecast-card">
      <h3 className="text-base font-semibold text-gray-800">{date}</h3>
      <div className="flex items-center space-x-2 mt-1">
        <span className="text-xl">{icon}</span>
        <p className="text-xl font-bold text-gray-900">
          {maxTemp}°C / {minTemp}°C
        </p>
      </div>
      <p className={`text-sm mt-2 ${color}`}>
        {getWeatherDescription(weatherCode)}
      </p>
    </div>
  );
}