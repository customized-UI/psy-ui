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
import { Histories } from './history.eneity';
  
@Entity('groups')
export class Groups {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({
        default: ''
    })
    type: string

    @Column({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      createTime: Date;

    @ManyToOne(() => User, user => user.groups, {
        onDelete: "CASCADE"
    })
    user: User
    
    @OneToMany(() => Histories, histories => histories.groups)
    histories: Histories[]
}