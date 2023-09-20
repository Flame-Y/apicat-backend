import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'projectpermission'
})
export class ProjectPermission {
    @PrimaryGeneratedColumn({
        comment: '权限id(只在更新时使用)'
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
        comment: '权限类型:管理、只读或读写(admin, r, rw)'
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
