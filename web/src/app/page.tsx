import type { Metadata } from 'next';
import { WeatherExplorer } from '@/components/weather/weather-explorer';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Search weather forecasts by city, auto-detect your location, and save searches when logged in.',
};

export default function Home() {
  return <WeatherExplorer />;
}
