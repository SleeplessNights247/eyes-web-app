import { AppConstants } from '../config/constants';

export class HapticService {
  static canVibrate(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  static feedbackForDistance(
    distance: number,
    intensity: number = 2,
    isCritical: boolean = false
  ): boolean {
    if (distance <= 0 || !this.canVibrate()) return false;

    if (isCritical) {
      return this.hazardPattern(distance);
    }
    return this.regularPattern(distance, intensity);
  }

  private static hazardPattern(distance: number): boolean {
    if (distance < AppConstants.distanceVeryClose) {
      navigator.vibrate([150, 80, 150, 80, 150, 80, 150, 80, 150]);
      return true;
    }
    if (distance < AppConstants.distanceClose) {
      navigator.vibrate([250, 150, 250, 150, 250]);
      return true;
    }
    if (distance < AppConstants.distanceMedium) {
      navigator.vibrate([200, 200, 200]);
      return true;
    }
    return false;
  }

  private static regularPattern(distance: number, _intensity: number): boolean {
    if (distance < AppConstants.distanceVeryClose) {
      navigator.vibrate([200, 200, 200]);
      return true;
    }
    if (distance < AppConstants.distanceClose) {
      navigator.vibrate([250]);
      return true;
    }
    return false;
  }

  static tap(): void {
    if (this.canVibrate()) navigator.vibrate(50);
  }

  static confirm(): void {
    if (this.canVibrate()) navigator.vibrate(30);
  }

  static detected(): void {
    if (this.canVibrate()) navigator.vibrate(100);
  }
}
