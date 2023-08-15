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

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;
}
