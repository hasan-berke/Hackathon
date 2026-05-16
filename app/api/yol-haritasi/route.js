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
    const { all_context } = body;

    if (!all_context) {
      return NextResponse.json(
        { hata: "all_context alanı zorunludur.", basarili: false },
        { status: 400 }
      );
    }

    // Pazar verisini oku ve sistem promptunu oluştur
    const pazarVerisi = getPazarVerisi();
    const systemPrompt = buildSystemPrompt(pazarVerisi);

    // Kullanıcı promptunu oluştur
    const userPrompt = `Tüm bağlam: ${JSON.stringify(all_context, null, 2)}

Bu girişimci için kapsamlı bir yol haritası oluştur. Döndür (yalnızca JSON):
{
  "ilk_30_gun": [
    { "gorev": "string", "aciklama": "string", "oncelik": "yüksek | orta | düşük" }
  ],
  "ilk_3_ay": [
    { "gorev": "string", "aciklama": "string", "oncelik": "yüksek | orta | düşük" }
  ],
  "ilk_6_ay": [
    { "gorev": "string", "aciklama": "string", "oncelik": "yüksek | orta | düşük" }
  ]
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
