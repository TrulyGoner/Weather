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
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchWeather({ latitude, longitude }));
  }, [dispatch, latitude, longitude]);

  const handleCityInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCity(input);
    setGeocodingError(null);
    
    if (input.length > 2) {
      setIsCityLoading(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input)}&count=10&language=ru`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSuggestions(data.results || []);
        setShowSuggestions(true);
        
        if (!data.results || data.results.length === 0) {
          setGeocodingError('Города не найдены');
        }
      } catch (err) {
        console.error('Geocoding error:', err);
        setSuggestions([]);
        setShowSuggestions(false);
        setGeocodingError('Ошибка поиска городов');
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
    setGeocodingError(null);
  };

  const handleCitySearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleCitySelect(suggestions[0]);
    } else if (city.length > 2) {
      // Try to search again if no suggestions are shown
      setIsCityLoading(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          handleCitySelect(data.results[0]);
        } else {
          setGeocodingError('Город не найден');
        }
      } catch (err) {
        console.error('Search error:', err);
        setGeocodingError('Ошибка поиска города');
      } finally {
        setIsCityLoading(false);
      }
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
            disabled={isCityLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isCityLoading ? '...' : 'Поиск'}
          </button>
          
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto top-full shadow-lg">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  onClick={() => handleCitySelect(s)}
                  className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {s.name}, {s.country} {s.admin1 ? `(${s.admin1})` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {geocodingError && (
          <p className="text-red-500 text-sm mt-2">{geocodingError}</p>
        )}
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
        <div className="w-full max-w-md text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-lg text-red-600 mb-2">Ошибка загрузки погоды</p>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => dispatch(fetchWeather({ latitude, longitude }))}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      ) : status === 'succeeded' && currentWeather ? (
        <div className="w-full max-w-5xl space-y-6">
          <WeatherCard
            temperature={currentWeather.temperature}
            weatherCode={currentWeather.weatherCode}
            time={format(new Date(currentWeather.time), 'PPPp', { locale: ru })}
          />
          {forecast.length > 0 && (
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
          )}
        </div>
      ) : null}
    </main>
  );
}