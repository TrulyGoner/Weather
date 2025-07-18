'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/store';
import { fetchWeather } from '../store/weatherSlice';
import { RootState } from '../store/store';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
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
  const [city, setCity] = useState('Воронеж'); // Default to Voronezh
  const [latitude, setLatitude] = useState(51.67); // Voronezh latitude
  const [longitude, setLongitude] = useState(39.22); // Voronezh longitude
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch weather when coordinates change
  useEffect(() => {
    dispatch(fetchWeather({ latitude, longitude }));
  }, [dispatch, latitude, longitude]);

  // Handle city input and fetch suggestions
  const handleCityInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCity(input);
    if (input.length > 2) {
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
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle city selection from suggestions
  const handleCitySelect = (cityResult: CityResult) => {
    setCity(cityResult.name);
    setLatitude(cityResult.latitude);
    setLongitude(cityResult.longitude);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle form submission
  const handleCitySearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      // Select the first suggestion if the user submits without clicking
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
          <input
            type="text"
            value={city}
            onChange={handleCityInput}
            placeholder="Введите город (например, Воронеж)"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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