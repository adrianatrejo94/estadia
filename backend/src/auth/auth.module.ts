import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.services';
import { AuthToken } from './auth.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';

/**
 * Módulo de autenticación
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AuthToken]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    UsuariosModule, // Necesario para validar usuarios
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
