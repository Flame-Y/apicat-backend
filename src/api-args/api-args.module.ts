import { Module } from '@nestjs/common';
import { ApiArgsService } from './api-args.service';
import { ApiArgsController } from './api-args.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiArg } from './entities/api-arg.entity';
import { ProjectPermissionModule } from 'src/project-permission/project-permission.module';

@Module({
    imports: [TypeOrmModule.forFeature([ApiArg]), ProjectPermissionModule],
    controllers: [ApiArgsController],
    providers: [ApiArgsService],
    exports: [ApiArgsService]
})
export class ApiArgsModule {}
