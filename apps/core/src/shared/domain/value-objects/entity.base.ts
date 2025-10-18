import { IEntity } from '../interfaces/entity.interface';

export abstract class Entity<T> implements IEntity<T> {
  protected readonly _id: T;

  constructor(id: T) {
    this._id = id;
  }

  get id(): T {
    return this._id;
  }

  equals(entity: IEntity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (!(entity instanceof Entity)) {
      return false;
    }

    return this._id === entity._id;
  }
}
