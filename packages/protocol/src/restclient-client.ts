import type { EditorFileContent, RestClientContext, RestClientEditorData, RestClientSaveDataArgs, ValidationResult } from './data/restclient';
import type { RestClientActionArgs, RestClientMetaRequestTypes } from './restclient-protocol';

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface RestClientClient {
  initialize(context: RestClientContext): Promise<void>;
  data(context: RestClientContext): Promise<RestClientEditorData>;
  saveData(saveData: RestClientSaveDataArgs): Promise<EditorFileContent>;

  meta<TMeta extends keyof RestClientMetaRequestTypes>(
    path: TMeta,
    args: RestClientMetaRequestTypes[TMeta][0]
  ): Promise<RestClientMetaRequestTypes[TMeta][1]>;

  validate(context: RestClientContext): Promise<ValidationResult[]>;
  action(action: RestClientActionArgs): void;

  onDataChanged: Event<void>;
  onValidationChanged: Event<void>;
}
