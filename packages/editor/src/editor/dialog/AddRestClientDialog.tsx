import type { RestClientData, RestClientOpenApi } from '@axonivy/restclient-editor-protocol';
import {
  BasicCollapsible,
  BasicDialogContent,
  BasicField,
  BasicTooltip,
  Button,
  configKeySanitize,
  Dialog,
  DialogContent,
  DialogTrigger,
  hotkeyText,
  Input,
  selectRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys,
  type DataTableFeatures,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../..';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { OpenApiClassGenerator, useGenerateOpenApi } from './GenerateRestClassesDialog';
import { useValidateKey } from './useValidateKey';

const DIALOG_HOTKEY_IDS = ['addRestClientDialog'];

export const AddRestClientDialog = ({ table, children }: { table: Table<DataTableFeatures, RestClientData>; children: ReactNode }) => {
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const { addRestClient: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()} className='max-w-140!'>
        <AddDialogContent table={table} closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

const AddDialogContent = ({ table, closeDialog }: { table: Table<DataTableFeatures, RestClientData>; closeDialog: () => void }) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex, context } = useAppContext();
  const [name, setName] = useState('');
  const client = useClient();
  const nameValidationMessage = useValidateKey(name, data);
  const generator = useGenerateOpenApi({ namespace: '', resolveFully: false, spec: '' }, context, client);
  const allInputsValid = !nameValidationMessage && (!generator.openApi.spec || !!generator.query.data?.uri);
  const sanitizedKey = configKeySanitize(name);
  const sanitizeMessage: MessageData = { variant: 'info', message: t('message.sanitizedKey', { key: sanitizedKey }) };

  const generateMutation = useMutation({
    mutationFn: (payload: { clientName: string; openApiSpec: RestClientOpenApi }) =>
      client.vsc('integration/generate', {
        context,
        clientName: payload.clientName,
        ...payload.openApiSpec
      })
  });

  const addRestClient = async (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    if (!allInputsValid || generateMutation.isPending) {
      return;
    }

    const baseClient: RestClientData = {
      key: sanitizedKey,
      name,
      description: '',
      icon: '',
      uri: '',
      features: ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
      properties: [],
      openApi: { namespace: '', resolveFully: false, spec: '' }
    };

    let newClient = baseClient;
    if (generator.openApi.spec) {
      const openApiSpec = generator.resolveOpenApiSpec();
      try {
        const result = await generateMutation.mutateAsync({ clientName: baseClient.name, openApiSpec });
        if (!result.success) {
          return;
        }
      } catch {
        return;
      }
      newClient = { ...baseClient, openApi: openApiSpec, uri: generator.query.data?.uri ?? '' };
    }

    setData(old => [...old, newClient]);
    if (!event.ctrlKey && !event.metaKey) {
      closeDialog();
    } else {
      setName('');
      nameInputRef.current?.focus();
    }
    selectRow(table, data.length.toString());
    setSelectedIndex(data.length);
  };

  const enter = useHotkeys<HTMLDivElement>(['Enter', 'mod+Enter'], addRestClient, { scopes: DIALOG_HOTKEY_IDS, enableOnFormTags: true });

  return (
    <BasicDialogContent
      title={t('dialog.addRestClient.title')}
      description={t('dialog.addRestClient.desc')}
      submit={
        <BasicTooltip content={t('dialog.createTooltip', { modifier: hotkeyText('mod') })}>
          <Button
            variant='primary'
            size='large'
            icon={generateMutation.isPending ? IvyIcons.Spinner : IvyIcons.Plus}
            spin={generateMutation.isPending}
            aria-label={t('dialog.create')}
            disabled={!allInputsValid || generateMutation.isPending}
            onClick={addRestClient}
          >
            {t('dialog.create')}
          </Button>
        </BasicTooltip>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
      ref={enter}
      tabIndex={-1}
    >
      <BasicField label={t('common.label.name')} message={nameValidationMessage || sanitizeMessage} aria-label={t('common.label.name')}>
        <Input ref={nameInputRef} value={name} onChange={event => setName(event.target.value)} />
      </BasicField>
      <BasicCollapsible label={t('dialog.OpenAPI.generator')}>
        <span>{t('dialog.OpenAPI.generateDescription')}</span>
        <OpenApiClassGenerator {...generator} />
      </BasicCollapsible>
    </BasicDialogContent>
  );
};
