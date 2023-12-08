import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateApiFileDto {
    @IsNotEmpty({ message: '项目id不能为空' })
    @ApiProperty()
    pid: number;

    @ApiProperty()
    parentId: string;
}
