import { Entity } from '../../../shared/domain/value-objects/entity.base';
import { MemberId } from '../../../shared/domain/value-objects/id.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export class Member extends Entity<MemberId> {
  private _name: string;
  private readonly _joinedAt: Date;

  private constructor(id: MemberId, name: string, joinedAt: Date) {
    super(id);
    this._name = name;
    this._joinedAt = joinedAt;
  }

  public static create(name: string, id?: MemberId): Member {
    if (!name || name.trim().length === 0) {
      throw new InvalidArgumentException('Member name cannot be empty');
    }

    if (name.trim().length > 100) {
      throw new InvalidArgumentException(
        'Member name cannot exceed 100 characters',
      );
    }

    const memberId = id || MemberId.create();
    const joinedAt = new Date();

    return new Member(memberId, name.trim(), joinedAt);
  }

  public static reconstitute(
    id: MemberId,
    name: string,
    joinedAt: Date,
  ): Member {
    return new Member(id, name, joinedAt);
  }

  get name(): string {
    return this._name;
  }

  get joinedAt(): Date {
    return this._joinedAt;
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidArgumentException('Member name cannot be empty');
    }

    if (name.trim().length > 100) {
      throw new InvalidArgumentException(
        'Member name cannot exceed 100 characters',
      );
    }

    this._name = name.trim();
  }
}
