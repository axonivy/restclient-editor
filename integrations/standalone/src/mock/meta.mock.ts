import type { JavaType, RestPropertyMeta } from '@axonivy/restclient-editor-protocol';

export const META_PROPS = [
  {
    property: 'jersey.client.pool.maxConnections',
    description:
      'Maximum number of connections to pool.\nOnly has an effect if no or the Apache connector provider is set.\nOnly has an effect when set in the REST Client Editor, cannot be changed during execution.',
    defaultValue: '5',
    examples: ['10', '20', '50']
  },
  {
    property: 'jersey.config.client.readTimeout',
    description: 'Read timeout interval, in milliseconds.',
    defaultValue: '30000',
    examples: []
  },
  { property: 'JSON.Mapper.INVERSE_READ_WRITE_ACCESS', description: '', defaultValue: 'false', examples: [] },
  {
    property: 'username',
    description: 'The username used for authentication by Basic, Digest or NTLM authentication.',
    defaultValue: '',
    examples: []
  },
  {
    property: 'password',
    description: 'The password used for authentication by Basic, Digest or NTLM authentication.',
    defaultValue: '',
    examples: []
  },
  {
    property: 'SSL.keyAlias',
    description:
      'The keystore key alias to use if the SSL connection to the REST service is configured to use client authentication.\nThis configuration can only be set in the REST Client configuration and cannot be configured in the REST Client call step.\nBy default no keystore key alias is definied.',
    defaultValue: '',
    examples: []
  }
] as const satisfies RestPropertyMeta[];

export const META_FEATURES = [
  {
    simpleName: 'MultiPartFeature',
    packageName: 'org.glassfish.jersey.media.multipart',
    fullQualifiedName: 'org.glassfish.jersey.media.multipart.MultiPartFeature'
  },
  {
    simpleName: 'MonitoringFeature',
    packageName: 'org.glassfish.jersey.server.internal.monitoring',
    fullQualifiedName: 'org.glassfish.jersey.server.internal.monitoring.MonitoringFeature'
  }
] as const satisfies JavaType[];
