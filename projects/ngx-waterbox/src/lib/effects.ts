export function createCoarseNoise(width: number, height: number, cellSize: number, alpha: number): OffscreenCanvas {
  const off = new OffscreenCanvas(width, height);
  const ctx = off.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  ctx.save();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const value = Math.random();;
      ctx.fillStyle = `rgba(255,255,255,${value})`;
      const px = x * cellSize;
      const py = y * cellSize;
      const w = Math.min(cellSize, width - px);
      const h = Math.min(cellSize, height - py);
      ctx.fillRect(px, py, w, h);
    }
  }

  ctx.restore();
  return off;
}
