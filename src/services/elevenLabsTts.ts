import { AppConstants } from '../config/constants';

/**
 * ElevenLabs TTS Service
 * Calls the backend /api/tts proxy so the ElevenLabs key stays server-side.
 */

export class ElevenLabsTtsService {
    private currentAudio: HTMLAudioElement | null = null;
    private currentAbortController: AbortController | null = null;
    private objectUrls: string[] = [];
  
    /** Speak text by calling the backend proxy */
    async speak(text: string, rate: number = 1.0): Promise<void> {
      this.stop();
  
      this.currentAbortController = new AbortController();

      const response = await fetch(`${AppConstants.baseUrl}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speed: rate }),
        signal: this.currentAbortController.signal,
      });
  
      if (!response.ok) {
        throw new Error(`TTS proxy error: ${response.status}`);
      }
  
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      this.objectUrls.push(audioUrl);
  
      return new Promise<void>((resolve) => {
        this.currentAudio = new Audio(audioUrl);
        this.currentAudio.onended = () => { this.cleanup(audioUrl); resolve(); };
        this.currentAudio.onerror = () => { this.cleanup(audioUrl); resolve(); };
        this.currentAudio.play().catch(() => { this.cleanup(audioUrl); resolve(); });
      });
    }
  
    stop() {
      this.currentAbortController?.abort();
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      }
    }
  
    private cleanup(url: string) {
      URL.revokeObjectURL(url);
      this.objectUrls = this.objectUrls.filter(u => u !== url);
      this.currentAudio = null;
    }
  
    dispose() {
      this.stop();
      this.objectUrls.forEach(url => URL.revokeObjectURL(url));
      this.objectUrls = [];
    }
  }
  
  export const elevenLabsTtsService = new ElevenLabsTtsService();