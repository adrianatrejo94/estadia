import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { MenusRoles } from './menus-roles.entity';

/**
 * Módulo de roles - Configuración del módulo NestJS
 * Equivalente a la configuración de Spring para el módulo de roles
 * Configura todas las dependencias necesarias para el funcionamiento
 * del sistema de roles y permisos
 */
@Module({
  imports: [
    // Registra la entidad Role para TypeORM
    TypeOrmModule.forFeature([Role, MenusRoles]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [TypeOrmModule], // Exporta el módulo TypeOrm para uso en otros módulos
})
export class RolesModule {}
