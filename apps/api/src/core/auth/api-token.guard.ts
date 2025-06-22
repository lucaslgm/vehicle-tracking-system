import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const token =
      request.headers['x-api-token' as keyof typeof request.headers];

    if (typeof token !== 'string') {
      throw new UnauthorizedException('Invalid or missing API Token.');
    }

    const secretToken = this.configService.get<string>('API_TOKEN');

    if (!secretToken) {
      Logger.error('API_TOKEN is not configured on the server.');
      throw new UnauthorizedException();
    }

    if (token !== secretToken) {
      throw new UnauthorizedException('Invalid or missing API Token.');
    }

    return true;
  }
}
