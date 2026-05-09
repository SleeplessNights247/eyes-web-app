import { elevenLabsTtsService } from './elevenLabsTts';

export class TtsService {
  private defaultRate = 0.9;

  init() {
    // ElevenLabs needs no initialization
  }

  setSpeechRate(flutterRate: number) {
    // Map 0.25–1.0 to ElevenLabs speed ~0.75–1.25
    this.defaultRate = 0.75 + flutterRate * 0.5;
  }

  setLanguage(lang: string) {
    void lang;
    // Language is handled by the backend-generated alert text.
  }

  async speak(text: string, lang: string = 'en'): Promise<void> {
    void lang;
    try {
      await elevenLabsTtsService.speak(text, this.defaultRate);
    } catch (err) {
      console.warn('[TTS] ElevenLabs unavailable:', err);
    }
  }

  async speakUrgent(text: string, lang: string = 'en'): Promise<void> {
    return this.speak(text, lang);
  }

  async speakCalm(text: string, lang: string = 'en'): Promise<void> {
    return this.speak(text, lang);
  }

  stop() {
    elevenLabsTtsService.stop();
  }

  dispose() {
    elevenLabsTtsService.dispose();
  }
}

export const ttsService = new TtsService();