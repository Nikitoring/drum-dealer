import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RehearsalBooking } from "@/components/rehearsal-booking";

export default async function RehearsalPointPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pointNumber = slug === "kovry-2" ? "№2" : "№1";

  return <main><SiteHeader /><section className="page-surface">
    <div className="booking-hero">
      <div className="booking-hero-copy"><h1>Ковры {pointNumber}</h1><p className="booking-lead">Репетиционная точка в центре города</p><ul className="point-details"><li><span className="detail-icon" aria-hidden="true">●</span>ул. Примерная, 12</li><li><span className="detail-icon" aria-hidden="true">◷</span>Ежедневно: 10:00 — 23:00</li><li><span className="detail-icon" aria-hidden="true">☎</span>+7 (999) 123-45-67</li></ul></div>
      <div className="booking-hero-art"><Image alt="Репетиционная комната с музыкальным оборудованием" fill priority sizes="(max-width:640px) 100vw, 50vw" src="/design/05-rehearsal-building.png" /></div>
    </div>
    <RehearsalBooking />
  </section><SiteFooter /></main>;
}
