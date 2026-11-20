import type { ValidationResult } from '@axonivy/restclient-editor-protocol';
import { customRenderHook } from 'test-utils';
import { useValidations } from './useValidation';

test('useValidations', () => {
  expect(renderValidations('').result.current).toEqual([]);
  expect(renderValidations('Employee').result.current).toEqual([validations[0]]);
  expect(renderValidations('Teamleader').result.current).toEqual([validations[1], validations[2], validations[3]]);
  expect(renderValidations('Teamleader.features.test').result.current).toEqual([validations[1]]);
  expect(renderValidations('TEAMLEADER.FEAtures').result.current).toEqual([validations[1]]);
  expect(renderValidations('Manager').result.current).toEqual([validations[4]]);
  expect(renderValidations('HR Manager').result.current).toEqual([]);
});

const renderValidations = (path: string) => {
  return customRenderHook(() => useValidations(path), { wrapperProps: { appContext: { validations } } });
};

const validations: Array<ValidationResult> = [
  { message: 'message0', path: 'Employee.key', severity: 'INFO', code: 'code0', url: 'url0' },
  { message: 'message1', path: 'Teamleader.features.test', severity: 'INFO', code: 'code1', url: 'url1' },
  { message: 'message2', path: 'Teamleader', severity: 'WARNING', code: 'code2', url: 'url2' },
  { message: 'message3', path: 'Teamleader', severity: 'ERROR', code: 'code3', url: 'url3' },
  { message: 'message4', path: 'Manager', severity: 'INFO', code: 'code4', url: 'url4' }
];
