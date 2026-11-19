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
import {Execution} from './execution';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../../rendering/renderNode/renderNode';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';
import {RenderNodeImpl} from '../../rendering/renderNode/renderNodeImpl';
import {Requestable} from '../../channel/requestable';
import {WebSocketPayload} from '../../webSocket/webSocketPayload/webSocketPayload';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import {WebSocketResponseImpl} from '../../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../webSocket/webSocketPayload/webSocketPayloadImpl';
dayjs.extend(relativeTime);
dayjs.extend(duration);

export class ExecutionImpl implements Execution {
  private readonly _requestable: Requestable;
  private readonly _startExecutionView:RenderNode;
  private readonly _cancelExecutionView:RenderNode;
  private readonly _executorView:Signal<RenderNode>;
  private readonly _executionStatusView:RenderNode;
  private readonly _executionIsOngoing:Signal<boolean>;
  private readonly _timeInfoText:WritableSignal<string>;
  private readonly _executionStatus:WritableSignal<string>;
  private readonly _toggler:RenderNode;
  private readonly _executionIsEnabled:WritableSignal<boolean>;

  constructor(requestable: Requestable, paragraphState:WebSocketPayload) {
    this._requestable = requestable;
    this._executionIsEnabled = signal(true);
    this._startExecutionView = new RenderNodeImpl(RegisteredComponents.START_EXECUTION_VIEW,
      computed(() => ({
        startExecutionCallback:() => this.startExecution(),
        disable:!this._executionIsEnabled()
      })));
    this._cancelExecutionView = new RenderNodeImpl(RegisteredComponents.CANCEL_EXECUTION_VIEW,
      computed(() => ({
        cancelExecutionCallback:() => this.cancelExecution()
      })));
    const status = paragraphState.stringProperty('status');
    this._executionStatus = signal(status);
    this._executionIsOngoing = computed(() => this.executionIsOnGoing(this._executionStatus()));
    this._executorView = computed(() => this._executionIsOngoing() ? this._cancelExecutionView : this._startExecutionView);
    this._timeInfoText = signal(this.initializedTimeInfoText(paragraphState, status));
    this._executionStatusView = new RenderNodeImpl(RegisteredComponents.EXECUTION_STATUS_VIEW, computed(() => ({
      executionIsOngoing:this._executionIsOngoing(),
      timeInfoText:this._timeInfoText(),
      executionStatus: this._executionStatus(),
    })));
    this._toggler = new RenderNodeImpl(RegisteredComponents.TOGGLER_VIEW, computed(() => ({
      isDisabled: !this._executionIsEnabled(),
      enableCallback: () => this.enableExecution(),
      disableCallback: () => this.disableExecution()
    })));
  }

  executionStatus(): RenderNode {
    return this._executionStatusView;
  }

  executor(): Signal<RenderNode> {
    return this._executorView;
  }

  executionIsOngoing(): Signal<boolean> {
    return this._executionIsOngoing;
  }

  toggler(): RenderNode {
    return this._toggler;
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'EXECUTION_STATUS'){
      const status = webSocketResponse.dataAsWebSocketPayload().stringProperty('status');
      this._executionStatus.set(status);
      const startDate = webSocketResponse.dataAsWebSocketPayload().stringProperty('startDate');
      if(this._executionIsOngoing()){
        this._timeInfoText.set(this.calculateElapsedTime(startDate));
      }
      else{
        const endDate = webSocketResponse.dataAsWebSocketPayload().stringProperty('endDate');
        const user = webSocketResponse.dataAsWebSocketPayload().stringProperty('user');
        this._timeInfoText.set(this.calculateExecutionTime(startDate, endDate, user));
      }
    }
    else if(webSocketResponse.operation() === 'EXECUTION_CONFIG'){
      this._executionIsEnabled.set(webSocketResponse.dataAsWebSocketPayload().booleanProperty('enabled'));
    }
  }

  private executionIsOnGoing(status:string): boolean {
    return status === 'RUNNING' || status === 'PENDING';
  }

  private startExecution():void {
    this._requestable.request({
      op:'START_EXECUTION',
      data:{}
    });
  }

  private cancelExecution():void {
    this._requestable.request({
      op:'CANCEL_EXECUTION',
      data:{}
    });
  }

  private calculateElapsedTime(startDate:string):string{
    return `Started ${dayjs(startDate).fromNow()}`;
  }

  private calculateExecutionTime(startDate:string, endDate:string, user:string):string{
    const diffMs = dayjs(endDate).diff(dayjs(startDate));
    const duration = dayjs.duration(diffMs).humanize();
    const formattedEndDate = dayjs(endDate).format('MMMM DD YYYY, h:mm:ss A');
    return `Took ${duration}. Last updated by ${user} at ${formattedEndDate}`;
  }

  private initializedTimeInfoText(paragraphState:WebSocketPayload, status:string):string{
    let timeInfoText:string;
    const startDate = paragraphState.stringProperty('dateStarted');
    if(status === 'RUNNING' || status === 'PENDING') {
      timeInfoText = this.calculateElapsedTime(startDate);
    }
    else{
      const endDate = paragraphState.stringProperty('dateFinished');
      const user = paragraphState.stringProperty('user');
      timeInfoText = this.calculateExecutionTime(startDate, endDate, user);
    }
    return timeInfoText;
  }

  private enableExecution():void{
    this._requestable.request({
      op:'EXECUTION_CONFIG',
      data:{
        enabled:true
      }
    });
    this._executionIsEnabled.set(true);
  }

  private disableExecution():void{
    this._requestable.request({
      op:'EXECUTION_CONFIG',
      data:{
        enabled:false
      }
    });
    this._executionIsEnabled.set(false);
  }
}
