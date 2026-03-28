import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

function trimString({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeEmail({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class RegisterDto {
  @IsString()
  @Transform(trimString)
  name: string;

  @IsEmail()
  @Transform(normalizeEmail)
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
