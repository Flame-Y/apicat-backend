// import { HttpException, HttpStatus, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
// import { CreateApiDto } from './dto/create-api.dto';
// import { UpdateApiDto } from './dto/update-api.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Api } from './entities/api.entity';
// import { ProjectService } from 'src/project/project.service';
// import { ProjectPermissionService } from 'src/project-permission/project-permission.service';
// import { ApiArgsService } from 'src/api-args/api-args.service';
// import { JwtUserData } from 'src/login.guard';
// import * as fs from 'fs';
// import { ApiInfoVo } from './vo/api-info.vo';
// import { ApiResponseService } from 'src/api-response/api-response.service';
// import { CreateApiArgDto } from 'src/api-args/dto/create-api-arg.dto';
// @Injectable()
// export class ApiService {
//     constructor(
//         @Inject(forwardRef(() => ProjectService))
//         private readonly projectService: ProjectService,
//         private readonly projectPermissionService: ProjectPermissionService,
//         private readonly apiArgService: ApiArgsService,
//         private readonly apiResponseService: ApiResponseService
//     ) {}
//     private logger = new Logger();
//     @InjectRepository(Api)
//     private apiRepository: Repository<Api>;
//     async create(createApiDto: CreateApiDto, user: JwtUserData) {
//         // 查看项目是否存在
//         const foundProject = await this.projectService.findOne(createApiDto.pid);
//         if (!foundProject) {
//             throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
//         }

//         // 查看用户是否有权限
//         const foundPermission = await this.projectPermissionService.findByPidAndUid(createApiDto.pid, user.userId);
//         if (!foundPermission) {
//             throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
//         } else if (foundPermission.type === 'r') {
//             throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
//         }

//         try {
//             const api = new Api();
//             api.name = createApiDto.name;
//             api.description = createApiDto.description;
//             api.type = createApiDto.type;
//             api.url = createApiDto.url;

//             api.pid = createApiDto.pid;
//             await this.apiRepository.save(api);
//             //获取api的id
//             const foundApi = await this.apiRepository.findOneBy({ pid: createApiDto.pid, url: createApiDto.url });
//             //  若url中含有：格式的动态参数，在api表中添加参数
//             const reg = /\/:[a-zA-Z0-9]+/g;
//             const matchResult = api.url.match(reg);
//             if (matchResult) {
//                 matchResult.forEach(async (item) => {
//                     const apiArg = new CreateApiArgDto();
//                     apiArg.aid = foundApi.id;
//                     apiArg.pid = createApiDto.pid;
//                     apiArg.name = item.replace('/:', '');
//                     apiArg.argType = 'path';
//                     apiArg.form = 'multipart/form-data';
//                     apiArg.dataType = 'string';
//                     apiArg.required = true;
//                     apiArg.description = '自动生成的动态参数';
//                     apiArg.default = '';
//                     await this.apiArgService.create(apiArg, user);
//                 });
//             }
//             //更新项目的api数量
//             await this.projectService.incrementApiCount(createApiDto.pid, 1);
//             return '创建成功';
//         } catch (e) {
//             this.logger.log(e);
//             return '创建失败';
//         }
//     }

//     findAll() {
//         return `This action returns all api`;
//     }

//     findOne(id: number) {
//         return `This action returns a #${id} api`;
//     }

//     findApiCountByProject(pid: number) {
//         return this.apiRepository.countBy({ pid: pid });
//     }

//     async findByProject(pid: number, page: number, size: number, user: JwtUserData) {
//         // 查看用户是否有权限
//         const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
//         if (!foundPermission) {
//             throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
//         }
//         const apiList = await this.apiRepository.findBy({ pid: pid });
//         const total = apiList.length;
//         // 按页数返回
//         const start = (page - 1) * size;
//         const end = page * size;
//         apiList.sort((a, b) => {
//             return b.id - a.id;
//         });
//         apiList.splice(end, apiList.length - end);
//         apiList.splice(0, start);
//         return { records: apiList, total: total };
//     }

