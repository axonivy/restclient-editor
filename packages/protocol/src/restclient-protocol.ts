/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  EditorFileContent,
  RestClientContext,
  RestClientEditorData,
  RestClientSaveDataArgs,
  ValidationResult
} from './data/restclient';

export interface RestClientActionArgs {
  actionId: 'openUrl';
  context: RestClientContext;
  payload: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RestClientMetaRequestTypes {}

export interface RestClientRequestTypes extends RestClientMetaRequestTypes {
  initialize: [RestClientContext, void];
  data: [RestClientContext, RestClientEditorData];
  saveData: [RestClientSaveDataArgs, EditorFileContent];

  validate: [RestClientContext, ValidationResult[]];
}

export interface RestClientNotificationTypes {
  action: RestClientActionArgs;
}

export interface RestClientOnNotificationTypes {
  dataChanged: void;
  validationChanged: void;
}
