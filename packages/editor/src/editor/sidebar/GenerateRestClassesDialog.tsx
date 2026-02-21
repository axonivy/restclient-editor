import {
  BasicDialogContent,
  BasicField,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  Input
} from '@axonivy/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';

export const GenerateRestClassesDialog = () => {
  const { t } = useTranslation();
  return (
    <Dialog modal>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <AddDialogContent />
      </DialogContent>
      <DialogTrigger asChild>
        <Button variant='outline'>{t('dialog.OpenAPI.generateRestClassesButton')}</Button>
      </DialogTrigger>
    </Dialog>
  );
};
const AddDialogContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const [filePath, setFilePath] = useState('');
  const [namespace, setNamespace] = useState('');
  const [resolveFully, setResolveFully] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePath(file.name);
    }
  };

  const GenerateDataClass = () => {
    if (!filePath || !namespace) {
      return;
    }

    const currentClient = data[selectedIndex];
    if (!currentClient) {
      return;
    }

    setData(currentData =>
      currentData.map((client, index) =>
        index === selectedIndex
          ? {
              ...client,
              openApi: {
                namespace,
                resolveFully,
                spec: filePath
              }
            }
          : client
      )
    );
  };

  return (
    <BasicDialogContent
      title={t('dialog.OpenAPI.generateRestClasses')}
      description={t('dialog.OpenAPI.generateRestClassesDescription')}
      submit={
        <Button variant='primary' size='large' aria-label={t('dialog.create')} onClick={GenerateDataClass}>
          {t('dialog.create')}
        </Button>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
    >
      <Flex direction='column' gap={2}>
        <BasicField label={t('dialog.OpenAPI.schemaUri')}>
          <Flex gap={2}>
            <Input value={filePath} readOnly />
            <Input accept='.json' type='file' onChange={handleFileChange} />
          </Flex>
        </BasicField>
        <BasicField label={t('dialog.OpenAPI.namespace')}>
          <Input value={namespace} onChange={event => setNamespace(event.target.value)} />
        </BasicField>
        <BasicField label='Options'>
          <Flex gap={2}>
            <Checkbox checked={resolveFully} onCheckedChange={checked => setResolveFully(checked === true)} />
            {t('dialog.OpenAPI.properties')}
          </Flex>
        </BasicField>
        <BasicField>
          <a href='https://convert.odata-openapi.net/' target='_blank' rel='noopener noreferrer'>
            {t('dialog.OpenAPI.convertODataLink')}
          </a>
        </BasicField>
      </Flex>
    </BasicDialogContent>
  );
};