//     async findApiDetail(id: number, pid: number, user: JwtUserData): Promise<ApiInfoVo> {
//         const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
//         if (!foundPermission) {
//             throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
//         }
//         const foundApi = await this.apiRepository.findOneBy({ id: id });
//         const foundApiArgs = await this.apiArgService.findByApiId(id);
//         const foundResponse = await this.apiResponseService.findByApiId(id);
//         const apiInfoVo = new ApiInfoVo();
//         apiInfoVo.apiInfo = foundApi;
//         apiInfoVo.apiArgs = foundApiArgs;
//         apiInfoVo.apiResponse = foundResponse;
//         return apiInfoVo;
//     }
//     async update(id: number, pid: number, updateApiDto: UpdateApiDto, user: JwtUserData) {
//         // 查看用户是否有权限
//         const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
//         if (!foundPermission) {
//             throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
//         } else if (foundPermission.type === 'r') {
//             throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
//         }
//         const foundApi = await this.apiRepository.findOneBy({ id: id });
//         if (updateApiDto.name) foundApi.name = updateApiDto.name;
//         if (updateApiDto.description) foundApi.description = updateApiDto.description;
//         if (updateApiDto.type) foundApi.type = updateApiDto.type;
//         if (updateApiDto.url) foundApi.url = updateApiDto.url;
//         try {
//             await this.apiRepository.save(foundApi);
//             return '更新成功';
//         } catch (e) {
//             this.logger.log(e);
//             return '更新失败';
//         }
//     }

//     async remove(id: number, pid: number, user: JwtUserData) {
//         // 查看用户是否有权限
//         const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
//         if (!foundPermission) {
//             throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
//         } else if (foundPermission.type === 'r') {
//             throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
//         }

//         try {
//             await this.apiRepository.delete(id);
//             // 减去项目的api数量
//             await this.projectService.decrementApiCount(pid, 1);
//             return '删除成功';
//         } catch (e) {
//             this.logger.log(e);
//             return '删除失败';
//         }
//     }
//     // 导入swagger文档接口
//     async importApiBySwaggerFile(pid: number, user: JwtUserData, swaggerFile: any) {
//         // 查看用户是否有权限
//         const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
//         if (!foundPermission) {
//             throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
//         } else if (foundPermission.type === 'r') {
//             throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
//         }
//         try {
//             // 读取swagger文件
//             const filePath = swaggerFile[0].path;
//             const fileContent = fs.readFileSync(filePath, 'utf-8');
//             const swaggerJson = JSON.parse(fileContent);

//             // 读取swagger文件中的接口信息
//             const apiList = [];
//             for (const url in swaggerJson.paths) {
//                 const api = new Api();
//                 api.name = swaggerJson.paths[url].summary ? swaggerJson.paths[url].summary : url;
//                 api.description = swaggerJson.paths[url].description ? swaggerJson.paths[url].description : '';
//                 // todo: 解析swagger文件中的response
//                 api.type = Object.keys(swaggerJson.paths[url])[0];
//                 api.url = url;
//                 api.pid = pid;
//                 apiList.push(api);
//                 // 统计项目的api数量
//             }
//             //todo: 同名接口处理
//             //todo: 与schema关联

//             // 将接口信息保存到数据库
//             await this.apiRepository.save(apiList);
//             await this.projectService.incrementApiCount(pid, apiList.length);
//             // 删除swagger文件
//             fs.unlinkSync(filePath);
//             return '导入成功';
//         } catch (e) {
//             this.logger.log(e);
//             return '导入失败';
//         }
//     }
// }

import { HttpException, HttpStatus, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Api } from './api.schema';
import { ProjectService } from 'src/project/project.service';
import { ProjectPermissionService } from 'src/project-permission/project-permission.service';
import { JwtUserData } from 'src/login.guard';
import * as fs from 'fs';
import { CreateApiFileDto } from './dto/create-api-file.dto';

interface ApiArg {
    type: string;
    data: object[];
}

interface ApiResponse {
    code: number;
    description: string;
    data: object[];
}

@Injectable()
export class ApiService {
    constructor(
        @Inject(forwardRef(() => ProjectService))
        private readonly projectService: ProjectService,
        private readonly projectPermissionService: ProjectPermissionService,
        @InjectModel('Api') private readonly apiModel: Model<Api>
    ) {}

    private logger = new Logger();

