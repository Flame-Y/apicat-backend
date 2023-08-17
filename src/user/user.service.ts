import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
import { LoginUserVo } from './vo/login-user.vo';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

@Injectable()
export class UserService {
    private logger = new Logger();

    @InjectRepository(User)
    private userRepository: Repository<User>;

    async login(user: LoginDto) {
        const foundUser: User = await this.userRepository.findOneBy({
            username: user.username
        });

        if (!foundUser) {
            throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
        }
        if (foundUser.password !== md5(user.password)) {
            throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
        }
        const vo = new LoginUserVo();

        vo.userInfo = {
            id: foundUser.id,
            username: foundUser.username,
            project: [] // todo：获取用户项目
        };

        return vo;
    }

    async register(user: RegisterDto) {
        const foundUser = await this.userRepository.findOneBy({
            username: user.username
        });

        if (foundUser) {
            throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
        }

        const newUser = new User();
        newUser.username = user.username;
        newUser.password = md5(user.password);

        try {
            await this.userRepository.save(newUser);
            return '注册成功';
        } catch (e) {
            this.logger.error(e, UserService);
            return '注册失败';
        }
    }

    async findUserDetailById(userId: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            }
        });

        return user;
    }

    async update(userId: number, updateUserDto: UpdateUserDto) {
        console.log(userId);

        console.log(updateUserDto);

        const foundUser = await this.userRepository.findOneBy({
            id: userId
        });

        if (updateUserDto.username) {
            foundUser.username = updateUserDto.username;
        }
        if (updateUserDto.avatar) {
            foundUser.avatar = updateUserDto.avatar;
        }

        try {
            await this.userRepository.save(foundUser);
            return '用户信息修改成功';
        } catch (e) {
            this.logger.error(e, UserService);
            return '用户信息修改成功';
        }
    }

    async updatePassword(userId: number, passwordDto: UpdateUserPasswordDto) {
        const foundUser = await this.userRepository.findOneBy({
            id: userId
        });

        foundUser.password = md5(passwordDto.password);

        try {
            await this.userRepository.save(foundUser);
            return '密码修改成功';
        } catch (e) {
            this.logger.error(e, UserService);
            return '密码修改失败';
        }
    }
}
