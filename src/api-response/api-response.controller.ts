import { Controller, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { ApiResponseService } from './api-response.service';
import { CreateApiResponseDto } from './dto/create-api-response.dto';
import { UpdateApiResponseDto } from './dto/update-api-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtUserData } from 'src/login.guard';
import { RequireLogin } from 'src/custom.decorator';

@ApiTags('接口返回值管理模块')
@Controller('api-response')
export class ApiResponseController {
    constructor(private readonly apiResponseService: ApiResponseService) {}

    @RequireLogin()
    @ApiBearerAuth()
    @Post('create')
    create(@Body() createApiResponseDto: CreateApiResponseDto, @Req() req: any) {
        return this.apiResponseService.create(createApiResponseDto, req.user as JwtUserData);
    }

    @RequireLogin()
    @ApiBearerAuth()
    @Post('update/:id')
    update(@Param('id') id: string, @Body() updateApiResponseDto: UpdateApiResponseDto, @Req() req: any) {
        return this.apiResponseService.update(+id, updateApiResponseDto, req.user as JwtUserData);
    }

    @RequireLogin()
    @ApiBearerAuth()
    @Delete('delete/:pid/:id')
    remove(@Param('id') id: string, @Param('pid') pid: string, @Req() req: any) {
        return this.apiResponseService.remove(+id, +pid, req.user as JwtUserData);
    }
}
