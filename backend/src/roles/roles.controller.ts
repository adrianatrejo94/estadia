import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto, CheckDuplicateDto } from './roles.dto';

/**
 * Controlador de roles - Manejo de endpoints REST
 * Expone endpoints para todas las operaciones CRUD de roles
 * y gestión de permisos de menús
 */
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Obtiene todos los roles
   * Equivalente al método buscar() de ControllerCatRoles
   * GET /api/roles
   */
  @Get()
  async findAll() {
    try {
      const roles = await this.rolesService.findAll();
      return {
        success: true,
        data: roles,
        message: 'Roles obtenidos correctamente',
      };
    } catch (error: unknown) {
      let message = 'Error al obtener roles';
      if (error instanceof Error) {
        message = error.message;
      }
      return {
        success: false,
        data: [],
        message,
      };
    }
  }

  /**
   * Obtiene un rol por ID
   * Equivalente a la lógica de edición en ControllerCatRoles.init() case 2
   * GET /api/roles/:id
   */
  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      const role = await this.rolesService.findById(id);
      return {
        success: true,
        data: role,
        message: 'Rol encontrado',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message:
          error instanceof Error ? error.message : 'Error al buscar el rol',
      };
    }
  }

  /**
   * Crea un nuevo rol
   * Equivalente al método guardar() de ControllerCatRoles cuando banderaEdicion = false
   * POST /api/roles
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const role = await this.rolesService.create(createRoleDto);
      return {
        success: true,
        data: role,
        message: 'Rol creado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message:
          error instanceof Error ? error.message : 'Error al crear el rol',
      };
    }
  }

  /**
   * Actualiza un rol existente
   * Equivalente al método actualizar() de ControllerCatRoles
   * PUT /api/roles/:id
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.rolesService.update(id, updateRoleDto);
      return {
        success: true,
        data: role,
        message: 'Rol actualizado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message:
          error instanceof Error ? error.message : 'Error al actualizar el rol',
      };
    }
  }

  /**
   * Elimina un rol
   * DELETE /api/roles/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    try {
      await this.rolesService.delete(id);
      return {
        success: true,
        data: null,
        message: 'Rol eliminado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message:
          error instanceof Error ? error.message : 'Error al eliminar el rol',
      };
    }
  }

  /**
   * Obtiene todos los menús disponibles para asignar a roles
   * Equivalente al método buscarTodosMenusDisponibles() del CatRolesRepository
   * GET /api/roles/menus/available
   */
  @Get('menus/available')
  getAvailableMenus() {
    try {
      const menus = this.rolesService.getAvailableMenus();
      return {
        success: true,
        data: menus,
        message: 'Menús disponibles obtenidos',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message:
          error instanceof Error
            ? error.message
            : 'Error al obtener menús disponibles',
      };
    }
  }

  /**
   * Obtiene menús disponibles */
  @Post('menus/available-excluding')
  getAvailableMenusExcluding(@Body() body: { excludedIds: number[] }) {
    try {
      const menus = this.rolesService.getAvailableMenusExcluding(
        body.excludedIds || [],
      );
      return {
        success: true,
        data: menus,
        message: 'Menús filtrados obtenidos',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message:
          error instanceof Error
            ? error.message
            : 'Error al obtener menús filtrados',
      };
    }
  }

  /**
   * Verifica si existe duplicidad en el nombre del rol  */
  @Get('check-duplicate')
  async checkDuplicate(@Query() query: CheckDuplicateDto) {
    try {
      const isDuplicate = await this.rolesService.checkDuplicate(
        query.nombre,
        query.excludeId ? Number(query.excludeId) : undefined,
      );
      return {
        success: true,
        isDuplicate,
        message: 'Verificación completada',
      };
    } catch (error) {
      return {
        success: false,
        isDuplicate: false,
        message:
          error instanceof Error
            ? error.message
            : 'Error al verificar duplicidad',
      };
    }
  }
}
