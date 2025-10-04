import { Theme } from './types';

interface Area {
    x: number,
    y: number,
    w: number,
    h: number
}

interface Size {
    w: number,
    h: number
}

export function Renderer(canvas: HTMLCanvasElement, width: number, height: number) {
    canvas.width = width;
    canvas.height = height;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
        throw new Error("can't get context");
    }

    const offscreenCanvas = new OffscreenCanvas(width, height);
    const ctx = offscreenCanvas.getContext("2d");
    if (!ctx) {
        throw new Error("can't get context");
    }

    return function(value: number, theme: Theme): void {
        const {
            waterFillColor,
            waterFillColorLight,
            waterFillColorDark,
            waterStrokeColor,
            backFillColor,
            backFillColorLight,
            backFillColorDark,
            backStrokeColor,
            frontFillColor,
            frontFillColorLight,
            frontFillColorDark,
            frontStrokeColor,
            strokeWidth,
            divisions,
            separatorSize,
            clipEdges,
            drawFront
        } = theme;

        const actualWidth = Math.min(width, height),
            rect: Area = { x: width/2 - actualWidth/2 + strokeWidth/2, y: strokeWidth/2, w: actualWidth - strokeWidth - 1, h: height - strokeWidth - 1 },
            size: Size = { w: rect.w, h: rect.w/2 };

        ctx.clearRect(0, 0, width, height);

        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";

        const bottomRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - size.h, w: size.w, h: size.h };
        rhombusPath(ctx, bottomRhombusArea);
        paint(ctx, backFillColor, backStrokeColor, clipEdges);

        const leftBackWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
        wallPath(ctx, leftBackWallArea, size, 0, -size.h/2);
        paint(ctx, backFillColorLight, backStrokeColor, clipEdges);

        const rightBackWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };
        wallPath(ctx, rightBackWallArea, size, -size.h/2, 0);
        paint(ctx, backFillColorDark, backStrokeColor, clipEdges);

        if (divisions > 1) {
            const step = 100.0/divisions;

            for (let s = step; s < 100.0; s += step) {
                const separatorArea: Area = { x: rect.x, y: rect.y + rect.h - size.h - (rect.h - size.h) * s/100.0, w: size.w, h: size.h };
                separatorPath(ctx, separatorArea, separatorSize);
                paint(ctx, null, backStrokeColor, clipEdges);
            }
        }

        if (value > 0) {
            const fillHeight = size.h + (value / 100.0 * (rect.h - size.h));

            const leftFillWallArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
            wallPath(ctx, leftFillWallArea, size, 0, size.h/2);
            paint(ctx, waterFillColorDark, waterStrokeColor, clipEdges);

            const rightFillWallArea: Area = { x: rect.x+rect.w/2, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
            wallPath(ctx, rightFillWallArea, size, size.h/2, 0);
            paint(ctx, waterFillColorLight, waterStrokeColor, clipEdges);

            const fillTopRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w, h: size.h };
            rhombusPath(ctx, fillTopRhombusArea);
            paint(ctx, waterFillColor, waterStrokeColor, clipEdges);
        }

        if (drawFront) {
            const leftFrontWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
            wallPath(ctx, leftFrontWallArea, size, 0, size.h/2);
            paint(ctx, frontFillColorDark, frontStrokeColor, clipEdges);

            const rightFrontWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };
            wallPath(ctx, rightFrontWallArea, size, size.h/2, 0);
            paint(ctx, frontFillColorLight, frontStrokeColor, clipEdges);

            const topRhombusArea: Area = { x: rect.x, y: rect.y, w: size.w, h: size.h };
            rhombusPath(ctx, topRhombusArea);
            paint(ctx, frontFillColor, frontStrokeColor, clipEdges);
        }

        canvasCtx.clearRect(0, 0, width, height);
        canvasCtx.drawImage(offscreenCanvas, 0, 0);
    }
}

function rhombusPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, area: Area) {
    ctx.beginPath();
    ctx.moveTo(area.x+area.w/2, area.y);
    ctx.lineTo(area.x+area.w, area.y+area.h/2);
    ctx.lineTo(area.x+area.w/2, area.y+area.h);
    ctx.lineTo(area.x,area.y+area.h/2);
    ctx.closePath();
}

function wallPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, area: Area, size: Size, leftOffset: number, rightOffset: number): void {
    const rect: Area = { x: area.x, y: area.y+size.h/2, w: area.w, h: area.h-size.h};

    const { x, y, w, h } = rect;

    ctx.save();
const skewY = (w === 0) ? 0 : (rightOffset - leftOffset) / w;

  // move origin to topleft of the rect after applying the left offset
  ctx.translate(x, y);
  // apply vertical shear: newY = skewY * x + 1 * y
  // transform(a,b,c,d,e,f) multiplies current transform by:
  // [ a c e ]
  // [ b d f ]
  // where newX = a*x + c*y + e, newY = b*x + d*y + f
  ctx.transform(1, skewY, 0, 1, 0, 0);

  ctx.translate(-x, -y);
  ctx.translate(0, leftOffset);

    ctx.beginPath();
    ctx.moveTo(rect.x, rect.y);
    ctx.lineTo(rect.x+rect.w, rect.y);
    ctx.lineTo(rect.x+rect.w, rect.y+rect.h);
    ctx.lineTo(rect.x, rect.y+rect.h);
    ctx.closePath();
    ctx.restore();
}

function separatorPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, area: Area, size: number): void {
    const s = size / 200.0;
    ctx.beginPath();
    ctx.moveTo(area.x+area.w/2-area.w*s, area.y+area.h*s);
    ctx.lineTo(area.x+area.w/2, area.y);
    ctx.lineTo(area.x+area.w/2+area.w*s, area.y+area.h*s);
}

function paint(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    fillColor: string | null,
    strokeColor: string | null,
    clipEdges: boolean
): void {
    if (fillColor !== null) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    if (strokeColor !== null) {
        if (clipEdges) {
            ctx.globalCompositeOperation = "destination-out";
        }
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
    }
}
