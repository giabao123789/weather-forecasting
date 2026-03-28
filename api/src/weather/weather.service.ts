import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '../users/users.service';
import { WeatherQueryDto } from './dto/weather-query.dto';

type OpenWeatherResponse = {
  coord: {
    lat: number;
    lon: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
};

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  async getWeather(weatherQueryDto: WeatherQueryDto, userId?: string) {
    const apiKey = this.configService.get<string>('WEATHER_API_KEY')?.trim();

    if (!apiKey || apiKey === 'your_openweather_api_key') {
      throw new InternalServerErrorException(
        'WEATHER_API_KEY is not configured correctly. Please update api/.env with a real OpenWeather API key.',
      );
    }

    const { city, lat, lon } = weatherQueryDto;

    if (!city && (lat === undefined || lon === undefined)) {
      throw new BadRequestException(
        'Please provide either a city or both latitude and longitude.',
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<OpenWeatherResponse>(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              appid: apiKey,
              units: 'metric',
              ...(city ? { q: city } : { lat, lon }),
            },
          },
        ),
      );

      const weatherData = response.data;
      const currentWeather = weatherData.weather[0];
      const displayCity = `${weatherData.name}, ${weatherData.sys.country}`;

      if (userId) {
        await this.usersService.addSearchHistory(userId, displayCity);
      }

      return {
        city: weatherData.name,
        country: weatherData.sys.country,
        condition: currentWeather.main,
        description: currentWeather.description,
        iconCode: currentWeather.icon,
        iconUrl: `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`,
        humidity: weatherData.main.humidity,
        windSpeedKph: Number((weatherData.wind.speed * 3.6).toFixed(1)),
        temperatureC: Number(weatherData.main.temp.toFixed(1)),
        temperatureF: Number(((weatherData.main.temp * 9) / 5 + 32).toFixed(1)),
        searchedAt: new Date().toISOString(),
        coordinates: {
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon,
        },
      };
    } catch (error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
          };
        };
      };

      if (axiosError.response?.status === 404) {
        throw new NotFoundException('City not found.');
      }

      if (axiosError.response?.status === 401) {
        throw new InternalServerErrorException(
          'The configured OpenWeather API key is invalid or not activated yet.',
        );
      }

      if (axiosError.response?.status === 400) {
        throw new BadRequestException(
          axiosError.response.data?.message ?? 'Invalid weather query.',
        );
      }

      throw new BadGatewayException(
        'Unable to fetch weather data from OpenWeather right now.',
      );
    }
  }
}
