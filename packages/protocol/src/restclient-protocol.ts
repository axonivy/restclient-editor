/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  EditorFileContent,
  JavaType,
  OpenApiSpec,
  RestClientContext,
  RestClientEditorData,
  RestClientIcon,
  RestClientOpenApi,
  RestClientSaveDataArgs,
  RestPropertyMeta,
  ValidationResult
} from './data/restclient';

export interface RestClientActionArgs {
  actionId: 'openUrl';
  context: RestClientContext;
  payload: string;
}

export interface OpenApiGeneratorConfig extends RestClientOpenApi {
  context: RestClientContext;
  clientName: string;
}

export interface OpenApiGeneratorResult {
  success: boolean;
  message: string;
}

export interface RestClientMetaRequestTypes {
  'meta/properties/all': [void, Array<RestPropertyMeta>];
  'meta/features/all': [RestClientContext, Array<JavaType>];
  'meta/icons/all': [RestClientContext, Array<RestClientIcon>];
  'meta/open-api/load': [string, OpenApiSpec];
}

export interface RestClientRequestTypes extends RestClientMetaRequestTypes, RestClientVscExtensionTypes {
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

export interface RestClientVscExtensionTypes {
  'integration/generate': [OpenApiGeneratorConfig, OpenApiGeneratorResult];
  'integration/file/pick': [FilePickRequest, string | undefined];
}

export interface FilePickRequest {
  context: RestClientContext;
  fileTypes: Record<string, string[]>;
}
