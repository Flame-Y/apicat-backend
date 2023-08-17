import { Controller, Post, Body, Inject, ValidationPipe, HttpStatus, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'success',
        type: UserDetailVo
    })
    @Get('info')
    @RequireLogin()
    async info(@UserInfo('userId') userId: number) {
        const foundUser = await this.userService.findUserDetailById(userId);
        const vo = new UserDetailVo();
        vo.id = foundUser.id;
        vo.username = foundUser.username;
        vo.createTime = foundUser.createTime;
        return vo;
    }

    @ApiBearerAuth()
    @ApiBody({
        type: UpdateUserDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '验证码已失效/不正确'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '更新成功',
        type: String
    })
    @Post('update')
    @RequireLogin()
    async update(@UserInfo('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(userId, updateUserDto);
    }

    @ApiBearerAuth()
    @ApiBody({
        type: UpdateUserPasswordDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '验证码已失效/不正确'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '更新成功',
        type: String
    })
    @Post('update_password')
    @RequireLogin()
    async updatePassword(@UserInfo('userId') userId: number, @Body() passwordDto: UpdateUserPasswordDto) {
        return await this.userService.updatePassword(userId, passwordDto);
    }
}
