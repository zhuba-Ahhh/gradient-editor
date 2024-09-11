import gradient from 'gradient-parser';
import { GradientStop, GradientType } from './constants';
import { uuid } from '../utils';

export const ParseGradient = (
  gradientString: string
): {
  type: GradientType;
  direction: string;
  stops: GradientStop[];
} => {
  let type: GradientType = 'linear';
  let direction = '90';
  let stops: GradientStop[] = [];
  if (gradientString && gradientString !== 'none') {
    const gradientData = gradient.parse(gradientString)?.[0];
    if (!!gradientData) {
      type = gradientData.type.split('-')[0] as GradientType;
      direction = Array.isArray(gradientData.orientation)
        ? // @ts-ignore
          gradientData.orientation[0]?.value
        : gradientData.orientation?.value;
      stops = gradientData.colorStops.map((colorStop) => ({
        color: `rgba(${(colorStop.value as string[]).join(',')})`,
        position: Number(colorStop.length?.value),
        id: uuid()
      }));
    }
  }

  return { type, direction, stops };
};
