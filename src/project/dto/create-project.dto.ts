import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProjectDto {
    @IsString()
    @IsNotEmpty({ message: '项目名不能为空' })
    @ApiProperty()
    @Length(1, 20)
    name: string;
}
