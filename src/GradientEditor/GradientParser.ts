import gradient from './parser';
import { GradientStop, GradientType } from './constants';
import { uuid } from '../utils';

// 辅助函数：将各种颜色格式转换为rgba格式
const convertToRgba = (colorValue: any): string => {
  // 如果已经是rgba格式，直接返回
  if (typeof colorValue === 'string' && colorValue.startsWith('rgba')) {
    return colorValue;
  }

  try {
    // 处理RGB/RGBA数组
    if (Array.isArray(colorValue)) {
      const [r, g, b, a = 1] = colorValue.map(v => Number(v));
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // 处理十六进制颜色字符串
    if (typeof colorValue === 'string' && (colorValue.startsWith('#') || /^[0-9A-Fa-f]{3,6}$/i.test(colorValue))) {
      const hex = colorValue.startsWith('#') ? colorValue.slice(1) : colorValue;
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    // 处理其他颜色格式
    return typeof colorValue === 'string' ? colorValue : 'rgba(0,0,0,1)';
  } catch (error) {
    // 如果转换失败，返回默认黑色
    return 'rgba(0,0,0,1)';
  }
}

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
    const gradientData = gradient(gradientString)?.[0];
    if (!!gradientData) {
      type = gradientData.type.split('-')[0] as GradientType;
      direction = Array.isArray(gradientData.orientation)
        ? gradientData.orientation[0]?.value
        : gradientData.orientation?.value;
      // @ts-ignore
      stops = gradientData.colorStops.map((colorStop) => {
        // 将所有颜色类型统一转换为rgba格式
        let color = convertToRgba(colorStop.value);

        // 计算位置：如果没有明确的位置值，根据索引计算
        let position = Number(colorStop.length?.value);
        if (isNaN(position)) {
          // 如果没有位置信息，根据在渐变中的位置均匀分配
          const totalStops = gradientData.colorStops.length;
          position = totalStops > 1 ? (100 / (totalStops - 1)) * gradientData.colorStops.indexOf(colorStop) : 0;
        }

        return {
          color,
          position,
          id: uuid()
        };
      });
    }
  }

  return { type, direction, stops };
};
