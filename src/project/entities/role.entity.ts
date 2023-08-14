import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from 'src/user/entities/user.entity';
import { Project } from './project.entity';

@Entity({
    name: 'roles'
})
export class Role {
    // 角色表
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;

    // 每个角色与一个用户关联
    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    // 每个角色与一个权限关联
    @OneToOne(() => Permission)
    @JoinColumn()
    permission: Permission;

    // 多个角色与一个项目关联
    @ManyToOne(() => Project, (project) => project.roles)
    project: Project[];
}
