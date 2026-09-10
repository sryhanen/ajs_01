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
import {HttpTestingController, provideHttpClientTesting, TestRequest} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {PermissionsService} from './permissionsService';
import {PermissionsServiceImpl} from './permissionsServiceImpl';
import {AuthenticationServiceImpl} from '../authentication/authenticationServiceImpl';
import {AuthenticationService} from '../authentication/authenticationService';
import {Authentication} from '../../../../shared/objects/security/authentication';
import {AuthenticationImpl} from '../../../../shared/objects/security/authenticationImpl';

describe('PermissionsService unit test', () => {
  let permissionsService: PermissionsService;
  let httpTestingController: HttpTestingController;

  const fakeAuthenticationService:Partial<AuthenticationService> = {
    authentication(): Authentication {
      return new AuthenticationImpl({
        principal: 'principal',
        ticket: 'ticket',
        roles: ''
      });
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        { provide: AuthenticationServiceImpl, useValue: fakeAuthenticationService }
      ],
    });
    permissionsService = TestBed.inject(PermissionsServiceImpl);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('Requesting permissions ', () => {
    let permissions:string[];
    let request:TestRequest;

    beforeEach(() => {
      permissionsService.requestPermissions('noteId').subscribe(p => permissions = p);
      request = httpTestingController.expectOne(request => request.url.endsWith('api/notebook/noteId/permissions'));
    });

    it('Should make http get request', () => {
      expect(request.request.method).toEqual('GET');
    });

    describe('Parsing request data', () => {
      it('Should receive all permissions', () => {
        request.flush({
          body:{
            owners:['principal'],
            writers:['principal'],
            runners:['principal'],
            readers:['principal'],
          }
        });
        expect(permissions).toEqual(['owners', 'writers', 'runners', 'readers']);
      });

      it('Should receive all but owner as permissions', () => {
        request.flush({
          body:{
            owners:['someone else'],
            writers:['principal'],
            runners:['principal'],
            readers:['principal'],
          }
        });
        expect(permissions).toEqual(['writers', 'runners', 'readers']);
      });

      it('Should receive all but writer as permissions', () => {
        request.flush({
          body:{
            owners:['principal'],
            writers:['someone else'],
            runners:['principal'],
            readers:['principal'],
          }
        });
        expect(permissions).toEqual(['owners', 'runners', 'readers']);
      });

      it('Should receive all but runner as permissions', () => {
        request.flush({
          body:{
            owners:['principal'],
            writers:['principal'],
            runners:['someone else'],
            readers:['principal'],
          }
        });
        expect(permissions).toEqual(['owners', 'writers', 'readers']);
      });

      it('Should receive all but reader as permissions', () => {
        request.flush({
          body:{
            owners:['principal'],
            writers:['principal'],
            runners:['principal'],
            readers:['someone else'],
          }
        });
        expect(permissions).toEqual(['owners', 'writers', 'runners']);
      });

      it('Should receive no permissions', () => {
        request.flush({
          body:{
            owners:[],
            writers:[],
            runners:[],
            readers:[],
          }
        });
        expect(permissions).toEqual([]);
      });
    });
  });
});
