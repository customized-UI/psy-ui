// use/entities/user.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { getName } from 'random_chinese_fantasy_names';
import { Exclude } from 'class-transformer';
import { Groups } from './groups.entity';
import { Order } from './order.entity';
import { OtherHistories } from './otherhistory.eneity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string; // 用户名

  @Exclude()
  @Column()
  password: string; // 密码

  @Column({
    length: 100,
    default: '',
  })
  nickname: string;

  @Column({
    default: false,
  })
  isMember: boolean; //是否是会员

  // @Column('text',{
  //   default: [],
  //   array: true
  // })
  // chats: string[]

  @Column({
    name: 'member_time',
    type: 'timestamp',
    default: null,
  })
  memberTime: Date; // 会员时间

  @Column({
    default: null,
  })
  inviteCode: string; //邀请码

  @Column({ default: 0 })
  usageCount: number; //使用次数,如果有会员则不用到这个

  @OneToMany(() => Groups, (groups) => groups.user)
  groups: Groups[];

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order[];

  @OneToMany(() => OtherHistories, (otherHistories) => otherHistories.user)
  otherHistories: OtherHistories[];
  

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

  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hashSync(this.password);
  }
  @BeforeInsert()
  async randomNickname() {
    this.nickname = await getName(1)[0];
  }
}
