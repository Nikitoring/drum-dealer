import Image from 'next/image';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ProductCatalog } from '@/components/product-catalog';

export default function CatalogPage() {
  return (
    <main>
      <SiteHeader />
      <section aria-labelledby="catalog-title" className="page-surface">
        <div className="catalog-banner">
          <h1 id="catalog-title">Каталог барабанов</h1>
          <Image
            alt="Малый барабан"
            height={314}
            priority
            sizes="35vw"
            src="/design/illustrations/04-snare-drum.png"
            width={312}
          />
        </div>
        <ProductCatalog />
      </section>
      <SiteFooter />
    </main>
  );
}
