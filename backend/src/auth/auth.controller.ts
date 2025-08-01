import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.services';
import { LoginDto } from './auth.dto';

/**
 * Controlador de autenticación
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
  /**
   * Endpoint POST /auth/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return { success: true, message: 'Logout successful' };
  }

  @Get('verify')
  async verify(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no válido');
    }

    const token = authHeader.substring(7);
    const user = await this.authService.verifyToken(token);

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    return { user };
  }
}
