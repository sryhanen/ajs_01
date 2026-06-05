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
import {CommitParagraphMessage} from './commitParagraphMessage';
import {ParagraphDataImpl} from '../../paragraph/paragraphData/paragraphDataImpl';

describe('CommitParagraphMessage unit test', () => {
  let commitParagraphMessage: CommitParagraphMessage;
  const expectedOperation = 'COMMIT_PARAGRAPH';
  const expectedData = {
    id: 'paragraphId',
    noteId: '',
    title: '',
    paragraph: 'paragraph text',
    config: {},
    params: {},
  };
  const paragraphData = {
    id: 'paragraphId',
    noteId: '',
    title: '',
    text: 'paragraph text',
    config: {},
    settings: {},
  };

  beforeEach(() => {
    commitParagraphMessage = new CommitParagraphMessage(new ParagraphDataImpl(paragraphData), []);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(commitParagraphMessage).toBeDefined();
    });

    it('Should have operation', () => {
      expect(commitParagraphMessage.operation()).toEqual(expectedOperation);
    });

    it('Should have data', () => {
      expect(commitParagraphMessage.data()).toEqual(expectedData);
    });

    it('Should have message', () => {
      const expectedMessage = {
        op:expectedOperation,
        data:expectedData
      };
      expect(commitParagraphMessage.message()).toEqual(expectedMessage);
    });
  });

  describe('Overrides paragraphData', () => {
    it('Should override paragraphData with given properties', () => {
      const overrides = [
        {name:'id', value:'newValue'},
        {name:'title', value:'newTitle'},
        {name:'paragraph', value:'newText'},
        {name:'config', value: {test1:'test1'}},
        {name:'params', value:{test2:'test2'}},
      ];
      commitParagraphMessage = new CommitParagraphMessage(new ParagraphDataImpl(paragraphData), overrides);
      const expectedData = {
        id: 'newValue',
        noteId: '',
        title: 'newTitle',
        paragraph: 'newText',
        config: {test1:'test1'},
        params: {test2:'test2'},
      };
      const expectedMessage = {
        op:expectedOperation,
        data:expectedData
      };
      expect(commitParagraphMessage.data()).toEqual(expectedData);
      expect(commitParagraphMessage.message()).toEqual(expectedMessage);
    });
  });
});
