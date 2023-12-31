import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './entities/team.entity';
import { plainToClass } from 'class-transformer';
import { JwtUserData } from 'src/login.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TeamPermission } from 'src/team-permission/entities/team-permission.entity';
import { TeamPermissionService } from 'src/team-permission/team-permission.service';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TeamService {
    constructor(
        private readonly teamPermissionService: TeamPermissionService,
        @Inject(forwardRef(() => ProjectService))
        private readonly projectService: ProjectService,
        private readonly userService: UserService
    ) {}
    private logger = new Logger();

    @InjectRepository(Team)
    private teamRepository: Repository<Team>;

    // 创建团队
    async create(teamDto: CreateTeamDto, user: JwtUserData) {
        const team = plainToClass(Team, teamDto);
        team.createTime = new Date();
        team.updateTime = new Date();
        team.ownerId = user.userId;
        team.ownerName = user.username;
        team.projectCount = 0;
        if (!team.icon) {
            //todo: 设置默认图标
        }
        try {
            await this.teamRepository.save(team);
            const teamPermission = new TeamPermission();
            teamPermission.uid = user.userId;
            teamPermission.tid = team.id;
            teamPermission.type = 'owner';
            teamPermission.username = user.username;
            await this.teamPermissionService.create(teamPermission);
            return '创建成功';
        } catch (e) {
            this.logger.error(e, TeamService);
            return '创建失败';
        }
    }

    async findAll() {
        try {
            const teamList = await this.teamRepository.find();
            return teamList;
        } catch (e) {
            this.logger.error(e, TeamService);
        }
    }

    async findOne(id: number) {
        try {
            const foundTeam: Team = await this.teamRepository.findOneBy({
                id: id
            });
            if (!foundTeam) {
                return '团队不存在';
            }
            return foundTeam;
        } catch (e) {
            this.logger.error(e, TeamService);
            return '查询失败';
        }
    }

    // 获取用户所在的团队
    async findByUser(user: JwtUserData) {
        const permList = await this.teamPermissionService.findByUser(user.userId);
        const teamIdList = permList.map((perm) => perm.tid);
        const teams: Team[] = await this.teamRepository.findBy({
            id: In(teamIdList)
        });
        return { teams: teams, total: teams.length };
    }

    //根据团队id获取团队详情
    async findByTid(id: number) {
        try {
            const foundTeam: Team = await this.teamRepository.findOneBy({
                id: id
            });
            if (!foundTeam) {
                return '团队不存在';
            }
            return foundTeam;
        } catch (e) {
            this.logger.error(e, TeamService);
            return '查询失败';
        }
    }

    // 更新团队信息
    async updateInfo(id: number, updateTeamDto: UpdateTeamDto) {
        try {
            const foundTeam = await this.teamRepository.findOneBy({
                id: id
            });
            if (!foundTeam) {
                return '团队不存在';
            }
            const newTeam = {
                ...foundTeam,
                ...updateTeamDto
            };
            await this.teamRepository.save(newTeam);
            return '更新成功';
        } catch (e) {
            this.logger.error(e, TeamService);
            return '更新失败';
        }
    }

    // 转移团队所有权
    async transferTeamOwner(teamId: number, newOwnerId: number, user: JwtUserData) {
        const foundTeam = await this.teamRepository.findOneBy({
            id: teamId
        });
        if (!foundTeam) {
            return '团队不存在';
        }
        // 验证用户是否有转移权限
        if (foundTeam.ownerId !== user.userId) {
            return '没有转移权限';
        }
        foundTeam.ownerId = newOwnerId;
        foundTeam.ownerName = (await this.userService.findUserDetailById(newOwnerId)).username;
        foundTeam.updateTime = new Date();
        try {
            await this.teamRepository.save(foundTeam);
            const newOwner = await this.userService.findUserDetailById(newOwnerId);
            const teamPermission = await this.teamPermissionService.findByTidAndUid(teamId, user.userId);
            teamPermission.uid = newOwnerId;
            teamPermission.username = newOwner.username;
            teamPermission.updateTime = new Date();
            await this.teamPermissionService.update(teamPermission);
            return '转移成功';
        } catch (e) {
            this.logger.error(e, TeamService);
            return '转移失败';
        }
    }

    //删除团队
    async remove(id: number, user: JwtUserData) {
        const foundTeam = await this.teamRepository.findOneBy({
            id: id
        });
        if (!foundTeam) {
            throw new HttpException('团队不存在', HttpStatus.BAD_REQUEST);
        }

        // 验证用户是否有删除权限
        if (foundTeam.ownerId !== user.userId) {
            throw new HttpException('没有删除权限', HttpStatus.UNAUTHORIZED);
        }

        try {
            await this.teamRepository.remove(foundTeam);
            //在team-permission表中删除所有属于该团队的权限
            const teamPermissions = await this.teamPermissionService.findByTid(id);
            for (const teamPermission of teamPermissions) {
                await this.teamPermissionService.delete(teamPermission);
            }
            //删除所有属于该团队的项目
            const projects = await this.projectService.findByTid(id);
            for (const project of projects) {
                await this.projectService.remove(project.id, user);
            }
            return '删除成功';
        } catch (e) {
            this.logger.error(e, TeamService);
            throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
        }
    }

    //分配团队权限
    async assignTeamPermission(tid: number, uid: number, type: string, user: JwtUserData) {
        const team: Team = await this.teamRepository.findOneBy({
            id: tid
        });
        if (!team) {
            return '团队不存在';
        }
        // 查询用户是否存在
        const foundUser = await this.userService.findUserDetailById(uid);
        if (!foundUser) {
            return '用户不存在';
        }
        //验证类型是否正确
        if (!['owner', 'admin', 'member'].includes(type)) {
            return '权限类型错误';
        }
        // 验证用户是否有分配权限
        const userPermission = await this.teamPermissionService.findByTidAndUid(tid, user.userId);
        if (userPermission.type !== 'owner') {
            return '没有分配权限';
        }
        // 验证是否分配给自己
        if (uid === user.userId) {
            return '不能分配给自己';
        }
        // 验证用户是否已经有权限
        const foundPermission = await this.teamPermissionService.findByTidAndUid(tid, uid);
        if (foundPermission) {
            // 如果已经有权限,则更新权限
            foundPermission.type = type;
            foundPermission.updateTime = new Date();
            try {
                await this.teamPermissionService.update(foundPermission);
                return '更新权限成功';
            } catch (e) {
                this.logger.error(e, TeamService);
                return '更新权限失败';
            }
        } else {
            // 如果没有权限,则创建权限
            const teamPermission = new TeamPermission();
            teamPermission.tid = tid;
            teamPermission.uid = uid;
            teamPermission.type = type;
            teamPermission.username = foundUser.username;
            try {
                await this.teamPermissionService.create(teamPermission);
                return '分配权限成功';
            } catch (e) {
                this.logger.error(e, TeamService);
                return '分配权限失败';
            }
        }
    }

    //将用户从团队中移除
    async removeUserFromTeam(tid: number, uid: number, user: JwtUserData) {
        const team: Team = await this.teamRepository.findOneBy({
            id: tid
        });
        if (!team) {
            return '团队不存在';
        }
        // 验证用户是否有移除权限
        const userPermission = await this.teamPermissionService.findByTidAndUid(tid, user.userId);
        if (userPermission.type !== 'owner' && userPermission.type !== 'admin') {
            return '没有移除权限';
        }
        // 验证用户是否存在
        const foundUser = await this.userService.findUserDetailById(uid);
        if (!foundUser) {
            return '用户不存在';
        }
        // 验证是否移除自己
        if (uid === user.userId) {
            return '不能移除自己';
        }
        // 验证用户是否有权限
        const foundPermission = await this.teamPermissionService.findByTidAndUid(tid, uid);
        if (!foundPermission) {
            return '用户没有权限';
        }
        try {
            await this.teamPermissionService.delete(foundPermission);
            return '移除成功';
        } catch (e) {
            this.logger.error(e, TeamService);
            return '移除失败';
        }
    }

    //获取团队权限表
    async findTeamPermission(tid: number, user: JwtUserData) {
        const team: Team = await this.teamRepository.findOneBy({
            id: tid
        });
        if (!team) {
            return '团队不存在';
        }
        // 验证用户是否有查看权限
        const foundPermission = await this.teamPermissionService.findByTidAndUid(tid, user.userId);
        if (!foundPermission) {
            return '没有查看权限';
        }
        if (foundPermission.type !== 'owner' && foundPermission.type !== 'admin') {
            return '权限不足';
        }
        const teamPermissions = await this.teamPermissionService.findByTid(tid);
        return teamPermissions;
    }
}
