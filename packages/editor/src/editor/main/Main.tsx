import type { RestClientData } from '@axonivy/restclient-editor-protocol';
import {
  BasicField,
  Button,
  deleteFirstSelectedRow,
  Flex,
  IvyIcon,
  PanelMessage,
  selectRow,
  Separator,
  SortableHeader,
  Table,
  TableBody,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly,
  useTableGlobalFilter,
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { getCoreRowModel, useReactTable, type ColumnDef, type Table as ReactTable } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { AddRestClientDialog } from '../dialog/AddRestClientDialog';
import { GenerateRestClassesDialog } from '../sidebar/GenerateRestClassesDialog';
import './Main.css';
import { ValidationRow } from './ValidationRow';

export const Main = () => {
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex, detail, setDetail } = useAppContext();

  const selection = useTableSelect<RestClientData>({
    onSelect: selectedRows => {
      const selectedRowIndex = Object.keys(selectedRows).find(key => selectedRows[key]);
      if (selectedRowIndex === undefined) {
        setSelectedIndex(-1);
        return;
      }
      setSelectedIndex(Number(selectedRowIndex));
    }
  });
  const globalFilter = useTableGlobalFilter();
  const sort = useTableSort();
  const columns = useMemo<ColumnDef<RestClientData, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => (
          <Flex alignItems='center' gap={1}>
            {<IvyIcon icon={IvyIcons.RestClient} />}
            <span>{cell.getValue()}</span>
          </Flex>
        )
      },
      {
        accessorKey: 'uri',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.uri')} />,
        cell: cell => (
          <Flex alignItems='center' gap={1}>
            <span>{cell.getValue()}</span>
          </Flex>
        )
      }
    ],
    [t]
  );

  const table = useReactTable({
    ...selection.options,
    ...globalFilter.options,
    ...sort.options,
    columnResizeMode: 'onChange',
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...sort.tableState,
      ...globalFilter.tableState
    }
  });

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
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  if (data === undefined || data.length === 0) {
    return (
      <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
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
    <Flex direction='column' ref={ref} onClick={resetSelection} className='restclient-editor-main-content'>
      <BasicField
        tabIndex={-1}
        ref={firstElement}
        className='restclient-editor-table-field'
        label={t('label.restClients')}
        control={
          <Controls table={table} deleteRestClient={table.getSelectedRowModel().flatRows.length > 0 ? deleteRestClient : undefined} />
        }
        onClick={event => event.stopPropagation()}
      >
        {globalFilter.filter}
        <div className='restclient-editor-table-container'>
          <Table onKeyDown={e => handleKeyDown(e, () => setDetail(!detail))}>
            <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <ValidationRow key={row.id} row={row} validationPath={row.original.name} />
              ))}
            </TableBody>
          </Table>
        </div>
      </BasicField>
    </Flex>
  );
};

const Controls = ({ table, deleteRestClient }: { table: ReactTable<RestClientData>; deleteRestClient?: () => void }) => {
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
          aria-label={t('dialog.OpenAPI.generateRestClassesButton')}
          disabled={table.getSelectedRowModel().rows.length === 0}
        />
      </GenerateRestClassesDialog>
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <AddRestClientDialog table={table}>
        <Button icon={IvyIcons.Plus} aria-label={hotkeys.addRestClient.label} />
      </AddRestClientDialog>
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
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
