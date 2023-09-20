import { Controller } from '@nestjs/common';
import { ProjectPermissionService } from './project-permission.service';

@Controller('permission')
export class ProjectPermissionController {
    constructor(private readonly permissionService: ProjectPermissionService) {}
}
