import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Role } from './role.entity';

/**
 * Entidad MenusRoles - Relación entre roles y menús/permisos
 */
@Entity('menus_roles')
export class MenusRoles {
  @PrimaryGeneratedColumn()
  idMenuRol: number;

  @Column({ name: 'id_menu' })
  idMenu: number; // Por ahora como número, después se puede relacionar con CatMenus

  @ManyToOne(() => Role, (role) => role.menusRolesList)
  @JoinColumn({ name: 'id_rol' })
  idRol: Role;
}
