import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateApiResponseDto } from './dto/create-api-response.dto';
import { UpdateApiResponseDto } from './dto/update-api-response.dto';
import { JwtUserData } from 'src/login.guard';
import { ProjectPermissionService } from 'src/project-permission/project-permission.service';
import { ApiResponse } from './entities/api-response.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ApiResponseService {
    constructor(private readonly projectPermissionService: ProjectPermissionService) {}

    private logger = new Logger();
    @InjectRepository(ApiResponse)
    private apiArgRepository: Repository<ApiResponse>;
    async create(createApiResponseDto: CreateApiResponseDto, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(
            createApiResponseDto.pid,
            user.userId
        );
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        try {
            const apiResponse = new ApiResponse();
            apiResponse.aid = createApiResponseDto.aid;
            apiResponse.HttpStatus = createApiResponseDto.HttpStatus;
            apiResponse.code = createApiResponseDto.code;
            apiResponse.data = createApiResponseDto.data;
            apiResponse.mock = createApiResponseDto.mock ? createApiResponseDto.mock : '';
            this.apiArgRepository.save(apiResponse);
            return '创建成功';
        } catch (e) {
            this.logger.log(e);
            return '创建失败';
        }
    }

    findAll() {
        return `This action returns all apiResponse`;
    }

    findOne(id: number) {
        return `This action returns a #${id} apiResponse`;
    }

    findByApiId(aid: number) {
        return this.apiArgRepository.find({ where: { aid: aid } });
    }

    async update(id: number, updateApiResponseDto: UpdateApiResponseDto, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(
            updateApiResponseDto.pid,
            user.userId
        );
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        const apiResponse = await this.apiArgRepository.findOneBy({ id: id });
        if (!apiResponse) {
            throw new HttpException('返回值不存在', HttpStatus.BAD_REQUEST);
        }
        try {
            const newApiResponse = {
                ...apiResponse,
                ...plainToClass(ApiResponse, updateApiResponseDto)
            };
            this.apiArgRepository.save(newApiResponse);
            return '修改成功';
        } catch (e) {
            this.logger.error(e);
            return '修改失败';
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
            const apiResponse = await this.apiArgRepository.findOneBy({ id: id });
            if (!apiResponse) {
                throw new HttpException('返回值不存在', HttpStatus.BAD_REQUEST);
            }
            this.apiArgRepository.remove(apiResponse);
            return '删除成功';
        } catch (e) {
            this.logger.error(e);
            return '删除失败';
        }
    }
}
