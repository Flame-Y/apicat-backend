import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { plainToClass } from 'class-transformer';
import { PermissionService } from 'src/permission/permission.service';
import { JwtUserData } from 'src/login.guard';
import { Permission } from 'src/permission/entities/permission.entity';
import { UserService } from 'src/user/user.service';
import { ProjectListVo } from './vo/project-list.vo';
import { ProjectInfoVo } from './vo/project-info.vo';
import { ApiService } from 'src/api/api.service';

@Injectable()
export class ProjectService {
    constructor(
        private readonly permissionService: PermissionService,
        private readonly userService: UserService,
        private readonly apiService: ApiService
    ) {}

    private logger = new Logger();

    @InjectRepository(Project)
    private projectRepository: Repository<Project>;

    async create(projectDto: CreateProjectDto, user: JwtUserData) {
        const newProject = plainToClass(Project, projectDto);
        newProject.createTime = new Date();
        newProject.updateTime = new Date();
        newProject.creatorId = user.userId;
        newProject.creatorName = user.username;
        newProject.apiCount = 0;
        try {
            await this.projectRepository.save(newProject);
            //在permission表中添加记录
            const permission = new Permission();
            permission.pid = newProject.id;
            permission.uid = user.userId;
            permission.username = user.username;
            permission.type = 'admin';
            await this.permissionService.create(permission);
            return '创建成功';
        } catch (e) {
            this.logger.error(e, ProjectService);
            return '创建失败';
        }
    }

    async findAll(): Promise<Project[]> {
        try {
            // const permList = await this.permissionService.findByUser()
            const projectList: Project[] = await this.projectRepository.find();
            return projectList;
        } catch (e) {
            this.logger.error(e);
        }
    }

    async findByUser(user: JwtUserData) {
        try {
            const permList = await this.permissionService.findByUser(user.userId);
            const projectIdList = permList.map((e) => e.pid);
            const projectList: Project[] = await this.projectRepository.findBy({
                id: In(projectIdList)
            });
            // 将Project[]转换为ProjectListVo[]并加入权限信息与接口数量
            const projectListVo: ProjectListVo[] = projectList.map((e) => {
                // 去除creatorId、creatorName、description
                delete e.creatorId;
                delete e.creatorName;
                delete e.description;
                const vo = plainToClass(ProjectListVo, e);
                const perm = permList.find((p) => p.pid === e.id);
                vo.permission = perm.type;
                return vo;
            });
            return { records: projectListVo, total: projectListVo.length };
        } catch (e) {
            this.logger.error(e);
        }
    }

    async findOne(id: number) {
        try {
            const project: Project = await this.projectRepository.findOneBy({
                id: id
            });
            if (!project) throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
            return project;
        } catch (e) {
            this.logger.error(e);
        }
    }

    async incrementApiCount(id: number, number: number) {
        try {
            const project: Project = await this.projectRepository.findOneBy({
                id: id
            });
            if (!project) throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
            project.apiCount += number;
            await this.projectRepository.save(project);
        } catch (e) {
            this.logger.error(e);
        }
    }

    async decrementApiCount(id: number, number: number) {
        try {
            const project: Project = await this.projectRepository.findOneBy({
                id: id
            });
            if (!project) throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
            project.apiCount -= number;
            await this.projectRepository.save(project);
        } catch (e) {
            this.logger.error(e);
        }
    }

    async findProjectDetail(id: number, user: JwtUserData): Promise<ProjectInfoVo> {
        try {
            const project: Project = await this.projectRepository.findOneBy({
                id: id
            });
            if (!project) throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
            // 获取该项目权限表
            const permList = await this.permissionService.findByPid(id);
            // 删除权限表中的pid、createTime、updateTime
            permList.forEach(async (e) => {
                delete e.pid;
                delete e.createTime;
                delete e.updateTime;
            });
            // 获取该项目下的所有接口;
            const apiList = await this.apiService.findByProject(id, 1, Number.MAX_SAFE_INTEGER, user);

            const projectInfoVo = new ProjectInfoVo();
            projectInfoVo.projectInfo = plainToClass(Project, project);
            projectInfoVo.permissionList = permList;
            projectInfoVo.apiList = apiList.records;
            return projectInfoVo;
        } catch (e) {
            this.logger.error(e);
        }
    }

