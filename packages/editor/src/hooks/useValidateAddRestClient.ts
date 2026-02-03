import type { RestClientData } from '@axonivy/restclient-editor-protocol';
import type { MessageData } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useValidateName = (name: string, restClients: Array<RestClientData>) => {
  const { t } = useTranslation();
  return useMemo<MessageData | undefined>(() => {
    switch (validateName(name, restClients)) {
      case 'emptyName':
        return toErrorMessage(t('message.emptyName'));
      case 'alreadyExists':
        return toErrorMessage(t('message.restclientAlreadyExists'));
      default:
        return;
    }
  }, [name, restClients, t]);
};

export const validateName = (name: string, restClients: Array<RestClientData>) => {
  const trimmedName = name.trim();
  if (trimmedName === '') {
    return 'emptyName';
  }
  if (restClients.map(restClient => restClient.name).includes(trimmedName)) {
    return 'alreadyExists';
  }
  return undefined;
};

const toErrorMessage = (message: string): MessageData => ({ message: message, variant: 'error' });
