import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ProductDetail } from '@/components/product-detail';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <SiteHeader />
      <section className="page-surface">
        <ProductDetail slug={slug} />
      </section>
      <SiteFooter />
    </main>
  );
}
