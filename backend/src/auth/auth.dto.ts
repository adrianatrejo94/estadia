import { IsString, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO para validar datos de login
 * Valida automáticamente los datos que vienen de Login.jsx
 * Equivalente a las validaciones de ControllerLogin
 */
export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'El usuario es requerido' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(1, { message: 'La contraseña no puede estar vacía' })
  password: string;
}

/**
 * DTO para respuesta de login
 * Define la estructura que retorna al frontend
 */
export class LoginResponseDto {
  success: boolean;
  token?: string;
  user?: any;
  message: string;
}
