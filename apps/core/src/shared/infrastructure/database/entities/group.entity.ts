import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { MemberEntity } from './member.entity';

@Entity('groups')
export class GroupEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => MemberEntity, (member) => member.group)
  members: MemberEntity[];
}
