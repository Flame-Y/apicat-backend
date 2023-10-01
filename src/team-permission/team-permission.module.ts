import { Module } from '@nestjs/common';
import { TeamPermissionService } from './team-permission.service';
import { TeamPermissionController } from './team-permission.controller';
import { TeamPermission } from './entities/team-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([TeamPermission])],
    controllers: [TeamPermissionController],
    providers: [TeamPermissionService],
    exports: [TeamPermissionService]
})
export class TeamPermissionModule {}
