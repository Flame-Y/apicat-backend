import { Module, forwardRef } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Api } from './entities/api.entity';
import { ProjectModule } from 'src/project/project.module';
import { ProjectPermissionModule } from 'src/project-permission/project-permission.module';
import { ApiArgsModule } from 'src/api-args/api-args.module';
import { ApiResponseModule } from 'src/api-response/api-response.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Api]),
        ProjectPermissionModule,
        forwardRef(() => ProjectModule),
        ApiArgsModule,
        ApiResponseModule
    ],
    controllers: [ApiController],
    providers: [ApiService],
    exports: [ApiService]
})
export class ApiModule {}
