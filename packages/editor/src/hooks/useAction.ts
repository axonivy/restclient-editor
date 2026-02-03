import type { RestClientActionArgs } from '@axonivy/restclient-editor-protocol';
import { useAppContext } from '../context/AppContext';
import { useClient } from '../context/ClientContext';

export function useAction(actionId: RestClientActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: RestClientActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
