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
    const { user_data } = body;

    if (!user_data) {
      return NextResponse.json(
        { hata: "user_data alanı zorunludur.", basarili: false },
        { status: 400 }
      );
    }

    // Pazar verisini oku ve sistem promptunu oluştur
    const pazarVerisi = getPazarVerisi();
    const systemPrompt = buildSystemPrompt(pazarVerisi);

    // Kullanıcı promptunu oluştur
    const userPrompt = `Girişimci: ${JSON.stringify(user_data, null, 2)} — Sektör analizi yap.

Döndür (yalnızca JSON):
{
  "pazar_ozeti": "string",
  "firsatlar": ["string", "string", ...],
  "riskler": ["string", "string", ...],
  "butce_degerlendirmesi": "string",
  "tavsiye": "string",
  "devam_skoru": 0-100
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
