import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import weatherReducer from './WeatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed useAppDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();