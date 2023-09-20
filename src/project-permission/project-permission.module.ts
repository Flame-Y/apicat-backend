import { Module } from '@nestjs/common';
import { ProjectPermissionService } from './project-permission.service';
import { ProjectPermissionController } from './project-permission.controller';
import { ProjectPermission } from 'src/project-permission/entities/project-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectPermission])],
    controllers: [ProjectPermissionController],
    providers: [ProjectPermissionService],
    exports: [ProjectPermissionService]
})
export class ProjectPermissionModule {}
