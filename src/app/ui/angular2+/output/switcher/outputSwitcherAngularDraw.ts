import {AngularDraw} from '../../angularDraw/angularDraw';
import {OutputSwitcher} from '../../../../objects/output/switcher/outputSwitcher';

export interface OutputSwitcherAngularDraw extends Partial<OutputSwitcher>, AngularDraw{
  status():{ isSwitchable: boolean, isLoading: boolean }
}
