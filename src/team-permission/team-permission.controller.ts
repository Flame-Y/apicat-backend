import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamPermissionService } from './team-permission.service';
import { CreateTeamPermissionDto } from './dto/create-team-permission.dto';
import { UpdateTeamPermissionDto } from './dto/update-team-permission.dto';

@Controller('team-permission')
export class TeamPermissionController {
    constructor(private readonly teamPermissionService: TeamPermissionService) {}

    @Post()
    create(@Body() createTeamPermissionDto: CreateTeamPermissionDto) {
        return this.teamPermissionService.create(createTeamPermissionDto);
    }

    @Get()
    findAll() {
        return this.teamPermissionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.teamPermissionService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTeamPermissionDto: UpdateTeamPermissionDto) {
        return this.teamPermissionService.update(+id, updateTeamPermissionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.teamPermissionService.remove(+id);
    }
}
