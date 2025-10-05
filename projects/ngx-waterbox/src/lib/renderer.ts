import { Theme } from './types';
import {createCoarseNoise } from './effects';

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

export class Renderer {
    private canvasContext: CanvasRenderingContext2D;
    private noisePattern: CanvasPattern | null = null;
    private offscreenCanvas: OffscreenCanvas;
    private offscreenContext: OffscreenCanvasRenderingContext2D;

    constructor(
        private canvas: HTMLCanvasElement,
        private width: number, 
        private height: number
    ) {
        this.canvas.width = width;
        this.canvas.height = height;

        const canvasContext = canvas.getContext("2d");
        if (!canvasContext) {
            throw new Error("can't get context");
        }
        this.canvasContext = canvasContext;

        this.offscreenCanvas = new OffscreenCanvas(width, height);
        const offscreenContext = this.offscreenCanvas.getContext("2d");
        if (!offscreenContext) {
            throw new Error("can't get context");
        }

        this.offscreenContext = offscreenContext;

        const noiseCanvas = createCoarseNoise(64, 64, 8, 0.5);
        this.noisePattern = this.canvasContext.createPattern(noiseCanvas, "repeat");
    }

    render(value: number, theme: Theme): void {
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

        const ctx = this.offscreenContext,
              width = this.width,
              height = this.height;

        const actualWidth = Math.min(width, height),
            rect: Area = { x: width/2 - actualWidth/2 + strokeWidth/2, y: strokeWidth/2, w: actualWidth - strokeWidth - 1, h: height - strokeWidth - 1 },
            size: Size = { w: rect.w, h: rect.w/2 };

        ctx.clearRect(0, 0, width, height);

        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";

        const bottomRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - size.h, w: size.w, h: size.h };
        ctx.save();
        rhombusPath(ctx, bottomRhombusArea);
        paint(ctx, backFillColor, backStrokeColor, clipEdges);
        ctx.restore();

        const leftBackWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
        ctx.save();
        wallPath(ctx, leftBackWallArea, size, 0, -size.h/2);
        paint(ctx, backFillColorLight, backStrokeColor, clipEdges);
        ctx.restore();

        const rightBackWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };
        ctx.save();
        wallPath(ctx, rightBackWallArea, size, -size.h/2, 0);
        paint(ctx, backFillColorDark, backStrokeColor, clipEdges);
        ctx.restore();

        if (divisions > 1) {
            const step = 100.0/divisions;

            for (let s = step; s < 100.0; s += step) {
                const separatorArea: Area = { x: rect.x, y: rect.y + rect.h - size.h - (rect.h - size.h) * s/100.0, w: size.w, h: size.h };
                ctx.save();
                separatorPath(ctx, separatorArea, separatorSize);
                paint(ctx, null, backStrokeColor, clipEdges);
                ctx.restore();
            }
        }

        if (value > 0) {
            const fillHeight = size.h + (value / 100.0 * (rect.h - size.h));

            const leftFillWallArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
            ctx.save();
            wallPath(ctx, leftFillWallArea, size, 0, size.h/2);
            paint(ctx, waterFillColorDark, waterStrokeColor, clipEdges, this.noisePattern);
            ctx.restore();

            const rightFillWallArea: Area = { x: rect.x+rect.w/2, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
            ctx.save();
            wallPath(ctx, rightFillWallArea, size, size.h/2, 0);
            paint(ctx, waterFillColorLight, waterStrokeColor, clipEdges, this.noisePattern);
            ctx.restore();

            const fillTopRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w, h: size.h };
            ctx.save();
            rhombusPath(ctx, fillTopRhombusArea);
            paint(ctx, waterFillColor, waterStrokeColor, clipEdges, this.noisePattern);
            ctx.restore();
        }

        if (drawFront) {
            const leftFrontWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
            ctx.save();
            wallPath(ctx, leftFrontWallArea, size, 0, size.h/2);
            paint(ctx, frontFillColorDark, frontStrokeColor, clipEdges);
            ctx.restore();

            const rightFrontWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };
            ctx.save();
            wallPath(ctx, rightFrontWallArea, size, size.h/2, 0);
            paint(ctx, frontFillColorLight, frontStrokeColor, clipEdges);
            ctx.restore();

            const topRhombusArea: Area = { x: rect.x, y: rect.y, w: size.w, h: size.h };
            ctx.save();
            rhombusPath(ctx, topRhombusArea);
            paint(ctx, frontFillColor, frontStrokeColor, clipEdges);
            ctx.restore();
        }

        this.canvasContext.clearRect(0, 0, width, height);
        this.canvasContext.drawImage(this.offscreenCanvas, 0, 0);
    }
}

function rhombusPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, area: Area) {
    const a = Math.min(area.w, area.h),
          b = Math.sqrt(2*a*a);;

    ctx.translate(area.x+area.w/2, area.y+area.h/2);
    ctx.scale(area.w/b, area.h/b);
    ctx.rotate(Math.PI / 4);

    ctx.beginPath();
    ctx.rect(-a/2, -a/2, a, a);
}

function wallPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, area: Area, size: Size, leftOffset: number, rightOffset: number): void {
    const x = area.x,
          y = area.y+size.h/2,
          w = area.w,
          h = area.h-size.h;

    const skewY = (w === 0) ? 0 : (rightOffset - leftOffset) / w;

    ctx.translate(x, y + leftOffset);
    ctx.transform(1, skewY, 0, 1, 0, 0);

    ctx.beginPath();
    ctx.rect(0, 0, w, h);
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
    if (fillColor !== null) {
        ctx.fillStyle = fillColor;
        ctx.fill();
        if (pattern !== null) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = pattern;
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
        }
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
