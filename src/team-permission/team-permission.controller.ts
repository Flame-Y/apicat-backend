import { Controller } from '@nestjs/common';
import { TeamPermissionService } from './team-permission.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('团队权限管理模块')
@Controller('team-permission')
export class TeamPermissionController {
    constructor(private readonly teamPermissionService: TeamPermissionService) {}
}
