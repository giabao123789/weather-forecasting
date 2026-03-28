export type TemperatureUnit = 'c' | 'f';

export type WeatherData = {
  city: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  country: string;
  description: string;
  humidity: number;
  iconCode: string;
  iconUrl: string;
  searchedAt: string;
  temperatureC: number;
  temperatureF: number;
  condition: string;
  windSpeedKph: number;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SearchHistoryItem = {
  id: string;
  city: string;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterPayload = {
  email: string;
  name: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
