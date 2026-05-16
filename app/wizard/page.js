"use client";
import { useState } from "react";
import Link from "next/link";

const SECTORS = [
  { id: "tekstil", label: "Tekstil & Giyim" },
  { id: "gida", label: "Gıda & İçecek" },
  { id: "kozmetik", label: "Kozmetik & Kişisel Bakım" },
  { id: "teknoloji", label: "Teknoloji Aksesuarları" },
  { id: "el_yapimi", label: "El Yapımı & Sanat" },
  { id: "kitap", label: "Kitap & Kırtasiye" },
  { id: "spor", label: "Spor & Outdoor" },
  { id: "ev_dekor", label: "Ev Dekorasyon" },
  { id: "evcil_hayvan", label: "Evcil Hayvan" },
  { id: "dijital_urun", label: "Dijital Ürün" },
];

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    yas: "",
    butce: "",
    sektor: "tekstil",
    ozet: "",
  });

  // Results State
  const [isimler, setIsimler] = useState(null);
  const [chosenName, setChosenName] = useState("");
  const [analiz, setAnaliz] = useState(null);
  const [platformlar, setPlatformlar] = useState(null);
  const [finansman, setFinansman] = useState(null);
  const [yolHaritasi, setYolHaritasi] = useState(null);

  // Carousel indices for Analiz step
  const [firsatIdx, setFirsatIdx] = useState(0);
  const [riskIdx, setRiskIdx] = useState(0);

  const totalSteps = 6;

  // --- Handlers ---
  const handleNext = async () => {
    setError(null);
    setLoading(true);

    try {
      if (step === 1) {
        // Veri zaten varsa direkt ilerle
        if (isimler) { setStep(2); setLoading(false); return; }
        const res = await fetch("/api/isimler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_data: formData }),
        });
        const data = await res.json();
        if (!data.basarili) throw new Error(data.hata);
        setIsimler(data.veri.isimler);
        setFirsatIdx(0);
        setRiskIdx(0);
        setStep(2);
      } else if (step === 2) {
        if (!chosenName) throw new Error("Lütfen devam etmek için bir marka ismi seçin.");
        // Veri zaten varsa direkt ilerle
        if (analiz) { setStep(3); setLoading(false); return; }
        const res = await fetch("/api/analiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_data: formData }),
        });
        const data = await res.json();
        if (!data.basarili) throw new Error(data.hata);
        setAnaliz(data.veri);
        setStep(3);
      } else if (step === 3) {
        // Veri zaten varsa direkt ilerle
        if (platformlar) { setStep(4); setLoading(false); return; }
        const res = await fetch("/api/marketplace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_data: formData, step2_result: analiz, chosen_name: chosenName }),
        });
        const data = await res.json();
        if (!data.basarili) throw new Error(data.hata);
        setPlatformlar(data.veri.platformlar);
        setStep(4);
      } else if (step === 4) {
        // Veri zaten varsa direkt ilerle
        if (finansman) { setStep(5); setLoading(false); return; }
        const res = await fetch("/api/finansman", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_data: formData, step2_result: analiz }),
        });
        const data = await res.json();
        if (!data.basarili) throw new Error(data.hata);
        setFinansman(data.veri);
        setStep(5);
      } else if (step === 5) {
        // Veri zaten varsa direkt ilerle
        if (yolHaritasi) { setStep(6); setLoading(false); return; }
        const allContext = {
          profil: formData,
          analiz,
          secilen_isim: chosenName,
          platformlar,
          finansman
        };
        const res = await fetch("/api/yol-haritasi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ all_context: allContext }),
        });
        const data = await res.json();
        if (!data.basarili) throw new Error(data.hata);
        setYolHaritasi(data.veri);
        setStep(6);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const renderLoader = (text) => (
    <div className="loader-wrap">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );

  return (
    <div className="wizard-wrap">
      <header className="wizard-header">
        <Link href="/" className="wizard-logo">Filiz 🌱</Link>
        <div className="progress-bar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`progress-dot ${step === i ? "active" : ""} ${step > i ? "done" : ""}`}
            />
          ))}
        </div>
      </header>

      {error && <div className="error-box">{error}</div>}

      {/* --- STEP 1: PROFIL --- */}
      {step === 1 && (
        <div className="step-card">
          <div className="step-label">Adım 1 / 6</div>
          <h2 className="step-title">Girişimci Profili</h2>
          <p className="step-desc">Sana özel tavsiyeler üretebilmemiz için biraz bilgi ver.</p>

          <div className="form-grid">
            <div className="form-group">
              <label>Yaş</label>
              <input
                type="number"
                placeholder="Örn: 28"
                value={formData.yas}
                onChange={(e) => setFormData({ ...formData, yas: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Başlangıç Bütçesi (TL)</label>
              <input
                type="number"
                placeholder="Örn: 50000"
                value={formData.butce}
                onChange={(e) => setFormData({ ...formData, butce: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Hedef Sektör</label>
              <select
                value={formData.sektor}
                onChange={(e) => setFormData({ ...formData, sektor: e.target.value })}
              >
                {SECTORS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group full">
              <label>Kısa Fikir Özeti (Opsiyonel)</label>
              <textarea
                placeholder="Ne satmak istiyorsun? Farkın ne olacak?"
                value={formData.ozet}
                onChange={(e) => setFormData({ ...formData, ozet: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 2: MARKA İSMİ --- */}
      {step === 2 && !loading && isimler && (
        <div className="step-card">
          <div className="step-label">Adım 2 / 6</div>
          <h2 className="step-title">Marka İsmi</h2>
          <p className="step-desc">Senin için 5 farklı konsept geliştirdim. Birini seç.</p>

          <div className="name-grid">
            {isimler.map((item, i) => (
              <button
                key={i}
                className={`name-card ${chosenName === item.isim ? 'selected' : ''}`}
                onClick={() => setChosenName(item.isim)}
              >
                <div className="name-card-title">{item.isim}</div>
                <div className="name-card-tone">{item.marka_tonu} • {item.domain_notu}</div>
                <div className="name-card-desc">{item.neden_uygun}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- STEP 3: ANALİZ --- */}
      {step === 3 && !loading && analiz && (
        <div className="step-card">
          <div className="step-label">Adım 3 / 6</div>
          <h2 className="step-title">Sektör Analizi</h2>
          <p className="step-desc">"{chosenName}" markası için seçtiğin pazarın güncel fotoğrafı.</p>

          <div className="result-section">
            <p className="result-text">{analiz.pazar_ozeti}</p>
          </div>

          {/* Fırsatlar Carousel */}
          {analiz.firsatlar?.length > 0 && (
            <div className="result-section">
              <div className="carousel-header">
                <h3>Fırsatlar</h3>
                <span className="carousel-counter">{firsatIdx + 1} / {analiz.firsatlar.length}</span>
              </div>
              <div className="carousel-card carousel-green">
                <div className="carousel-icon">✦</div>
                <p className="carousel-text">{analiz.firsatlar[firsatIdx]}</p>
              </div>
              <div className="carousel-nav">
                <button
                  className="carousel-btn"
                  onClick={() => setFirsatIdx(i => Math.max(0, i - 1))}
                  disabled={firsatIdx === 0}
                >←</button>
                <div className="carousel-dots">
                  {analiz.firsatlar.map((_, i) => (
                    <span
                      key={i}
                      className={`carousel-dot ${i === firsatIdx ? 'active-green' : ''}`}
                      onClick={() => setFirsatIdx(i)}
                    />
                  ))}
                </div>
                <button
                  className="carousel-btn"
                  onClick={() => setFirsatIdx(i => Math.min(analiz.firsatlar.length - 1, i + 1))}
                  disabled={firsatIdx === analiz.firsatlar.length - 1}
                >→</button>
              </div>
            </div>
          )}

          {/* Riskler Carousel */}
          {analiz.riskler?.length > 0 && (
            <div className="result-section">
              <div className="carousel-header">
                <h3 style={{ color: 'var(--danger)' }}>Riskler</h3>
                <span className="carousel-counter">{riskIdx + 1} / {analiz.riskler.length}</span>
              </div>
              <div className="carousel-card carousel-red">
                <div className="carousel-icon" style={{ color: 'var(--danger)' }}>⚠</div>
                <p className="carousel-text">{analiz.riskler[riskIdx]}</p>
              </div>
              <div className="carousel-nav">
                <button
                  className="carousel-btn carousel-btn-red"
                  onClick={() => setRiskIdx(i => Math.max(0, i - 1))}
                  disabled={riskIdx === 0}
                >←</button>
                <div className="carousel-dots">
                  {analiz.riskler.map((_, i) => (
                    <span
                      key={i}
                      className={`carousel-dot ${i === riskIdx ? 'active-red' : ''}`}
                      onClick={() => setRiskIdx(i)}
                    />
                  ))}
                </div>
                <button
                  className="carousel-btn carousel-btn-red"
                  onClick={() => setRiskIdx(i => Math.min(analiz.riskler.length - 1, i + 1))}
                  disabled={riskIdx === analiz.riskler.length - 1}
                >→</button>
              </div>
            </div>
          )}

          <div className="result-section">
            <h3>Bütçe & Tavsiye</h3>
            <p className="result-text" style={{ fontSize: '0.85rem' }}>{analiz.butce_degerlendirmesi}</p>
            <p className="result-text" style={{ marginTop: '0.5rem', color: 'var(--accent)' }}>{analiz.tavsiye}</p>
          </div>

          <div className="score-bar-wrap">
            <div className="score-label">
              <span>Potansiyel Skoru</span>
              <span>{analiz.devam_skoru}/100</span>
            </div>
            <div className="score-track">
              <div className="score-fill" style={{ width: `${analiz.devam_skoru}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 4: MARKETPLACE --- */}
      {step === 4 && !loading && platformlar && (
        <div className="step-card">
          <div className="step-label">Adım 4 / 6</div>
          <h2 className="step-title">Satış Kanalları</h2>
          <p className="step-desc">"{chosenName}" markan için en uygun platformlar.</p>

          <div className="platform-list">
            {platformlar.map((p, i) => (
              <div key={i} className="platform-card">
                <div className="platform-score">{p.tavsiye_skoru}</div>
                <div className="platform-info">
                  <div className="platform-name">{p.isim}</div>
                  <div className="platform-meta">Zorluk: {p.zorluk} • Komisyon: {p.komisyon}</div>
                  <div className="platform-why">{p.neden}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- STEP 5: FİNANSMAN --- */}
      {step === 5 && !loading && finansman && (
        <div className="step-card">
          <div className="step-label">Adım 5 / 6</div>
          <h2 className="step-title">Finansman Rehberi</h2>
          <p className="step-desc">Bütçeni büyütmek için sana özel destek kaynakları.</p>

          <p className="result-text" style={{ marginBottom: "1rem" }}>{finansman.ozet}</p>

          {finansman.onerililer?.map((f, i) => {
            const badgeCls = f.tur === "devlet_hibesi" ? "fin-badge-devlet"
              : f.tur === "banka_kredisi" ? "fin-badge-banka"
              : f.tur === "melek_yatirim" ? "fin-badge-melek"
              : f.tur === "kitle_fonlama" ? "fin-badge-kitle" : "fin-badge-girisim";
            
            return (
              <div key={i} className="fin-card">
                <div className="fin-card-header">
                  <span className={`fin-badge ${badgeCls}`}>{f.tur.replace('_', ' ').toUpperCase()}</span>
                  <div className="fin-name">{f.kaynak_adi}</div>
                </div>
                <div className="fin-amount">{f.tutar_aralik} • Süreç: {f.tahmini_sure}</div>
                <div className="fin-why">{f.neden_uygun}</div>
                <ul className="fin-steps">
                  {f.basvuru_adimlari?.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
                <div style={{ marginTop: "0.5rem" }}>
                  <a href={f.website} target="_blank" rel="noreferrer" className="fin-link">Sitesi: {f.website} ↗</a>
                </div>
              </div>
            );
          })}
          
          <div className="result-section" style={{ marginTop: "1rem" }}>
            <h3>Öncelikli Strateji</h3>
            <p className="result-text" style={{ fontSize: '0.85rem' }}>{finansman.oncelikli_strateji}</p>
          </div>
        </div>
      )}

      {/* --- STEP 6: YOL HARİTASI --- */}
      {step === 6 && !loading && yolHaritasi && (
        <div className="step-card">
          <div className="step-label">Tamamlandı</div>
          <h2 className="step-title">Yol Haritası</h2>
          <p className="step-desc">"{chosenName}" maceran başlıyor. İşte adım adım planın.</p>

          <div className="phase-title">İlk 30 Gün</div>
          <div className="timeline">
            {yolHaritasi.ilk_30_gun?.map((t, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-task">{t.gorev} <span className={
                  t.oncelik === 'yüksek' ? 'priority-high' : t.oncelik === 'orta' ? 'priority-medium' : 'priority-low'
                }>({t.oncelik})</span></div>
                <div className="timeline-desc">{t.aciklama}</div>
              </div>
            ))}
          </div>

          <div className="phase-title" style={{ marginTop: "2rem" }}>İlk 3 Ay</div>
          <div className="timeline">
            {yolHaritasi.ilk_3_ay?.map((t, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-task">{t.gorev}</div>
                <div className="timeline-desc">{t.aciklama}</div>
              </div>
            ))}
          </div>

          <div className="phase-title" style={{ marginTop: "2rem" }}>İlk 6 Ay</div>
          <div className="timeline">
            {yolHaritasi.ilk_6_ay?.map((t, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-task">{t.gorev}</div>
                <div className="timeline-desc">{t.aciklama}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- LOADER --- */}
      {loading && (
        step === 1 ? renderLoader("Marka konseptleri üretiliyor...") :
        step === 2 ? renderLoader("Pazar verileri işleniyor...") :
        step === 3 ? renderLoader("Algoritmalar platform komisyonlarını karşılaştırıyor...") :
        step === 4 ? renderLoader("Uygun finansman ve hibe kaynakları taranıyor...") :
        renderLoader("Aksiyon planı oluşturuluyor...")
      )}

      {/* --- FOOTER BUTTONS --- */}
      {!loading && (
        <div className="wizard-footer">
          {step > 1 && step < 6 && (
            <button className="btn-ghost" onClick={() => setStep(step - 1)}>Geri</button>
          )}
          {step < 6 && (
            <button className="btn-next" onClick={handleNext}>
              {step === 1 ? "Marka İsmi Öner" :
               step === 2 ? "Sektör Analizi Yap" :
               step === 3 ? "Platform Öner" :
               step === 4 ? "Finansman Bul" :
               "Yol Haritası Çıkar"}
            </button>
          )}
          {step === 6 && (
            <button className="btn-next" onClick={() => window.print()}>PDF Olarak Kaydet</button>
          )}
        </div>
      )}
    </div>
  );
}

