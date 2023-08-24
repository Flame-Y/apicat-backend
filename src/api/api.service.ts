import { HttpException, HttpStatus, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Api } from './entities/api.entity';
import { ProjectService } from 'src/project/project.service';
import { PermissionService } from 'src/permission/permission.service';
import { ApiArgsService } from 'src/api-args/api-args.service';
import { JwtUserData } from 'src/login.guard';
import * as fs from 'fs';
import { ApiInfoVo } from './vo/api-info.vo';
@Injectable()
export class ApiService {
    constructor(
        @Inject(forwardRef(() => ProjectService))
        private readonly projectService: ProjectService,
        private readonly permissionService: PermissionService,
        private readonly apiArgService: ApiArgsService
    ) {}
    private logger = new Logger();
    @InjectRepository(Api)
    private apiRepository: Repository<Api>;
    async create(createApiDto: CreateApiDto, user: JwtUserData) {
        // 查看项目是否存在
        const foundProject = await this.projectService.findOne(createApiDto.pid);
        if (!foundProject) {
            throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
        }
        console.log(foundProject);

        // 查看用户是否有权限
        const foundPermission = await this.permissionService.findByPidAndUid(createApiDto.pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        try {
            const api = new Api();
            api.name = createApiDto.name;
            api.description = createApiDto.description;
            api.type = createApiDto.type;
            api.url = createApiDto.url;
            api.pid = createApiDto.pid;
            await this.apiRepository.save(api);
            return '创建成功';
        } catch (e) {
            this.logger.log(e);
            return '创建失败';
        }
    }

    findAll() {
        return `This action returns all api`;
    }

    findOne(id: number) {
        return `This action returns a #${id} api`;
    }

    async findByProject(pid: number, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.permissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        }
        const apiList = await this.apiRepository.findBy({ pid: pid });
        return apiList;
    }

    async findApiDetail(id: number, pid: number, user: JwtUserData): Promise<ApiInfoVo> {
        const foundPermission = await this.permissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        }
        const foundApi = await this.apiRepository.findOneBy({ id: id });
        const foundApiArgs = await this.apiArgService.findByApiId(id);
        const apiInfoVo = new ApiInfoVo();
        apiInfoVo.apiInfo = foundApi;
        apiInfoVo.apiArgs = foundApiArgs;
        // apiInfoVo.apiArgs = [];
        return apiInfoVo;
    }
    async update(id: number, updateApiDto: UpdateApiDto, pid: number, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.permissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }
        const foundApi = await this.apiRepository.findOneBy({ id: id });
        if (updateApiDto.name) foundApi.name = updateApiDto.name;
        if (updateApiDto.description) foundApi.description = updateApiDto.description;
        if (updateApiDto.type) foundApi.type = updateApiDto.type;
        if (updateApiDto.url) foundApi.url = updateApiDto.url;
        try {
            await this.apiRepository.save(foundApi);
            return '更新成功';
        } catch (e) {
            this.logger.log(e);
            return '更新失败';
        }
    }

    async remove(id: number, pid: number, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.permissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        try {
            await this.apiRepository.delete(id);
            return '删除成功';
        } catch (e) {
            this.logger.log(e);
            return '删除失败';
        }
    }
    // 导入swagger文档接口
    async importApiBySwaggerFile(pid: number, user: JwtUserData, swaggerFile: any) {
        // 查看用户是否有权限
        const foundPermission = await this.permissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }
        try {
            // 读取swagger文件
            const filePath = swaggerFile[0].path;
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const swaggerJson = JSON.parse(fileContent);

            // 读取swagger文件中的接口信息
            const apiList = [];
            for (const url in swaggerJson.paths) {
                const api = new Api();
                api.name = swaggerJson.paths[url].summary ? swaggerJson.paths[url].summary : url;
                api.description = swaggerJson.paths[url].description ? swaggerJson.paths[url].description : '';
                // todo: 解析swagger文件中的response
                api.type = Object.keys(swaggerJson.paths[url])[0];
                api.url = url;
                api.pid = pid;
                apiList.push(api);
            }
            //todo: 同名接口处理
            //todo: 与schema关联

            // 将接口信息保存到数据库
            await this.apiRepository.save(apiList);
            // 删除swagger文件
            fs.unlinkSync(filePath);
            return '导入成功';
        } catch (e) {
            this.logger.log(e);
            return '导入失败';
        }
    }
}
