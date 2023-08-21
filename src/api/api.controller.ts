import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtUserData } from 'src/login.guard';
import { RequireLogin } from 'src/custom.decorator';
import { UpdateApiDto } from './dto/update-api.dto';

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

    @Get('update/:pid/:id')
    @RequireLogin()
    @ApiBearerAuth()
    findOne(@Param('pid') pid: string, @Param('id') @Body() updateApiDto: UpdateApiDto, id: string, @Req() req: any) {
        return this.apiService.update(+id, updateApiDto, +pid, req.user as JwtUserData);
    }

    @Delete('deleteApi/:pid/:id')
    @RequireLogin()
    @ApiBearerAuth()
    remove(@Param('pid') pid: string, @Param('id') id: string, @Req() req: any) {
        return this.apiService.remove(+id, +pid, req.user as JwtUserData);
    }
}
