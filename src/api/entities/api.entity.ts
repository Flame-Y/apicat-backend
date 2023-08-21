import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'api'
})
export class Api {
    @PrimaryGeneratedColumn({
        comment: '接口id(只在更新时使用)'
    })
    id: number;

    @Column({
        comment: '项目id'
    })
    pid: number;

    @Column({
        length: 100,
        comment: '接口名称'
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
        comment: '请求方式'
    })
    type: string;

    @Column({
        length: 1000,
        comment: '接口地址'
    })
    url: string;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;
}
