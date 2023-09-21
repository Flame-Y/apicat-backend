import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'team'
})
export class Team {
    @PrimaryGeneratedColumn({
        comment: '团队id'
    })
    id: number;

    @Column({
        length: 20,
        comment: '团队名'
    })
    name: string;

    @Column({
        comment: '团队所有者id'
    })
    creatorId: number;

    @Column({
        length: 100,
        comment: '团队所有者名称'
    })
    creatorName: string;

    @Column({
        comment: '项目数量',
        default: 0
    })
    projectCount: number;

    @Column({
        length: 1000,
        comment: '团队描述',
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
