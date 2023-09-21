import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'teampermission'
})
export class TeamPermission {
    @PrimaryGeneratedColumn({
        comment: '团队权限id(只在更新时使用)'
    })
    id: number;

    @Column({
        comment: '团队id'
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
        comment: '权限类型:团队所有者（owner）、团队管理员（admin）、团队成员（member）'
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
