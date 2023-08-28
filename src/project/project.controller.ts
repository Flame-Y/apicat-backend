import { Controller, Get, Post, Body, Param, Delete, Req, HttpStatus } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtUserData } from 'src/login.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from 'src/custom.decorator';
import { ProjectInfoVo } from './vo/project-info.vo';
import { AssginPermissionDto } from './dto/assign-permission.dto';
import { ProjectListVo } from './vo/project-list.vo';

@ApiTags('项目管理模块')
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '项目已存在',
        type: String
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: '创建成功/失败',
        type: String
    })
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'success',
        type: [ProjectListVo]
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '用户未登录',
        type: String
    })
    @Get('getUserProjectList')
    @RequireLogin()
    @ApiBearerAuth()
    findByUser(@Req() req: any) {
        return this.projectService.findByUser(req.user as JwtUserData);
    }

    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '项目不存在',
        type: String
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'success',
        type: ProjectInfoVo
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '用户未登录',
        type: String
    })
    @ApiBearerAuth()
    @RequireLogin()
    @Get('getProjectDetail/:id')
    findOne(@Param('id') id: string, @Req() req: any) {
        //todo: 通过id获取项目详情,包括项目下的所有接口
        return this.projectService.findProjectDetail(+id, req.user as JwtUserData);
    }

    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '项目不存在',
        type: String
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '删除成功/失败',
        type: String
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '用户未登录/没有删除权限',
        type: String
    })
    @ApiBearerAuth()
    @RequireLogin()
    @Delete('deleteProject/:id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.projectService.remove(+id, req.user as JwtUserData);
    }

    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '项目不存在/权限类型错误/不能分配给自己/用户不存在',
        type: String
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: '分配权限成功/失败',
        type: String
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '更新权限成功',
        type: String
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '用户未登录/没有分配权限',
        type: String
    })
    @ApiBearerAuth()
    @RequireLogin()
    @Post('assignPermission')
    assignPermission(@Body() assignPermission: AssginPermissionDto, @Req() req: any) {
        return this.projectService.assignPermission(
            assignPermission.pid,
            assignPermission.uid,
            assignPermission.type,
            req.user as JwtUserData
        );
    }

    @ApiBearerAuth()
    @RequireLogin()
    @Post('getProjectPermission/:page/:size')
    getProjectPermission(
        @Param('page') page: string,
        @Param('size') size: string,
        @Body() assignPermission: AssginPermissionDto,
        @Req() req: any
    ) {
        return this.projectService.getProjectPermission(
            assignPermission.pid,
            assignPermission.type,
            +page,
            +size,
            req.user as JwtUserData
        );
    }
}
