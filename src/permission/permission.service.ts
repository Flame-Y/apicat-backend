import { Injectable, Logger } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PermissionService {
    private logger = new Logger();
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>;
    async findByUser(user: User): Promise<Permission[]> {
        try {
            const perms = await this.permissionRepository.findBy({
                uid: user.id
            });
            return perms;
        } catch (e) {
            this.logger.log(e);
        }
    }

    async create(permission: Permission) {
        try {
            await this.permissionRepository.save(permission);
        } catch (e) {
            this.logger.log(e);
        }
    }

    async update(permission: Permission) {
        try {
            await this.permissionRepository.update(permission.id, permission);
        } catch (e) {
            this.logger.log(e);
        }
    }

    async delete(permission: Permission) {
        try {
            await this.permissionRepository.delete(permission.id);
        } catch (e) {
            this.logger.log(e);
        }
    }

    async findByPid(pid: number): Promise<Permission[]> {
        try {
            const perms = await this.permissionRepository.findBy({
                pid
            });
            return perms;
        } catch (e) {
            this.logger.log(e);
        }
    }

    async findByPidAndUid(pid: number, uid: number): Promise<Permission> {
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
