import { Theme } from './types';
import { createCoarseNoise } from './effects'


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

    const noiseCanvas = createCoarseNoise(width, height, 1, 0.15);
    const noisePattern = ctx.createPattern(noiseCanvas, 'repeat');

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
            paint(ctx, waterFillColorDark, waterStrokeColor, clipEdges, noisePattern);

            const rightFillWallArea: Area = { x: rect.x+rect.w/2, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
            wallPath(ctx, rightFillWallArea, size, size.h/2, 0);
            paint(ctx, waterFillColorLight, waterStrokeColor, clipEdges, noisePattern);

            const fillTopRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w, h: size.h };
            rhombusPath(ctx, fillTopRhombusArea);
            paint(ctx, waterFillColor, waterStrokeColor, clipEdges, noisePattern);
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
    ctx.beginPath();
    ctx.moveTo(area.x, area.y+size.h/2+leftOffset);
    ctx.lineTo(area.x+area.w, area.y+size.h/2+rightOffset);
    ctx.lineTo(area.x+area.w, area.y+area.h-size.h/2+rightOffset);
    ctx.lineTo(area.x, area.y+area.h-size.h/2+leftOffset);
    ctx.closePath();
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
    clipEdges: boolean,
    pattern: CanvasPattern | null = null
): void {
    ctx.save();
    if (fillColor !== null) {
        ctx.fillStyle = fillColor;
        ctx.fill();
        if (pattern !== null) {
            ctx.fillStyle = pattern;
            ctx.fill();
        }
    }
    if (strokeColor !== null) {
        if (clipEdges) {
            ctx.globalCompositeOperation = "destination-out";
        }
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }
    ctx.restore();
}