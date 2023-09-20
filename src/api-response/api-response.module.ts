import { Module } from '@nestjs/common';
import { ApiResponseService } from './api-response.service';
import { ApiResponseController } from './api-response.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiResponse } from './entities/api-response.entity';
import { ProjectPermissionModule } from 'src/project-permission/project-permission.module';

@Module({
    imports: [TypeOrmModule.forFeature([ApiResponse]), ProjectPermissionModule],
    controllers: [ApiResponseController],
    providers: [ApiResponseService],
    exports: [ApiResponseService]
})
export class ApiResponseModule {}
