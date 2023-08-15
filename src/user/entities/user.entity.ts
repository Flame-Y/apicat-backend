import { Project } from 'src/project/entities/project.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity({
    name: 'user'
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 10,
        comment: '用户名'
    })
    username: string;

    @Column({
        length: 100,
        comment: '密码'
    })
    password: string;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;

    // 多个用户与多个项目关联
    @ManyToMany(() => Project, (project) => project.users)
    @JoinTable({
        name: 'user_project'
    })
    project: Project[];
}
