import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
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
import { ApiSchema } from './api/api.schema';
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
                entities: [User, Project, ProjectPermission, Team, TeamPermission],
                poolSize: 10,
                connectorPackage: 'mysql2',
                extra: {
                    authPlugin: 'sha256_password'
                }
            }),
            inject: [ConfigService]
        }),
        // TypeOrmModule.forRootAsync({
        //     useFactory: (ConfigService: ConfigService) => ({
        //         type: 'mongodb',
        //         host: ConfigService.get('mongodb_server_host'),
        //         port: ConfigService.get('mongodb_server_port'),
        //         database: ConfigService.get('mongodb_server_database'),

        //         entities: [ApiArg, ApiResponse, Api],
        //         synchronize: true
        //     }),
        //     inject: [ConfigService]
        // }),
        // MongooseModule.forRoot('mongodb://127.0.0.1:27017', { dbName: 'apicat' }),

        MongooseModule.forRootAsync({
            useFactory: (ConfigService: ConfigService) => ({
                uri: `mongodb://${ConfigService.get('mongodb_server_host')}:${ConfigService.get(
                    'mongodb_server_port'
                )}/${ConfigService.get('mongodb_server_database')}`
            }),
            inject: [ConfigService]
        }),
        // MongooseModule.forFeature([{ name: Api.name, schema: ApiSchema }]),
        JwtModule.register({
            global: true,
            secret: '114514', // 秘钥
            signOptions: {
                expiresIn: '7d' // token 过期时间
            }
        }),
        ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/.env' }),
        UserModule,
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
