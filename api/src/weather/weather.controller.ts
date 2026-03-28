import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getWeather(
    @Query() weatherQueryDto: WeatherQueryDto,
    @CurrentUser() user: JwtPayload | null,
  ) {
    return this.weatherService.getWeather(weatherQueryDto, user?.sub);
  }
}
