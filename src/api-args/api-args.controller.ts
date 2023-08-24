import { Controller, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { ApiArgsService } from './api-args.service';
import { CreateApiArgDto } from './dto/create-api-arg.dto';
import { UpdateApiArgDto } from './dto/update-api-arg.dto';
import { JwtUserData } from 'src/login.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from 'src/custom.decorator';

@ApiTags('接口参数管理模块')
@Controller('api-args')
export class ApiArgsController {
    constructor(private readonly apiArgsService: ApiArgsService) {}

    @RequireLogin()
    @ApiBearerAuth()
    @Post('create')
    create(@Body() createApiArgDto: CreateApiArgDto, @Req() req: any) {
        return this.apiArgsService.create(createApiArgDto, req.user as JwtUserData);
    }

    @RequireLogin()
    @ApiBearerAuth()
    @Post('update/:id')
    update(@Param('id') id: string, @Body() updateApiArgDto: UpdateApiArgDto, @Req() req: any) {
        return this.apiArgsService.update(+id, updateApiArgDto, req.user as JwtUserData);
    }

    @RequireLogin()
    @ApiBearerAuth()
    @Delete('delete/:pid/:id')
    remove(@Param('id') id: string, @Param('pid') pid: string, @Req() req: any) {
        return this.apiArgsService.remove(+id, +pid, req.user as JwtUserData);
    }
}
