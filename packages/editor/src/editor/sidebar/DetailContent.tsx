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
  // const properties = useMemo(
  //   () => Object.entries(restclient?.properties ?? {}).map(([key, value]) => ({ key, value })),
  //   [restclient?.properties]
  // );
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

  return (
    <Flex direction='column' gap={4} className='restclient-editor-detail-content'>
      <BasicField label={t('common.label.id')}>
        <BasicInput value={restclient.id} disabled />
      </BasicField>
      <NameInput
        value={restclient.name}
        onChange={value => handleAttributeChange('name', value)}
        restClients={data.filter(u => u.name !== restclient.name)}
        message={nameMessage}
      />
      <BasicField label={t('common.label.description')}>
        <BasicInput value={restclient.description} onChange={event => handleAttributeChange('description', event.target.value)} />
      </BasicField>
      <BasicField label={t('common.label.icon')}>
        <BasicInput value={restclient.icon} onChange={event => handleAttributeChange('icon', event.target.value)} />
      </BasicField>
      <BasicField label={t('common.label.uri')}>
        <BasicInput value={restclient.uri} onChange={event => handleAttributeChange('uri', event.target.value)} />
      </BasicField>
      <PropertiesTable
        key={restclient.name}
        data={[]}
        onChange={() => {} /*handleAttributeChange('properties', Object.fromEntries(change.map(({ key, value }) => [key, value])))*/}
      />
    </Flex>
  );
};

const fieldMessage = (validations: Array<ValidationResult>, restclientName: string, field: keyof RestClientData) =>
  validations
    .filter(v => v.path.startsWith(`${restclientName}.${field}`))
    .map<MessageData>(v => ({ message: v.message, variant: v.severity.toLocaleLowerCase() as Lowercase<Severity> }))[0];
