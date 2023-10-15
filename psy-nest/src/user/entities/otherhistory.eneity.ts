import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('other_histories')
export class OtherHistories {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    role: string

    @Column()
    type: string

    @Column({
        default: ''
    })
    grade: string

    @Column(
        {
            type: 'text'
        }
    )
    content: string

    @Column(
        {
           type: 'json',
           default: {}
        }
    )
    arraydata: any

    @Column({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      createTime: Date;

    @ManyToOne(() => User, user => user.otherHistories, {
        onDelete: "CASCADE"
    })
    user: User
}