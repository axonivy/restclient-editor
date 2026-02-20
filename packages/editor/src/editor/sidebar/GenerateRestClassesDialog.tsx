import {
  BasicCheckbox,
  BasicDialogContent,
  BasicField,
  BasicInput,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';

export const GenerateRestClassesDialog = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  return (
    <Dialog modal>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('dialog.OpenAPI.generateRestClassesButton')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <OpenApiClassGeneratorDialog />
      </DialogContent>
    </Dialog>
  );
};
const OpenApiClassGeneratorDialog = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePath, setFilePath] = useState('');
  const [namespace, setNamespace] = useState('');
  const [resolveFully, setResolveFully] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePath(file.name);
    }
  };

  const generateRestClasses = () => {
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
        <Button
          variant='primary'
          size='large'
          icon={IvyIcons.SettingsCog}
          disabled={!filePath || !namespace}
          aria-label={t('dialog.create')}
          onClick={generateRestClasses}
        >
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
        <BasicField
          control={<Button icon={IvyIcons.FolderOpen} onClick={() => fileInputRef.current?.click()}></Button>}
          label={t('dialog.OpenAPI.schemaUri')}
        >
          <input ref={fileInputRef} accept='.json' type='file' onChange={handleFileChange} hidden />
          <BasicInput value={filePath} required onChange={event => setFilePath(event.target.value)} />
        </BasicField>
        <BasicField label={t('dialog.OpenAPI.namespace')}>
          <BasicInput disabled={!filePath} value={namespace} required onChange={event => setNamespace(event.target.value)} />
        </BasicField>
        <Flex gap={2}>
          <BasicCheckbox
            disabled={!filePath}
            label={t('dialog.OpenAPI.properties')}
            checked={resolveFully}
            onCheckedChange={checked => setResolveFully(checked === true)}
          />
        </Flex>
        <a
          href='https://convert.odata-openapi.net/'
          style={{ color: 'blue', textDecoration: 'underline' }}
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('dialog.OpenAPI.convertODataLink')}
        </a>
      </Flex>
    </BasicDialogContent>
  );
};
