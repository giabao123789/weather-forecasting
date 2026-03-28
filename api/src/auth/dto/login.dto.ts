import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

function normalizeEmail({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class LoginDto {
  @IsEmail()
  @Transform(normalizeEmail)
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
