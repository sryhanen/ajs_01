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
import ace from 'ace-builds';
import {Channel} from '../../channel/channel';
import {ConfiguredEditor} from './configuredEditor';
import {AutoCompletionConfigurationImpl} from '../configuration/autoCompletion/autoCompletionConfigurationImpl';
import {AutoCompletionConfiguration} from '../configuration/autoCompletion/autoCompletionConfiguration';
import {TextConfiguration} from '../configuration/text/textConfiguration';
import {LinesConfiguration} from '../configuration/lines/linesConfiguration';
import {KeyCommandsConfiguration} from '../configuration/keyCommands/keyCommandsConfiguration';
import {HighlightsConfiguration} from '../configuration/highlights/highLightsConfiguration';
import {AutoCommitConfiguration} from '../configuration/autoCommit/autoCommitConfiguration';
import {AnnotationsConfiguration} from '../configuration/annotations/annotationsConfiguration';

export class ConfiguredEditorImpl implements ConfiguredEditor {
  private readonly _channel:Channel;
  private readonly _paragraphData:object;
  private readonly _autoCompletionConfiguration:AutoCompletionConfiguration;

  constructor(channel:Channel, paragraphData: object) {
    this._channel = channel;
    this._paragraphData = paragraphData;
    this._autoCompletionConfiguration = new AutoCompletionConfigurationImpl(channel);
  }

  configuredEditor(aceEditor: ace.Editor): ace.Editor {
    this.setBasePath();
    this.configureReadOnly(aceEditor);
    return new TextConfiguration(this._paragraphData,
            new LinesConfiguration(this._paragraphData,
              new KeyCommandsConfiguration(
                new HighlightsConfiguration(
                  new AutoCommitConfiguration(this,
                    new AnnotationsConfiguration(
                      this._autoCompletionConfiguration
                    )))))).configuredEditor(aceEditor);
  }

  response(json: object): void {
    this._autoCompletionConfiguration.response(json);
  }

  request(json: object) {
    this._channel.request(json);
  }

  private configureReadOnly(aceEditor: ace.Editor):void{
    const status = this._paragraphData['status'];
    const editorIsDisabled = status === 'RUNNING' || status === 'PENDING';
    aceEditor.setReadOnly(editorIsDisabled);
    aceEditor.setStyle('paragraph-disable', editorIsDisabled);
  }

  private setBasePath(): void {
    ace.config.set('basePath', '/');
    ace.config.set('modePath', '/');
    ace.config.set('themePath', '/');
    ace.config.set('workerPath', '/');
  }
}
