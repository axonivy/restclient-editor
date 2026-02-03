import type { RestClientData } from '@axonivy/restclient-editor-protocol';

export const data: Array<RestClientData> = [
  {
    name: 'personService',
    id: 'e00c9735-7733-4da8-85c8-6413c6fb2cd3',
    uri: '{ivy.app.baseurl}/api/persons',
    description: '',
    icon: ''
  },
  {
    name: 'batchService',
    id: 'b0a5f371-e479-444d-b71c-af1fff4c084d',
    uri: '{ivy.app.baseurl}/api/batch',
    description: '',
    icon: ''
  },
  {
    name: 'jsonPlaceholder',
    id: '449e7581-aa1e-4e3b-931a-903253491b50',
    uri: 'https://jsonplaceholder.typicode.com/',
    description: 'A free to use test service with fixed data.',
    icon: ''
  },
  {
    name: 'odataService',
    id: '65f8e5a4-768d-4a68-813a-e6d569cda522',
    uri: 'https://services.odata.org/V4/(S(cnbm44wtbc1v5bgrlek5lpcc))/TripPinServiceRW',
    description: 'The OData demo service',
    icon: ''
  },
  {
    name: 'ivy.engine (local.backend)',
    id: '4d9a8b09-9968-4476-a8ac-b71a94d25e94',
    uri: '{ivy.app.baseurl}/api',
    description:
      'A client using the REST endpoints defined by the serving ivy.engine. These endpoints either derive from application/projects or static engine resources.',
    icon: ''
  },
  {
    name: 'openApiService',
    id: 'ae69ba01-79b7-4dce-9049-900f8f420907',
    uri: 'https://petstore3.swagger.io/api/v3',
    description: '',
    icon: ''
  },
  {
    name: 'customClient',
    id: 'bf0e4baf-96e6-470c-a61c-a2f4dbfe4c8f',
    uri: '{ivy.app.baseurl}/api/persons',
    description: '',
    icon: ''
  }
];
