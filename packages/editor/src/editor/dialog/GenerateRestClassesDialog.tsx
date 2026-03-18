import type { RestClientData, RestClientOpenApi } from '@axonivy/restclient-editor-protocol';
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
          <TooltipContent>{t('dialog.OpenAPI.generator')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()} className='max-w-140!'>
        <OpenApiClassGeneratorDialog />
      </DialogContent>
    </Dialog>
  );
};

const OpenApiClassGeneratorDialog = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const currentClient = data[selectedIndex];
  const generator = useGenerateOpenApi(currentClient?.openApi ?? { namespace: '', resolveFully: false, spec: '' });

  const generateOpenApi = () => {
    setData(currentData =>
      currentData.map((client, index) => {
        if (index === selectedIndex) {
          return generator.generate(client);
        }
        return client;
      })
    );
  };

  return (
    <BasicDialogContent
      title={t('dialog.OpenAPI.generator')}
      description={t('dialog.OpenAPI.generateDescription')}
      submit={
        <Button
          variant='primary'
          size='large'
          icon={IvyIcons.SettingsCog}
          disabled={!generator.query.data?.uri}
          aria-label={t('dialog.OpenAPI.generate')}
          onClick={generateOpenApi}
        >
          {t('dialog.OpenAPI.generate')}
        </Button>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
    >
      <OpenApiClassGenerator {...generator} />
    </BasicDialogContent>
  );
};

export const useGenerateOpenApi = (initOpenApi: RestClientOpenApi) => {
  const generateOpenApiClient = useAction('generateOpenApiClient');
  const [openApi, setOpenApi] = useState<RestClientOpenApi>(initOpenApi);
  const query = useMeta('meta/open-api/load', openApi.spec, { disable: !openApi.spec, retry: false });
  const generate = (client: RestClientData) => {
    const openApiSpec = {
      ...openApi,
      namespace: openApi.namespace.trim() ? openApi.namespace : (query.data?.namespace ?? '')
    };

    generateOpenApiClient({
      clientName: client.name,
      ...openApiSpec
    });

    return {
      ...client,
      openApi: openApiSpec,
      uri: query.data?.uri ?? ''
    };
  };
  return { generate, openApi, setOpenApi, query };
};

export const OpenApiClassGenerator = ({ openApi, setOpenApi, query }: ReturnType<typeof useGenerateOpenApi>) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOpenApi({ ...openApi, spec: file.name });
    }
  };

  return (
    <Flex direction='column' gap={2}>
      <BasicField
        control={<Button icon={IvyIcons.FolderOpen} onClick={() => fileInputRef.current?.click()}></Button>}
        label={t('dialog.OpenAPI.schemaUri')}
        message={query.isError ? { variant: 'error', message: query.error.message } : undefined}
      >
        <input ref={fileInputRef} accept='.json' type='file' onChange={handleFileChange} hidden />
        <BasicInput value={openApi.spec} required onChange={event => setOpenApi({ ...openApi, spec: event.target.value })} />
      </BasicField>
      {openApi.spec && query.isPending && (
        <Flex direction='row' gap={1}>
          <Spinner size='small' />
          {t('common.label.loading')}
        </Flex>
      )}
      <BasicField label={t('dialog.OpenAPI.namespace')}>
        <BasicInput
          disabled={!openApi.spec}
          value={openApi.namespace}
          placeholder={query.data?.namespace}
          onChange={event => setOpenApi({ ...openApi, namespace: event.target.value })}
        />
      </BasicField>
      <Flex gap={2}>
        <BasicCheckbox
          disabled={!openApi.spec}
          label={t('dialog.OpenAPI.properties')}
          checked={openApi.resolveFully}
          onCheckedChange={checked => setOpenApi({ ...openApi, resolveFully: checked === true })}
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
  );
};
