import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('测试接口')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('aaa')
    @UseGuards(LoginGuard)
    aaa() {
        return 'aaa';
    }

    @Get('bbb')
    @UseGuards(LoginGuard)
    bbb() {
        return 'bbb';
    }
}
