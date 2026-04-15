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
import PaginationServerError from './paginationServerError';

describe('PaginationServerError test suite', function() {
  const errorMessage = 'Request failed: Interpreter session is not running, please rerun the paragraph!';

  describe('Test error method', function() {
    it('Error set to true should return true', function() {
      const errorJson = { error: true, message: errorMessage};
      const paginationError = new PaginationServerError(errorJson);

      const error = paginationError.error();
      expect(error).toBeTrue();
    });

    it('Error set to false should return false', function() {
      const noError = { error: false};
      const paginationError = new PaginationServerError(noError);
      const error = paginationError.error();
      expect(error).toBeFalse();
    });

    it('Undefined input should return false', function() {
      const empty = {};
      const paginationError = new PaginationServerError(empty);
      const error = paginationError.error();
      expect(error).toBeFalse();
    });
  });

  describe('Test message method', function() {
    it('Should return error message', function() {
      const errorJson = { error: true, message: errorMessage};
      const paginationError = new PaginationServerError(errorJson);
      const message = paginationError.message();
      expect(message).toEqual(errorMessage);
    });

    it('Undefined input should throw error', function() {
      const empty = {};
      const paginationError = new PaginationServerError(empty);
      expect(() => paginationError.message())
        .toThrow(new Error(`Message is undefined. Object: ${empty}`));
    });

  });
});
