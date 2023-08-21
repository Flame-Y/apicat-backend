import { Module, forwardRef } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Api } from './entities/api.entity';
import { ProjectModule } from 'src/project/project.module';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
    imports: [TypeOrmModule.forFeature([Api]), PermissionModule, forwardRef(() => ProjectModule)],
    controllers: [ApiController],
    providers: [ApiService],
    exports: [ApiService]
})
export class ApiModule {}
