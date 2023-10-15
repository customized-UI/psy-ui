import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InvitationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  inviteCode: string;
}