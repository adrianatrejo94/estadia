import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('cat_usuarios')
export class User {
  @PrimaryGeneratedColumn()
  idUsuario: number;

  @Column()
  nombres: string;

  @Column({ nullable: true })
  apellidoPaterno: string;

  @Column({ nullable: true })
  apellidoMaterno: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ default: true })
  primerInicio: boolean;

  @Column({ nullable: true })
  passTmp: string;

  @Column({ default: false })
  update: boolean;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'id_rol' })
  idRol: Role;
}
