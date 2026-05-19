# Filiz AI Consultancy 🌱

**Filiz**, girişimcilere ve yeni iş kurmak isteyenlere rehberlik eden, yapay zeka destekli bir e-ticaret iş danışmanlığı uygulamasıdır. Bu proje bir **Hackathon** kapsamında geliştirilmiştir.

Filiz, kullanıcının girdiği yaş, bütçe, sektör ve iş fikri özetine dayanarak tamamen kişiselleştirilmiş bir iş kurma serüveni tasarlar. 6 adımlı interaktif bir asistan (wizard) aracılığıyla marka isminden satış platformlarına, finansman kaynaklarından detaylı yol haritasına kadar 360 derece danışmanlık hizmeti sunar.

## 🚀 Özellikler & Asistan Adımları

Uygulama 6 temel adımdan oluşmaktadır:

1. **Girişimci Profili (Adım 1):** Kullanıcıdan yaş, bütçe, sektör (Tekstil, Gıda, Kozmetik, Teknoloji, vb.) ve fikir özeti alınır.
2. **Marka İsmi (Adım 2):** Girilen bilgilere göre 5 farklı marka ismi konsepti (marka tonu, uygunluk nedeni ve domain notu ile birlikte) üretilir. Kullanıcı isterse kendi ismini de belirleyebilir.
3. **Sektör Analizi (Adım 3):** Seçilen marka ve sektöre özel pazar özeti, fırsatlar ve riskler analiz edilir. Dinamik carousel yapılarıyla desteklenen bir potansiyel skoru sunulur.
4. **Satış Kanalları (Adım 4):** Pazaryerleri ve e-ticaret platformları, tavsiye skorları, komisyon oranları ve zorluk dereceleriyle listelenir.
5. **Finansman Rehberi (Adım 5):** Devlet hibeleri, melek yatırımlar, kitle fonlama veya banka kredileri gibi bütçeye uygun dış finansman kaynakları ve başvuru adımları önerilir.
6. **Yol Haritası (Adım 6):** İlk 30 gün, ilk 3 ay ve ilk 6 ay için önceliklendirilmiş detaylı bir aksiyon planı çıkartılır.

## 🧠 Teknik Mimari ve Yapay Zeka Entegrasyonu

- **Framework:** Next.js (App Router) ile geliştirilmiştir. Hem Frontend (React) hem de Backend API Route'ları aynı proje içerisindedir.
- **Yapay Zeka:** `@google/generative-ai` kütüphanesi ile **Gemini 2.5 Flash** modeli kullanılmıştır.
- **API Rotasyonu & Dayanıklılık:** Çoklu API anahtarı desteği (API Key Rotation) mevcuttur. Eğer bir API anahtarı "Rate Limit (429)" veya başka bir hata verirse, sistem otomatik olarak diğer tanımlı anahtarlara (`GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`, vs.) geçiş yapar.
- **Yerel Veri Kaynakları:** Uygulama, LLM'in halüsinasyon görmesini engellemek ve Türkiye pazarına özel isabetli tavsiyeler vermek için `data/pazar.json`, `platformlar.json` ve çeşitli finansal CSV dosyalarından beslenir. Promptlar bu lokal verilerle zenginleştirilerek (RAG benzeri bir yaklaşımla) Gemini'a gönderilir.

## 💻 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v18+)
- npm, yarn, pnpm veya bun

### 1. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

### 2. Çevre Değişkenlerini Ayarlayın

Projenin kök dizininde bir `.env.local` dosyası oluşturun ve Gemini API anahtarlarınızı ekleyin. Sistem çoklu anahtar destekler:

```env
GEMINI_API_KEY=senin_ana_api_anahtarin
GEMINI_API_KEY_1=yedek_api_anahtari_1
GEMINI_API_KEY_2=yedek_api_anahtari_2
# 5'e kadar yedek eklenebilir
```

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
# veya
yarn dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## 📂 Proje Yapısı

- `app/api/`: Backend servisleri (analiz, finansman, isimler, marketplace, yol-haritasi).
- `app/wizard/`: 6 adımlı interaktif React arayüzü (`page.js`).
- `app/lib/gemini.js`: Gemini API bağlantısı, prompt oluşturma, hata yönetimi ve API Key rotasyon mantığı.
- `data/`: Sistemin beslendiği yerel JSON ve CSV pazar veri dosyaları.
- `app/globals.css` & `app/landing.css`: Projeye özel tasarlanmış CSS dosyaları (Tailwind kullanılmamış, modern ve dinamik Vanilla CSS tercih edilmiştir).

---

*Hackathon için sevgiyle ve yapay zeka ile geliştirildi.* 🌱
