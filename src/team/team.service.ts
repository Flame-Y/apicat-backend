import { Injectable, Logger } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { plainToClass } from 'class-transformer';
import { JwtUserData } from 'src/login.guard';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TeamService {
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
            //todo: 在team-permission表中添加记录
            return '创建成功';
        } catch (e) {
            this.logger.error(e, TeamService);
            return '创建失败';
        }
    }

    findAll() {
        return `This action returns all team`;
    }

    async findOne(id: number) {
        const foundTeam: Team = await this.teamRepository.findOneBy({
            id: id
        });
        if (!foundTeam) {
            return '团队不存在';
        }
        return foundTeam;
    }

    // 获取用户所在的团队
    async findByUser(user: JwtUserData) {
        //todo: 在team-permission表中查找用户所在的团队
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
        foundTeam.updateTime = new Date();
        try {
            await this.teamRepository.save(foundTeam);
            //todo: 在team-permission表中更新记录
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

        //todo: 在team-permission表中删除记录

        //todo: 删除所有属于该团队的项目

        try {
            await this.teamRepository.remove(foundTeam);
        } catch (e) {
            this.logger.error(e, TeamService);
            throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
        }
        return `This action removes a #${id} team`;
    }
}
