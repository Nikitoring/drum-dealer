import type { ComponentProps } from 'react';

type DrmTableProps = ComponentProps<'table'>;

export function DrmTable({ className, ...props }: DrmTableProps) {
  return <table {...props} className={['drm-table', className].filter(Boolean).join(' ')} />;
}

export function DrmTableHead(props: ComponentProps<'thead'>) {
  return <thead {...props} />;
}

export function DrmTableBody(props: ComponentProps<'tbody'>) {
  return <tbody {...props} />;
}

export function DrmTableRow(props: ComponentProps<'tr'>) {
  return <tr {...props} />;
}

export function DrmTableHeaderCell(props: ComponentProps<'th'>) {
  return <th {...props} />;
}

export function DrmTableCell(props: ComponentProps<'td'>) {
  return <td {...props} />;
}
