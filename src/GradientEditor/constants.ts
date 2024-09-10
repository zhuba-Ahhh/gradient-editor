import { CSSProperties } from 'react';
import ColorUtil from 'color';
import { uuid } from '../utils';
interface GradientEditorProps {
  defaultValue?: string;
  style?: CSSProperties;
  onChange?: (value: any) => void;
  options?: any[];
}

interface GradientStop {
  color: string;
  position: number;
  id: string;
}

const defalutGradientStops: GradientStop[] = [
  { color: 'rgba(255,255,255,0)', position: 0, id: uuid() },
  { color: 'rgba(255,255,255,0)', position: 50, id: uuid() }
];
type GradientType = 'linear' | 'radial';
type ShapeType = 'ellipse' | 'radial';

const gradientOptions = [
  { value: 'linear', label: '线性' },
  { value: 'radial', label: '径向' }
];

const shapeOptions = [
  { value: 'ellipse', label: '椭圆' },
  { value: 'circle', label: '圆形' }
];

function interpolateColor(
  stop1: GradientStop,
  stop2: GradientStop,
  targetPosition: number
): string {
  const { color: color1Hex, position: position1 } = stop1;
  const { color: color2Hex, position: position2 } = stop2;
  if (!color1Hex || !color2Hex) {
    return 'rgba(255,255,255,1)';
  }
  // 将颜色转换为 RGB 数组
  // @ts-ignore
  const color1RGB = ColorUtil(color1Hex).color;
  // @ts-ignore
  const color2RGB = ColorUtil(color2Hex).color;

  const scale = (targetPosition - position1) / (position2 - position1);

  // 计算目标颜色的 RGB 值
  const r = color1RGB[0] + (color2RGB[0] - color1RGB[0]) * scale;
  const g = color1RGB[1] + (color2RGB[1] - color1RGB[1]) * scale;
  const b = color1RGB[2] + (color2RGB[2] - color1RGB[2]) * scale;

  // 将 RGB 值转换回十六进制表示
  const targetColorHex = ColorUtil({ r, g, b }).toString();
  return targetColorHex;
}
function findColorByPosition(colorsArray: GradientStop[], position: number): string {
  // 检查位置是否在数组范围内
  if (position < colorsArray[0].position) {
    return colorsArray[0].color;
  } else if (position > colorsArray[colorsArray.length - 1].position) {
    return colorsArray[colorsArray.length - 1].color;
  } else {
    // 查找最接近给定位置的颜色
    let closestColorIndex = 0;
    let minDistance = Math.abs(position - colorsArray[0].position);
    for (let i = 1; i < colorsArray.length; i++) {
      const distance = Math.abs(position - colorsArray[i].position);
      if (distance < minDistance) {
        minDistance = distance;
        closestColorIndex = i;
      }
    }
    return interpolateColor(
      colorsArray[closestColorIndex - 1],
      colorsArray[closestColorIndex],
      position
    );
  }
}

// 解析颜色
function parseGradient(gradientString: string): {
  type: GradientType;
  direction?: string;
  stops: GradientStop[];
} {
  let match;
  let direction;

  // 匹配 linear-gradient
  match = gradientString.match(/(\d+deg),\s*(.+)/);
  if (match) {
    const direction = match[1].trim();
    const type = 'linear';
    return { type, direction, stops: parseStops(match[2].trim()) };
  } else {
    // 匹配 radial-gradient
    match = gradientString.match(/radial-gradient\(([^)]+)\)\s*,?\s*(.*)/);
    if (match) {
      const match1 = match[1].split(', ');
      direction = match1[0];
      gradientString = match1[1] + ') ' + match[2];
      const type = 'radial';
      return { type, direction, stops: parseStops(gradientString) };
    }
  }
  return { type: 'linear', stops: [] };
}

function parseStops(stopsString: string): GradientStop[] {
  const stops = [];
  const colors = stopsString.split(', ');
  console.log('[48;2;0;255;0m [ colors ]-118-「GradientEditor/constants.ts」 [0m', colors);
  let currentPercentage = 0;

  for (let i = 0; i < colors.length; i++) {
    const colorStop = colors[i].trim();
    const match = colorStop.match(/(.*)\s+(\d+)?%/);
    if (match) {
      const color = match[1];
      const position = match[2] ? parseInt(match[2], 10) : currentPercentage;
      stops.push({ color, position, id: uuid() });
      currentPercentage = position;
    }
  }

  return stops;
}

// 计算位置百分比的函数，确保值在0到100之间
const computePercentage = (position: number) => {
  // 确保 position 的值在 0 到 100 之间，并四舍五入到最近的整数
  return Math.round(Math.min(Math.max(position, 0), 100));
};

export type { GradientEditorProps, GradientStop, GradientType, ShapeType };

export {
  defalutGradientStops,
  findColorByPosition,
  parseGradient,
  shapeOptions,
  gradientOptions,
  interpolateColor,
  computePercentage
};
