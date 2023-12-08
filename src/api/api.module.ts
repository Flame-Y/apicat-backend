import { Module, forwardRef } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { ApiSchema } from './api.schema';
import { ProjectModule } from 'src/project/project.module';
import { ProjectPermissionModule } from 'src/project-permission/project-permission.module';
import { ApiArgsModule } from 'src/api-args/api-args.module';
import { ApiResponseModule } from 'src/api-response/api-response.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Api', schema: ApiSchema }]),
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
