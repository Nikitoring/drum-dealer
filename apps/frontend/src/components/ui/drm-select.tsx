import type { ComponentProps } from 'react';

export type DrmSelectProps = ComponentProps<'select'>;

export function DrmSelect({ className, ...props }: DrmSelectProps) {
  return <select {...props} className={['drm-select', className].filter(Boolean).join(' ')} />;
}
