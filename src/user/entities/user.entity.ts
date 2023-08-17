import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

    @Column({
        length: 1000,
        comment: '头像',
        nullable: true
    })
    avatar: string;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;
}
