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
    const { user_data, step2_result, chosen_name } = body;

    if (!user_data || !step2_result || !chosen_name) {
      return NextResponse.json(
        {
          hata: "user_data, step2_result ve chosen_name alanları zorunludur.",
          basarili: false,
        },
        { status: 400 }
      );
    }

    // Pazar verisini oku ve sistem promptunu oluştur
    const pazarVerisi = getPazarVerisi();
    const systemPrompt = buildSystemPrompt(pazarVerisi);

    // Kullanıcı promptunu oluştur
    const userPrompt = `Girişimci: ${JSON.stringify(user_data, null, 2)}
Sektör Analizi: ${JSON.stringify(step2_result, null, 2)}
Seçilen Marka İsmi: ${chosen_name}

Bu girişim için en uygun satış platformlarını öner. Döndür (yalnızca JSON):
{
  "platformlar": [
    {
      "isim": "string",
      "komisyon": "string",
      "hedef_kitle": "string",
      "zorluk": "düşük | orta | yüksek",
      "tavsiye_skoru": 1-10,
      "neden": "string"
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
