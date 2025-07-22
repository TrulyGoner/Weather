import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeatherData } from '../utils/api';
import { WeatherData, DailyForecast } from '../types/Weather';

interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: DailyForecast[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WeatherState = {
  currentWeather: null,
  forecast: [],
  status: 'idle',
  error: null,
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    const data = await fetchWeatherData(latitude, longitude);
    return data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentWeather = action.payload.current;
        state.forecast = action.payload.daily;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Не удалось получить данные о погоде';
      });
  },
});

export default weatherSlice.reducer;