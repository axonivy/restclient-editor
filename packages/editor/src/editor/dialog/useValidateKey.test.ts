import type { RestClientData } from '@axonivy/restclient-editor-protocol';
import { customRenderHook } from 'test-utils';
import { useValidateKey } from './useValidateKey';

const data: Array<RestClientData> = [
  {
    name: 'Employee',
    description: '',
    icon: '',
    key: 'Employee',
    uri: '',
    features: [],
    properties: [],
    openApi: {
      namespace: '',
      resolveFully: false,
      spec: ''
    }
  },
  {
    name: 'Teamleader',
    description: '',
    icon: '',
    key: 'Teamleader',
    uri: '',
    features: [],
    properties: [],
    openApi: {
      namespace: '',
      resolveFully: false,
      spec: ''
    }
  }
];

const validate = (name: string) => {
  const { result } = customRenderHook(() => useValidateKey(name, data));
  return result.current;
};

test('validate', () => {
  expect(validate('Name')).toBeUndefined();
  const emptyError = { message: 'Name cannot be empty.', variant: 'error' };
  expect(validate('')).toEqual(emptyError);
  expect(validate('   ')).toEqual(emptyError);
  const alreadyExistError = { message: 'Rest Client already exists.', variant: 'error' };
  expect(validate('Employee')).toEqual(alreadyExistError);
  expect(validate('Teamleader    ')).toEqual(alreadyExistError);
});
