import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root', //数据库用户名配置
            password: '114514', //数据库密码配置
            database: 'apicat', //数据库名字配置
            synchronize: true,
            logging: true,
            entities: [User],
            poolSize: 10,
            connectorPackage: 'mysql2',
            extra: {
                authPlugin: 'sha256_password'
            }
        }),
        JwtModule.register({
            global: true,
            secret: '114514', // 秘钥
            signOptions: {
                expiresIn: '7d' // token 过期时间
            }
        }),
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
