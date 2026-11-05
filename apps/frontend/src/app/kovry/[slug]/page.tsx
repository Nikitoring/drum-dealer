import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { RehearsalPointDetail } from '@/components/rehearsal-point-detail';

export default async function RehearsalPointPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main>
      <SiteHeader />
      <section className="page-surface">
        <RehearsalPointDetail slug={slug} />
      </section>
      <SiteFooter />
    </main>
  );
}
