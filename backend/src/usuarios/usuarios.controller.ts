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
import { UsuariosService } from './usuarios.service';
import { CreateUserDto, UpdateUserDto } from './usuarios.dto';

/**
 * Controlador de usuarios - Manejo de endpoints REST
 * Expone endpoints para todas las operaciones CRUD de usuarios,
 * incluyendo generación automática de username y reset de contraseñas
 */
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Obtiene todos los usuarios
   * Equivalente al método buscar() de ControllerCatUsuarios
   * GET /api/usuarios
   */
  @Get()
  async findAll() {
    try {
      const usuarios = await this.usuariosService.findAll();
      return {
        success: true,
        data: usuarios,
        message: 'Usuarios obtenidos correctamente',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error al obtener usuarios',
      };
    }
  }

  /**
   * Obtiene todos los roles disponibles para asignar a usuarios
   * Equivalente al método buscarRoles() de ControllerCatUsuarios
   * GET /api/usuarios/roles/available
   */
  @Get('roles/available')
  async getAvailableRoles() {
    try {
      const roles = await this.usuariosService.getAvailableRoles();
      return {
        success: true,
        data: roles,
        message: 'Roles disponibles obtenidos',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error al obtener roles disponibles',
      };
    }
  }

  /**
   * Verifica si existe duplicidad en el nombre completo del usuario
   */
  @Get('check-duplicate')
  async checkDuplicate(
    @Query()
    query: {
      nombres: string;
      apellidoPaterno: string;
      apellidoMaterno?: string;
      excludeId?: number;
    },
  ) {
    try {
      const isDuplicate = await this.usuariosService.checkDuplicate(
        query.nombres,
        query.apellidoPaterno,
        query.apellidoMaterno,
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error al verificar duplicidad',
      };
    }
  }

  /**
   * Verifica si un email ya está registrado
   * GET /api/usuarios/check-email-duplicate?email=test@test.com&excludeId=1
   */
  @Get('check-email-duplicate')
  async checkEmailDuplicate(
    @Query('email') email: string,
    @Query('excludeId') excludeId?: number,
  ) {
    try {
      const isDuplicate = await this.usuariosService.checkEmailDuplicate(
        email,
        excludeId,
      );
      return { isDuplicate };
    } catch (error) {
      console.error('Error validando email:', error);
      return { isDuplicate: false };
    }
  }

  /**
   * Verifica si un teléfono ya está registrado
   * GET /api/usuarios/check-telefono-duplicate?telefono=1234567890&excludeId=1
   */
  @Get('check-telefono-duplicate')
  async checkTelefonoDuplicate(
    @Query('telefono') telefono: string,
    @Query('excludeId') excludeId?: number,
  ) {
    try {
      const isDuplicate = await this.usuariosService.checkTelefonoDuplicate(
        telefono,
        excludeId,
      );
      return { isDuplicate };
    } catch (error) {
      console.error('Error validando teléfono:', error);
      return { isDuplicate: false };
    }
  }

  /**
   * Obtiene un usuario por ID
   * Equivalente a la lógica de edición en ControllerCatUsuarios.init() case 2
   * GET /api/usuarios/:id
   * IMPORTANTE: Este endpoint debe ir AL FINAL de todos los GET endpoints
   */
  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      const usuario = await this.usuariosService.findById(id);
      return {
        success: true,
        data: usuario,
        message: 'Usuario encontrado',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error al buscar el usuario',
      };
    }
  }

  /**
   * Crea un nuevo usuario
   * Equivalente al método guardar() de ControllerCatUsuarios cuando banderaEdicion = false
   * POST /api/usuarios
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const usuario = await this.usuariosService.create(createUserDto);
      return {
        success: true,
        data: usuario,
        message:
          'Registro guardado correctamente, se enviará un email con la contraseña temporal',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error al crear el usuario',
      };
    }
  }

  /**
   * Genera username automáticamente basado en nombres y apellido paterno
   * Equivalente al método calculaUsuaro() de ControllerCatUsuarios
   * POST /api/usuarios/generate-username
   */
  @Post('generate-username')
  // eslint-disable-next-line @typescript-eslint/require-await
  async generateUsername(
    @Body() body: { nombres: string; apellidoPaterno: string },
  ) {
    try {
      const username = this.usuariosService.generateUsername(
        body.nombres,
        body.apellidoPaterno,
      );
      return {
        success: true,
        data: { username },
        message: 'Username generado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error al generar username',
      };
    }
  }

  /**
   * Actualiza un usuario existente
   * Equivalente al método actualizar() de ControllerCatUsuarios
   * PUT /api/usuarios/:id
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const usuario = await this.usuariosService.update(id, updateUserDto);
      return {
        success: true,
        data: usuario,
        message: 'Registro modificado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error al actualizar el usuario',
      };
    }
  }

  /**
   * Reestablece la contraseña de un usuario
   * Equivalente al método reestablecer() de ControllerCatUsuarios
   * PUT /api/usuarios/:id/reset-password
   */
  @Put(':id/reset-password')
  async resetPassword(@Param('id') id: number) {
    try {
      const result = await this.usuariosService.resetPassword(id);
      return {
        success: true,
        data: result,
        message: 'Se enviará una contraseña temporal cuando guarde los cambios',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error al reestablecer contraseña',
      };
    }
  }

  /**
   * Elimina un usuario
   * DELETE /api/usuarios/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    try {
      await this.usuariosService.delete(id);
      return {
        success: true,
        data: null,
        message: 'Usuario eliminado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message || 'Error al eliminar el usuario',
      };
    }
  }
}
