import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Groups } from './groups.entity';

@Entity('histories')
export class Histories {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    role: string

    @Column(
        {
            type: 'text'
        }
    )
    message: string
    
    @Column({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      createTime: Date;

    @ManyToOne(() => Groups, groups => groups.histories, {
        onDelete: "CASCADE"
    })
    groups: Groups
}