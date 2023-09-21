import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtUserData } from 'src/login.guard';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RequireLogin } from 'src/custom.decorator';

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

    @Post('transferTeam/:id/:newOwnerId')
    @RequireLogin()
    @ApiBearerAuth()
    transferTeamOwner(@Param('id') id: string, @Param('newOwnerId') newOwnerId: string, @Req() req: any) {
        return this.teamService.transferTeamOwner(+id, +newOwnerId, req.user as JwtUserData);
    }

    @Delete('deleteTeam/:id')
    @RequireLogin()
    @ApiBearerAuth()
    remove(@Param('id') id: string, @Req() req: any) {
        return this.teamService.remove(+id, req.user as JwtUserData);
    }
}
