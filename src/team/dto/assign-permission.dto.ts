import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AssginPermissionDto {
    @ApiProperty()
    tid: number;

    @ApiProperty()
    uid: number;

    @IsString()
    @ApiProperty()
    type: 'admin' | 'member';
}
