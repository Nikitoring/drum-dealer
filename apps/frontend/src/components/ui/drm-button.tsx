import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';

type DrmButtonProps =
  | ({ href: string; className?: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className'>)
  | ({ href?: never; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>);

export function DrmButton(props: DrmButtonProps) {
  const className = ['button', props.className].filter(Boolean).join(' ');

  if (props.href !== undefined) {
    const { href, ...linkProps } = props;
    return <Link {...linkProps} className={className} href={href} />;
  }

  const { href: _href, ...buttonProps } = props;
  return <button {...buttonProps} className={className} />;
}
