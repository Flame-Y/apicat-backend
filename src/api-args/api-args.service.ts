import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateApiArgDto } from './dto/create-api-arg.dto';
import { UpdateApiArgDto } from './dto/update-api-arg.dto';
import { PermissionService } from 'src/permission/permission.service';
import { JwtUserData } from 'src/login.guard';
import { ApiArg } from './entities/api-arg.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ApiArgsService {
    constructor(private readonly permissionService: PermissionService) {}
    private logger = new Logger();
    @InjectRepository(ApiArg)
    private apiArgRepository: Repository<ApiArg>;
    async create(createApiArgDto: CreateApiArgDto, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.permissionService.findByPidAndUid(createApiArgDto.pid, user.userId);
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

    update(id: number, updateApiArgDto: UpdateApiArgDto) {
        return `This action updates a #${id} apiArg`;
    }

    remove(id: number) {
        return `This action removes a #${id} apiArg`;
    }
}
