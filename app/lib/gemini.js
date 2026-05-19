import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Mevcut tüm API key'leri listeden döndürür.
 * Önce numaralı key'lere bakar (KEY_1, KEY_2, KEY_3),
 * sonra fallback olarak ana GEMINI_API_KEY'i ekler.
 */
function getApiKeys() {
  const keys = [];
  for (let i = 1; i <= 5; i++) {
    const k = process.env[`GEMINI_API_KEY_${i}`];
    if (k && k.trim()) keys.push(k.trim());
  }
  // Ana key'i de ekle (zaten yukarıdakilerden biri değilse)
  const mainKey = process.env.GEMINI_API_KEY;
  if (mainKey && mainKey.trim() && !keys.includes(mainKey.trim())) {
    keys.push(mainKey.trim());
  }
  return keys;
}

/**
 * Pazar verisini /data/pazar.json'dan okur
 */
export function getPazarVerisi() {
  try {
    const filePath = join(process.cwd(), "data", "pazar.json");
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    throw new Error("Pazar verisi okunamadı. data/pazar.json dosyasını kontrol edin.");
  }
}

/**
 * Gemini sistem promptunu oluşturur — pazar verisini enjekte eder
 */
export function buildSystemPrompt(pazarJson) {
  return `Sen deneyimli bir Türk iş geliştirme danışmanısın. Aşağıdaki güncel Türkiye pazar verileri sana sağlanmıştır:

[PAZAR_VERISI]
${JSON.stringify(pazarJson, null, 2)}
[/PAZAR_VERISI]

Sadece JSON döndür, başka hiçbir şey yazma.`;
}

/**
 * Gemini Flash'a istek gönderir.
 * Birden fazla API key varsa, 429/403 hatalarında sıradakine geçer.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {Promise<string>}
 */
export async function callGemini(systemPrompt, userPrompt) {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error("Hiçbir Gemini API key bulunamadı. .env.local dosyasını kontrol edin.");
  }

  let lastError;
  for (let i = 0; i < keys.length; i++) {
    try {
      console.log(`[Gemini] Key #${i + 1} deneniyor...`);
      const genAI = new GoogleGenerativeAI(keys[i]);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt,
      });
      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      console.log(`[Gemini] Key #${i + 1} başarılı.`);
      return response.text();
    } catch (err) {
      const msg = err?.message || "";
      const isRetryable =
        msg.includes("429") || msg.includes("quota") ||
        msg.includes("403") || msg.includes("leaked") ||
        msg.includes("RESOURCE_EXHAUSTED");

      if (isRetryable && i < keys.length - 1) {
        console.warn(`[Gemini] Key #${i + 1} başarısız (${msg.slice(0, 60)}...), sonraki key deneniyor.`);
        lastError = err;
        continue;
      }
      throw err; // Retry edilemez hata veya son key — fırlat
    }
  }
  throw lastError;
}

/**
 * Gemini yanıtındaki ```json ... ``` bloklarını temizler ve parse eder
 * @param {string} raw
 * @returns {object}
 */
export function parseGeminiResponse(raw) {
  let cleaned = raw.trim();

  // ```json ... ``` veya ``` ... ``` bloklarını soy
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");

  return JSON.parse(cleaned);
}

/**
 * Türkçe hata yanıtı üretir
 * @param {Error | unknown} err
 * @param {number} status
 * @returns {{ json: object, status: number }}
 */
export function buildErrorResponse(err, status = 500) {
  console.error(">>> GEMINI API HATASI:", err);
  // Hatanın aslını da döndürerek Vercel'de ne olduğunu anlayalım
  let mesaj = `Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin. (Hata detayı: ${err?.message || "Bilinmiyor"})`;

  if (err instanceof Error) {
    if (err.message.includes("API_KEY") || err.message.includes("401")) {
      mesaj = "Gemini API anahtarı geçersiz veya eksik. GEMINI_API_KEY ortam değişkenini kontrol edin.";
      status = 401;
    } else if (err.message.includes("429") || err.message.includes("quota")) {
      mesaj = "Gemini API kotası aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.";
      status = 429;
    } else if (err.message.includes("JSON") || err.message instanceof SyntaxError) {
      mesaj = "Yapay zeka geçerli bir JSON yanıtı döndürmedi. Lütfen tekrar deneyin.";
      status = 502;
    } else if (err.message.includes("pazar verisi")) {
      mesaj = err.message;
      status = 500;
    }
  }

  return {
    json: { hata: mesaj, basarili: false },
    status,
  };
}
