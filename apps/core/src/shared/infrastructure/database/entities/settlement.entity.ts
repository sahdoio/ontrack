import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('settlements')
export class SettlementEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @Column({ name: 'payer_id', type: 'uuid' })
  payerId: string;

  @Column({ name: 'receiver_id', type: 'uuid' })
  receiverId: string;

  @Column({ type: 'integer', comment: 'Amount in cents' })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
