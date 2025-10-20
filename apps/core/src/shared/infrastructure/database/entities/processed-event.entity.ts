import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('processed_events')
export class ProcessedEventEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  eventId: string;

  @Column({ type: 'varchar', length: 100 })
  eventName: string;

  @Column({ type: 'varchar', length: 36 })
  aggregateId: string;

  @CreateDateColumn()
  processedAt: Date;

  @Column({ type: 'varchar', length: 50 })
  handlerName: string;
}
