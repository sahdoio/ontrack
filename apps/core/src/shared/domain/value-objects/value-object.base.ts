import { IValueObject } from '../interfaces/value-object.interface';

export abstract class ValueObject<T> implements IValueObject<T> {
  protected abstract getEqualityComponents(): any[];

  equals(vo: IValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (!(vo instanceof ValueObject)) {
      return false;
    }

    const components1 = this.getEqualityComponents();
    const components2 = (vo as ValueObject<T>).getEqualityComponents();

    if (components1.length !== components2.length) {
      return false;
    }

    return components1.every((component, index) => {
      return this.deepEquals(component, components2[index]);
    });
  }

  private deepEquals(a: any, b: any): boolean {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a === undefined || b === undefined) return false;
    if (typeof a !== typeof b) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => this.deepEquals(item, b[index]));
    }

    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every((key) => this.deepEquals(a[key], b[key]));
    }

    return false;
  }
}
