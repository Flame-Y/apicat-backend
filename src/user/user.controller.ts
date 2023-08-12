import { Controller, Post, Body, Inject, Res, Header, ValidationPipe, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Inject(JwtService)
    private jwtService: JwtService;

    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '用户已存在',
        type: String
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '注册成功/失败',
        type: String
    })
    @Post('register')
    async register(@Body(ValidationPipe) user: RegisterDto) {
        console.log(user);
        return await this.userService.register(user);
    }

    @ApiBody({
        type: LoginDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '用户不存在/密码错误',
        type: String
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '用户信息和 token',
        type: Object
    })
    @Post('login')
    @Header('token', 'token')
    async login(@Body(ValidationPipe) user: LoginDto, @Res({ passthrough: true }) res: Response) {
        const foundUser = await this.userService.login(user);

        if (foundUser) {
            const token = await this.jwtService.signAsync({
                user: {
                    id: foundUser.id,
                    username: foundUser.username
                }
            });
            res.setHeader('token', token);
            return 'login success';
        } else {
            return 'login fail';
        }
    }
}
