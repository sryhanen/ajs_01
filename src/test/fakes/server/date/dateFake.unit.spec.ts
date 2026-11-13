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
import {DateFake} from './dateFake';
import {DateFakeImpl} from './dateFakeImpl';

describe('DateFake unit test', () => {
  let dateFake: DateFake;

  it('formats a timestamp with a positive timezone offset (e.g., UTC+2)', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-120);
    dateFake = new DateFakeImpl(new Date(2026, 10, 13, 12, 3, 33).getTime());
    expect(dateFake.toString()).toBe('2026-11-13T12:03:33+0200');
  });

  it('formats a timestamp with a negative timezone offset (e.g., UTC-5)', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(300);
    dateFake = new DateFakeImpl(new Date(2026, 10, 13, 12, 3, 33).getTime());
    expect(dateFake.toString()).toBe('2026-11-13T12:03:33-0500');
  });

  it('formats a timestamp at UTC (+0000)', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);
    dateFake = new DateFakeImpl(new Date(2026, 10, 13, 12, 3, 33).getTime());
    expect(dateFake.toString()).toBe('2026-11-13T12:03:33+0000');
  });

  it('handles non-hour timezone offsets (e.g., UTC+5:30)', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-330);
    dateFake = new DateFakeImpl(new Date(2026, 10, 13, 12, 3, 33).getTime());
    expect(dateFake.toString()).toBe('2026-11-13T12:03:33+0530');
  });

  it('pads single-digit months, days, hours, minutes, and seconds with leading zeros', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-60);
    dateFake = new DateFakeImpl(new Date(2026, 0, 5, 3, 4, 9).getTime());
    expect(dateFake.toString()).toBe('2026-01-05T03:04:09+0100');
  });

  it('works directly with Date.now() using fake timers', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 13, 12, 3, 33));
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-120);
    dateFake = new DateFakeImpl(Date.now());
    expect(dateFake.toString()).toBe('2026-11-13T12:03:33+0200');
  });
});
