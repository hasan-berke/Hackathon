import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
 * Gemini 1.5 Flash'a istek gönderir
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {Promise<string>}
 */
export async function callGemini(systemPrompt, userPrompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userPrompt);
  const response = await result.response;
  return response.text();
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
  let mesaj = "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";

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
