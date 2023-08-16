import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin } from './custom.decorator';
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
    @RequireLogin()
    aaa() {
        return 'aaa';
    }

    @Get('bbb')
    bbb() {
        return 'bbb';
    }
}