    async create(createApiDto: CreateApiDto, user: JwtUserData) {
        // 查看项目是否存在
        const foundProject = await this.projectService.findOne(createApiDto.pid);
        if (!foundProject) {
            throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
        }

        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(createApiDto.pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        //  若url中含有：格式或{}的动态参数，在api表中添加参数
        // const reg = /\/:[a-zA-Z0-9]+/g;
        const reg = /\/:[a-zA-Z0-9]+|\/\{[a-zA-Z0-9]+\}/g;
        const matchResult = createApiDto.url.match(reg);
        console.log(matchResult);

        const newArg: ApiArg = { type: '', data: [] };
        if (matchResult) {
            newArg.type = 'path';
            matchResult.forEach(async (item) => {
                newArg.data.push({
                    //判断格式是:xxx还是{xxx}
                    name: item.replace(/\/:|\/{|\}/g, ''),
                    form: 'multipart/form-data',
                    dataType: 'string',
                    required: true,
                    description: '自动生成的动态参数',
                    default: ''
                });
            });
        }

        try {
            const api = new this.apiModel({
                name: createApiDto.name,
                description: createApiDto.description,
                method: createApiDto.method,
                url: createApiDto.url,
                pid: createApiDto.pid,
                orderNum: createApiDto.orderNum,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: user.userId,
                args: newArg,
                responses: [],
                isFile: false,
                parentId: createApiDto.parentId ? createApiDto.parentId : '0'
            });
            await api.save();

            //更新项目的api数量
            await this.projectService.incrementApiCount(createApiDto.pid, 1);
            return '创建成功';
        } catch (e) {
            this.logger.log(e);
            return '创建失败';
        }
    }

    async createFlie(createApiFileDto: CreateApiFileDto, user: JwtUserData) {
        // 查看项目是否存在
        const foundProject = await this.projectService.findOne(createApiFileDto.pid);
        if (!foundProject) {
            throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
        }

        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(createApiFileDto.pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        try {
            const api = new this.apiModel({
                name: '新建文件夹',
                description: '',
                pid: createApiFileDto.pid,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: user.userId,
                updatedBy: user.userId,
                isFile: true,
                orderNum: 0,
                parentId: createApiFileDto.parentId ? createApiFileDto.parentId : '0'
            });
            await api.save();
            return '创建成功';
        } catch (e) {
            this.logger.log(e);
            return '创建失败';
        }
    }

    async findAll() {
        return this.apiModel.find().exec();
    }

    async findOne(id: string) {
        return this.apiModel.findById(id).exec();
    }

    async findApiCountByProject(pid: number) {
        return this.apiModel.countDocuments({ pid: pid }).exec();
    }

    async findByProject(pid: number, page: number, size: number, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        }

        const apiList = await this.apiModel.find({ pid: pid }).exec();
        const total = apiList.length;

        // 按页数返回
        const start = (page - 1) * size;
        const end = page * size;
        apiList.sort((a, b) => {
            return b.id - a.id;
        });
        apiList.splice(end, apiList.length - end);
        apiList.splice(0, start);
        return { records: apiList, total: total };
    }

    async findApiDetail(id: string, pid: number, user: JwtUserData) {
        const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        }

        return this.findOne(id);
    }

    async update(id: string, pid: number, updateApiDto: UpdateApiDto, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        const foundApi = await this.apiModel.findById(id).exec();
        if (updateApiDto.name) foundApi.name = updateApiDto.name;
        if (updateApiDto.description) foundApi.description = updateApiDto.description;
        if (updateApiDto.method) foundApi.method = updateApiDto.method;
        if (updateApiDto.url) foundApi.url = updateApiDto.url;
        if (updateApiDto.parentId) foundApi.parentId = updateApiDto.parentId;
        if (updateApiDto.orderNum) foundApi.orderNum = updateApiDto.orderNum;
        foundApi.updatedAt = new Date();
        foundApi.updatedBy = user.userId;
        try {
            await foundApi.save();
            return '更新成功';
        } catch (e) {
            this.logger.log(e);
            return '更新失败';
        }
    }

    async remove(id: string, pid: number, user: JwtUserData) {
        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) {
            throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        } else if (foundPermission.type === 'r') {
            throw new HttpException('用户权限不足', HttpStatus.BAD_REQUEST);
        }

        try {
            await this.apiModel.findByIdAndDelete(id).exec();

            // 减去项目的api数量
            await this.projectService.decrementApiCount(pid, 1);
            return '删除成功';
        } catch (e) {
            this.logger.log(e);
            return '删除失败';
        }
    }

    // 导入swagger文档接口
    async importApiBySwaggerFile(pid: number, user: JwtUserData, swaggerFile: any) {
        // 查看用户是否有权限
        const foundPermission = await this.projectPermissionService.findByPidAndUid(pid, user.userId);
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
                const api = new this.apiModel({
                    name: swaggerJson.paths[url].summary ? swaggerJson.paths[url].summary : url,
                    description: swaggerJson.paths[url].description ? swaggerJson.paths[url].description : '',
                    type: Object.keys(swaggerJson.paths[url])[0],
                    url: url,
                    pid: pid
                });
                apiList.push(api);
            }

            // 将接口信息保存到数据库
            await this.apiModel.insertMany(apiList);
            await this.projectService.incrementApiCount(pid, apiList.length);

            // 删除swagger文件
            fs.unlinkSync(filePath);
            return '导入成功';
        } catch (e) {
            this.logger.log(e);
            return '导入失败';
        }
    }
}
