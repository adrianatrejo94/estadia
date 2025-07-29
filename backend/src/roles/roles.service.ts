import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';

/**
 * Servicio de roles - Lógica de negocio
 * Maneja todas las operaciones CRUD de roles y gestión de permisos
 */
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  /**
   * Obtiene todos los roles
   */
  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: ['menusRolesList', 'catUsuariosList'],
      order: { nombre: 'ASC' },
    });
  }

  /**
   * Obtiene un rol por ID
   * Equivalente a la lógica de edición en ControllerCatRoles
   */
  async findById(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { idRol: id },
      relations: ['menusRolesList', 'menusRolesList.idMenu'],
    });

    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return role;
  }

  /**
   * Crea un nuevo rol
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verificar duplicidad - equivalente a verificaDuplicidad()
    const existingRole = await this.rolesRepository.findOne({
      where: { nombre: createRoleDto.nombre },
    });

    if (existingRole) {
      throw new ConflictException(
        `Ya existe un registro con el identificador: ${createRoleDto.nombre}`,
      );
    }

    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  /**
   * Actualiza un rol existente
   * Equivalente al método actualizar() de ControllerCatRoles
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);

    // Verificar duplicidad solo si el nombre cambió
    if (updateRoleDto.nombre && updateRoleDto.nombre !== role.nombre) {
      const existingRole = await this.rolesRepository.findOne({
        where: { nombre: updateRoleDto.nombre },
      });

      if (existingRole) {
        throw new ConflictException(
          `Ya existe un registro con el identificador: ${updateRoleDto.nombre}`,
        );
      }
    }

    Object.assign(role, updateRoleDto);
    return this.rolesRepository.save(role);
  }

  /**
   * Elimina un rol
   */
  async delete(id: number): Promise<void> {
    const role = await this.findById(id);
    await this.rolesRepository.remove(role);
  }

  /**
   * Obtiene todos los menús disponibles para asignar a roles
   * Equivalente al método buscarTodosMenusDisponibles() del CatRolesRepository
   */
  getAvailableMenus(): any[] {
    // Aquí iría la lógica para obtener menús desde la entidad CatMenus
    // Por ahora retornamos datos mock
    return [
      { idMenu: 1, nombre: 'Dashboard', status: true },
      { idMenu: 2, nombre: 'Usuarios', status: true },
      { idMenu: 3, nombre: 'Roles', status: true },
      { idMenu: 4, nombre: 'Catálogos', status: true },
    ];
  }

  /**
   * Obtiene menús disponibles excluyendo los ya asignados
   * Equivalente al método buscarMenusDisponibles(ids) del CatRolesRepository
   */
  getAvailableMenusExcluding(excludedIds: number[]): any[] {
    const allMenus = this.getAvailableMenus();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return allMenus.filter((menu) => !excludedIds.includes(menu.idMenu));
  }

  /**
   * Verifica si existe duplicidad en el nombre del rol
   * Equivalente a la lógica de verificaDuplicidad en ControllerCatRoles.guardar()
   */
  async checkDuplicate(nombre: string, excludeId?: number): Promise<boolean> {
    const query = this.rolesRepository
      .createQueryBuilder('role')
      .where('role.nombre = :nombre', { nombre });

    if (excludeId) {
      query.andWhere('role.idRol != :excludeId', { excludeId });
    }

    const existingRole = await query.getOne();
    return !!existingRole;
  }
}
