import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './car.schema';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async createCar(data: Partial<Car>): Promise<Car> {
    const car = new this.carModel(data);
    return car.save();
  }

  async getAllCars(): Promise<Car[]> {
    return this.carModel.find().populate('owner', 'name email').exec();
  }

  async getCarById(id: string): Promise<Car> {
    const car = await this.carModel
      .findById(id)
      .populate('owner', 'name email')
      .exec();
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async updateCar(id: string, data: Partial<Car>): Promise<Car> {
    const car = await this.carModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async deleteCar(id: string): Promise<{ message: string }> {
    const car = await this.carModel.findByIdAndDelete(id).exec();
    if (!car) throw new NotFoundException('Car not found');
    return { message: 'Car deleted successfully' };
  }

  async getCarsByOwner(ownerId: string): Promise<Car[]> {
    return this.carModel
      .find({ owner: ownerId })
      .populate('owner', 'name email')
      .exec();
  }
}
