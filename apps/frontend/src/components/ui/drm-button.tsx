import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';

type DrmButtonProps =
  | ({ href: string; className?: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className'>)
  | ({ href?: never; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>);

export function DrmButton(props: DrmButtonProps) {
  const className = ['button', props.className].filter(Boolean).join(' ');
  const ariaLabel = 'aria-label' in props ? props['aria-label'] : undefined;
  const title = 'title' in props ? props.title : undefined;
  const tooltipProps = ariaLabel && !title ? { title: ariaLabel } : {};

  if (props.href !== undefined) {
    const { href, ...linkProps } = props;
    return <Link {...linkProps} {...tooltipProps} className={className} href={href} />;
  }

  const { href: _href, ...buttonProps } = props;
  return <button {...buttonProps} {...tooltipProps} className={className} />;
}
