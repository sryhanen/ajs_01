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
import './job/job.component';
import {JobManagerFilter} from './jobManager.filter';
import {JobManagerService} from './jobManager.service';

import {getJobIconByStatus, getJobColorByStatus} from './job-status';

angular.module('zeppelinWebApp.jobManager', ['zeppelinWebApp.comToaster','zeppelinWebApp.comBaseURL',])
  .controller('JobManagerCtrl', ['$scope', 'ToasterService', 'JobManagerFilter', 'JobManagerService', JobManagerController])
  .filter('JobManager', [JobManagerFilter])
  .service('JobManagerService', ['$http', '$rootScope', 'baseUrlSrv', 'websocketMsgSrv', JobManagerService]);

const JobDateSorter = {
  RECENTLY_UPDATED: 'Recently Updated',
  OLDEST_UPDATED: 'Oldest Updated',
};

function JobManagerController($scope,
                              ToasterService,
                              JobManagerFilter,
                              JobManagerService) {

  $scope.isFilterLoaded = false;
  $scope.jobs = [];
  $scope.sorter = {
    availableDateSorter: Object.keys(JobDateSorter).map((key) => {
      return JobDateSorter[key];
    }),
    currentDateSorter: JobDateSorter.RECENTLY_UPDATED,
  };
  $scope.filteredJobs = $scope.jobs;
  $scope.filterConfig = {
    isRunningAlwaysTop: true,
    noteNameFilterValue: '',
    interpreterFilterValue: '*',
    isSortByAsc: true,
  };

  $scope.pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    maxPageCount: 5,
  };
  ToasterService.dismissAll();
  init();

  /** functions */

  $scope.setJobDateSorter = function(dateSorter) {
    $scope.sorter.currentDateSorter = dateSorter;
  };

  $scope.getJobsInCurrentPage = function(jobs) {
    const cp = $scope.pagination.currentPage;
    const itp = $scope.pagination.itemsPerPage;
    return jobs.slice((cp - 1) * itp, cp * itp);
  };

  const asyncNotebookJobFilter = function(jobs, filterConfig) {
    return new Promise((resolve, reject) => {

      $scope.filteredJobs = JobManagerFilter(jobs, filterConfig);
      resolve($scope.filteredJobs);
    });
  };

  $scope.$watch('sorter.currentDateSorter', function() {
    $scope.filterConfig.isSortByAsc =
      $scope.sorter.currentDateSorter === JobDateSorter.OLDEST_UPDATED;
    asyncNotebookJobFilter($scope.jobs, $scope.filterConfig);
  });

  $scope.getJobIconByStatus = getJobIconByStatus;
  $scope.getJobColorByStatus = getJobColorByStatus;

  $scope.filterJobs = function(jobs, filterConfig) {
    asyncNotebookJobFilter(jobs, filterConfig)
      .then(() => {
        $scope.isFilterLoaded = true;
      })
      .catch((error) => {
        throw new Error(`Failed to search jobs from server ${error}`);
      });
  };

  $scope.filterValueToName = function(filterValue, maxStringLength) {
    if (typeof $scope.defaultInterpreters === 'undefined') {
      return;
    }

    const index = $scope.defaultInterpreters.findIndex((intp) => intp.value === filterValue);
    if (typeof $scope.defaultInterpreters[index].name !== 'undefined') {
      if (typeof maxStringLength !== 'undefined' &&
        maxStringLength > $scope.defaultInterpreters[index].name) {
        return `${$scope.defaultInterpreters[index].name.substr(0, maxStringLength - 3)}...`;
      }
      return $scope.defaultInterpreters[index].name;
    } else {
      return 'NONE';
    }
  };

  $scope.setFilterValue = function(filterValue) {
    $scope.filterConfig.interpreterFilterValue = filterValue;
    $scope.filterJobs($scope.jobs, $scope.filterConfig);
  };

  $scope.setJobs = function(jobs) {
    $scope.jobs = jobs;
    let interpreters = $scope.jobs
      .filter((j) => typeof j.interpreter !== 'undefined')
      .map((j) => j.interpreter);
    interpreters = [...new Set(interpreters)]; // remove duplicated interpreters

    $scope.defaultInterpreters = [{name: 'ALL', value: '*'}];
    for (let i = 0; i < interpreters.length; i++) {
      $scope.defaultInterpreters.push({name: interpreters[i], value: interpreters[i]});
    }
  };

  function init() {
    JobManagerService.getJobs();
    JobManagerService.subscribeSetJobs($scope, setJobsCallback);
    JobManagerService.subscribeUpdateJobs($scope, updateJobsCallback);

    $scope.$on('$destroy', function() {
      JobManagerService.disconnect();
    });
  }

  /*
   ** $scope.$on functions below
   */

  function setJobsCallback(event, response) {
    const jobs = response.jobs;
    $scope.setJobs(jobs);
    $scope.filterJobs($scope.jobs, $scope.filterConfig);
  }

  function updateJobsCallback(event, response) {
    const jobs = $scope.jobs;
    const jobByNoteId = jobs.reduce((acc, j) => {
      const noteId = j.noteId;
      acc[noteId] = j;
      return acc;
    }, {});

    const updatedJobs = response.jobs;
    updatedJobs.map((updatedJob) => {
      if (typeof jobByNoteId[updatedJob.noteId] === 'undefined') {
        const newItem = angular.copy(updatedJob);
        jobs.push(newItem);
        jobByNoteId[updatedJob.noteId] = newItem;
      } else {
        const job = jobByNoteId[updatedJob.noteId];

        if (updatedJob.isRemoved === true) {
          delete jobByNoteId[updatedJob.noteId];
          const removeIndex = jobs.findIndex((j) => j.noteId === updatedJob.noteId);
          if (removeIndex) {
            jobs.splice(removeIndex, 1);
          }
        } else {
          // update the job
          job.isRunningJob = updatedJob.isRunningJob;
          job.noteName = updatedJob.noteName;
          job.noteType = updatedJob.noteType;
          job.interpreter = updatedJob.interpreter;
          job.unixTimeLastRun = updatedJob.unixTimeLastRun;
          job.paragraphs = updatedJob.paragraphs;
        }
      }
    });
    $scope.filterJobs(jobs, $scope.filterConfig);
  }
}
