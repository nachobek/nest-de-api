import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller()
export class AppController {
  @Get()
  getHealthCheck() {
    return { status: 'OK' };
  }
}
