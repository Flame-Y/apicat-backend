import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateApiDto {
    @IsString()
    @ApiProperty()
    @Length(1, 20)
    name: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsString()
    @ApiProperty()
    type: string;

    @IsString()
    @ApiProperty()
    url: string;

    @ApiProperty()
    pid: number;
}
