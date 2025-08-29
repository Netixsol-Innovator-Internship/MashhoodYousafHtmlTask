import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  // ---------------- Create Car ----------------
  @Post()
  @UseGuards(JwtAuthGuard)
  async createCar(
    @Body()
    body: {
      name: string;
      make: string;
      model: string;
      year: number;
      price: number;
      description?: string;
      images?: string[];
      category: string;
    },
    @Req() req,
  ) {
    if (!body) throw new BadRequestException('Request body is missing');

    const requiredFields = [
      'name',
      'make',
      'model',
      'year',
      'price',
      'category',
    ];
    for (const field of requiredFields) {
      if (!body[field]) throw new BadRequestException(`${field} is required`);
    }

    if (isNaN(Number(body.price)) || isNaN(Number(body.year))) {
      throw new BadRequestException('Price and year must be valid numbers');
    }

    const ownerId = req.user.sub;

    const car = await this.carsService.createCar({
      ...body,
      owner: ownerId,
    });

    return car;
  }

  // ---------------- Get All Cars ----------------
  @Get()
  async getAllCars() {
    return this.carsService.getAllCars();
  }

  // ---------------- Get Car By ID ----------------
  @Get(':id')
  async getCar(@Param('id') id: string) {
    return this.carsService.getCarById(id);
  }

  // ---------------- Update Car ----------------
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateCar(
    @Param('id') id: string,
    @Body() body: Partial<any>,
    @Req() req,
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException('Request body is empty');
    }

    const allowedFields = ['price', 'year', 'model', 'description'];

    // Fetch existing car first
    const car = await this.carsService.getCarById(id);

    // Check ownership
    if (car.owner._id.toString() !== req.user.sub) {
      throw new ForbiddenException('You are not the owner of this car');
    }

    const updateData: Partial<any> = {};

    for (const field of allowedFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === '' 
      ) {
        // Keep old value if client didn’t provide a value
        updateData[field] = car[field];
      } else {
        // Validate numeric fields
        if (
          (field === 'price' || field === 'year') &&
          isNaN(Number(body[field]))
        ) {
          throw new BadRequestException(`${field} must be a valid number`);
        }
        updateData[field] = body[field];
      }
    }

    return this.carsService.updateCar(id, updateData);
  }

  // ---------------- Delete Car ----------------
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCar(@Param('id') id: string, @Req() req) {
    const car = await this.carsService.getCarById(id);

    if (car.owner._id.toString() !== req.user.sub) {
      throw new ForbiddenException('You are not the owner of this car');
    }

    return this.carsService.deleteCar(id);
  }

  // ---------------- Get Cars By Owner ----------------
  // @Get('owner/:ownerId')
  // async getCarsByOwner(@Param('ownerId') ownerId: string) {
  //   return this.carsService.getCarsByOwner(ownerId);
  // }
  @Get('owner/me')
  @UseGuards(JwtAuthGuard)
  async getCarsByOwner(@Req() req) {
    return this.carsService.getCarsByOwner(req.user.sub);
  }
}
