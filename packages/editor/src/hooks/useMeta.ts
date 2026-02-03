import type { RestClientMetaRequestTypes } from '@axonivy/restclient-editor-protocol';
import { useQuery } from '@tanstack/react-query';
import { useClient } from '../context/ClientContext';
import { genQueryKey } from '../query/query-client';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof RestClientMetaRequestTypes>(
  path: TMeta,
  args: RestClientMetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<RestClientMetaRequestTypes[TMeta][1]>,
  options?: { disable?: boolean }
): { data: RestClientMetaRequestTypes[TMeta][1] } {
  const client = useClient();
  return useQuery({
    enabled: !options?.disable,
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args),
    initialData: initialData
  });
}
