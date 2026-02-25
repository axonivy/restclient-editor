import type { RestClientData, ValidationResult } from '@axonivy/restclient-editor-protocol';

export const validateMock = (data: Array<RestClientData>): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  data.forEach(restClient => {
    if (restClient.name.includes('#')) {
      validations.push(
        {
          path: `${restClient.name}.name`,
          message: `RestClient ${restClient.name} contains invalid characters`,
          severity: 'ERROR'
        },
        {
          path: `${restClient.name}.uri`,
          message: 'URI empty',
          severity: 'ERROR'
        },
        {
          path: `${restClient.name}.features.ch.ivyteam.ivy.rest.client.mapper.JsonFeature`,
          message: 'Feature unknown',
          severity: 'WARNING'
        }
      );
    }
  });
  return validations;
};
