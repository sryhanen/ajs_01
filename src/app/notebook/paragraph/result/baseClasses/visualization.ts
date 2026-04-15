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

/**
 * Base class for visualization.
 */
export default class Visualization {
  protected targetEl;
  protected config;
  private _dirty= false;
  private _emitter;

  constructor(targetEl, config) {
    this.targetEl = targetEl;
    this.config = config;
    this._emitter = () => {};
  }

  /**
   * Method will be invoked when data or configuration changed.
   * @abstract
   */
  render(tableData) {
    // override this
    throw new TypeError('Visualization.render() should be overrided');
  }

  /**
   * Refresh visualization.
   */
  refresh() {
    // override this
    console.warn('A chart is missing refresh function, it might not work preperly');
  }

  /**
   * Method will be invoked when visualization need to be destroyed.
   * Don't need to destroy this.targetEl.
   */
  destroy() {
    // override this
  }

  /**
   * Set new config.
   */
  setConfig(config) {
    this.config = config;
    this._dirty = true;
    this.refresh();
  }

  /**
   * Emit config. config will sent to server and saved.
   */
  emitConfig(config) {
    this._emitter(config);
  }

}
