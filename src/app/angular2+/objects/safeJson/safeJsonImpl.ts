
import {SafeJson} from './safeJson';

export class SafeJsonImpl implements SafeJson{
  private readonly _data:object;

  constructor(data:object) {
    this._data = data;
  }

  propertyExists(key: string): boolean {
    return Object.hasOwn(this._data, key);
  }

  getProperty<T>(key:string, type:string): T {
    this.validateKeyExists(key);
    const property = this._data[key];
    return this.validatePropertyType(property, type);
  }

  private validateKeyExists(key:string):void {
    if(!Object.hasOwn(this._data, key)) {
      throw new Error(`Key "${key}" not found in object ${this._data}`);
    }
  }

  private validatePropertyType<T>(property: T, type:string): T {
    const propertyType = typeof property;
    if(propertyType !== type) {
      throw new Error(`Type "${propertyType}" of property ${property} is not of type "${type}"`);
    }
    return property;
  }
}
