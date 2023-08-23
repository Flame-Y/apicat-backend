import { Module } from '@nestjs/common';
import { ApiResponseService } from './api-response.service';
import { ApiResponseController } from './api-response.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiResponse } from './entities/api-response.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ApiResponse])],
    controllers: [ApiResponseController],
    providers: [ApiResponseService],
    exports: [ApiResponseService]
})
export class ApiResponseModule {}
