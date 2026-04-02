import type { RestClientData, ValidationResult } from '@axonivy/restclient-editor-protocol';

export const validateMock = (data: Array<RestClientData>): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  data.forEach(restClient => {
    if (restClient.key.includes('invalid-')) {
      validations.push(
        {
          path: `${restClient.key}.key`,
          message: `RestClient ${restClient.key} contains invalid characters`,
          severity: 'ERROR'
        },
        {
          path: `${restClient.key}.uri`,
          message: 'URI empty',
          severity: 'ERROR'
        },
        {
          path: `${restClient.key}.features.ch.ivyteam.ivy.rest.client.mapper.JsonFeature`,
          message: 'Feature unknown',
          severity: 'WARNING'
        }
      );
    }
  });
  return validations;
};
