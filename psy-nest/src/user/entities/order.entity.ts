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

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    orderId: string

    @Column()
    money:  number
    
    @Column()
    duration: string

    @ManyToOne(() => User, user => user.orders, {
        onDelete: "CASCADE"
    })
    user: User

    @Column({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      createTime: Date;
    
      @Column({
        name: 'update_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      updateTime: Date;
}