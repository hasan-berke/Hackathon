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

    // Kullanıcı promptunu oluştur (analiz varsa ekle, yoksa sadece profille çalış)
    const analizKisim = step2_result
      ? `\nAnaliz: ${JSON.stringify(step2_result, null, 2)}`
      : "";

    const userPrompt = `Girişimci: ${JSON.stringify(user_data, null, 2)}${analizKisim}

5 marka ismi öner. Döndür (yalnızca JSON):
{
  "isimler": [
    {
      "isim": "string",
      "neden_uygun": "string",
      "domain_notu": "string",
      "marka_tonu": "string"
    }
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
