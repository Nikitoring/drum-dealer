import type { ComponentProps } from 'react';

export type DrmInputProps = ComponentProps<'input'>;

export function DrmInput({ className, ...props }: DrmInputProps) {
  return <input {...props} className={['drm-input', className].filter(Boolean).join(' ')} />;
}
