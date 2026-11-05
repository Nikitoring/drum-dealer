import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const points = [
  { slug: "kovry-1", title: "Ковры №1", address: "ул. Примерная, 12" },
  { slug: "kovry-2", title: "Ковры №2", address: "ул. Музыкальная, 7" },
];

export default function RehearsalPointsPage() {
  return <main><SiteHeader /><section className="page-surface points-page"><h1 className="section-title">Репетиционные точки «Ковры»</h1><div className="points-grid">{points.map((point) => <article className="point-card" key={point.slug}><Image alt="Репетиционное пространство" height={296} src="/design/05-rehearsal-building.png" width={310} /><div><p className="eyebrow">Репетиционная точка</p><h2>{point.title}</h2><p>{point.address}</p><Link className="button button-red" href={`/kovry/${point.slug}`}>Подробнее <span aria-hidden="true">→</span></Link></div></article>)}</div></section><SiteFooter /></main>;
}
