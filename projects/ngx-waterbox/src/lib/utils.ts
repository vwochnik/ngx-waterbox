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

export function createDotMatrix(width: number, height: number, spacing: number, alpha: number): OffscreenCanvas {
    const dotRadius = spacing * 0.2;

  const off = new OffscreenCanvas(width, height);
  const ctx = off.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  ctx.save();

    const cols = Math.max(1, Math.round(width / spacing));
    const rows = Math.max(1, Math.round(height / spacing));
    const spacingX = width / cols;
    const spacingY = height / rows;
  const startX = spacingX / 2;
  const startY = spacingY / 2;

  // Draw dots. We'll center first dot at spacing/2 so pattern is symmetric.
  ctx.fillStyle = 'white';
  ctx.globalAlpha = alpha;
  for (let y = startY; y < height + 0.0001; y += spacingY) {
    for (let x = startX; x < width + 0.0001; x += spacingX) {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return off;
}

export function createGrid(width: number, height: number, cellSize: number, alpha: number): OffscreenCanvas {
  const off = new OffscreenCanvas(width, height);
  const ctx = off.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  ctx.save();

  ctx.strokeStyle = 'white';
  ctx.lineWidth = cellSize * 0.1;
  ctx.globalAlpha = alpha;

  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }

  ctx.restore();
  return off;
}


