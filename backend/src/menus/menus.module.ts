import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatMenus } from './cat-menus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatMenus])],
  exports: [TypeOrmModule],
})
export class MenusModule {}
