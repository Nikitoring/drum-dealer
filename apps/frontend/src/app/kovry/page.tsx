import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { RehearsalPointsList } from '@/components/rehearsal-points-list';

export default function RehearsalPointsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-surface points-page">
        <h1 className="section-title">Репетиционные точки «Ковры»</h1>
        <RehearsalPointsList />
      </section>
      <SiteFooter />
    </main>
  );
}
