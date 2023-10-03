import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtUserData } from 'src/login.guard';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RequireLogin } from 'src/custom.decorator';
import { AssginPermissionDto } from './dto/assign-permission.dto';
import { DeletePermissionDto } from './dto/delete-permission.dto';

@ApiTags('团队管理模块')
@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post('create')
    @RequireLogin()
    @ApiBearerAuth()
    create(@Body() createTeamDto: CreateTeamDto, @Req() req: any) {
        return this.teamService.create(createTeamDto, req.user as JwtUserData);
    }

    @Get('getUserTeamList')
    @RequireLogin()
    @ApiBearerAuth()
    findByUser(@Req() req: any) {
        return this.teamService.findByUser(req.user as JwtUserData);
    }

    @Patch(':id')
    updateInfo(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
        return this.teamService.updateInfo(+id, updateTeamDto);
    }

    @Post('transferTeam/:teamId/:newOwnerId')
    @RequireLogin()
    @ApiBearerAuth()
    transferTeamOwner(@Param('teamId') teamId: string, @Param('newOwnerId') newOwnerId: string, @Req() req: any) {
        return this.teamService.transferTeamOwner(+teamId, +newOwnerId, req.user as JwtUserData);
    }

    @Delete('deleteTeam/:id')
    @RequireLogin()
    @ApiBearerAuth()
    remove(@Param('id') id: string, @Req() req: any) {
        return this.teamService.remove(+id, req.user as JwtUserData);
    }

    @Get('getTeamPermission/:teamId')
    @RequireLogin()
    @ApiBearerAuth()
    getTeamPermission(@Param('teamId') teamId: string, @Req() req: any) {
        return this.teamService.findTeamPermission(+teamId, req.user as JwtUserData);
    }

    @Post('assignTeamPermission')
    @RequireLogin()
    @ApiBearerAuth()
    assignTeamPermission(@Body() assignPermission: AssginPermissionDto, @Req() req: any) {
        return this.teamService.assignTeamPermission(
            assignPermission.tid,
            assignPermission.uid,
            assignPermission.type,
            req.user as JwtUserData
        );
    }

    @Delete('removeUserFromTeam')
    @RequireLogin()
    @ApiBearerAuth()
    deleteTeamPermission(@Body() deletePermission: DeletePermissionDto, @Req() req: any) {
        return this.teamService.removeUserFromTeam(deletePermission.tid, deletePermission.uid, req.user as JwtUserData);
    }
}
