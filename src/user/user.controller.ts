import { Controller, Post, Body, Inject, Header, ValidationPipe, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Inject(JwtService)
    private jwtService: JwtService;

    @Inject(ConfigService)
    private configService: ConfigService;

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
    async login(@Body(ValidationPipe) user: LoginDto) {
        const vo = await this.userService.login(user);
        vo.accessToken = this.jwtService.sign(
            {
                userId: vo.userInfo.id,
                username: vo.userInfo.username,
                project: vo.userInfo.project
            },
            {
                expiresIn: this.configService.get('jwt_access_token_expires_time') || '3d'
            }
        );
        return vo;
    }
}
