import {OutputSwitcher} from '../../../../objects/output/switcher/outputSwitcher';

export interface OutputSwitcherAngular extends OutputSwitcher {
  status():{ isSwitchable: boolean, isLoading: boolean }
}
