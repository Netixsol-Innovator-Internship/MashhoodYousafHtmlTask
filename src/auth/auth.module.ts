<<<<<<< HEAD
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}), // options supplied at runtime
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
=======
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'chooseAnyStrongKey', // use env in production
      signOptions: { expiresIn: '24h' },
    }),
  ],
  exports: [JwtModule], // export so UsersModule can inject JwtService
>>>>>>> 629360c (login signup with token and crud on cars, based on token)
})
export class AuthModule {}
