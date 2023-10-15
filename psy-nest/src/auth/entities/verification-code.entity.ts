import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  code: string;

  @Column({ default: false })
  verified: boolean;
}