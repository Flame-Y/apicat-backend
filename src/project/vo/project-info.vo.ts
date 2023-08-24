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

class Permission {
    @ApiProperty()
    id: number;

    @ApiProperty()
    uid: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    type: string;
}

class Api {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    description: string;
}
export class ProjectInfoVo {
    @ApiProperty()
    projectInfo: ProjectInfo;

    @ApiProperty()
    permissionList: Permission[];

    @ApiProperty()
    apiList: Api[];
}
