import { Injectable, Logger } from '@nestjs/common';
import { TeamPermission } from './entities/team-permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TeamPermissionService {
    private logger = new Logger();
    @InjectRepository(TeamPermission)
    private teamPermissionRepository: Repository<TeamPermission>;

    // 根据用户id查找团队权限
    async findByUser(id: number): Promise<TeamPermission[]> {
        try {
            const perms = await this.teamPermissionRepository.findBy({
                uid: id
            });
            return perms;
        } catch (e) {
            this.logger.log(e);
        }
    }
    // 根据团队id查找团队权限
    async findByTid(tid: number): Promise<TeamPermission[]> {
        try {
            const perms = await this.teamPermissionRepository.findBy({
                tid
            });
            return perms;
        } catch (e) {
            this.logger.log(e);
        }
    }
    // 根据团队id与用户id查找团队权限
    async findByTidAndUid(tid: number, uid: number): Promise<TeamPermission> {
        try {
            const perms = await this.teamPermissionRepository.findOneBy({
                tid,
                uid
            });
            return perms;
        } catch (e) {
            this.logger.log(e);
        }
    }

    async create(permission: TeamPermission) {
        try {
            await this.teamPermissionRepository.save(permission);
        } catch (e) {
            this.logger.log(e);
        }
    }

    findAll() {
        return `This action returns all teamPermission`;
    }

    findOne(id: number) {
        return `This action returns a #${id} teamPermission`;
    }

    async update(permission: TeamPermission) {
        try {
            await this.teamPermissionRepository.update(permission.id, permission);
        } catch (e) {
            this.logger.log(e);
        }
    }

    async delete(permission: TeamPermission) {
        try {
            await this.teamPermissionRepository.delete(permission.id);
        } catch (e) {
            this.logger.log(e);
        }
    }
}