    async update(id: number, updateProjectDto: UpdateProjectDto): Promise<string> {
        try {
            const project: Project = await this.projectRepository.findOneBy({
                id: updateProjectDto.id
            });
            const newProject = {
                ...project,
                ...plainToClass(Project, updateProjectDto)
            };
            this.projectRepository.save(newProject);
            return '修改成功';
        } catch (e) {
            this.logger.error(e);
            return '修改失败';
        }
    }

    async remove(id: number, user: JwtUserData): Promise<string> {
        const project: Project = await this.projectRepository.findOneBy({
            id: id
        });
        if (!project) throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
        //查询用户是否有删除权限
        if (project.creatorId !== user.userId) throw new HttpException('没有删除权限', HttpStatus.UNAUTHORIZED);

        try {
            this.projectRepository.remove(project);
            // 删除权限表中的记录
            const perms = await this.permissionService.findByPid(id);
            perms.forEach(async (perm) => {
                await this.permissionService.delete(perm);
            });
            return '删除成功';
        } catch (e) {
            this.logger.error(e);
            return '删除失败';
        }
    }

    // 分配权限
    async assignPermission(pid: number, uid: number, type: string, user: JwtUserData): Promise<string> {
        const project: Project = await this.projectRepository.findOneBy({
            id: pid
        });
        //查询用户是否存在
        const foundUser = await this.userService.findUserDetailById(uid);
        if (!foundUser) throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
        if (!['admin', 'r', 'rw'].includes(type)) throw new HttpException('权限类型错误', HttpStatus.BAD_REQUEST);
        if (!project) throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
        if (project.creatorId !== user.userId) throw new HttpException('没有分配权限', HttpStatus.UNAUTHORIZED);

        if (project.creatorId == uid) throw new HttpException('不能分配给自己', HttpStatus.BAD_REQUEST);
        // 查询是否已经分配过权限
        const foundPermission = await this.permissionService.findByPidAndUid(pid, uid);
        // 如果已经分配过权限，则更新权限
        if (foundPermission) {
            foundPermission.type = type;
            await this.permissionService.update(foundPermission);
            throw new HttpException('更新权限成功', HttpStatus.OK);
        }
        try {
            const permission = new Permission();
            permission.pid = pid;
            permission.uid = uid;
            permission.username = foundUser.username;
            permission.type = type;
            await this.permissionService.create(permission);
            return '分配权限成功';
        } catch (e) {
            this.logger.error(e);
            return '分配权限失败';
        }
    }

    //  获取项目成员
    async getProjectPermission(pid: number, type: string, page: number, size: number, user: JwtUserData): Promise<any> {
        //查询用户是否有权限
        const foundPermission = await this.permissionService.findByPidAndUid(pid, user.userId);
        if (!foundPermission) throw new HttpException('用户没有权限', HttpStatus.BAD_REQUEST);
        const project: Project = await this.projectRepository.findOneBy({
            id: pid
        });
        if (!project) throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
        try {
            let permList = await this.permissionService.findByPid(pid);
            //根据type过滤
            if (type === 'all') {
                // 不做处理
            } else if (type === 'admin') {
                permList = permList.filter((e) => e.type === 'admin');
            } else if (type === 'r') {
                permList = permList.filter((e) => e.type === 'r');
            } else if (type === 'rw') {
                permList = permList.filter((e) => e.type === 'rw');
            } else {
                throw new HttpException('权限类型错误', HttpStatus.BAD_REQUEST);
            }
            const total = permList.length;
            // 根据page和size分页
            const start = (page - 1) * size;
            const end = page * size;
            permList.sort((a, b) => {
                return b.id - a.id;
            });
            permList.splice(end, permList.length - end);
            permList.splice(0, start);
            return { records: permList, total: total };
        } catch (e) {
            this.logger.error(e);
        }
    }
}
