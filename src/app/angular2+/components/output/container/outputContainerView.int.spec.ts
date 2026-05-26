/*
 * Teragrep User Interface (ajs_01)
 * Copyright (C) 2019-2026 Suomen Kanuuna Oy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *
 * Additional permission under GNU Affero General Public License version 3
 * section 7
 *
 * If you modify this Program, or any covered work, by linking or combining it
 * with other code, such other code is not for that reason alone subject to any
 * of the requirements of the GNU Affero GPL version 3 as long as this Program
 * is the same Program as licensed from Suomen Kanuuna Oy without any additional
 * modifications.
 *
 * Supplemented terms under GNU Affero General Public License version 3
 * section 7
 *
 * Origin of the software must be attributed to Suomen Kanuuna Oy. Any modified
 * versions must be marked as "Modified version of" The Program.
 *
 * Names of the licensors and authors may not be used for publicity purposes.
 *
 * No rights are granted for use of trade names, trademarks, or service marks
 * which are in The Program if any.
 *
 * Licensee must indemnify licensors and authors for any liability that these
 * contractual assumptions impose on licensors and authors.
 *
 * To the extent this program is licensed as part of the Commercial versions of
 * Teragrep, the applicable Commercial License may apply to this file if you as
 * a licensee so wish it.
 */
import {Channel} from '../../../objects/channel/channel';
import {AngularObjectCollection} from '../../../objects/angularObjectCollection/angularObjectCollection';
import {OutputContainer} from '../../../objects/output/container/outputContainer';
import {FakeToasterService} from '../../../../shared/components/Toaster/fakeToasterService';
import {FakeChannel} from '../../../objects/channel/fakeChannel';
import {AngularObjectCollectionImpl} from '../../../objects/angularObjectCollection/angularObjectCollectionImpl';
import {OutputContainerImpl} from '../../../objects/output/container/outputContainerImpl';
import {OutputContainerView} from './outputContainerView';
import {ToasterService} from '../../../../shared/components/Toaster/notifications.service';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {OutputPluginDirective} from '../plugin/outputPluginDirective';
import {OutputSwitcherView} from '../switcher/outputSwitcherView';

describe('OutputContainerView integration', () => {
  const channel:Channel = new FakeChannel();
  const angularObjectCollection: AngularObjectCollection = new AngularObjectCollectionImpl(channel);
  const outputContainer: OutputContainer = new OutputContainerImpl(channel, angularObjectCollection);
  const toaster: FakeToasterService = new FakeToasterService();
  let fixture: ComponentFixture<OutputContainerView>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide:ToasterService, useValue: toaster}
      ]
    });
    fixture = TestBed.createComponent(OutputContainerView);
    fixture.componentInstance.outputContainer = outputContainer;
    fixture.detectChanges();
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(fixture.componentInstance).toBeDefined();
    });

    it('Should have output plugin directive', () => {
      const outputPluginDirective = fixture.debugElement.queryAll(By.directive(OutputPluginDirective));
      expect(outputPluginDirective).toBeTruthy();
    });

    it('Should have output switcher view', () => {
      const outputSwitcherView = fixture.debugElement.queryAll(By.directive(OutputSwitcherView));
      expect(outputSwitcherView).toBeTruthy();
    });
  });
});
