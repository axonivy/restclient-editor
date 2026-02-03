import {
  BaseRpcClient,
  createMessageConnection,
  Emitter,
  urlBuilder,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  Event,
  RestClientActionArgs,
  RestClientClient,
  RestClientContext,
  RestClientEditorData,
  RestClientMetaRequestTypes,
  RestClientNotificationTypes,
  RestClientOnNotificationTypes,
  RestClientRequestTypes,
  RestClientSaveDataArgs,
  ValidationResult
} from '@axonivy/restclient-editor-protocol';

export class RestClientClientJsonRpc extends BaseRpcClient implements RestClientClient {
  protected onDataChangedEmitter = new Emitter<void>();
  protected onValidationChangedEmitter = new Emitter<void>();
  onDataChanged: Event<void> = this.onDataChangedEmitter.event;
  onValidationChanged: Event<void> = this.onValidationChangedEmitter.event;

  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.toDispose.push(this.onValidationChangedEmitter);
    this.onNotification('dataChanged', data => {
      this.onDataChangedEmitter.fire(data);
    });
    this.onNotification('validationChanged', data => {
      this.onValidationChangedEmitter.fire(data);
    });
  }

  initialize(context: RestClientContext): Promise<void> {
    return this.sendRequest('initialize', { ...context });
  }

  data(context: RestClientContext): Promise<RestClientEditorData> {
    return this.sendRequest('data', { ...context });
  }

  saveData(saveData: RestClientSaveDataArgs): Promise<EditorFileContent> {
    return this.sendRequest('saveData', { ...saveData });
  }

  validate(context: RestClientContext): Promise<ValidationResult[]> {
    return this.sendRequest('validate', { ...context });
  }

  meta<TMeta extends keyof RestClientMetaRequestTypes>(
    path: TMeta,
    args: RestClientMetaRequestTypes[TMeta][0]
  ): Promise<RestClientMetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  action(action: RestClientActionArgs): void {
    void this.sendNotification('action', action);
  }

  sendRequest<K extends keyof RestClientRequestTypes>(command: K, args?: RestClientRequestTypes[K][0]): Promise<RestClientRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  sendNotification<K extends keyof RestClientNotificationTypes>(command: K, args: RestClientNotificationTypes[K]): Promise<void> {
    return this.connection.sendNotification(command, args);
  }

  onNotification<K extends keyof RestClientOnNotificationTypes>(kind: K, listener: (args: RestClientOnNotificationTypes[K]) => unknown): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-restclient-lsp');
  }

  public static async startClient(connection: Connection): Promise<RestClientClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<RestClientClientJsonRpc> {
    const client = new RestClientClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
