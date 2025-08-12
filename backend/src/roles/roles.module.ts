import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { MenusRoles } from './menus-roles.entity';
import { CatMenus } from '../menus/cat-menus.entity';

/**
 * Módulo de roles - Configuración del módulo NestJS
 */
@Module({
  imports: [
    // Registra la entidad Role para TypeORM
    TypeOrmModule.forFeature([Role, MenusRoles, CatMenus]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [TypeOrmModule], // Exporta el módulo TypeOrm para uso en otros módulos
})
export class RolesModule {}
