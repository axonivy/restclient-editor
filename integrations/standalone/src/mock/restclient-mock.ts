import { Emitter } from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  RestClientActionArgs,
  RestClientClient,
  RestClientEditorData,
  RestClientMetaRequestTypes,
  RestClientSaveDataArgs,
  ValidationResult
} from '@axonivy/restclient-editor-protocol';
import { data } from './data-mock';
import { META_FEATURES, META_PROPS } from './meta.mock';
import { validateMock } from './validation-mock';

export class RestClientMock implements RestClientClient {
  private restclientData: RestClientEditorData;
  constructor() {
    this.restclientData = {
      context: { app: 'mockApp', pmv: 'mockPmv', file: 'rest-clients.yaml' },
      data: data,
      helpUrl: 'https://dev.axonivy.com',
      readonly: false
    };
  }

  protected onValidationChangedEmitter = new Emitter<void>();
  onValidationChanged = this.onValidationChangedEmitter.event;
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged = this.onDataChangedEmitter.event;

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  data(): Promise<RestClientEditorData> {
    return Promise.resolve(this.restclientData);
  }

  saveData(saveData: RestClientSaveDataArgs): Promise<EditorFileContent> {
    this.restclientData.data = saveData.data;
    return Promise.resolve({ content: '' });
  }

  validate(): Promise<ValidationResult[]> {
    return Promise.resolve(validateMock(this.restclientData.data));
  }

  meta<TMeta extends keyof RestClientMetaRequestTypes>(
    path: TMeta,
    args: RestClientMetaRequestTypes[TMeta][0]
  ): Promise<RestClientMetaRequestTypes[TMeta][1]> {
    console.log('Meta:', args);
    switch (path) {
      case 'meta/properties/all':
        return Promise.resolve(META_PROPS);
      case 'meta/features/all':
        return Promise.resolve(META_FEATURES);
      default:
        throw Error('mock meta path not programmed');
    }
  }

  action(action: RestClientActionArgs): void {
    console.log('action', JSON.stringify(action));
  }
}
