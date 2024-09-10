export * from './uuid';

const color2rgba = (color: string): string => {
  if (color.startsWith('rgba')) {
    return color;
  }
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', ',1)');
  }
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    let a = 1;
    if (color.length === 9) {
      a = Number((parseInt(color.slice(7, 9), 16) / 255).toFixed(2));
    }
    return `rgba(${r},${g},${b},${a})`;
  }
  return color;
};

export { color2rgba };
