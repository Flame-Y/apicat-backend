import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { plainToClass } from 'class-transformer';
import { PermissionService } from 'src/permission/permission.service';
import { JwtUserData } from 'src/login.guard';

@Injectable()
export class ProjectService {
    constructor(private readonly permissionService: PermissionService) {}

    private logger = new Logger();

    @InjectRepository(Project)
    private projectRepository: Repository<Project>;

    async create(projectDto: CreateProjectDto, user: JwtUserData) {
        const foundProject = await this.projectRepository.findOneBy({
            name: projectDto.name
        });
        if (foundProject) throw new HttpException('项目已存在', HttpStatus.BAD_REQUEST);
        this.logger.log(user);
        const newProject = plainToClass(Project, projectDto);
        newProject.createTime = new Date();
        newProject.updateTime = new Date();
        newProject.creatorId = user.userId;
        newProject.creatorName = user.username;
        try {
            await this.projectRepository.save(newProject);
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

    async findByUser(user: JwtUserData): Promise<Project[]> {
        try {
            // const permList = await this.permissionService.findByUser(user);
            // const projectIdList = permList.map((e) => e.pid);
            const projectList: Project[] = await this.projectRepository.find({
                where: { creatorId: user.userId }
            });
            return projectList;
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
        try {
            const project: Project = await this.projectRepository.findOneBy({
                id: id
            });
            if (!project) throw new HttpException('项目不存在', HttpStatus.BAD_REQUEST);
            //查询用户是否有删除权限
            if (project.creatorId !== user.userId) throw new HttpException('没有删除权限', HttpStatus.UNAUTHORIZED);
            this.projectRepository.remove(project);
            return '删除成功';
        } catch (e) {
            this.logger.error(e);
            return '删除失败';
        }
    }
}
