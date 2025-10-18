import { AggregateRoot } from '../../../shared/domain/value-objects/aggregate-root.base';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Member } from './member.entity';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';
import { GroupCreated } from '../events/group-created.event';
import { MemberAddedToGroup } from '../events/member-added-to-group.event';
import { MemberRemovedFromGroup } from '../events/member-removed-from-group.event';

export class Group extends AggregateRoot<GroupId> {
  private _name: string;
  private _members: Member[];
  private readonly _createdAt: Date;

  private constructor(id: GroupId, name: string, members: Member[], createdAt: Date) {
    super(id);
    this._name = name;
    this._members = members;
    this._createdAt = createdAt;
  }

  public static create(name: string, initialMembers: Member[], id?: GroupId): Group {
    if (!name || name.trim().length === 0) {
      throw new InvalidArgumentException('Group name cannot be empty');
    }

    if (name.trim().length > 200) {
      throw new InvalidArgumentException('Group name cannot exceed 200 characters');
    }

    // Invariant: Must have at least 2 members
    if (!initialMembers || initialMembers.length < 2) {
      throw new InvalidArgumentException('Group must have at least 2 members');
    }

    // Invariant: No duplicate member names
    const memberNames = initialMembers.map((m) => m.name.toLowerCase());
    const uniqueNames = new Set(memberNames);
    if (memberNames.length !== uniqueNames.size) {
      throw new InvalidArgumentException('Group cannot have duplicate member names');
    }

    const groupId = id || GroupId.create();
    const createdAt = new Date();
    const group = new Group(groupId, name.trim(), [...initialMembers], createdAt);

    // Emit domain event
    group.addDomainEvent(
      new GroupCreated(
        groupId.value,
        name.trim(),
        initialMembers.map((m) => ({ id: m.id.value, name: m.name })),
      ),
    );

    return group;
  }

  public static reconstitute(
    id: GroupId,
    name: string,
    members: Member[],
    createdAt: Date,
  ): Group {
    return new Group(id, name, members, createdAt);
  }

  get name(): string {
    return this._name;
  }

  get members(): Member[] {
    return [...this._members]; // Return a copy to prevent external modifications
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidArgumentException('Group name cannot be empty');
    }

    if (name.trim().length > 200) {
      throw new InvalidArgumentException('Group name cannot exceed 200 characters');
    }

    this._name = name.trim();
  }

  public addMember(member: Member): void {
    // Check if member already exists
    if (this._members.some((m) => m.id.equals(member.id))) {
      throw new DomainException('Member already exists in the group');
    }

    // Invariant: No duplicate names
    if (this._members.some((m) => m.name.toLowerCase() === member.name.toLowerCase())) {
      throw new InvalidArgumentException('A member with this name already exists in the group');
    }

    this._members.push(member);

    // Emit domain event
    this.addDomainEvent(new MemberAddedToGroup(this.id.value, member.id.value, member.name));
  }

  public removeMember(memberId: MemberId): void {
    const memberIndex = this._members.findIndex((m) => m.id.equals(memberId));

    if (memberIndex === -1) {
      throw new DomainException('Member not found in the group');
    }

    // Invariant: Must have at least 2 members
    if (this._members.length <= 2) {
      throw new DomainException('Cannot remove member. Group must have at least 2 members');
    }

    const removedMember = this._members[memberIndex];
    this._members.splice(memberIndex, 1);

    // Emit domain event
    this.addDomainEvent(
      new MemberRemovedFromGroup(this.id.value, removedMember.id.value, removedMember.name),
    );
  }

  public hasMember(memberId: MemberId): boolean {
    return this._members.some((m) => m.id.equals(memberId));
  }

  public getMember(memberId: MemberId): Member | undefined {
    return this._members.find((m) => m.id.equals(memberId));
  }

  public getMemberCount(): number {
    return this._members.length;
  }
}
