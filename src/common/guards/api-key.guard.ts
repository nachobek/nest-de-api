import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKey = process.env.API_KEY;

  constructor() {
    if (!this.apiKey) {
      Logger.error('Missing `API_KEY` environment variable', this.constructor.name);
      throw new Error('Missing `API_KEY` environment variable');
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || authHeader !== this.apiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
