import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  //CreateDateColumn,
  //UpdateDateColumn,
} from 'typeorm';

import { User } from '../usuarios/user.entity';
import { MenusRoles } from './menus-roles.entity';

/**
 * Entidad Role - Modelo de datos para roles del sistema
 * Representa los roles que pueden ser asignados a usuarios
 * con sus respectivos permisos de menús/funciones
 */
@Entity('cat_roles')
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  idRol: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: true })
  status: boolean;

  //@CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  //@UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  // Relación con usuarios - equivalente a catUsuariosList en CatRoles.java
  @OneToMany(() => User, (user) => user.idRol)
  catUsuariosList: User[];

  // Relación con menús/permisos - equivalente a menusRolesList en CatRoles.java
  @OneToMany(() => MenusRoles, (menusRoles) => menusRoles.idRol, {
    cascade: true,
  })
  menusRolesList: MenusRoles[];
}
