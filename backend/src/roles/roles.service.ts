import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { MenusRoles } from './menus-roles.entity';
import { CatMenus } from '../menus/cat-menus.entity';
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
    @InjectRepository(MenusRoles)
    private readonly menusRolesRepository: Repository<MenusRoles>,
    @InjectRepository(CatMenus)
    private readonly menusRepository: Repository<CatMenus>,
  ) {}

  /**
   * Obtiene todos los roles
   */
  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: {
        menusRolesList: {
          idMenu: true,
        },
        catUsuariosList: true,
      },
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

    const role = this.rolesRepository.create({
      nombre: createRoleDto.nombre,
      descripcion: createRoleDto.descripcion,
      status: createRoleDto.status ?? true,
    });

    const savedRole = await this.rolesRepository.save(role);

    // Procesar menús si existen
    if (
      createRoleDto.menusRolesList &&
      createRoleDto.menusRolesList.length > 0
    ) {
      await this.assignMenusToRole(savedRole, createRoleDto.menusRolesList);
    }

    // Retornar el rol con sus relaciones
    return this.findById(savedRole.idRol);
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

    // Actualizar campos básicos
    if (updateRoleDto.nombre) role.nombre = updateRoleDto.nombre;
    if (updateRoleDto.descripcion !== undefined)
      role.descripcion = updateRoleDto.descripcion;
    if (updateRoleDto.status !== undefined) role.status = updateRoleDto.status;

    await this.rolesRepository.save(role);

    // Actualizar menús si se proporcionaron
    if (updateRoleDto.menusRolesList !== undefined) {
      // Eliminar menús existentes
      await this.menusRolesRepository.delete({ idRol: { idRol: id } });

      // Asignar nuevos menús
      if (updateRoleDto.menusRolesList.length > 0) {
        await this.assignMenusToRole(role, updateRoleDto.menusRolesList);
      }
    }

    return this.findById(id);
  }

  /**
   * Asigna menús a un rol
   */
  private async assignMenusToRole(role: Role, menusList: any[]): Promise<void> {
    for (const menuItem of menusList) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const menuId =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof menuItem.idMenu === 'object'
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            menuItem.idMenu.idMenu
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, prettier/prettier
          menuItem.idMenu;

      // Verificar que el menú existe
      const menu = await this.menusRepository.findOne({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where: { idMenu: menuId },
      });

      if (menu) {
        const menuRole = this.menusRolesRepository.create({
          idMenu: menu,
          idRol: role,
        });
        await this.menusRolesRepository.save(menuRole);
      }
    }
  }

  /**
   * Elimina un rol
   */
  async delete(id: number): Promise<void> {
    const role = await this.findById(id);

    // Primero eliminar los permisos de menú asociados
    await this.menusRolesRepository.delete({ idRol: { idRol: id } });

    // Luego eliminar el rol
    await this.rolesRepository.remove(role);
  }

  /**
   * Obtiene todos los menús disponibles desde la base de datos
   */
  async getAvailableMenus(): Promise<CatMenus[]> {
    return this.menusRepository.find({
      where: { status: true },
      order: { nombre: 'ASC' },
    });
  }

  /**
   * Obtiene menús disponibles excluyendo los ya asignados
   */
  async getAvailableMenusExcluding(excludedIds: number[]): Promise<CatMenus[]> {
    const query = this.menusRepository
      .createQueryBuilder('menu')
      .where('menu.status = :status', { status: true });

    if (excludedIds && excludedIds.length > 0) {
      query.andWhere('menu.idMenu NOT IN (:...excludedIds)', { excludedIds });
    }

    return query.orderBy('menu.nombre', 'ASC').getMany();
  }

  /**
   * Verifica si existe duplicidad en el nombre del rol
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
