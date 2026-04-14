import type { RestClientClient } from '@axonivy/restclient-editor-protocol';
import type { ReactNode } from 'react';
import { createContext, use } from 'react';

export interface ClientContext {
  client: RestClientClient;
}

const ClientContext = createContext<ClientContext | undefined>(undefined);
export const useClient = (): RestClientClient => {
  const context = use(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientContext');
  }
  return context.client;
};

export const ClientContextProvider = ({ client, children }: { client: RestClientClient; children: ReactNode }) => {
  return <ClientContext value={{ client }}>{children}</ClientContext>;
};
