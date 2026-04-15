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


export default class BaseUrlService {

  getPort() {
    let port = Number(location.port);
    if (!port) {
      port = 80;
      if (location.protocol === 'https:') {
        port = 443;
      }
    }
    return port;
  };

  skipTrailingSlash(path) {
    return path.replace(/\/$/, '');
  };

  getWebsocketUrl() {
    const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const port = process.env.WEBSOCKET_PORT || this.getPort();
    return `${wsProtocol}//${location.hostname}:${port}${this.skipTrailingSlash(location.pathname)}/ws`;
  };

  getBase() {
    return `${location.protocol}//${location.hostname}:${this.getPort()}${location.pathname}`;
  };

  getRestApiBase() {
    return `${this.skipTrailingSlash(this.getBase())}/api`;
  };

}

angular.module('zeppelinWebApp.comBaseURL', []).service('baseUrlSrv', [BaseUrlService]);
