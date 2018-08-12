export const drawRectangle = (size) => (ctx, x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
};

export const map = (value, inMin, inMax, outMin, outMax) => {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};
