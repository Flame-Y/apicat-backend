import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtUserData } from 'src/login.guard';
import { RequireLogin } from 'src/custom.decorator';

@ApiTags('接口管理模块')
@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService) {}

    @Post('create')
    @RequireLogin()
    @ApiBearerAuth()
    create(@Body() createApiDto: CreateApiDto, @Req() req: any) {
        return this.apiService.create(createApiDto, req.user as JwtUserData);
    }

    @Get()
    findAll() {
        return this.apiService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.apiService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.apiService.remove(+id);
    }
}
