"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./landing.css";

export default function Home() {
  const router = useRouter();
  const goWizard = () => router.push("/wizard");

  useEffect(() => {
    // Mouse parallax
    const stage = document.getElementById("stage");
    const world = document.getElementById("world");
    const hint = document.getElementById("hint");
    const cards = document.querySelectorAll("#stage .card");
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tx = nx * 10; ty = -ny * 6; cx = nx; cy = ny;
      if (hint) { hint.style.left = (e.clientX - r.left) + "px"; hint.style.top = (e.clientY - r.top) + "px"; hint.style.opacity = 0.25; }
    };
    const onLeave = () => { tx = 0; ty = 0; cx = 0; cy = 0; if (hint) hint.style.opacity = 0; };
    stage?.addEventListener("pointermove", onMove);
    stage?.addEventListener("pointerleave", onLeave);

    let rafId;
    const tick = () => {
      if (world) { world.style.setProperty("--mx", tx.toFixed(2) + "deg"); world.style.setProperty("--my", ty.toFixed(2) + "deg"); }
      cards.forEach((c) => {
        const base = parseFloat(c.style.getPropertyValue("--ry")) || 0;
        const baseX = parseFloat(c.style.getPropertyValue("--rx")) || 0;
        c.style.transform = `rotateY(${(base + cx * 10).toFixed(2)}deg) rotateX(${(baseX - cy * 8).toFixed(2)}deg)`;
      });
      rafId = requestAnimationFrame(tick);
    };
    tick();

    // Particles — hero
    const layer = document.getElementById("particles");
    if (layer) {
      const tints = ["", "warm", "cool", "", "", "cool"];
      for (let i = 0; i < 60; i++) {
        const p = document.createElement("span");
        p.className = "p" + (tints[Math.floor(Math.random() * tints.length)] ? " " + tints[Math.floor(Math.random() * tints.length)] : "");
        const dur = 9 + Math.random() * 14;
        p.style.cssText = `left:${Math.random() * 100}%;width:${2 + Math.random() * 4}px;height:${2 + Math.random() * 4}px;--dx:${Math.random() * 60 - 30}px;animation-duration:${dur}s;animation-delay:${-Math.random() * dur}s;opacity:.9`;
        layer.appendChild(p);
      }
    }

    // Particles — CTA
    const ctaLayer = document.getElementById("ctaParticles");
    if (ctaLayer) {
      for (let i = 0; i < 30; i++) {
        const p = document.createElement("span");
        const t = ["", "", "cool", "warm"][Math.floor(Math.random() * 4)];
        p.className = "p" + (t ? " " + t : "");
        const dur = 11 + Math.random() * 16;
        p.style.cssText = `left:${Math.random() * 100}%;width:${2 + Math.random() * 3.5}px;height:${2 + Math.random() * 3.5}px;--dx:${Math.random() * 50 - 25}px;animation-duration:${dur}s;animation-delay:${-Math.random() * dur}s;opacity:.85`;
        ctaLayer.appendChild(p);
      }
    }

    // Card hover tilt
    document.querySelectorAll(".feature, .step").forEach((el) => {
      el.style.transformStyle = "preserve-3d";
      const mv = (e) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `translateY(-4px) perspective(900px) rotateY(${(nx * 6).toFixed(2)}deg) rotateX(${(-ny * 5).toFixed(2)}deg)`;
      };
      el.addEventListener("pointermove", mv);
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });

    return () => {
      stage?.removeEventListener("pointermove", onMove);
      stage?.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="brand">Filiz 🌱</div>
        <div className="nav-links">
          <a href="#how">Nasıl Çalışır</a>
          <a href="#features">Özellikler</a>
          <a href="#start">Hakkında</a>
        </div>
        <button className="nav-cta" onClick={goWizard}>Başla</button>
      </nav>

      {/* HERO STAGE */}
      <div className="stage" id="stage">
        <div className="light-warm" /><div className="light-cool" />
        <div className="world" id="world">
          <div className="ground" />

          {/* Orbit 3 */}
          <div className="orbit o3 dof-far">
            <div className="ring" />
            <div className="pos place" style={{"--r":"480px","--a":"25deg","--h":"60px"}}>
              <div className="sat"><div className="sat-inner bob-c">
                <div className="card sm" style={{"--ry":"-22deg","--rx":"6deg"}}>
                  <div className="chip" />
                  <div className="face"><svg className="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10 24l4-10h36l4 10"/><path d="M10 24v26h44V24"/><path d="M10 24c0 4 3 7 7 7s7-3 7-7c0 4 3 7 7 7s7-3 7-7c0 4 3 7 7 7s7-3 7-7"/><path d="M26 50V36h12v14"/></svg></div>
                  <div className="strip" />
                </div>
              </div></div>
            </div>
            <div className="pos place" style={{"--r":"480px","--a":"155deg","--h":"-30px"}}>
              <div className="sat"><div className="sat-inner">
                <div className="card sm" style={{"--ry":"18deg","--rx":"-4deg"}}>
                  <div className="chip" />
                  <div className="face"><svg className="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="14" width="48" height="36" rx="5"/><path d="M8 24h48"/><path d="M16 40h10M30 40h6"/></svg></div>
                  <div className="strip" />
                </div>
              </div></div>
            </div>
            <div className="pos place" style={{"--r":"480px","--a":"265deg","--h":"20px"}}>
              <div className="sat"><div className="sat-inner bob-b">
                <div className="card sm" style={{"--ry":"-10deg","--rx":"10deg"}}>
                  <div className="chip" />
                  <div className="face"><svg className="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M30 8H12a4 4 0 0 0-4 4v18l26 26 22-22z"/><circle cx="20" cy="20" r="3"/></svg></div>
                  <div className="strip" />
                </div>
              </div></div>
            </div>
          </div>

          {/* Orbit 2 */}
          <div className="orbit o2">
            <div className="ring" />
            <div className="pos place" style={{"--r":"380px","--a":"60deg","--h":"90px"}}>
              <div className="sat"><div className="sat-inner">
                <div className="card" style={{"--ry":"-18deg","--rx":"6deg"}}>
                  <div className="chip" />
                  <div className="face"><svg className="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22h36l-3 30a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4z"/><path d="M22 22a10 10 0 0 1 20 0"/></svg></div>
                  <div className="strip" />
                </div>
              </div></div>
            </div>
            <div className="pos place" style={{"--r":"380px","--a":"200deg","--h":"-50px"}}>
              <div className="sat"><div className="sat-inner bob-c">
                <div className="card" style={{"--ry":"20deg","--rx":"-6deg"}}>
                  <div className="chip" />
                  <div className="face"><svg className="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M32 8L8 20v24l24 12 24-12V20z"/><path d="M8 20l24 12 24-12"/><path d="M32 32v24"/><path d="M20 14l24 12"/></svg></div>
                  <div className="strip" />
                </div>
              </div></div>
            </div>
            <div className="pos place" style={{"--r":"380px","--a":"320deg","--h":"30px"}}>
              <div className="sat"><div className="sat-inner bob-b">
                <div className="card" style={{"--ry":"-6deg","--rx":"8deg"}}>
                  <div className="chip" />
                  <div className="face"><svg className="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="10" y="14" width="44" height="38" rx="3"/><path d="M10 24h44"/><circle cx="18" cy="19" r="1.4" fill="currentColor"/><circle cx="24" cy="19" r="1.4" fill="currentColor"/><path d="M20 34h24M20 40h16"/></svg></div>
                  <div className="strip" />
                </div>
              </div></div>
            </div>
          </div>

          {/* Orbit 1 */}
          <div className="orbit o1 dof-near">
            <div className="ring" />
            <div className="pos place" style={{"--r":"260px","--a":"35deg","--h":"140px"}}>
              <div className="sat"><div className="sat-inner bob-b">
                <div className="card lg" style={{"--ry":"-22deg","--rx":"6deg"}}>
                  <div className="chip" />
                  <div className="face"><svg className="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h6l4 28a4 4 0 0 0 4 3h24a4 4 0 0 0 4-3l3-18H18"/><circle cx="24" cy="52" r="3"/><circle cx="44" cy="52" r="3"/></svg></div>
                  <div className="strip" />
                </div>
              </div></div>
            </div>
            <div className="pos place" style={{"--r":"260px","--a":"215deg","--h":"-100px"}}>
              <div className="sat"><div className="sat-inner">
                <div className="card lg" style={{"--ry":"22deg","--rx":"-8deg"}}>
                  <div className="chip" />
                  <div className="face"><svg className="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M16 24h32l-2 28a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z"/><path d="M24 24v-4a8 8 0 0 1 16 0v4"/><path d="M26 36h12"/></svg></div>
                  <div className="strip" />
                </div>
              </div></div>
            </div>
          </div>

          {/* Sprout */}
          <div className="sprout-wrap">
            <div className="glow-core" />
            <div className="sprout">
              <svg viewBox="0 0 160 200" aria-hidden="true">
                <defs>
                  <linearGradient id="stem" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#0f3a25"/><stop offset="55%" stopColor="#5fd594"/><stop offset="100%" stopColor="#c9ffe1"/></linearGradient>
                  <radialGradient id="leafA" cx="30%" cy="30%" r="80%"><stop offset="0%" stopColor="#e8ffef"/><stop offset="30%" stopColor="#7ef0a8"/><stop offset="70%" stopColor="#1f8a5b"/><stop offset="100%" stopColor="#062a17"/></radialGradient>
                  <radialGradient id="leafB" cx="70%" cy="35%" r="85%"><stop offset="0%" stopColor="#f0fff6"/><stop offset="25%" stopColor="#9bf6bd"/><stop offset="70%" stopColor="#2aa66c"/><stop offset="100%" stopColor="#04200f"/></radialGradient>
                  <radialGradient id="warmKick" cx="20%" cy="20%" r="80%"><stop offset="0%" stopColor="rgba(220,255,232,.85)"/><stop offset="60%" stopColor="rgba(220,255,232,0)"/></radialGradient>
                  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".6"/></filter>
                </defs>
                <path d="M80 200 C 80 160, 82 140, 80 110 C 78 90, 82 70, 80 50" stroke="url(#stem)" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#soft)"/>
                <path d="M80 95 C 50 90, 28 70, 26 50 C 50 48, 76 65, 80 95 Z" fill="url(#leafA)"/>
                <path d="M80 95 C 60 88, 44 76, 36 60" stroke="#03180c" strokeWidth="1.2" fill="none" opacity=".55"/>
                <path d="M80 95 C 50 90, 28 70, 26 50 C 50 48, 76 65, 80 95 Z" fill="url(#warmKick)" opacity=".55"/>
                <path d="M80 78 C 110 70, 134 48, 138 24 C 110 26, 86 46, 80 78 Z" fill="url(#leafB)"/>
                <path d="M80 78 C 100 70, 118 56, 128 38" stroke="#03180c" strokeWidth="1.2" fill="none" opacity=".55"/>
                <path d="M80 78 C 110 70, 134 48, 138 24 C 110 26, 86 46, 80 78 Z" fill="url(#warmKick)" opacity=".35"/>
                <circle cx="80" cy="50" r="4" fill="#e8ffef"/>
                <circle cx="80" cy="50" r="9" fill="rgba(126,240,168,.45)"/>
              </svg>
            </div>
            <div className="soil-rim" /><div className="soil" />
          </div>
        </div>

        <div className="particles" id="particles" />
        <div className="horizon" /><div className="vignette" /><div className="grain" />
        <div className="cursor-hint" id="hint" />
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="how-bg"><div className="blob-warm" /><div className="blob-cool" /></div>
        <div className="section-head">
          <span className="section-eyebrow">Nasıl Çalışır</span>
          <h2 className="section-title">Altı adımda <span className="accent">fikrinden</span> markana</h2>
          <p className="section-sub">Profil bilgilerinden yola çıkarak AI sana özel marka ismi, sektör analizi, riskler, platform önerisi, finansman rehberi ve yol haritası üretir.</p>
        </div>
        <div className="steps steps-6">
          {/* Arka plan bağlantı çizgileri (CSS cache'e takılmaması için explicit) */}
          <div className="row-line row-line-1" />
          <div className="row-line row-line-2" />
          
          <div className="glass step">
            <span className="step-num">ADIM 01</span>
            <div className="step-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="10" width="48" height="44" rx="6"/><path d="M16 22h32M16 32h22M16 42h16"/><circle cx="48" cy="42" r="6" fill="currentColor" opacity=".25"/><path d="M44 42l3 3 5-6"/></svg></div>
            <h3>Profilini Oluştur</h3>
            <p>Yaşın, başlangıç bütçen ve hedef sektörünü gir. Bir de kısa fikir özetin varsa ekle.</p>
          </div>
          <div className="glass step">
            <span className="step-num">ADIM 02</span>
            <div className="step-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12h6l4 28a4 4 0 0 0 4 3h24a4 4 0 0 0 4-3l3-18H18"/><circle cx="24" cy="52" r="3"/><circle cx="44" cy="52" r="3"/></svg></div>
            <h3>Marka İsmini Seç</h3>
            <p>AI sektörüne ve hedef kitlenë uygun 5 farklı marka ismi konsepti önerir. Sen seçersin ya da kendi ismini yazarsın.</p>
          </div>
          <div className="glass step">
            <span className="step-num">ADIM 03</span>
            <div className="step-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="32" cy="32" r="14"/><path d="M32 18v6M32 40v6M18 32h6M40 32h6M22 22l4 4M38 38l4 4M22 42l4-4M38 26l4-4"/><circle cx="32" cy="32" r="4" fill="currentColor"/></svg></div>
            <h3>Sektör Analizi</h3>
            <p>Pazarın büyüklüğü, fırsatlar ve <strong>riskler</strong> detaylı analiz edilir. Potansiyel skoru ile ilerleyip ilerlemeyeceğini gör.</p>
          </div>
          <div className="glass step">
            <span className="step-num">ADIM 04</span>
            <div className="step-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M24 6L8 12v16c0 14 8 22 16 26 8-4 16-12 16-26V12z"/><path d="M18 32l6 6 12-14"/></svg></div>
            <h3>Satış Platformu</h3>
            <p>Trendyol, Hepsiburada, Amazon TR, Etsy ve dahası. Ürününe en uygun kanallar gerçek komisyon verileriyle karşılaştırılır.</p>
          </div>
          <div className="glass step">
            <span className="step-num">ADIM 05</span>
            <div className="step-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="14" width="48" height="36" rx="5"/><path d="M8 24h48"/><path d="M16 40h10M30 40h6"/></svg></div>
            <h3>Finansman Rehberi</h3>
            <p>KOSGEB hibeleri, KGF kredileri ve TÜBİTAK destekleri dahil bütçene uygun kaynaklar ve başvuru adımları listelenir.</p>
          </div>
          <div className="glass step">
            <span className="step-num">ADIM 06</span>
            <div className="step-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M32 8L8 20v24l24 12 24-12V20z"/><path d="M8 20l24 12 24-12"/><path d="M32 32v24"/><path d="M20 14l24 12"/></svg></div>
            <h3>Yol Haritanı Al</h3>
            <p>İlk 30 gün, 3 ay ve 6 aylık aksiyon planın hazır. Her adım önceliklendirilmiş, somut görevler halinde.</p>
          </div>
        </div>
      </section>


      <div className="divider" />

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-head">
          <span className="section-eyebrow">Ne Alırsın</span>
          <h2 className="section-title">Girişimin için <span className="accent">eksiksiz başlangıç</span> paketi</h2>
          <p className="section-sub">Tek bir girişten altı kritik çıktı. Markan, pazar analizi, satış kanalın, finansmanın ve net bir yol haritası.</p>
        </div>
        <div className="features">
          <div className="glass feature">
            <div className="feature-icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12h28M10 22h28M10 32h18"/><circle cx="36" cy="34" r="6"/><path d="M40 38l4 4"/></svg></div>
            <div><h3>Marka İsmi Önerisi</h3><p>Sektörüne, hedef kitlene ve marka tonuna uygun 5 farklı konsept. Her biri için domain notu ve marka tonu açıklanır.</p><div className="tag"><span>5 konsept</span><span>Domain notu</span><span>Marka tonu</span></div></div>
          </div>
          <div className="glass feature">
            <div className="feature-icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 18l3-7h26l3 7"/><path d="M8 18v22h32V18"/><path d="M8 18c0 3 2 5 5 5s5-2 5-5c0 3 2 5 5 5s5-2 5-5c0 3 2 5 5 5s5-2 5-5"/><path d="M20 40V30h8v10"/></svg></div>
            <div><h3>Sektör Analizi</h3><p>Pazarın büyüklüğü, fırsatlar, riskler ve bütçe değerlendirmesi. Potansiyel skoru ile devam etmeye değip değmediğini gör.</p><div className="tag"><span>Fırsatlar</span><span>Riskler</span><span>Bütçe skoru</span></div></div>
          </div>
          <div className="glass feature">
            <div className="feature-icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M24 6l16 6v10c0 11-7 17-16 20-9-3-16-9-16-20V12z"/><path d="M16 23l6 6 10-12"/></svg></div>
            <div><h3>Marketplace Seçimi</h3><p>Trendyol, Hepsiburada, Amazon TR, Etsy ve dahası. Ürününe ve marjına en uygun kanallar gerçek komisyon verileriyle karşılaştırılır.</p><div className="tag"><span>Komisyon</span><span>Zorluk</span><span>Tavsiye skoru</span></div></div>
          </div>
          <div className="glass feature">
            <div className="feature-icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12c4-4 10 4 16 0s8-4 16 0"/><path d="M8 24c4-4 10 4 16 0s8-4 16 0"/><path d="M8 36c4-4 10 4 16 0s8-4 16 0"/><circle cx="8" cy="12" r="2" fill="currentColor"/><circle cx="40" cy="24" r="2" fill="currentColor"/><circle cx="24" cy="36" r="2" fill="currentColor"/></svg></div>
            <div><h3>Finansman Rehberi</h3><p>KOSGEB, TÜBİTAK ve KGF destekleri dahil uygun finansman kaynaklarını bulur. Başvuru adımlarını ve website linklerini verir.</p><div className="tag"><span>KOSGEB</span><span>KGF</span><span>Hibe &amp; Kredi</span></div></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="start">
        <div className="cta-particles" id="ctaParticles" />
        <div className="cta-inner">
          <span className="section-eyebrow">Başlama Zamanı</span>
          <h2 className="cta-title" style={{marginTop:"20px"}}>Fikrinin <span className="accent-green">filizlenme</span> zamanı geldi</h2>
          <p className="cta-sub">Birkaç dakika içinde girişiminin haritası elinde olsun.</p>
          <button className="cta-btn" onClick={goWizard}>
            Yolculuğuna Başla
            <svg className="arrow-r" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M11 5l5 5-5 5"/></svg>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="brand">Filiz 🌱</div>
        <div>© 2026 Filiz</div>
      </footer>
    </>
  );
}
