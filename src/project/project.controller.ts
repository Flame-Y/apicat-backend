import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtUserData } from 'src/login.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequireLogin } from 'src/custom.decorator';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post('create')
    @RequireLogin()
    @ApiBearerAuth()
    create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
        return this.projectService.create(createProjectDto, req.user as JwtUserData);
    }

    //大概是一个不会用到的接口
    @Get('getAll')
    findAll() {
        return this.projectService.findAll();
    }

    @Get('getUserProjectList')
    @RequireLogin()
    @ApiBearerAuth()
    findByUser(@Req() req: any) {
        return this.projectService.findByUser(req.user as JwtUserData);
    }

    @Get('getProjectDetail/:id')
    findOne(@Param('id') id: string) {
        //todo: 通过id获取项目详情,包括项目下的所有接口
        return this.projectService.findOne(+id);
    }

    @ApiBearerAuth()
    @RequireLogin()
    @Delete('deleteProject/:id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.projectService.remove(+id, req.user as JwtUserData);
    }
}
