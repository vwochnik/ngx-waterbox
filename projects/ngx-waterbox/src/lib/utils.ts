export function createCanvasFromPattern(
    name: string,
    size: number,
    alpha: number
): OffscreenCanvas | null {
    switch (name) {
    case "none":
      return null;
    case "blocky":
        return createCoarseNoise(size || 10, alpha);
    case "noise":
        return createCoarseNoise(size || 1, alpha);
    case "dotted":
        return createDotMatrix(size || 10, alpha);
    case "grid":
        return createGrid(size || 10, alpha);
    case "checkered":
        return createCheckeredPattern(size || 10, alpha);
    case "debug":
        return createDebugPattern(size || 10, alpha);
    default:
        throw new Error(`unknown pattern name: ${name}`);
    }
}

export function createCoarseNoise(cellSize: number, alpha: number): OffscreenCanvas {
  const width = cellSize * 64, height = cellSize * 64;

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
      const value = Math.random() * alpha;
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

export function createDotMatrix(spacing: number, alpha: number): OffscreenCanvas {
    const width = spacing * 4, height = spacing * 4;
    const dotRadius = spacing * 0.1;

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

export function createGrid(cellSize: number, alpha: number): OffscreenCanvas {
  const width = cellSize * 4, height = cellSize * 4;
  const off = new OffscreenCanvas(width, height);
  const ctx = off.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  ctx.save();

  ctx.strokeStyle = 'white';
  ctx.lineWidth = cellSize * 0.05;
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

export function createCheckeredPattern(cellSize: number, alpha: number): OffscreenCanvas {
  const off = new OffscreenCanvas(cellSize*2, cellSize*2);
  const ctx = off.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  ctx.save();

  ctx.globalAlpha = alpha;

  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#000000';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  ctx.restore();
  return off;
}

export function createDebugPattern(size: number, alpha: number): OffscreenCanvas {
  const off = new OffscreenCanvas(size*2, size*2);
  const ctx = off.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  ctx.save();

  ctx.globalAlpha = alpha;

  const radius = Math.hypot(size, size);

  const gradient = ctx.createRadialGradient(size, size, 0, size, size, radius);

  gradient.addColorStop(0, "red");
  gradient.addColorStop(0.25, "yellow");
  gradient.addColorStop(0.5, "green");
  gradient.addColorStop(1, "blue");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size*2, size*2);

  ctx.restore();
  return off;
}
