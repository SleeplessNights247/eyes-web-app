export interface DetectionItem {
  label: string;
  confidence: number;
  bbox: number[];
  distance: number;
}

export interface ResultModel {
  priorityObject: string;
  distance: number;
  isCritical: boolean;
  priorityBbox: number[] | null;
  currency: string | null;
  currencyTotal: number | null;
  currencyMode: boolean;
  sceneType: string;
  alerts: string[];
  detections: DetectionItem[];
  voiceAlert: string | null;
  imageDataUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  enhanced: boolean;
  processingTime: number;
  timestamp: Date;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asNumberArray(value: unknown): number[] {
  return Array.isArray(value) ? value.filter((item): item is number => typeof item === 'number') : [];
}

export function parseResult(json: unknown): ResultModel {
  const data = asRecord(json);
  const detections = Array.isArray(data.detections) ? data.detections : [];
  const priorityBbox = asNumberArray(data.priority_bbox);

  return {
    priorityObject: asString(data.priority_object, 'Unknown'),
    distance: asNumber(data.distance),
    isCritical: asBoolean(data.is_critical),
    priorityBbox: priorityBbox.length > 0 ? priorityBbox : null,
    currency: typeof data.currency === 'string' ? data.currency : null,
    currencyTotal: typeof data.currency_total === 'number' ? data.currency_total : null,
    currencyMode: asBoolean(data.currency_mode),
    sceneType: asString(data.scene_type, 'Unknown'),
    alerts: Array.isArray(data.alerts) ? data.alerts.filter((alert): alert is string => typeof alert === 'string') : [],
    detections: detections.map((item) => {
      const det = asRecord(item);
      return {
        label: asString(det.label),
        confidence: asNumber(det.confidence),
        bbox: asNumberArray(det.bbox),
        distance: asNumber(det.distance),
      };
    }),
    voiceAlert: typeof data.voice_alert === 'string' ? data.voice_alert : null,
    imageDataUrl: typeof data.image_data_url === 'string' ? data.image_data_url : null,
    imageWidth: typeof data.image_width === 'number' ? data.image_width : null,
    imageHeight: typeof data.image_height === 'number' ? data.image_height : null,
    enhanced: asBoolean(data.enhanced),
    processingTime: asNumber(data.processing_time),
    timestamp: new Date(),
  };
}

export function toSpokenSentence(r: ResultModel, lang?: string): string {
  void lang;
  if (r.voiceAlert) return r.voiceAlert;

  if (r.currencyMode && r.currency) {
    return `Currency detected. ${r.currency}.`;
  }

  let text = '';
  if (r.isCritical && r.distance > 0 && r.distance < 3.0) {
    text += 'Warning! ';
  }
  text += `${r.priorityObject} detected`;
  if (r.distance > 0) {
    text += `, ${r.distance.toFixed(1)} meters ahead`;
  }
  for (const alert of r.alerts) {
    if (alert.toLowerCase().includes('close')) {
      text += '. Very close, be careful';
    }
  }
  if (r.currency) {
    text += `. Currency: ${r.currency}`;
  }
  text += '.';
  return text;
}

export function shortSummary(r: ResultModel): string {
  if (r.currencyMode && r.currencyTotal != null) {
    return `Currency: ₱${r.currencyTotal.toFixed(0)}`;
  }
  return `${r.priorityObject} at ${r.distance.toFixed(1)}m`;
}