/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  EditorFileContent,
  JavaType,
  RestClientContext,
  RestClientEditorData,
  RestClientSaveDataArgs,
  RestPropertyMeta,
  ValidationResult
} from './data/restclient';

export interface RestClientActionArgs {
  actionId: 'openUrl';
  context: RestClientContext;
  payload: string;
}

export interface RestClientMetaRequestTypes {
  'meta/properties/all': [void, Array<RestPropertyMeta>];
  'meta/features/all': [RestClientContext, Array<JavaType>];
}

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
