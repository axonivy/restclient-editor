import type { RestClientData, Severity, ValidationResult } from '@axonivy/restclient-editor-protocol';
import { BasicField, BasicInput, Flex, PanelMessage, type MessageData } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useValidations } from '../../hooks/useValidation';
import './DetailContent.css';
import { NameInput } from './components/NameInput';
import { PropertiesTable } from './components/PropertiesTable';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const restclient = useMemo(() => data[selectedIndex], [data, selectedIndex]);
  const validations = useValidations(restclient?.name ?? '');
  const properties = useMemo(
    () => Object.entries(restclient?.properties ?? {}).map(([key, value]) => ({ key, value })),
    [restclient?.properties]
  );
  if (restclient === undefined) {
    return <PanelMessage message={t('label.noRestClientSelected')} />;
  }
  const handleAttributeChange = <T extends keyof RestClientData>(key: T, value: RestClientData[T]) =>
    setData(old => {
      const oldRestclient = old[selectedIndex];
      if (oldRestclient) {
        oldRestclient[key] = value;
      }
      return structuredClone(old);
    });

  const nameMessage = fieldMessage(validations, restclient.name, 'name');
  const passwordMessage = fieldMessage(validations, restclient.name, 'password');
  const fullNameMessage = fieldMessage(validations, restclient.name, 'fullName');
  const emailAddressMessage = fieldMessage(validations, restclient.name, 'emailAddress');

  return (
    <Flex direction='column' gap={4} className='restclient-editor-detail-content'>
      <NameInput
        value={restclient.name}
        onChange={value => handleAttributeChange('name', value)}
        restClients={data.filter(u => u.name !== restclient.name)}
        message={nameMessage}
      />
      <BasicField label={t('common.label.password')} message={passwordMessage}>
        <BasicInput value={restclient.password} onChange={event => handleAttributeChange('password', event.target.value)} />
      </BasicField>
      <BasicField label={t('common.label.fullName')} message={fullNameMessage}>
        <BasicInput value={restclient.fullName} onChange={event => handleAttributeChange('fullName', event.target.value)} />
      </BasicField>
      <BasicField label={t('common.label.emailAddress')} message={emailAddressMessage}>
        <BasicInput value={restclient.emailAddress} onChange={event => handleAttributeChange('emailAddress', event.target.value)} />
      </BasicField>
      <PropertiesTable
        key={restclient.name}
        data={properties}
        onChange={change => handleAttributeChange('properties', Object.fromEntries(change.map(({ key, value }) => [key, value])))}
      />
    </Flex>
  );
};

const fieldMessage = (validations: Array<ValidationResult>, restclientName: string, field: keyof RestClientData) =>
  validations
    .filter(v => v.path.startsWith(`${restclientName}.${field}`))
    .map<MessageData>(v => ({ message: v.message, variant: v.severity.toLocaleLowerCase() as Lowercase<Severity> }))[0];
