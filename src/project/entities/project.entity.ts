import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Role } from './role.entity';
import { User } from 'src/user/entities/user.entity';

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

    // 多个项目与多个角色关联
    @ManyToMany(() => Role)
    @JoinTable({
        name: 'project_role'
    })
    roles: Role[];

    // 每个项目与多个用户关联
    @OneToMany(() => User, (user) => user.project)
    users: User[];
}
