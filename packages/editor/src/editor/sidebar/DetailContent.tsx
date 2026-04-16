import type { RestClientData, Severity, ValidationResult } from '@axonivy/restclient-editor-protocol';
import { BasicCollapsible, BasicField, BasicInput, Combobox, Flex, PanelMessage, type MessageData } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../hooks/useMeta';
import { useValidations } from '../../hooks/useValidation';
import { AuthenticationPart } from './AuthenticationPart';
import { FeaturesTable } from './components/FeaturesTable';
import { PropertiesTable } from './components/PropertiesTable';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex, context } = useAppContext();
  const restclient = useMemo(() => data[selectedIndex], [data, selectedIndex]);
  const validations = useValidations(restclient?.key ?? '');
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

  const keyMessage = fieldMessage(validations, restclient, 'key');
  const uriMessage = fieldMessage(validations, restclient, 'uri');
  const iconOptions = iconMeta.data?.map(icon => ({ icon: icon.path, label: icon.name, value: icon.relativePath })) ?? [];

  return (
    <Flex direction='column' gap={3} className='min-h-0 overflow-auto p-3'>
      <BasicCollapsible label={t('common.label.details')} defaultOpen>
        <Flex direction='column' gap={3}>
          <BasicField label={t('common.label.key')} message={keyMessage}>
            <BasicInput value={restclient.key} disabled />
          </BasicField>
          <BasicField label={t('common.label.name')}>
            <BasicInput value={restclient.name} onChange={event => handleAttributeChange('name', event.target.value)} />
          </BasicField>
          <BasicField label={t('common.label.description')}>
            <BasicInput value={restclient.description} onChange={event => handleAttributeChange('description', event.target.value)} />
          </BasicField>
          <BasicField label={t('common.label.icon')}>
            <Flex alignItems='center' gap={2} className='w-full *:last:grow'>
              <div className='flex size-9.25 items-center justify-center rounded-sm border border-n200'>
                {restclient.icon && <img src={iconOptions.find(option => option.value === restclient.icon)?.icon} className='size-6' />}
              </div>
              <Combobox
                itemRender={item => (
                  <Flex alignItems='center' gap={1}>
                    <img src={item.icon} alt={item.label} className='size-3' />
                    <span>{item.label}</span>
                  </Flex>
                )}
                onChange={value => handleAttributeChange('icon', value)}
                options={iconOptions}
                value={restclient.icon}
              />
            </Flex>
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
        validationPath={restclient.key}
      />
      <PropertiesTable data={restclient.properties} onChange={change => handleAttributeChange('properties', change)} />
    </Flex>
  );
};

const fieldMessage = (validations: Array<ValidationResult>, restclient: RestClientData, field: keyof RestClientData) =>
  validations
    .filter(v => v.path.toLowerCase().startsWith(`${restclient.key}.${field}`.toLowerCase()))
    .map<MessageData>(v => ({ message: v.message, variant: v.severity.toLowerCase() as Lowercase<Severity> }))[0];
