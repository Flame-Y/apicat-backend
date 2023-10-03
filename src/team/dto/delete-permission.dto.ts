import { ApiProperty } from '@nestjs/swagger';
export class DeletePermissionDto {
    @ApiProperty()
    tid: number;

    @ApiProperty()
    uid: number;
}
