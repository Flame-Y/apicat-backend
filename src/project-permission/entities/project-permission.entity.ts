import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'projectpermission'
})
export class ProjectPermission {
    @PrimaryGeneratedColumn({
        comment: '项目权限id(只在更新时使用)'
    })
    id: number;

    @Column({
        comment: '项目id'
    })
    pid: number;

    @Column({
        comment: '队伍id'
    })
    tid: number;

    @Column({
        comment: '用户id'
    })
    uid: number;

    @Column({
        length: 20,
        comment: '用户名'
    })
    username: string;

    @Column({
        length: 10,
        comment: '权限类型:项目管理员（admin）、项目编辑者（rw)、项目查看者（r）'
    })
    type: string;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;
}
