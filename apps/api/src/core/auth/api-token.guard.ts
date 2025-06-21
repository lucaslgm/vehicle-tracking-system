import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
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

    // Obtém o token secreto do ficheiro .env
    const secretToken = this.configService.get<string>('API_TOKEN');

    if (!secretToken) {
      // Falha de segurança: se o token não estiver configurado no servidor, ninguém pode aceder.
      console.error('API_TOKEN is not configured on the server.');
      throw new UnauthorizedException();
    }

    // Compara o token enviado pelo cliente com o token secreto.
    if (token !== secretToken) {
      throw new UnauthorizedException('Invalid or missing API Token.');
    }

    // Se os tokens corresponderem, a requisição é permitida.
    return true;
  }
}
