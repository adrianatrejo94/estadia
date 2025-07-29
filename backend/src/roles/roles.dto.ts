import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTOs para el módulo de roles
 * Equivalente a base/Commons/src/main/java/com/mx/ca/base/commons/dtos/DTORoles.java
 */

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean = true;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MenuRoleDto)
  menusRolesList?: MenuRoleDto[];
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MenuRoleDto)
  menusRolesList?: MenuRoleDto[];
}

export class MenuRoleDto {
  @IsNotEmpty()
  idMenu: any; // Referencia al menú

  @IsOptional()
  idRol?: any; // Referencia al rol (opcional para creación)
}

export class RoleResponseDto {
  idRol: number;
  nombre: string;
  descripcion: string;
  status: boolean;
  menusRolesList?: any[];
  catUsuariosList?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export class CheckDuplicateDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  excludeId?: number;
}
