import type { RestPropertyMeta } from '@axonivy/restclient-editor-protocol';
import { useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../hooks/useMeta';
import { useBrowserData } from './browser-data';

export const PROPERTIES_BROWSER_ID = 'Properties';

export const usePropertiesBrowser = (initialSearch: string): Browser => {
  const meta = useMeta('meta/properties/all', undefined);
  const properties = useBrowserData(meta, propertiesToBrowserNode);
  const browser = useBrowser(properties, { initialSearch });
  return {
    name: PROPERTIES_BROWSER_ID,
    icon: IvyIcons.ChangeType,
    browser,
    infoProvider: row => (row?.original.data ? (row?.original.data as RestPropertyMeta).description : ''),
    applyModifier: row => ({ value: row?.original.value ?? '' })
  };
};

const propertiesToBrowserNode = (prop: RestPropertyMeta): BrowserNode<RestPropertyMeta> => {
  return {
    value: prop.property,
    info: prop.description,
    data: prop,
    children: []
  };
};
