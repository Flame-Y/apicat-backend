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
        length: 100,
        comment: '创建者id'
    })
    creatorId: string;

    @Column({
        length: 100,
        comment: '创建者名称'
    })
    creatorName: string;

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
