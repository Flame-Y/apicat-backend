import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProjectService {
    private logger = new Logger();

    @InjectRepository(Project)
    private projectRepository: Repository<Project>;

    async create(projectDto: CreateProjectDto, user: User) {
        //需要查询user的project有没有重名,和创建权限,此处先不管
        this.logger.log(user);
        const newProject = plainToClass(Project, projectDto);
        newProject.createTime = new Date();
        newProject.updateTime = new Date();
        try {
            await this.projectRepository.save(newProject);
            return '创建成功';
        } catch (e) {
            this.logger.error(e, ProjectService);
            return '创建失败';
        }
    }

    findAll() {
        return `This action returns all project`;
    }

    findOne(id: number) {
        return `This action returns a #${id} project`;
    }

    update(id: number, updateProjectDto: UpdateProjectDto) {
        return `This action updates a #${id} project`;
    }

    remove(id: number) {
        return `This action removes a #${id} project`;
    }
}
