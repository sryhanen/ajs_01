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
import {MessageDTO} from '../messageDTO';
import {MessageWithAuthenticationInfo} from './messageWithAuthenticationInfo';
import {MessageWithAuthenticationInfoImpl} from './messageWithAuthenticationInfoImpl';
import {Authentication} from '../../../../shared/objects/security/authentication';
import {AuthenticationStub} from '../../../../shared/objects/security/authenticationStub';
import {Ticket} from '../../../../shared/types/securityTicket';
import {AuthenticationImpl} from '../../../../shared/objects/security/authenticationImpl';

describe('DecoratedMessage', () => {
  const messageId = 'messageId';
  let authentication: Authentication;
  let data: MessageDTO<unknown>;
  let messageWithAuthenticationInfo: MessageWithAuthenticationInfo;

  describe('Birth', () => {
    it('Should be initialized', () => {
      messageWithAuthenticationInfo = new MessageWithAuthenticationInfoImpl(data, authentication, messageId);
      expect(messageWithAuthenticationInfo).toBeInstanceOf(MessageWithAuthenticationInfoImpl);
    });
  });

  describe('Decoration with authentication info', () => {
    it('Decorates with stub authentication', () => {
      data = {
        op:'',
        data:{}
      };
      const expectedMessage = {
        ...data,
        ticket:'',
        principal:'',
        roles:'',
        msgId:messageId
      };
      authentication = new AuthenticationStub();
      messageWithAuthenticationInfo = new MessageWithAuthenticationInfoImpl(data, authentication, messageId);
      expect(messageWithAuthenticationInfo.print()).toEqual(expectedMessage);
    });

    it('Decorates with real authentication', () => {
      const ticket: Ticket ={
        principal: 'principal',
        roles: '[role1,role2]',
        ticket: 'ticket'
      };
      data = {
        op:'',
        data:{}
      };
      const expectedMessage = {
        ...data,
        ...ticket,
        msgId:messageId
      };
      authentication = new AuthenticationImpl(ticket);
      messageWithAuthenticationInfo = new MessageWithAuthenticationInfoImpl(data, authentication, messageId);
      expect(messageWithAuthenticationInfo.print()).toEqual(expectedMessage);
    });
  });
});
