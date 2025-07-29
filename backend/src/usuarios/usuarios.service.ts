import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './usuarios.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Métodos existentes
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['idRol'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { idUsuario: id },
      relations: ['idRol'],
    });
  }

  // Nuevo método para autenticación - Equivalente a CatUsuariosRepository.login()
  async findByUsernameAndPassword(
    username: string,
    encryptedPassword: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        username: username,
        password: encryptedPassword,
      },
      relations: ['idRol'],
    });
  }

  // Métodos CRUD completos basados en ControllerCatUsuarios
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['idRol'],
      order: { nombres: 'ASC' },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Generar username automáticamente si no se proporciona
    if (!createUserDto.username) {
      createUserDto.username = this.generateUsername(
        createUserDto.nombres,
        createUserDto.apellidoPaterno,
      );
    }

    // Generar contraseña temporal y encriptarla
    const tempPassword = this.generateRandomPassword(8);
    const encryptedPassword = this.encryptPassword(tempPassword);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: encryptedPassword,
      primerInicio: true,
      passTmp: tempPassword,
    });

    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    await this.usersRepository.remove(user);
  }

  // Métodos específicos del arquetipo original
  generateUsername(nombres: string, apellidoPaterno: string): string {
    const nombre = nombres.split(' ')[0];
    return `${nombre}.${apellidoPaterno}`.toLowerCase();
  }

  async resetPassword(id: number): Promise<{ passTmp: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const tempPassword = this.generateRandomPassword(8);
    const encryptedPassword = this.encryptPassword(tempPassword);

    user.password = encryptedPassword;
    user.passTmp = tempPassword;
    user.update = true;
    user.primerInicio = true;

    await this.usersRepository.save(user);
    return { passTmp: tempPassword };
  }

  getAvailableRoles(): any[] {
    // Aquí iría la lógica para obtener roles desde RolesService
    // Por ahora retornamos datos mock
    return [
      { idRol: 1, nombre: 'ADMINISTRADOR', status: true },
      { idRol: 2, nombre: 'OPERADOR', status: true },
    ];
  }

  async checkDuplicate(
    nombres: string,
    apellidoPaterno: string,
    apellidoMaterno?: string,
    excludeId?: number,
  ): Promise<boolean> {
    const fullName = `${nombres}${apellidoPaterno}${apellidoMaterno || ''}`;

    const query = this.usersRepository
      .createQueryBuilder('user')
      .where(
        "CONCAT(user.nombres, user.apellidoPaterno, COALESCE(user.apellidoMaterno, '')) = :fullName",
        { fullName },
      );

    if (excludeId) {
      query.andWhere('user.idUsuario != :excludeId', { excludeId });
    }

    const existingUser = await query.getOne();
    return !!existingUser;
  }

  // Métodos de utilidad
  private encryptPassword(password: string): string {
    return crypto.createHash('sha512').update(password).digest('hex');
  }

  private generateRandomPassword(length: number): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
}
