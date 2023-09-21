import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ProjectModule } from './project/project.module';
import { Project } from './project/entities/project.entity';
import { ProjectPermission } from './project-permission/entities/project-permission.entity';
import { ProjectPermissionModule } from './project-permission/project-permission.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';
import { ApiModule } from './api/api.module';
import { Api } from './api/entities/api.entity';
import { ApiArgsModule } from './api-args/api-args.module';
import { ApiResponseModule } from './api-response/api-response.module';
import { ApiArg } from './api-args/entities/api-arg.entity';
import { ApiResponse } from './api-response/entities/api-response.entity';
import { TeamModule } from './team/team.module';
import { Team } from './team/entities/team.entity';
import { TeamPermissionModule } from './team-permission/team-permission.module';
import { TeamPermission } from './team-permission/entities/team-permission.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (ConfigService: ConfigService) => ({
                type: 'mysql',
                host: ConfigService.get('mysql_server_host'),
                port: ConfigService.get('mysql_server_port'),
                username: ConfigService.get('mysql_server_username'), //数据库用户名配置
                password: ConfigService.get('mysql_server_password'), //数据库密码配置
                database: ConfigService.get('mysql_server_database'), //数据库名字配置
                synchronize: true,
                logging: true,
                entities: [User, Project, ProjectPermission, Api, ApiArg, ApiResponse, Team, TeamPermission],
                poolSize: 10,
                connectorPackage: 'mysql2',
                extra: {
                    authPlugin: 'sha256_password'
                }
            }),
            inject: [ConfigService]
        }),
        JwtModule.register({
            global: true,
            secret: '114514', // 秘钥
            signOptions: {
                expiresIn: '7d' // token 过期时间
            }
        }),
        UserModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/.env' }),
        ProjectModule,
        ProjectPermissionModule,
        ApiModule,
        ApiArgsModule,
        ApiResponseModule,
        TeamModule,
        TeamPermissionModule
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: LoginGuard }]
})
export class AppModule {}
