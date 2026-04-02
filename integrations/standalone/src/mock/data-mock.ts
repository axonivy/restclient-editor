import type { RestClientData } from '@axonivy/restclient-editor-protocol';

export const data: Array<RestClientData> = [
  {
    name: 'personService',
    key: 'personService',
    uri: '{ivy.app.baseurl}/api/persons',
    description: '',
    icon: '',
    features: ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature', 'ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    properties: [
      { key: 'username', type: 'STRING', value: 'theWorker' },
      { key: 'password', type: 'PASSWORD', value: 'theWorker' }
    ],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'batchService',
    key: 'batchService',
    uri: '{ivy.app.baseurl}/api/batch',
    description: '',
    icon: '',
    features: ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'],
    properties: [
      { key: 'jersey.config.client.readTimeout', type: 'STRING', value: '35000' },
      { key: 'jersey.config.client.connectTimeout', type: 'STRING', value: '1000' },
      { key: 'username', type: 'STRING', value: 'theWorker' },
      { key: 'password', type: 'PASSWORD', value: 'theWorker' }
    ],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'jsonPlaceholder',
    key: 'jsonPlaceholder',
    uri: 'https://jsonplaceholder.typicode.com/',
    description: 'A free to use test service with fixed data.',
    icon: '',
    features: ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    properties: [{ key: 'JSON.Deserialization.FAIL_ON_UNKNOWN_PROPERTIES', type: 'STRING', value: 'false' }],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'odataService',
    key: 'odataService',
    uri: 'https://services.odata.org/V4/(S(cnbm44wtbc1v5bgrlek5lpcc))/TripPinServiceRW',
    description: 'The OData demo service',
    icon: '',
    features: ['com.axonivy.connectivity.rest.sample.odata.TripPinJsonFeature'],
    properties: [{ key: 'JSON.Deserialization.FAIL_ON_UNKNOWN_PROPERTIES', type: 'STRING', value: 'false' }],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'ivy.engine (local.backend)',
    key: 'ivyengine-localbackend',
    uri: '{ivy.app.baseurl}/api',
    description:
      'A client using the REST endpoints defined by the serving ivy.engine. These endpoints either derive from application/projects or static engine resources.',
    icon: '',
    features: [
      'ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature',
      'org.glassfish.jersey.media.multipart.MultiPartFeature'
    ],
    properties: [
      { key: 'username', type: 'STRING', value: 'theWorker' },
      { key: 'password', type: 'PASSWORD', value: 'theWorker' }
    ],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'openApiService',
    key: 'openApiService',
    uri: 'https://petstore3.swagger.io/api/v3',
    description: '',
    icon: '',
    features: ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    properties: [{ key: 'JSON.Deserialization.FAIL_ON_UNKNOWN_PROPERTIES', type: 'STRING', value: 'false' }],
    openApi: {
      spec: 'https://petstore3.swagger.io/api/v3/openapi.json',
      namespace: 'io.swagger.petstore.client',
      resolveFully: false
    }
  },
  {
    name: 'customClient',
    key: 'customClient',
    uri: '{ivy.app.baseurl}/api/persons',
    description: '',
    icon: '',
    features: [
      'ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature',
      'ch.ivyteam.ivy.rest.client.mapper.JsonFeature',
      'com.axonivy.connectivity.rest.client.connect.KeepAliveFeature'
    ],
    properties: [
      { key: 'username', type: 'STRING', value: 'theWorker' },
      { key: 'password', type: 'PASSWORD', value: 'theWorker' }
    ],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  }
];
