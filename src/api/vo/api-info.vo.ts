import { ApiProperty } from '@nestjs/swagger';

class ApiInfo {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    createTime: Date;

    @ApiProperty()
    updateTime: Date;
}

class ApiArgs {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    argType: string;

    @ApiProperty()
    form: string;

    @ApiProperty()
    dataType: string;

    @ApiProperty()
    default: string;

    @ApiProperty()
    required: boolean;

    @ApiProperty()
    description: string;
}

export class ApiInfoVo {
    @ApiProperty()
    apiInfo: ApiInfo;

    @ApiProperty()
    apiArgs: ApiArgs[];
}
