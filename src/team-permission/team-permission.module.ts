import { Module } from '@nestjs/common';
import { TeamPermissionService } from './team-permission.service';
import { TeamPermissionController } from './team-permission.controller';

@Module({
    controllers: [TeamPermissionController],
    providers: [TeamPermissionService],
    exports: [TeamPermissionService]
})
export class TeamPermissionModule {}
