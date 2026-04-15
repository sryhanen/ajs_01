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

import {ParagraphStatus} from '../notebook/paragraph/paragraph.status';
import _ from 'lodash';

angular.module('zeppelinWebApp.interpreter', []).controller('InterpreterCtrl', ['$rootScope', '$scope', '$http', 'baseUrlSrv', 'ToasterService', '$timeout', '$route', 'InterpreterPageService', 'InterpreterSettingService', InterpreterCtrl]);

function InterpreterCtrl($rootScope,
                         $scope,
                         $http,
                         baseUrlSrv,
                         ToasterService,
                         $timeout,
                         $route,
                         InterpreterPageService,
                         InterpreterSettingService,
                         ) {

  const self = this;
  const interpreterSettingsTmp = [];
  $scope.interpreterSettings = [];
  $scope.visibleSetting = -1;
  $scope.saving = false;
  $scope.waiting = false;
  $scope.availableInterpreters = {};
  $scope.showAddNewSetting = false;
  $scope.searchInterpreter = '';
  $scope._ = _;
  $scope.interpreterPropertyTypes = [];
  ToasterService.dismissAll();

  $scope.openPermissions = function() {
    $scope.showInterpreterAuth = true;
  };

  $scope.closePermissions = function() {
    $scope.showInterpreterAuth = false;
  };

  $scope.parseNumber = function (prop) {
    let num = 0;
    try {
      num = parseInt(prop);
    }catch (e) {
      console.warn(`Failed to parse number ${e}`);
      ToasterService.addToast(`Using default value ${num}. Couldn't parse given input: ${prop}`);
    }
    return num;
  };

  const getSelectJson = function() {
    const selectJson = {
      tags: true,
      minimumInputLength: 3,
      multiple: true,
      tokenSeparators: [',', ' '],
      ajax: {
        url: function(params) {
          if (params.term) {
            return `${baseUrlSrv.getRestApiBase()}/security/userlist/${params.term}`;
          }
        },
        delay: 250,
        processResults: function(data, params) {
          const results = [];

          if (data.body.users.length !== 0) {
            const users = [];
            for (let len = 0; len < data.body.users.length; len++) {
              users.push({
                'id': data.body.users[len],
                'text': data.body.users[len],
              });
            }
            results.push({
              'text': 'Users :',
              'children': users,
            });
          }
          if (data.body.roles.length !== 0) {
            const roles = [];
            for (let len = 0; len < data.body.roles.length; len++) {
              roles.push({
                'id': data.body.roles[len],
                'text': data.body.roles[len],
              });
            }
            results.push({
              'text': 'Roles :',
              'children': roles,
            });
          }
          return {
            results: results,
            pagination: {
              more: false,
            },
          };
        },
        cache: false,
      },
    };
    return selectJson;
  };

  $scope.togglePermissions = function(intpName) {
    angular.element(`#${intpName}Owners`).select2(getSelectJson());
    if ($scope.showInterpreterAuth) {
      $scope.closePermissions();
    } else {
      $scope.openPermissions();
    }
  };

  $scope.$on('ngRenderFinished', function(event, data) {
    for (let setting = 0; setting < $scope.interpreterSettings.length; setting++) {
      angular.element(`#${$scope.interpreterSettings[setting].name}Owners`).select2(getSelectJson());
    }
  });

  const getInterpreterSettings = function() {
    $http.get(`${baseUrlSrv.getRestApiBase()}/interpreter/setting`)
      .then(function(res) {
        $scope.interpreterSettings = res.data.body;
        checkDownloadingDependencies();
      }).catch(function(res) {
        if (res.status === 401) {
          ToasterService.addToast('You don\'t have permission on this page', 'Danger');
          setTimeout(function() {
            window.location = baseUrlSrv.getBase();
          }, 3000);
        }
        console.error('Error %o %o', res.status, res.data ? res.data.message : '');
      });
  };

  const checkDownloadingDependencies = function() {
    let isDownloading = false;
    for (let index = 0; index < $scope.interpreterSettings.length; index++) {
      const setting = $scope.interpreterSettings[index];
      if (setting.status === 'DOWNLOADING_DEPENDENCIES') {
        isDownloading = true;
      }

      if (setting.status === ParagraphStatus.ERROR || setting.errorReason) {
        const content = `Error setting properties for interpreter '${setting.group}.${setting.name}': ${setting.errorReason}`;
        ToasterService.addToast(content, 'Danger');
      }
    }

    if (isDownloading) {
      $timeout(function() {
        if ($route.current.$$route.originalPath === '/interpreter') {
          getInterpreterSettings();
        }
      }, 2000);
    }
  };

  const getAvailableInterpreters = function() {
    $http.get(`${baseUrlSrv.getRestApiBase()}/interpreter`).then(function(res) {
      $scope.availableInterpreters = res.data.body;
    }).catch(function(res) {
      console.error('Error %o %o', res.status, res.data ? res.data.message : '');
    });
  };

  const getAvailableInterpreterPropertyWidgets = function() {
    $http.get(`${baseUrlSrv.getRestApiBase()}/interpreter/property/types`)
      .then(function(res) {
        $scope.interpreterPropertyTypes = res.data.body;
        $scope.newInterpreterSetting.propertyType = $scope.interpreterPropertyTypes[0];
      }).catch(function(res) {
        console.error('Error %o %o', res.status, res.data ? res.data.message : '');
      });
  };

  const emptyNewProperty = function(object) {
    angular.extend(object, {propertyValue: '', propertyKey: '', propertyType: $scope.interpreterPropertyTypes[0], description: ''});
  };

  const emptyNewDependency = function(object) {
    angular.extend(object, {depArtifact: '', depExclude: ''});
  };

  const removeTMPSettings = function(index) {
    interpreterSettingsTmp.splice(index, 1);
  };

  $scope.copyOriginInterpreterSettingProperties = function(settingId) {
    const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
    interpreterSettingsTmp[index] = angular.copy($scope.interpreterSettings[index]);
  };

  $scope.setPerNoteOption = function(settingId, sessionOption) {
    let option;
    if (settingId === undefined) {
      option = $scope.newInterpreterSetting.option;
    } else {
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      const setting = $scope.interpreterSettings[index];
      option = setting.option;
    }

    if (sessionOption === 'isolated') {
      option.perNote = sessionOption;
      option.session = false;
      option.process = true;
    } else if (sessionOption === 'scoped') {
      option.perNote = sessionOption;
      option.session = true;
      option.process = false;
    } else {
      option.perNote = 'shared';
      option.session = false;
      option.process = false;
    }
  };

  $scope.defaultValueByType = function(setting) {
    if (setting.propertyType === 'checkbox') {
      setting.propertyValue = false;
      return;
    }

    setting.propertyValue = '';
  };

  $scope.setPerUserOption = function(settingId, sessionOption) {
    let option;
    if (settingId === undefined) {
      option = $scope.newInterpreterSetting.option;
    } else {
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      const setting = $scope.interpreterSettings[index];
      option = setting.option;
    }

    if (sessionOption === 'isolated') {
      option.perUser = sessionOption;
      option.session = false;
      option.process = true;
    } else if (sessionOption === 'scoped') {
      option.perUser = sessionOption;
      option.session = true;
      option.process = false;
    } else {
      option.perUser = 'shared';
      option.session = false;
      option.process = false;
    }
  };

  $scope.getPerNoteOption = function(settingId) {
    let option;
    if (settingId === undefined) {
      option = $scope.newInterpreterSetting.option;
    } else {
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      const setting = $scope.interpreterSettings[index];
      option = setting.option;
    }

    if (option.perNote === 'scoped') {
      return 'scoped';
    } else if (option.perNote === 'isolated') {
      return 'isolated';
    } else {
      return 'shared';
    }
  };

  $scope.getPerUserOption = function(settingId) {
    let option;
    if (settingId === undefined) {
      option = $scope.newInterpreterSetting.option;
    } else {
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      const setting = $scope.interpreterSettings[index];
      option = setting.option;
    }

    if (option.perUser === 'scoped') {
      return 'scoped';
    } else if (option.perUser === 'isolated') {
      return 'isolated';
    } else {
      return 'shared';
    }
  };

  $scope.getInterpreterRunningOption = function(settingId) {
    const sharedModeName = 'shared';

    const globallyModeName = 'Globally';
    const perNoteModeName = 'Per Note';
    const perUserModeName = 'Per User';

    let option;
    if (settingId === undefined) {
      option = $scope.newInterpreterSetting.option;
    } else {
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      const setting = $scope.interpreterSettings[index];
      option = setting.option;
    }

    const perNote = option.perNote;
    const perUser = option.perUser;

    // Globally == shared_perNote + shared_perUser
    if (perNote === sharedModeName && perUser === sharedModeName) {
      return globallyModeName;
    }

    if ($rootScope.ticket.ticket === 'anonymous' && $rootScope.ticket.roles === '[]') {
      if (perNote !== undefined && typeof perNote === 'string' && perNote !== '') {
        return perNoteModeName;
      }
    } else if ($rootScope.ticket.ticket !== 'anonymous') {
      if (perNote !== undefined && typeof perNote === 'string' && perNote !== '') {
        if (perUser !== undefined && typeof perUser === 'string' && perUser !== '') {
          return perUserModeName;
        }
        return perNoteModeName;
      }
    }

    option.perNote = sharedModeName;
    option.perUser = sharedModeName;
    return globallyModeName;
  };

  $scope.setInterpreterRunningOption = function(settingId, isPerNoteMode, isPerUserMode) {
    let option;
    if (settingId === undefined) {
      option = $scope.newInterpreterSetting.option;
    } else {
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      const setting = $scope.interpreterSettings[index];
      option = setting.option;
    }
    option.perNote = isPerNoteMode;
    option.perUser = isPerUserMode;
  };

  $scope.updateInterpreterSetting = function(settingId) {
    InterpreterPageService.openModalUpdate({
      callback: function() {
          const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
          const setting = $scope.interpreterSettings[index];
          if (setting.propertyKey !== '' || setting.propertyKey) {
            $scope.addNewInterpreterProperty(settingId);
          }
          if (setting.depArtifact !== '' || setting.depArtifact) {
            $scope.addNewInterpreterDependency(settingId);
          }
          // add missing field of option
          if (!setting.option) {
            setting.option = {};
          }
          if (setting.option.isExistingProcess === undefined) {
            setting.option.isExistingProcess = false;
          }
          if (setting.option.setPermission === undefined) {
            setting.option.setPermission = false;
          }
          if (setting.option.isUserImpersonate === undefined) {
            setting.option.isUserImpersonate = false;
          }
          if (!($scope.getInterpreterRunningOption(settingId) === 'Per User' &&
            $scope.getPerUserOption(settingId) === 'isolated')) {
            setting.option.isUserImpersonate = false;
          }
          if (setting.option.remote === undefined) {
            // remote always true for now
            setting.option.remote = true;
          }
          setting.option.owners = angular.element(`#${setting.name}Owners`).val();
          for (let i = 0; i < setting.option.owners.length; i++) {
            setting.option.owners[i] = setting.option.owners[i].trim();
          }

          const request = {
            option: angular.copy(setting.option),
            properties: angular.copy(setting.properties),
            dependencies: angular.copy(setting.dependencies),
          };

          /* this should be refactored later with shared services
          thisConfirm.$modalFooter.find('button').addClass('disabled');
          thisConfirm.$modalFooter.find('button:contains("OK")')
            .html('<i class="fa fa-circle-o-notch fa-spin"></i> Saving Setting');
          */
          $scope.waiting = true;
          $http.put(`${baseUrlSrv.getRestApiBase()}/interpreter/setting/${settingId}`, request)
            .then(function(res) {
              $scope.interpreterSettings[index] = res.data.body;
              removeTMPSettings(index);
              checkDownloadingDependencies();
              $scope.waiting = false;
              $scope.visibleSetting = -1;
            })
            .catch(function(res) {
              $scope.waiting = false;
              const message = res.data ? res.data.message : 'Could not connect to server.';
              console.error('Error %o %o', res.status, message);
              ToasterService.addToast(message, 'Danger');
              $scope.visibleSetting = -1;
            });
          return false;
      },
      deny: function (){
        $scope.visibleSetting = -1;
      }
    });
  };

  $scope.resetInterpreterSetting = function(settingId) {
    const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
    $scope.visibleSetting = -1;
    // Set the old settings back
    $scope.interpreterSettings[index] = angular.copy(interpreterSettingsTmp[index]);
    removeTMPSettings(index);
  };

  $scope.removeInterpreterSetting = function(settingId) {
    InterpreterPageService.openModal({
      id: 'deleteInterpreterModal',
      callback: function() {
          $http.delete(`${baseUrlSrv.getRestApiBase()}/interpreter/setting/${settingId}`)
            .then(function(res) {
              const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
              $scope.interpreterSettings.splice(index, 1);
            }).catch(function(res) {
              console.error('Error %o %o', res.status, res.data ? res.data.message : '');
            });
      },
    });
  };

  $scope.newInterpreterGroupChange = function() {
    const el = _.map(_.filter($scope.availableInterpreters, {'name': $scope.newInterpreterSetting.group}),
      'properties');
    const properties = {};
    for (let i = 0; i < el.length; i++) {
      const intpInfo = el[i];
      for (const key in intpInfo) {
        if (Object.prototype.hasOwnProperty.call(intpInfo, key)) {
          properties[key] = {
            value: intpInfo[key].defaultValue,
            description: intpInfo[key].description,
            type: intpInfo[key].type,
          };
        }
      }
    }
    $scope.newInterpreterSetting.properties = properties;
  };

  $scope.restartInterpreterSetting = function(settingId) {
    InterpreterPageService.openModal({
      id: 'restartInterpreterPageModal',
      callback: function() {
          $http.put(`${baseUrlSrv.getRestApiBase()}/interpreter/setting/restart/${settingId}`)
            .then(function(res) {
              const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
              $scope.interpreterSettings[index] = res.data.body;
              ToasterService.addToast('Interpreter stopped. Will be lazily started on next run.', 'Info');
            }).catch(function(res) {
              const errorMsg = res.data !== null ? res.data.message : 'Could not connect to server.';
              console.error('Error %o %o', res.status, errorMsg);
            ToasterService.addToast(errorMsg, 'Danger');
            });
      },
    });
  };

  $scope.addNewInterpreterSetting = function() {
    // user input validation on interpreter creation
    if (!$scope.newInterpreterSetting.name ||
        !$scope.newInterpreterSetting.name.trim() ||
        !$scope.newInterpreterSetting.name.match(/^[-_a-zA-Z0-9]+$/g)) {
      InterpreterPageService.openModal({
        id: 'interpreterNameModal',
        callback: function (){}
      });
      return;
    }

    if (!$scope.newInterpreterSetting.group) {
      InterpreterPageService.openModal({
        id: 'interpreterGroupModal',
        callback: function (){}
      });
      return;
    }

    if (_.findIndex($scope.interpreterSettings, {'name': $scope.newInterpreterSetting.name}) >= 0) {
      InterpreterPageService.openModal({
        id: 'interpreterNameExistsModal',
        callback: function (){}
      });
      return;
    }

    const newSetting = $scope.newInterpreterSetting;
    if (newSetting.propertyKey !== '' || newSetting.propertyKey) {
      $scope.addNewInterpreterProperty();
    }
    if (newSetting.depArtifact !== '' || newSetting.depArtifact) {
      $scope.addNewInterpreterDependency();
    }
    if (newSetting.option.setPermission === undefined) {
      newSetting.option.setPermission = false;
    }
    newSetting.option.owners = angular.element('#newInterpreterOwners').val();

    const request = angular.copy($scope.newInterpreterSetting);

    // Change properties to proper request format
    const newProperties = {};

    for (const p in newSetting.properties) {
      if (Object.prototype.hasOwnProperty.call(newSetting.properties, p)) {
        newProperties[p] = {
          value: newSetting.properties[p].value,
          type: newSetting.properties[p].type,
          description: newSetting.properties[p].description,
          name: p,
        };
      }
    }

    request.properties = newProperties;
    $scope.saving = true;
    $http.post(`${baseUrlSrv.getRestApiBase()}/interpreter/setting`, request)
      .then(function(res) {
        $scope.resetNewInterpreterSetting();
        getInterpreterSettings();
        $scope.showAddNewSetting = false;
        checkDownloadingDependencies();
        $scope.saving = false;
      }).catch(function(res) {
        const errorMsg = res.data ? res.data.message : 'Could not connect to server.';
        console.error('Error %o %o', res.status, errorMsg);
        $scope.saving = false;
        ToasterService.addToast(errorMsg, 'Danger');
      });
  };

  $scope.cancelInterpreterSetting = function() {
    $scope.showAddNewSetting = false;
    $scope.resetNewInterpreterSetting();
    self.closeModal('interpreterModal');
  };

  self.closeModal = function (id) {
    const myModalEl = document.getElementById(id);
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
  };

  $scope.close = function (id) {
    self.closeModal(id);
  };

  $scope.openModal = function (id) {
    const myModalEl = document.getElementById(id);
    let modal = bootstrap.Modal.getInstance(myModalEl);
    if(!modal) {
      modal = new bootstrap.Modal(myModalEl);
    }
    modal.show();
  };

  $scope.resetNewInterpreterSetting = function() {
    $scope.newInterpreterSetting = {
      name: undefined,
      group: undefined,
      properties: {},
      dependencies: [],
      option: {
        remote: true,
        isExistingProcess: false,
        setPermission: false,
        session: false,
        process: false,

      },
    };
    emptyNewProperty($scope.newInterpreterSetting);
  };

  $scope.removeInterpreterProperty = function(key, settingId) {
    if (settingId === undefined) {
      delete $scope.newInterpreterSetting.properties[key];
    } else {
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      delete $scope.interpreterSettings[index].properties[key];
    }
  };

  $scope.removeInterpreterDependency = function(artifact, settingId) {
    if (settingId === undefined) {
      $scope.newInterpreterSetting.dependencies = _.reject($scope.newInterpreterSetting.dependencies,
        function(el) {
          return el.groupArtifactVersion === artifact;
        });
    } else {
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      $scope.interpreterSettings[index].dependencies = _.reject($scope.interpreterSettings[index].dependencies,
        function(el) {
          return el.groupArtifactVersion === artifact;
        });
    }
  };

  $scope.addNewInterpreterProperty = function(settingId) {
    if (settingId === undefined) {
      // Add new property from create form
      if (!$scope.newInterpreterSetting.propertyKey || $scope.newInterpreterSetting.propertyKey === '') {
        return;
      }
      $scope.newInterpreterSetting.properties[$scope.newInterpreterSetting.propertyKey] = {
        value: $scope.newInterpreterSetting.propertyValue,
        type: $scope.newInterpreterSetting.propertyType,
        description: $scope.newInterpreterSetting.description,
      };
      emptyNewProperty($scope.newInterpreterSetting);
    } else {
      // Add new property from edit form
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      const setting = $scope.interpreterSettings[index];

      if (!setting.propertyKey || setting.propertyKey === '') {
        return;
      }

      setting.properties[setting.propertyKey] = {name: setting.propertyKey, value: setting.propertyValue,
        type: setting.propertyType, description: setting.description};

      emptyNewProperty(setting);
    }
  };

  $scope.addNewInterpreterDependency = function(settingId) {
    if (settingId === undefined) {
      // Add new dependency from create form
      if (!$scope.newInterpreterSetting.depArtifact || $scope.newInterpreterSetting.depArtifact === '') {
        return;
      }

      // overwrite if artifact already exists
      const newSetting = $scope.newInterpreterSetting;
      for (const d in newSetting.dependencies) {
        if (newSetting.dependencies[d].groupArtifactVersion === newSetting.depArtifact) {
          newSetting.dependencies[d] = {
            'groupArtifactVersion': newSetting.depArtifact,
            'exclusions': newSetting.depExclude,
          };
          newSetting.dependencies.splice(d, 1);
        }
      }

      newSetting.dependencies.push({
        'groupArtifactVersion': newSetting.depArtifact,
        'exclusions': newSetting.depExclude === '' ? [] : newSetting.depExclude,
      });
      emptyNewDependency(newSetting);
    } else {
      // Add new dependency from edit form
      const index = _.findIndex($scope.interpreterSettings, {'id': settingId});
      const setting = $scope.interpreterSettings[index];
      if (!setting.depArtifact || setting.depArtifact === '') {
        return;
      }

      // overwrite if artifact already exists
      for (const dep in setting.dependencies) {
        if (setting.dependencies[dep].groupArtifactVersion === setting.depArtifact) {
          setting.dependencies[dep] = {
            'groupArtifactVersion': setting.depArtifact,
            'exclusions': setting.depExclude,
          };
          setting.dependencies.splice(dep, 1);
        }
      }

      setting.dependencies.push({
        'groupArtifactVersion': setting.depArtifact,
        'exclusions': setting.depExclude === '' ? [] : setting.depExclude,
      });
      emptyNewDependency(setting);
    }
  };

  $scope.showErrorMessage = function(setting) {
    ToasterService.addToast(`Error downloading dependencies: ${_.escape(setting.errorReason)}`, 'Danger');
  };

  const init = function() {
    getAvailableInterpreterPropertyWidgets();

    $scope.resetNewInterpreterSetting();

    getInterpreterSettings();
    getAvailableInterpreters();
  };

  $scope.getInterpreterBindingModeDocsLink = function() {
    const currentVersion = $rootScope.zeppelinVersion;
    return `https://docs.teragrep.com/doc_01/${currentVersion}/administrator%20guide/interpreters.html`;
  };

  init();
}
