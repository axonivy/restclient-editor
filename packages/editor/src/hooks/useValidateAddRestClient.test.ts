import type { RestClientData } from '@axonivy/restclient-editor-protocol';
import { customRenderHook } from 'test-utils';
import { useValidateName } from './useValidateAddRestClient';

const data: Array<RestClientData> = [
  {
    name: 'Employee',
    fullName: '',
    emailAddress: '',
    password: '',
    roles: [],
    properties: {}
  },
  {
    name: 'Teamleader',
    fullName: '',
    emailAddress: '',
    password: '',
    roles: [],
    properties: {}
  }
];

const validate = (name: string) => {
  const { result } = customRenderHook(() => useValidateName(name, data));
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
