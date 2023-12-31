import { Controller, Get, Post, Body, Param, Delete, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtUserData } from 'src/login.guard';
import { RequireLogin } from 'src/custom.decorator';
import { UpdateApiDto } from './dto/update-api.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadedFileDto } from './dto/upload-file.dto';
import { CreateApiFileDto } from './dto/create-api-file.dto';

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

    @Post('createFile')
    @RequireLogin()
    @ApiBearerAuth()
    createFile(@Body() createApiFileDto: CreateApiFileDto, @Req() req: any) {
        return this.apiService.createFlie(createApiFileDto, req.user as JwtUserData);
    }

    @Get('getProjectApiList/:pid/:page/:size')
    @RequireLogin()
    @ApiBearerAuth()
    findAll(@Param('pid') pid: string, @Param('page') page: string, @Param('size') size: string, @Req() req: any) {
        return this.apiService.findByProject(+pid, +page, +size, req.user as JwtUserData);
    }

    @Post('update/:pid/:id')
    @RequireLogin()
    @ApiBearerAuth()
    findOne(@Param('pid') pid: string, @Param('id') id: string, @Body() updateApiDto: UpdateApiDto, @Req() req: any) {
        return this.apiService.update(id, +pid, updateApiDto, req.user as JwtUserData);
    }

    @Delete('deleteApi/:pid/:id')
    @RequireLogin()
    @ApiBearerAuth()
    remove(@Param('pid') pid: string, @Param('id') id: string, @Req() req: any) {
        return this.apiService.remove(id, +pid, req.user as JwtUserData);
    }

    @Get('getApiDetail/:pid/:id')
    @RequireLogin()
    @ApiBearerAuth()
    getApiDetail(@Param('pid') pid: string, @Param('id') id: string, @Req() req: any) {
        return this.apiService.findApiDetail(id, +pid, req.user as JwtUserData);
    }

    @Post('importApiBySwaggerFile/:pid')
    @RequireLogin()
    @ApiBearerAuth()
    @UseInterceptors(
        AnyFilesInterceptor({
            dest: './upload',
            fileFilter: (req, file, cb) => {
                // if (file.mimetype !== 'application/json') {
                //     return cb(new Error('仅支持json格式文件'), false);
                // }
                file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
                cb(null, true);
            }
        })
    )
    @ApiConsumes('multipart/form-data')
    importApiBySwaggerFile(
        @Param('pid') pid: string,
        @Body() uploadFileDto: UploadedFileDto,
        @Req() req: any,
        @UploadedFiles() file: Express.Multer.File
    ) {
        return this.apiService.importApiBySwaggerFile(+pid, req.user as JwtUserData, file);
    }
}
