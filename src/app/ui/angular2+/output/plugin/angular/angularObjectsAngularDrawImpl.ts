import {AngularObjectsAngularDraw} from './angularObjectsAngularDraw';
import {AngularObject} from '../../../../../objects/angularObject/angularObject';
import {AngularObjectCollection} from '../../../../../objects/angularObjectCollection/angularObjectCollection';

export class AngularObjectsAngularDrawImpl implements AngularObjectsAngularDraw {
  private readonly _angularObjectCollection: AngularObjectCollection;
  private _angularObjects: AngularObject[];

  constructor(angularObjectCollection: AngularObjectCollection) {
    this._angularObjectCollection = angularObjectCollection;
    this._angularObjects = this._angularObjectCollection.angularObjects();
  }

  angularObjects(): AngularObject[] {
    return this._angularObjects;
  }

  draw(): void {
    this._angularObjects = this._angularObjectCollection.angularObjects();
  }
}
