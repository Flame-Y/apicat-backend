import { ApiProperty } from '@nestjs/swagger';

export class ProjectListVo {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    createTime: Date;

    @ApiProperty()
    updateTime: Date;

    @ApiProperty()
    permission: string;
}
