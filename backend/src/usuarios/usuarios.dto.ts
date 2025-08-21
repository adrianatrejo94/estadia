import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsEmail,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo nombres es requerido' })
  nombres: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo apellido paterno es requerido' })
  apellidoPaterno: string;

  @IsString()
  @IsOptional()
  apellidoMaterno?: string;

  @IsString()
  @IsOptional()
  username?: string; // Se puede generar automáticamente

  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo teléfono es requerido' })
  @Matches(/^\d{10}$/, {
    message: 'El teléfono debe tener exactamente 10 dígitos',
  })
  telefono: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean = true;

  @IsOptional()
  idRol?: any; // Referencia al rol asignado

  @IsBoolean()
  @IsOptional()
  primerInicio?: boolean = true; // Para nuevos usuarios
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nombres?: string;

  @IsString()
  @IsOptional()
  apellidoPaterno?: string;

  @IsString()
  @IsOptional()
  apellidoMaterno?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{10}$/, {
    message: 'El teléfono debe tener exactamente 10 dígitos',
  })
  telefono: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsOptional()
  idRol?: any;

  @IsBoolean()
  @IsOptional()
  primerInicio?: boolean;

  @IsString()
  @IsOptional()
  passTmp?: string; // Para contraseñas temporales

  @IsBoolean()
  @IsOptional()
  update?: boolean; // Flag para indicar si se actualizó la contraseña
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  passTmp: string;

  @IsBoolean()
  @IsOptional()
  update?: boolean = true;
}

export class GenerateUsernameDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo nombres es requerido' })
  nombres: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo apellido paterno es requerido' })
  apellidoPaterno: string;
}

export class UserResponseDto {
  idUsuario: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  username: string;
  email?: string;
  telefono?: string;
  status: boolean;
  primerInicio: boolean;
  idRol?: any;
  createdAt: Date;
  updatedAt: Date;
}

export class CheckDuplicateUserDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidoPaterno: string;

  @IsString()
  @IsOptional()
  apellidoMaterno?: string;

  @IsOptional()
  excludeId?: number;
}
