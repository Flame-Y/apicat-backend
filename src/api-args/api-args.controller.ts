import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiArgsService } from './api-args.service';
import { CreateApiArgDto } from './dto/create-api-arg.dto';
import { UpdateApiArgDto } from './dto/update-api-arg.dto';

@Controller('api-args')
export class ApiArgsController {
    constructor(private readonly apiArgsService: ApiArgsService) {}

    @Post()
    create(@Body() createApiArgDto: CreateApiArgDto) {
        return this.apiArgsService.create(createApiArgDto);
    }

    @Get()
    findAll() {
        return this.apiArgsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.apiArgsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateApiArgDto: UpdateApiArgDto) {
        return this.apiArgsService.update(+id, updateApiArgDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.apiArgsService.remove(+id);
    }
}
