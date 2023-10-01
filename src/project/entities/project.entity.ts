import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'project'
})
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20,
        comment: '项目名'
    })
    name: string;

    @Column({
        comment: '创建团队id（个人项目则为-1）'
    })
    creatorId: number;

    @Column({
        length: 100,
        comment: '创建团队名称（个人项目则为用户名）'
    })
    creatorName: string;

    @Column({
        comment: '接口数量',
        default: 0
    })
    apiCount: number;

    @Column({
        length: 1000,
        comment: '项目描述',
        nullable: true
    })
    description: string;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;
}
