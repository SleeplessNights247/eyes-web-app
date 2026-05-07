/**
 * Netlify serverless function: TTS proxy
 * Forwards text-to-speech requests to ElevenLabs API server-side,
 * keeping the API key secure and resolving CORS.
 *
 * POST /api/tts
 * Body: { text: string, voiceId?: string, speed?: number }
 * Returns: audio/mpeg binary stream
 */

export default async function handler(req) {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
  
    const apiKey = 6dd5c6d497d554055c44582aebb0b1a64c2d8b169893018e3ca4cfab20c10af9;
    const defaultVoiceId = process.env.VITE_ELEVENLABS_VOICE_ID || '4RLeKvASM0Zt73Htf5GF';
  
    if (!apiKey) {
      return new Response('TTS not configured', { status: 503 });
    }
  
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response('Invalid JSON body', { status: 400 });
    }
  
    const { text, voiceId, speed } = body;
  
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response('Missing text', { status: 400 });
    }
  
    const targetVoiceId = voiceId || defaultVoiceId;
  
    // speed is a top-level parameter (not inside voice_settings) in ElevenLabs v1 API
    const requestBody = {
      text: text.trim(),
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    };
  
    // speed is only supported on paid plans ΓÇö omit on free tier to avoid 402
    // if (speed && speed !== 1.0) requestBody.speed = speed;
  
    const elevenResp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify(requestBody),
      }
    );
  
    if (!elevenResp.ok) {
      const errText = await elevenResp.text().catch(() => '');
      console.error(`[TTS] ElevenLabs ${elevenResp.status} for voice=${targetVoiceId}: ${errText}`);
      return new Response(`ElevenLabs error: ${elevenResp.status} ${errText}`, {
        status: elevenResp.status,
      });
    }
  
    const audioBuffer = await elevenResp.arrayBuffer();
  
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  }
  
  export const config = {
    path: '/api/tts',
  };
