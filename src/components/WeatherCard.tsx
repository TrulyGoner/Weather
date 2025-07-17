import { getWeatherDescription } from '../utils/api';

interface WeatherCardProps {
  temperature: number;
  weatherCode: number;
  time: string;
}

export default function WeatherCard({ temperature, weatherCode, time }: WeatherCardProps) {
  const getWeatherStyles = (code: number) => {
    if ([0, 1].includes(code)) return { bg: 'bg-yellow-100', icon: '☀️' }; 
    if ([2, 3].includes(code)) return { bg: 'bg-gray-200', icon: '☁️' }; 
    if ([45, 48].includes(code)) return { bg: 'bg-gray-300', icon: '🌫️' };
    if ([51, 53, 55, 61, 63, 65].includes(code)) return { bg: 'bg-blue-200', icon: '🌧️' }; 
    if ([71, 73, 75].includes(code)) return { bg: 'bg-blue-300', icon: '❄️' }; 
    if ([95, 96, 99].includes(code)) return { bg: 'bg-purple-200', icon: '⛈️' }; 
    return { bg: 'bg-gray-100', icon: '🌥️' }; 
  };

  const { bg, icon } = getWeatherStyles(weatherCode);

  return (
    <div className={`weather-card ${bg} flex flex-col items-center justify-center transition-all duration-300`}>
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
        Текущая погода
      </h2>
      <p className="text-gray-600 text-sm sm:text-base mt-1">{time}</p>
      <div className="flex items-center space-x-4 mt-4">
        <span className="text-5xl sm:text-6xl">{icon}</span>
        <p className="text-5xl sm:text-6xl font-bold text-gray-900">
          {temperature}°C
        </p>
      </div>
      <p className="text-lg sm:text-xl text-gray-700 mt-3">
        {getWeatherDescription(weatherCode)}
      </p>
    </div>
  );
}