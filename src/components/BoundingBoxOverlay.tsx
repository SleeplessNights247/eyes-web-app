import { ResultModel } from '../models/result';
import { theme } from '../config/theme';

interface Props {
  result: ResultModel;
  imageWidth: number;
  imageHeight: number;
}

export default function BoundingBoxOverlay({ result, imageWidth, imageHeight }: Props) {
  if (!result.detections || result.detections.length === 0) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {result.detections.map((det, i) => {
        if (!det.bbox || det.bbox.length < 4) return null;
        const [x1, y1, x2, y2] = det.bbox;

        const left = `${(x1 / imageWidth) * 100}%`;
        const top = `${(y1 / imageHeight) * 100}%`;
        const width = `${((x2 - x1) / imageWidth) * 100}%`;
        const height = `${((y2 - y1) / imageHeight) * 100}%`;

        const isPriority = det.label === result.priorityObject;
        const borderColor = result.isCritical && isPriority
          ? theme.danger
          : isPriority
          ? theme.accent
          : `${theme.accent}80`;

        return (
          <div key={i}>
            {/* Bounding box */}
            <div
              className="absolute border-2 rounded-lg"
              style={{ left, top, width, height, borderColor }}
            />
            {/* Label */}
            <div
              className="absolute px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
              style={{
                left,
                top,
                transform: 'translateY(-100%)',
                backgroundColor: borderColor,
              }}
            >
              {det.label} {det.distance > 0 ? `${det.distance.toFixed(1)}m` : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}
