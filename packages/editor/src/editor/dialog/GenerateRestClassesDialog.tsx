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
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useAction } from '../../hooks/useAction';
import { useMeta } from '../../hooks/useMeta';

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
  const currentClient = data[selectedIndex];
  const generateOpenApiClient = useAction('generateOpenApiClient');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePath, setFilePath] = useState(currentClient?.openApi.spec ?? '');
  const [namespace, setNamespace] = useState(currentClient?.openApi.namespace ?? '');
  const [resolveFully, setResolveFully] = useState(currentClient?.openApi.resolveFully ?? false);
  const query = useMeta('meta/open-api/load', filePath, { disable: !filePath, retry: false });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePath(file.name);
    }
  };

  const generateRestClasses = () => {
    if (!currentClient) {
      return;
    }

    generateOpenApiClient({
      clientName: currentClient.name,
      spec: filePath,
      namespace,
      resolveFully
    });

    setData(currentData =>
      currentData.map((client, index) =>
        index === selectedIndex
          ? {
              ...client,
              openApi: {
                namespace: namespace.trim() ? namespace : (query.data?.namespace ?? ''),
                resolveFully,
                spec: filePath
              },
              uri: query.data?.uri ?? ''
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
          disabled={!query.data?.uri}
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
          message={query.isError ? { variant: 'error', message: query.error.message } : undefined}
        >
          <input ref={fileInputRef} accept='.json' type='file' onChange={handleFileChange} hidden />
          <BasicInput value={filePath} required onChange={event => setFilePath(event.target.value)} />
        </BasicField>
        {filePath && query.isPending && (
          <Flex direction='row' gap={1}>
            <Spinner size='small' />
            {t('dialog.OpenAPI.loading')}
          </Flex>
        )}
        <BasicField label={t('dialog.OpenAPI.namespace')}>
          <BasicInput
            disabled={!filePath}
            value={namespace}
            placeholder={query.data?.namespace}
            onChange={event => setNamespace(event.target.value)}
          />
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
