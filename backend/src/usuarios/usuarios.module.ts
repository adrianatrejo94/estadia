import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Exportar para usar en AuthModule
})
export class UsuariosModule {}
