import type { RestClientData, Severity, ValidationResult } from '@axonivy/restclient-editor-protocol';
import { BasicCollapsible, BasicField, BasicInput, Combobox, Flex, PanelMessage, type MessageData } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../hooks/useMeta';
import { useValidations } from '../../hooks/useValidation';
import { AuthenticationPart } from './AuthenticationPart';
import { FeaturesTable } from './components/FeaturesTable';
import { NameInput } from './components/NameInput';
import { PropertiesTable } from './components/PropertiesTable';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex, context } = useAppContext();
  const restclient = useMemo(() => data[selectedIndex], [data, selectedIndex]);
  const validations = useValidations(restclient?.name ?? '');
  const iconMeta = useMeta('meta/icons/all', context);
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

  const idMessage = fieldMessage(validations, restclient.name, 'id');
  const nameMessage = fieldMessage(validations, restclient.name, 'name');
  const uriMessage = fieldMessage(validations, restclient.name, 'uri');

  return (
    <Flex direction='column' gap={3} className='min-h-0 overflow-auto p-3'>
      <BasicCollapsible label={t('common.label.details')} defaultOpen>
        <Flex direction='column' gap={3}>
          <BasicField label={t('common.label.id')} message={idMessage}>
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
            <Combobox
              itemRender={item => (
                <Flex alignItems='center' gap={1}>
                  <img src={item.icon} alt={item.label} className='size-3' />
                  <span>{item.label}</span>
                </Flex>
              )}
              onChange={value => handleAttributeChange('icon', value)}
              options={iconMeta.data?.map(icon => ({ icon: icon.path, label: icon.name, value: icon.path })) ?? []}
              value={restclient.icon}
            />
          </BasicField>
          <BasicField label={t('common.label.uri')} message={uriMessage}>
            <BasicInput value={restclient.uri} onChange={event => handleAttributeChange('uri', event.target.value)} />
          </BasicField>
        </Flex>
      </BasicCollapsible>
      <BasicCollapsible label={t('common.label.authentication')}>
        <AuthenticationPart restClient={restclient} handleAttributeChange={handleAttributeChange} />
      </BasicCollapsible>
      <FeaturesTable
        data={restclient.features}
        onChange={change => handleAttributeChange('features', change)}
        validationPath={restclient.name}
      />
      <PropertiesTable data={restclient.properties} onChange={change => handleAttributeChange('properties', change)} />
    </Flex>
  );
};

const fieldMessage = (validations: Array<ValidationResult>, restclientName: string, field: keyof RestClientData) =>
  validations
    .filter(v => v.path.startsWith(`${restclientName}.${field}`))
    .map<MessageData>(v => ({ message: v.message, variant: v.severity.toLocaleLowerCase() as Lowercase<Severity> }))[0];
