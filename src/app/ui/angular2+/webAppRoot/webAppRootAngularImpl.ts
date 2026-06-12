import {WebAppRoot} from '../../../objects/webAppRoot/webAppRoot';
import {WebSocketService} from '../../../objects/webSocket/service/webSocketService';
import {NotebookCollectionAngular} from '../notebookCollection/notebookCollectionAngular';
import {NotebookCollectionAngularImpl} from '../notebookCollection/notebookCollectionAngularImpl';

export class WebAppRootAngularImpl implements WebAppRoot {
  private readonly _webAppRoot:WebAppRoot;
  private readonly _rootObject:NotebookCollectionAngular;

  constructor(webAppRoot:WebAppRoot){
    this._webAppRoot = webAppRoot;
    this._rootObject = new NotebookCollectionAngularImpl(this._webAppRoot.rootObject());
  }

  initialize(webSocketService: WebSocketService): void {
    this._webAppRoot.initialize(webSocketService);
  }

  request(data: object): void {
    this._webAppRoot.request(data);
  }

  response(data: object): void {
    this._rootObject.response(data);
  }

  rootObject(): NotebookCollectionAngular {
    return this._rootObject;
  }

  addWebAppRoot(webAppRoot: WebAppRoot) {
    this._webAppRoot.addWebAppRoot(webAppRoot);
  }
}
