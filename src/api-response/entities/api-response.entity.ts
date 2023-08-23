import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'apiResponse'
})
export class ApiResponse {
    @PrimaryGeneratedColumn({
        comment: '返回值id(只在更新时使用)'
    })
    id: number;

    @Column({
        comment: '接口id'
    })
    aid: number;

    @Column({
        length: 100,
        comment: '状态码'
    })
    HttpStatus: number;

    @Column({
        length: 100,
        comment: '返回码'
    })
    code: number;

    @Column({
        length: 100,
        comment: '返回值'
    })
    data: string;

    @Column({
        length: 1000,
        comment: 'mock规则',
        nullable: true
    })
    mock: string;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;
}
