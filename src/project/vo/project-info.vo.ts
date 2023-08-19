import { ApiProperty } from '@nestjs/swagger';

class ProjectInfo {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    creatorId: number;

    @ApiProperty()
    creatorName: string;

    @ApiProperty()
    createTime: Date;

    @ApiProperty()
    updateTime: Date;
}

export class ProjectInfoVo {
    @ApiProperty()
    projectInfo: ProjectInfo;

    // todo: 项目权限表
}
