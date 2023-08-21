import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Api } from './entities/api.entity';
import { ProjectService } from 'src/project/project.service';
import { PermissionService } from 'src/permission/permission.service';
import { JwtUserData } from 'src/login.guard';

@Injectable()
export class ApiService {
    constructor(
        private readonly projectService: ProjectService,
        private readonly permissionService: PermissionService
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
        }
        console.log(foundPermission);

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

    update(id: number, updateApiDto: UpdateApiDto) {
        return `This action updates a #${id} api`;
    }

    remove(id: number) {
        return `This action removes a #${id} api`;
    }
}
