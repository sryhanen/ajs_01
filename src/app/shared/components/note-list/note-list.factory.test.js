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
describe('Factory: NoteList', function() {
  let noteList;

  beforeEach(function() {
    angular.mock.module('zeppelinWebApp.comNoteList');

    angular.mock.inject(function($injector) {
      noteList = $injector.get('noteListFactory');
    });
  });

  it('should generate both flat list and folder-based list properly', function() {
    const notesList = [
      {path: 'A', id: '000001'},
      {path: 'B', id: '000002'},
      {id: '000003'},                     // note without path
      {path: '/C/CA', id: '000004'},
      {path: '/C/CB', id: '000005'},
      {path: '/C/CB/CBA', id: '000006'},  // same path with a dir
      {path: '/C/CB/CBA', id: '000007'},  // same path with another note
      {path: 'C///CB//CBB', id: '000008'},
      {path: 'D/D[A/DA]B', id: '000009'},   // check if '[' and ']' considered as folder seperator
    ];
    noteList.setNotes(notesList);

    const flatList = noteList.flatList;
    expect(flatList.length).toBe(9);
    expect(flatList[0].path).toBe('A');
    expect(flatList[0].id).toBe('000001');
    expect(flatList[1].path).toBe('B');
    expect(flatList[2].path).toBeUndefined();
    expect(flatList[3].path).toBe('/C/CA');
    expect(flatList[4].path).toBe('/C/CB');
    expect(flatList[5].path).toBe('/C/CB/CBA');
    expect(flatList[6].path).toBe('/C/CB/CBA');
    expect(flatList[7].path).toBe('C///CB//CBB');
    expect(flatList[8].path).toBe('D/D[A/DA]B');

    const folderList = noteList.root.children;
    expect(folderList.length).toBe(5);
    expect(folderList[3].name).toBe('A');
    expect(folderList[3].id).toBe('000001');
    expect(folderList[4].name).toBe('B');
    expect(folderList[2].name).toBe('000003');
    expect(folderList[0].name).toBe('C');
    expect(folderList[0].id).toBe('C');
    expect(folderList[0].children.length).toBe(3);
    expect(folderList[0].children[0].name).toBe('CA');
    expect(folderList[0].children[0].id).toBe('000004');
    expect(folderList[0].children[0].children).toBeUndefined();
    expect(folderList[0].children[1].name).toBe('CB');
    expect(folderList[0].children[1].id).toBe('000005');
    expect(folderList[0].children[1].children).toBeUndefined();
    expect(folderList[0].children[2].name).toBe('CB');
    expect(folderList[0].children[2].id).toBe('C/CB');
    expect(folderList[0].children[2].children.length).toBe(3);
    expect(folderList[0].children[2].children[0].name).toBe('CBA');
    expect(folderList[0].children[2].children[0].id).toBe('000006');
    expect(folderList[0].children[2].children[0].children).toBeUndefined();
    expect(folderList[0].children[2].children[1].name).toBe('CBA');
    expect(folderList[0].children[2].children[1].id).toBe('000007');
    expect(folderList[0].children[2].children[1].children).toBeUndefined();
    expect(folderList[0].children[2].children[2].name).toBe('CBB');
    expect(folderList[0].children[2].children[2].id).toBe('000008');
    expect(folderList[0].children[2].children[2].children).toBeUndefined();
    expect(folderList[1].name).toBe('D');
    expect(folderList[1].id).toBe('D');
    expect(folderList[1].children.length).toBe(1);
    expect(folderList[1].children[0].name).toBe('D[A');
    expect(folderList[1].children[0].id).toBe('D/D[A');
    expect(folderList[1].children[0].children[0].name).toBe('DA]B');
    expect(folderList[1].children[0].children[0].id).toBe('000009');
    expect(folderList[1].children[0].children[0].children).toBeUndefined();
  });
});
