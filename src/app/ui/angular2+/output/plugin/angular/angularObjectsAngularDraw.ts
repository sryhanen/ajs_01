import {AngularDraw} from '../../../angularDraw/angularDraw';
import {AngularObject} from '../../../../../objects/angularObject/angularObject';
import {AngularObjectCollection} from '../../../../../objects/angularObjectCollection/angularObjectCollection';

export interface AngularObjectsAngularDraw extends Partial<AngularObjectCollection>,AngularDraw {
  angularObjects(): AngularObject[];
}
