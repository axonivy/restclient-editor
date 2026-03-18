import type { RestClientData } from '@axonivy/restclient-editor-protocol';
import {
  BasicCollapsible,
  BasicDialogContent,
  BasicField,
  BasicTooltip,
  Button,
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
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { v4 as uuid } from '@lukeed/uuid';
import type { Table } from '@tanstack/react-table';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useValidateName } from '../../hooks/useValidateAddRestClient';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { OpenApiClassGenerator, useGenerateOpenApi } from './GenerateRestClassesDialog';

const DIALOG_HOTKEY_IDS = ['addRestClientDialog'];

export const AddRestClientDialog = ({ table, children }: { table: Table<RestClientData>; children: ReactNode }) => {
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

const AddDialogContent = ({ table, closeDialog }: { table: Table<RestClientData>; closeDialog: () => void }) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex } = useAppContext();
  const [name, setName] = useState('');
  const nameValidationMessage = useValidateName(name, data);
  const generator = useGenerateOpenApi({ namespace: '', resolveFully: false, spec: '' });
  const allInputsValid = !nameValidationMessage;

  const addRestClient = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    if (!allInputsValid) {
      return;
    }
    setData(old => [
      ...old,
      generator.generate({
        id: uuid(),
        name,
        description: '',
        icon: '',
        uri: '',
        features: ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
        properties: [],
        openApi: { namespace: '', resolveFully: false, spec: '' }
      })
    ]);
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
            icon={IvyIcons.Plus}
            aria-label={t('dialog.create')}
            disabled={!allInputsValid}
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
      <BasicField label={t('common.label.name')} message={nameValidationMessage} aria-label={t('common.label.name')}>
        <Input ref={nameInputRef} value={name} onChange={event => setName(event.target.value)} />
      </BasicField>
      <BasicCollapsible label={t('dialog.OpenAPI.generator')}>
        <span>{t('dialog.OpenAPI.generateDescription')}</span>
        <OpenApiClassGenerator {...generator} />
      </BasicCollapsible>
    </BasicDialogContent>
  );
};
