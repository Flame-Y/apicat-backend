import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { LoginGuard } from 'src/login.guard';
import { User } from 'src/user/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequireLogin } from 'src/custom.decorator';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    // @UseGuards(LoginGuard)
    @RequireLogin()
    @ApiBearerAuth()
    create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
        return this.projectService.create(createProjectDto, req.user as User);
    }

    @Get()
    findAll() {
        return this.projectService.findAll();
    }
    @Get()
    @RequireLogin()
    @ApiBearerAuth()
    findByUser(@Req() req: any) {
        return this.projectService.findByUser(req.user as User);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectService.update(+id, updateProjectDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectService.remove(+id);
    }
}
