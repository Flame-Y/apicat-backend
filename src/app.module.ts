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
import { Permission } from './project/entities/permission.entity';
import { Role } from './project/entities/role.entity';

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
                entities: [User, Project, Permission, Role],
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
        ProjectModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
