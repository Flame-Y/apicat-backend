import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'apiArgs'
})
export class ApiArg {
    @PrimaryGeneratedColumn({
        comment: '参数id(只在更新时使用)'
    })
    id: number;

    @Column({
        comment: '接口id'
    })
    aid: number;

    @Column({
        length: 100,
        comment: '参数名称'
    })
    name: string;

    @Column({
        length: 1000,
        comment: '接口描述',
        nullable: true
    })
    description: string;

    @Column({
        length: 100,
        comment: '参数字段类型'
    })
    argType: string;

    @Column({
        length: 100,
        comment: '参数格式'
    })
    form: string;

    @Column({
        length: 100,
        comment: '参数数据类型'
    })
    dataType: string;

    @Column({
        length: 1000,
        comment: '参数默认值',
        nullable: true
    })
    default: string;

    @Column({
        comment: '是否必填',
        default: false,
        nullable: true
    })
    required: boolean;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;
}
