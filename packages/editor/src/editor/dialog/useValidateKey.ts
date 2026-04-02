import type { RestClientData } from '@axonivy/restclient-editor-protocol';
import type { MessageData } from '@axonivy/ui-components';
import { configKeySanitize } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useValidateKey = (key: string, restClients: Array<RestClientData>) => {
  const { t } = useTranslation();
  return useMemo<MessageData | undefined>(() => {
    switch (validateKey(key, restClients)) {
      case 'empty':
        return toErrorMessage(t('message.emptyName'));
      case 'alreadyExists':
        return toErrorMessage(t('message.restclientAlreadyExists'));
      default:
        return;
    }
  }, [key, restClients, t]);
};

const validateKey = (key: string, restClients: Array<RestClientData>) => {
  const sanitizedKey = configKeySanitize(key);
  if (sanitizedKey === '') {
    return 'empty';
  }
  if (restClients.map(restClient => restClient.key.toLowerCase()).includes(sanitizedKey.toLowerCase())) {
    return 'alreadyExists';
  }
};

const toErrorMessage = (message: string): MessageData => ({ message: message, variant: 'error' });
