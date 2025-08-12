import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { User } from './user.entity';
import { EmailService } from '../email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsuariosController],
  providers: [UsuariosService, EmailService],
  exports: [UsuariosService], // Exportar para usar en AuthModule
})
export class UsuariosModule {}
