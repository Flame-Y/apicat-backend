import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateApiArgDto } from './dto/create-api-arg.dto';
import { UpdateApiArgDto } from './dto/update-api-arg.dto';
import { ProjectPermissionService } from 'src/project-permission/project-permission.service';
import { JwtUserData } from 'src/login.guard';
import { ApiArg } from './entities/api-arg.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ApiArgsService {
    constructor(private readonly projectPermissionService: ProjectPermissionService) {}
    private logger = new Logger();
    @InjectRepository(ApiArg)
    private apiArgRepository: Repository<ApiArg>;
    async create(createApiArgDto: CreateApiArgDto, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(createApiArgDto.pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        try {
            const apiArg = new ApiArg();
            apiArg.aid = createApiArgDto.aid;
            apiArg.name = createApiArgDto.name;
            apiArg.argType = createApiArgDto.argType;
            apiArg.form = createApiArgDto.form;
            apiArg.dataType = createApiArgDto.dataType;
            apiArg.default = createApiArgDto.default ? createApiArgDto.default : '';
            apiArg.required = createApiArgDto.required ? createApiArgDto.required : true;
            apiArg.description = createApiArgDto.description ? createApiArgDto.description : '';

            await this.apiArgRepository.save(apiArg);
            return '创建成功';
        } catch (e) {
            this.logger.log(e);
            return '创建失败';
        }
    }

    findAll() {
        return `This action returns all apiArgs`;
    }

    findOne(id: number) {
        return `This action returns a #${id} apiArg`;
    }

    findByApiId(aid: number) {
        return this.apiArgRepository.find({ where: { aid: aid } });
    }

    async update(id: number, updateApiArgDto: UpdateApiArgDto, user: JwtUserData) {
        console.log(user);

        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(updateApiArgDto.pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }
        // 查看参数是否存在
        const apiArg: ApiArg = await this.apiArgRepository.findOneBy({ id: id });
        if (!apiArg) {
            throw new HttpException('参数不存在', HttpStatus.BAD_REQUEST);
        }
        try {
            const newApiArg = {
                ...apiArg,
                ...plainToClass(ApiArg, updateApiArgDto)
            };

            this.apiArgRepository.save(newApiArg);
            return '更新成功';
        } catch (e) {
            this.logger.log(e);
            return '更新失败';
        }
    }

    async remove(id: number, pid: number, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type !== 'admin') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        try {
            const apiArg: ApiArg = await this.apiArgRepository.findOneBy({ id: id });
            if (!apiArg) {
                throw new HttpException('参数不存在', HttpStatus.BAD_REQUEST);
            }
            this.apiArgRepository.remove(apiArg);
            return '删除成功';
        } catch (e) {
            this.logger.log(e);
            return '删除失败';
        }
    }
}
