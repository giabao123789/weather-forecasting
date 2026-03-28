import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtPayload>(
    _error: unknown,
    user: TUser | false | null,
  ): TUser | null {
    if (!user) {
      return null;
    }

    return user;
  }
}
