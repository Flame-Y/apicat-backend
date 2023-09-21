import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTeamDto {
    @IsString()
    @IsNotEmpty({ message: '团队名不能为空' })
    @ApiProperty()
    @Length(1, 20)
    name: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsString()
    @ApiProperty()
    icon: string;
}
