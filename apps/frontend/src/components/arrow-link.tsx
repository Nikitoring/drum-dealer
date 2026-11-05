import Link from "next/link";

export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link className={`arrow-link ${className}`} href={href}>{children}<span aria-hidden="true">→</span></Link>;
}
