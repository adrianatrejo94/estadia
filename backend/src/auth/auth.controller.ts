import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
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
   * Equivalente al método salir() de ControllerLogin.java
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return { success: true, message: 'Logout successful' };
  }
}
