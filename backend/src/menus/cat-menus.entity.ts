import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MenusRoles } from '../roles/menus-roles.entity';

// Entidad CatMenus - Catálogo de menús del sistema

@Entity('cat_menus')
export class CatMenus {
  @PrimaryGeneratedColumn({ name: 'id_menu' })
  idMenu: number;

  @Column()
  nombre: string;

  @Column({ name: 'spring_security' })
  springSecurity: string;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => MenusRoles, (menusRoles) => menusRoles.idMenu)
  menusRolesList: MenusRoles[];
}
