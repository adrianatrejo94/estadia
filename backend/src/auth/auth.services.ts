/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as crypto from 'crypto';

/**
 * Servicio de autenticación - Lógica de negocio
 * Equivalente a la lógica interna de ControllerLogin.entrar()
 * Procesa los datos que vienen del auth.controller.ts
 */
@Injectable()
export class AuthService {
  updatePassword(token: string, newPassword: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async verifyToken(token: string) {
    try {
      // Verificar si el token es válido
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const user = await this.usuariosService.findById(payload.sub);
      if (!user || !user.status || !user.idRol?.status) {
        return null; // Usuario o rol inactivo
      }
      const { password: _, ...userWithoutPassword } = user; // Excluir contraseña
      return userWithoutPassword; // Retornar usuario sin contraseña
    } catch (error) {
      return null; // Token inválido o error en la verificación
    }
  }

  /**
   * Valida credenciales y genera token JWT
   */
  async login(username: string, password: string) {
    try {
      // Validar campos vacíos - equivalente a if (!usuario.isEmpty() && !password.isEmpty())
      if (!username || !password) {
        return {
          success: false,
          message: 'Usuario y contraseña son requeridos',
        };
      }

      // Encriptar contraseña - equivalente a UtilCA.Encriptar(this.password)
      const encryptedPassword = this.encryptPassword(password);

      // Buscar usuario con contraseña encriptada - equivalente a getUsuarioService().login()
      const user = await this.usuariosService.findByUsernameAndPassword(
        username,
        encryptedPassword,
      );

      if (!user) {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
      }

      // Verificar estado del usuario - equivalente a usuarioBase.getStatus()
      if (!user.status) {
        return { success: false, message: 'Usuario inactivo' };
      }

      // Verificar estado del rol - equivalente a usuarioBase.getIdRol().getStatus()
      if (!user.idRol?.status) {
        return { success: false, message: 'Perfil inactivo' };
      }

      // Generar token JWT - reemplaza Spring Security context
      const payload = {
        sub: user.idUsuario,
        username: user.username,
        role: user.idRol?.nombre,
        primerInicio: user.primerInicio,
      };

      const token = this.jwtService.sign(payload);

      // Retornar sin contraseña - datos que recibe authService.js

      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        token,
        user: userWithoutPassword,
        message: 'Login exitoso',
      };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  /**
   * Encriptación de contraseña
   */
  private encryptPassword(password: string): string {
    return crypto.createHash('sha512').update(password).digest('hex');
  }
}
