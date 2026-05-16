import { NextResponse } from "next/server";
import {
  getPazarVerisi,
  buildSystemPrompt,
  callGemini,
  parseGeminiResponse,
  buildErrorResponse,
} from "../../lib/gemini";

export async function POST(request) {
  try {
    // İstek gövdesini oku
    const body = await request.json();
    const { user_data, step2_result } = body;

    if (!user_data) {
      return NextResponse.json(
        { hata: "user_data alanı zorunludur.", basarili: false },
        { status: 400 }
      );
    }

    // Pazar verisini oku ve sistem promptunu oluştur
    const pazarVerisi = getPazarVerisi();
    const systemPrompt = buildSystemPrompt(pazarVerisi);

    // Sektör analizini opsiyonel olarak dahil et
    const analizBolumu = step2_result
      ? `\nSektör Analizi: ${JSON.stringify(step2_result, null, 2)}`
      : "";

    // Kullanıcı promptunu oluştur
    const userPrompt = `Girişimci: ${JSON.stringify(user_data, null, 2)}${analizBolumu}

Bu girişimcinin profiline, bütçesine ve sektörüne göre en uygun finansman kaynaklarını öner.
Sağlanan pazar verisindeki finansman_kaynaklari bölümünü mutlaka kullan.
Her öneri için başvuru adımlarını ve gerçek website URL'sini belirt.

Döndür (yalnızca JSON):
{
  "ozet": "string (girişimcinin finansman durumunun kısa değerlendirmesi)",
  "onerililer": [
    {
      "kaynak_adi": "string",
      "tur": "devlet_hibesi | banka_kredisi | melek_yatirim | kitle_fonlama | girisim_sermayesi",
      "tutar_aralik": "string",
      "neden_uygun": "string",
      "kosullar": ["string"],
      "basvuru_adimlari": ["string"],
      "website": "string",
      "tavsiye_skoru": 1-10,
      "zorluk": "düşük | orta | yüksek",
      "tahmini_sure": "string (başvurudan onaya kadar)"
    }
  ],
  "oncelikli_strateji": "string (hangi kaynaktan hangi sırayla başlanmalı)",
  "uyarilar": ["string"]
}`;

    // Gemini'yi çağır
    const rawResponse = await callGemini(systemPrompt, userPrompt);

    // Yanıtı parse et
    const parsed = parseGeminiResponse(rawResponse);

    return NextResponse.json({ basarili: true, veri: parsed }, { status: 200 });
  } catch (err) {
    const { json, status } = buildErrorResponse(err);
    return NextResponse.json(json, { status });
  }
}
