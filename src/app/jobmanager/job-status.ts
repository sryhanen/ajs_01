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

export const JobStatus = {
  READY: 'READY',
  FINISHED: 'FINISHED',
  ABORT: 'ABORT',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
};

export function getJobIconByStatus(jobStatus) {
  if (jobStatus === JobStatus.READY) {
    return 'far fa-circle';
  } else if (jobStatus === JobStatus.FINISHED) {
    return 'fas fa-circle';
  } else if (jobStatus === JobStatus.ABORT) {
    return 'fas fa-circle';
  } else if (jobStatus === JobStatus.ERROR) {
    return 'fas fa-circle';
  } else if (jobStatus === JobStatus.PENDING) {
    return 'fas fa-circle';
  } else if (jobStatus === JobStatus.RUNNING) {
    return 'fas fa-spinner';
  }
}

export function getJobColorByStatus(jobStatus) {
  if (jobStatus === JobStatus.READY) {
    return 'status-ready'; //'#70EDD9'
  } else if (jobStatus === JobStatus.FINISHED) {
    return 'status-finished'; //'#70EDD9'
  } else if (jobStatus === JobStatus.ABORT) {
    return 'status-abort'; //'#FDE68A'
  } else if (jobStatus === JobStatus.ERROR) {
    return 'status-error'; //'#FECACA'
  } else if (jobStatus === JobStatus.PENDING) {
    return 'status-pending'; //'#CBD5E0'
  } else if (jobStatus === JobStatus.RUNNING) {
    return 'status-running'; //'#5A4CC2'
  }
}
