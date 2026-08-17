import type { RestClientData } from '@axonivy/restclient-editor-protocol';
import {
  BasicField,
  Button,
  dataTableHelper,
  deleteFirstSelectedRow,
  Flex,
  IvyIcon,
  PanelMessage,
  selectRow,
  Separator,
  SortableHeader,
  Table,
  TableBody,
  TableGlobalFilter,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly,
  useTableKeyHandler,
  type DataTableFeatures
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTable, type Table as ReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../hooks/useMeta';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { AddRestClientDialog } from '../dialog/AddRestClientDialog';
import { GenerateRestClassesDialog } from '../dialog/GenerateRestClassesDialog';
import { ValidationRow } from './ValidationRow';

const { columnHelper, tableOptions } = dataTableHelper<RestClientData>();

export const Main = () => {
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex, detail, setDetail, context } = useAppContext();
  const iconMeta = useMeta('meta/icons/all', context);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('name', {
          header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
          cell: cell => {
            const iconPath = iconMeta.data?.find(icon => icon.relativePath === cell.row.original.icon)?.path;

            return (
              <Flex alignItems='center' gap={1}>
                {iconPath ? <img src={iconPath} alt='icon' className='size-3' /> : <IvyIcon icon={IvyIcons.RestClient} />}
                <span>{cell.getValue()}</span>
              </Flex>
            );
          }
        }),
        columnHelper.accessor('uri', {
          header: ({ column }) => <SortableHeader column={column} name={t('common.label.uri')} />,
          cell: cell => (
            <Flex alignItems='center' gap={1}>
              <span>{cell.getValue()}</span>
            </Flex>
          )
        })
      ]),
    [t, iconMeta.data]
  );

  const table = useTable({
    ...tableOptions,
    data,
    columns,
    columnResizeMode: 'onChange'
  });

  useEffect(() => {
    const subscription = table.atoms.rowSelection.subscribe(selectedRows => {
      const selectedRowIndex = Object.keys(selectedRows).find(key => selectedRows[key]);
      if (selectedRowIndex === undefined) {
        setSelectedIndex(-1);
        return;
      }
      setSelectedIndex(Number(selectedRowIndex));
    });
    return () => subscription.unsubscribe();
  }, [table, setSelectedIndex]);

  const { handleKeyDown } = useTableKeyHandler({
    table,
    data
  });

  const deleteRestClient = () =>
    setData(old => {
      const selectedRow = table.getSelectedRowModel().flatRows[0];
      if (!selectedRow) {
        return old;
      }
      return deleteFirstSelectedRow(table, old).newData;
    });

  const resetSelection = () => {
    selectRow(table);
  };

  const hotkeys = useKnownHotkeys();
  const readonly = useReadonly();
  const ref = useHotkeys<HTMLDivElement>(hotkeys.deleteRestClient.hotkey, () => deleteRestClient(), {
    scopes: ['global'],
    enabled: !readonly
  });
  const firstElementRef = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElementRef.current?.focus(), { scopes: ['global'] });

  if (data === undefined || data.length === 0) {
    return (
      <Flex direction='column' alignItems='center' justifyContent='center' className='h-full'>
        <PanelMessage icon={IvyIcons.Tool} message={t('message.addFirstRestClient')} mode='column'>
          <AddRestClientDialog table={table}>
            <Button size='large' variant='primary' icon={IvyIcons.Plus}>
              {t('dialog.addRestClient.title')}
            </Button>
          </AddRestClientDialog>
        </PanelMessage>
      </Flex>
    );
  }

  return (
    <Flex direction='column' ref={ref} onClick={resetSelection} className='h-full overflow-auto'>
      <BasicField
        tabIndex={-1}
        ref={firstElementRef}
        className='m-3 min-h-0'
        label={t('label.restClients')}
        control={
          <Controls table={table} deleteRestClient={table.getSelectedRowModel().flatRows.length > 0 ? deleteRestClient : undefined} />
        }
        onClick={event => event.stopPropagation()}
      >
        <TableGlobalFilter table={table} />
        <div className='overflow-x-hidden'>
          <Table onKeyDown={e => handleKeyDown(e, () => setDetail(!detail))}>
            <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <ValidationRow key={row.id} row={row} validationPath={row.original.key} />
              ))}
            </TableBody>
          </Table>
        </div>
      </BasicField>
    </Flex>
  );
};

const Controls = ({ table, deleteRestClient }: { table: ReactTable<DataTableFeatures, RestClientData>; deleteRestClient?: () => void }) => {
  const { t } = useTranslation();
  const readonly = useReadonly();
  const hotkeys = useKnownHotkeys();
  if (readonly) {
    return null;
  }
  return (
    <Flex gap={2}>
      <GenerateRestClassesDialog>
        <Button
          icon={IvyIcons.SettingsCog}
          aria-label={t('dialog.OpenAPI.generator')}
          disabled={table.getSelectedRowModel().rows.length === 0}
        />
      </GenerateRestClassesDialog>
      <Separator decorative orientation='vertical' className='m-0! h-5!' />
      <AddRestClientDialog table={table}>
        <Button icon={IvyIcons.Plus} aria-label={hotkeys.addRestClient.label} />
      </AddRestClientDialog>
      <Separator decorative orientation='vertical' className='m-0! h-5!' />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              icon={IvyIcons.Trash}
              onClick={deleteRestClient}
              disabled={deleteRestClient === undefined}
              aria-label={hotkeys.deleteRestClient.label}
            />
          </TooltipTrigger>
          <TooltipContent>{hotkeys.deleteRestClient.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Flex>
  );
};
