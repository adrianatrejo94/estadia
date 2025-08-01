import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Role } from './role.entity';
import { CatMenus } from '../menus/cat-menus.entity';

@Entity('menus_roles')
export class MenusRoles {
  @PrimaryGeneratedColumn({ name: 'id_menu_rol' })
  idMenuRol: number;

  @ManyToOne(() => CatMenus, (catMenus) => catMenus.menusRolesList)
  @JoinColumn({ name: 'id_menu' })
  idMenu: CatMenus;

  @ManyToOne(() => Role, (role) => role.menusRolesList)
  @JoinColumn({ name: 'id_rol' })
  idRol: Role;
}
