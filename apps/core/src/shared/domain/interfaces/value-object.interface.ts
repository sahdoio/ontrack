export interface IValueObject<T> {
  equals(vo: IValueObject<T>): boolean;
}
