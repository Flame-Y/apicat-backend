import { Injectable, Logger } from '@nestjs/common';
import { ProjectPermission } from './entities/project-permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectPermissionService {
    private logger = new Logger();
    @InjectRepository(ProjectPermission)
    private permissionRepository: Repository<ProjectPermission>;
    async findByUser(id: number): Promise<ProjectPermission[]> {
        try {
            const perms = await this.permissionRepository.findBy({
                uid: id
            });
            return perms;
        } catch (e) {
            this.logger.log(e);
        }
    }

    async create(permission: ProjectPermission) {
        try {
            await this.permissionRepository.save(permission);
        } catch (e) {
            this.logger.log(e);
        }
    }

    async update(permission: ProjectPermission) {
        try {
            await this.permissionRepository.update(permission.id, permission);
        } catch (e) {
            this.logger.log(e);
        }
    }

    async delete(permission: ProjectPermission) {
        try {
            await this.permissionRepository.delete(permission.id);
        } catch (e) {
            this.logger.log(e);
        }
    }

    async findByPid(pid: number): Promise<ProjectPermission[]> {
        try {
            const perms = await this.permissionRepository.findBy({
                pid
            });
            return perms;
        } catch (e) {
            this.logger.log(e);
        }
    }

    async findByPidAndUid(pid: number, uid: number): Promise<ProjectPermission> {
        try {
            const perms = await this.permissionRepository.findOneBy({
                pid,
                uid
            });
            return perms;
        } catch (e) {
            this.logger.log(e);
        }
    }
}
