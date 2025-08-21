import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { User } from './user.entity';
import { EmailService } from '../email/email.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, EmailService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
