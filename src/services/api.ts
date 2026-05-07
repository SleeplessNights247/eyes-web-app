import { AppConstants } from '../config/constants';
import { ResultModel, parseResult } from '../models/result';

export class ApiService {
  async analyzeImage(imageBlob: Blob): Promise<ResultModel> {
    const url = `${AppConstants.baseUrl}${AppConstants.analyzeEndpoint}`;
    const formData = new FormData();
    formData.append('image', imageBlob, 'frame.jpg');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AppConstants.apiTimeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const json = await response.json();
      return parseResult(json);
    } catch (e: any) {
      clearTimeout(timeout);
      if (e.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }
      throw new Error(e.message || 'Unexpected error');
    }
  }

  async ping(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${AppConstants.baseUrl}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
