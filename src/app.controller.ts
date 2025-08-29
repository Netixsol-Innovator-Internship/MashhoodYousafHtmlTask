<<<<<<< HEAD
/* eslint-disable prettier/prettier */
=======
>>>>>>> 629360c (login signup with token and crud on cars, based on token)
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
