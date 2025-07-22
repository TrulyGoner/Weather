'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/store';
import { fetchWeather } from '../store/WeatherSlice';
import { RootState } from '../store/store';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import WeatherCardSkeleton from '../components/WeatherCardSkeleton';
import ForecastCardSkeleton from '../components/ForecastCardSkeleton';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { currentWeather, forecast, status, error } = useSelector(
    (state: RootState) => state.weather
  );
  const [city, setCity] = useState('Воронеж');
  const [latitude, setLatitude] = useState(51.67);
  const [longitude, setLongitude] = useState(39.22);
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchWeather({ latitude, longitude }));
  }, [dispatch, latitude, longitude]);

  const handleCityInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCity(input);
    if (input.length > 2) {
      setIsCityLoading(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input)}&count=10&language=ru`
        );
        if (!response.ok) {
          throw new Error('Не удалось найти город');
        }
        const data = await response.json();
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsCityLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleCitySelect = (cityResult: CityResult) => {
    setCity(cityResult.name);
    setLatitude(cityResult.latitude);
    setLongitude(cityResult.longitude);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleCitySearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleCitySelect(suggestions[0]);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
        Прогноз погоды
      </h1>
      <form onSubmit={handleCitySearch} className="mb-6 w-full max-w-md">
        <div className="relative flex items-center space-x-2">
          {isCityLoading ? (
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : (
            <input
              type="text"
              value={city}
              onChange={handleCityInput}
              placeholder="Введите город (например, Воронеж)"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Поиск
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto top-full">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  onClick={() => handleCitySelect(s)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {s.name}, {s.country} {s.admin1 ? `(${s.admin1})` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
      {status === 'loading' ? (
        <div className="w-full max-w-5xl space-y-6">
          <WeatherCardSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array(5).fill(0).map((_, index) => (
              <ForecastCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : status === 'failed' ? (
        <p className="text-lg text-red-500">Ошибка: {error}</p>
      ) : status === 'succeeded' && currentWeather ? (
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
      ) : null}
    </main>
  );
}