/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import angular from 'angular';
import moment from 'moment';
import {ParagraphStatus} from '../../notebook/paragraph/paragraph.status';
import {getJobColorByStatus, getJobIconByStatus} from '../job-status';

import './job.html';

class JobController {
  private JobManagerService;
  private JobModalsService;
  private ToasterService;
  private note;

  constructor($http,
              JobManagerService,
              JobModalsService,
              ToasterService) {
    this.JobManagerService = JobManagerService;
    this.JobModalsService = JobModalsService;
    this.ToasterService = ToasterService;
  }

  isRunning() {
    return this.note.isRunningJob;
  }

  getParagraphs() {
    return this.note.paragraphs;
  }

  getNoteId() {
    return this.note.noteId;
  }

  getNoteName() {
    return this.note.noteName;
  }

  runJob() {
    this.JobModalsService.openModal({
      id: 'jobRunAllModal',
      callback: () => {
        const noteId = this.getNoteId();
        // if the request is handled successfully, the job page will get updated using websocket
        this.JobManagerService.sendRunJobRequest(noteId)
          .catch((response) => {
            const message = response.data && response.data.message
              ? response.data.message : 'SERVER ERROR';
            this.ToasterService.addToast(`Execution Failure${message}`, 'Danger');
          });
      },
    });
  }

  stopJob() {
    this.JobModalsService.openModal({
      id: 'jobStopAllModal',
      callback: () => {
        const noteId = this.getNoteId();
        // if the request is handled successfully, the job page will get updated using websocket
        this.JobManagerService.sendStopJobRequest(noteId)
          .catch((response) => {
            const message = response.data && response.data.message
              ? response.data.message : 'SERVER ERROR';
            this.ToasterService.addToast(`Stop Failure${message}`, 'Danger');
          });
      },
    });
  }

  lastExecuteTime() {
    const timestamp = this.note.unixTimeLastRun;
    return moment.unix(timestamp / 1000).fromNow();
  }

  getInterpreterName() {
    return typeof this.note.interpreter === 'undefined'
      ? 'interpreter is not set' : this.note.interpreter;
  }

  getJobTypeIcon() {
    const noteType = this.note.noteType;
    if (noteType === 'normal') {
      return 'fas fa-file';
    } else if (noteType === 'cron') {
      return 'fas fa-clock';
    } else {
      return 'fas fa-question';
    }
  }

  getJobColorByStatus(status) {
    return getJobColorByStatus(status);
  }

  getJobIconByStatus(status) {
    return getJobIconByStatus(status);
  }

  getClassNames() {
    const result = this.getProgress();
    let className;
    if(result>0 && result<=20) {
      className = 'w-20';
    }else if(result>20 && result<=40) {
      className = 'w-40';
    }else if(result>40 && result<=60) {
      className = 'w-60';
    }else if(result>60 && result<=80) {
      className = 'w-80';
    }else if(result>80 && result<=100) {
      className = 'w-100';
    }else {
      className = '';
    }
    if (!this.showPercentProgressBar()){
      className = 'progress-bar-striped progress-bar-animated active w-100';
    }
    return className;
  }

  getProgress() {
    const paragraphs = this.getParagraphs();
    const paragraphStatuses = paragraphs.map((p) => p.status);
    const runningOrFinishedParagraphs = paragraphStatuses.filter((status) => {
      return status === ParagraphStatus.RUNNING || status === ParagraphStatus.FINISHED;
    });

    const totalCount = paragraphStatuses.length;
    const runningCount = runningOrFinishedParagraphs.length;
    let result = Math.ceil(runningCount / totalCount * 100);
    result = isNaN(result) ? 0 : result;

    return result;
  }

  showPercentProgressBar() {
    return this.getProgress() > 0 && this.getProgress() < 100;
  }
}

export const JobComponent = {
  bindings: {
    note: '<',
  },
  templateUrl: require('./job.html'),
  controller: ['$http', 'JobManagerService', 'JobModalsService', 'ToasterService', JobController],
};

export const JobModule = angular
  .module('zeppelinWebApp.job',['zeppelinWebApp', 'zeppelinWebApp.comJob'])
  .component('job', JobComponent)
  .name;
