import type { ComponentProps } from 'react';

export type DrmTextareaProps = ComponentProps<'textarea'>;

export function DrmTextarea({ className, ...props }: DrmTextareaProps) {
  return <textarea {...props} className={['drm-textarea', className].filter(Boolean).join(' ')} />;
}
