export interface IEntity<T> {
  equals(entity: IEntity<T>): boolean;
}
