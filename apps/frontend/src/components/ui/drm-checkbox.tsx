import type { ComponentProps } from 'react';

export type DrmCheckboxProps = Omit<ComponentProps<'input'>, 'type'>;

export function DrmCheckbox({ className, ...props }: DrmCheckboxProps) {
  return (
    <input
      {...props}
      className={['drm-checkbox', className].filter(Boolean).join(' ')}
      type="checkbox"
    />
  );
}
