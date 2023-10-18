import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { HttpExceptionFilter } from './format-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalInterceptors(new FormatResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    const configService = app.get(ConfigService);
    const config = new DocumentBuilder()
        .setTitle('API Cat')
        .setDescription('API Cat API 接口文档')
        .setVersion('1.0')
        .addTag('API Cat')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    await app.listen(configService.get('nest_server_port'));
}
bootstrap();
