import {
  BasicCollapsible,
  InputCell,
  SelectRow,
  SortableHeader,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader
} from '@axonivy/ui-components';
import { flexRender, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useResizableEditableTable } from '../../../hooks/useResizableEditableTable';

type Feature = { class: string };

type FeaturesTableProps = {
  data: Array<string>;
  onChange: (props: Array<string>) => void;
};

export const FeaturesTable = ({ data, onChange }: FeaturesTableProps) => {
  const { t } = useTranslation();

  const tableData: Feature[] = useMemo<Array<Feature>>(() => data.map(f => ({ class: f })), [data]);

  const onTableDataChange = (changedData: Array<Feature>) => {
    onChange(changedData.map(d => d.class));
  };

  const columns = useMemo<ColumnDef<Feature, string>[]>(
    () => [
      {
        accessorKey: 'class',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => <InputCell cell={cell} />
      }
    ],
    [t]
  );

  const { table, tableRef, setRowSelection, selectedRowActions, showAddButton } = useResizableEditableTable({
    data: tableData,
    columns,
    onChange: onTableDataChange,
    emptyDataObject: { class: '' }
  });

  return (
    <BasicCollapsible label={t('common.label.features')} controls={selectedRowActions()}>
      <div>
        <Table ref={tableRef}>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <SelectRow key={row.id} row={row}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </SelectRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton()}
      </div>
    </BasicCollapsible>
  );
};
