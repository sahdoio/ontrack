import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GroupEntity } from './group.entity';

@Entity('members')
export class MemberEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;

  @ManyToOne(() => GroupEntity, (group) => group.members)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}
