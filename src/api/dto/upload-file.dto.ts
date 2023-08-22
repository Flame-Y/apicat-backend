import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class UploadedFileDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsNotEmpty()
    file: any;
}
