import { Module, forwardRef } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectPermissionModule } from 'src/project-permission/project-permission.module';
import { UserModule } from 'src/user/user.module';
import { ApiModule } from 'src/api/api.module';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), ProjectPermissionModule, UserModule, forwardRef(() => ApiModule)],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService]
})
export class ProjectModule {}
