// cars/cars.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './car.schema';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    AuthModule, // ✅ inside imports array
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
