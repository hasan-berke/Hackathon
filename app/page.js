"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="landing">
      <div className="landing-logo">🌱</div>

      <h1>Filiz</h1>

      <p className="landing-sub">
        Yapay zeka destekli Türkiye e-ticaret danışmanın. Sektör analizi,
        marka ismi, platform önerisi ve finansman rehberi — 5 adımda.
      </p>

      <Link href="/wizard" className="btn-primary">
        Başla →
      </Link>

      <div className="landing-tags">
        {[
          "Sektör Analizi",
          "Marka İsmi",
          "Marketplace Önerisi",
          "Finansman Rehberi",
          "Yol Haritası",
          "KOSGEB & TÜBİTAK",
          "Trendyol · Etsy · Amazon TR",
        ].map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
    </main>
  );
}
