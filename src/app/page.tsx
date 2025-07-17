'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/store';
import { fetchWeather } from '../store/WeatherSlice';
import { RootState } from '../store/store';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function Home() {
  const dispatch = useAppDispatch();
  const { currentWeather, forecast, status, error } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    dispatch(fetchWeather({ latitude: 51.67, longitude: 39.22 })); // Voronezh
  }, [dispatch]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 tracking-tight">
        Прогноз в Воронеже
      </h1>
      {status === 'loading' && (
        <p className="text-lg text-gray-600 animate-pulse">Загрузка...</p>
      )}
      {status === 'failed' && (
        <p className="text-lg text-red-500">Ошибка: {error}</p>
      )}
      {status === 'succeeded' && currentWeather && (
        <div className="w-full max-w-5xl space-y-6">
          <WeatherCard
            temperature={currentWeather.temperature}
            weatherCode={currentWeather.weatherCode}
            time={format(new Date(currentWeather.time), 'PPPp', { locale: ru })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <ForecastCard
                key={index}
                date={format(new Date(day.date), 'EEE, d MMM', { locale: ru })}
                maxTemp={day.maxTemp}
                minTemp={day.minTemp}
                weatherCode={day.weatherCode}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}