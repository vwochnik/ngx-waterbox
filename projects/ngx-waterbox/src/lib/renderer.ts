import { Theme } from './types';
import { getDefaultTheme } from './theme';
import { CachedPattern } from './cached-pattern';

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

type PathFunction = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => void

export class Renderer {
    private canvasContext: CanvasRenderingContext2D;
    private bufferCanvas: OffscreenCanvas;
    private bufferContext: OffscreenCanvasRenderingContext2D;
    private tempCanvas: OffscreenCanvas;
    private tempContext: OffscreenCanvasRenderingContext2D;

    private cachedBackPattern: CachedPattern = new CachedPattern();
    private cachedFrontPattern: CachedPattern = new CachedPattern();
    private cachedWaterPattern: CachedPattern = new CachedPattern();

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

        this.bufferCanvas = new OffscreenCanvas(width, height);
        const bufferContext = this.bufferCanvas.getContext("2d");
        if (!bufferContext) {
            throw new Error("can't get context");
        }

        this.bufferContext = bufferContext;

        this.tempCanvas = new OffscreenCanvas(width, height);
        const tempContext = this.tempCanvas.getContext("2d");
        if (!tempContext) {
            throw new Error("can't get context");
        }

        this.tempContext = tempContext;
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

        const width = this.width,
              height = this.height;

        const actualWidth = Math.min(width, height),
            rect: Area = { x: width/2 - actualWidth/2 + strokeWidth/2, y: strokeWidth/2, w: actualWidth - strokeWidth - 1, h: height - strokeWidth - 1 },
            size: Size = { w: rect.w, h: rect.w/2 };

        const backPatternCanvas = this.cachedBackPattern.getPattern(theme.backPattern);
        const frontPatternCanvas = this.cachedFrontPattern.getPattern(theme.frontPattern);
        const waterPatternCanvas = this.cachedWaterPattern.getPattern(theme.waterPattern);

        const backPattern = makePattern(this.bufferContext, backPatternCanvas);
        const frontPattern = makePattern(this.bufferContext, frontPatternCanvas);
        const waterPattern = makePattern(this.bufferContext, waterPatternCanvas);

        this.bufferContext.clearRect(0, 0, width, height);

        const bottomRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - size.h, w: size.w, h: size.h };
        const leftBackWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
        const rightBackWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };

        this.paintFilling((ctx) => {
            rhombusPath(ctx, bottomRhombusArea, "bottom");
        }, backFillColor, backPattern);

        this.paintFilling((ctx) => {
            wallPath(ctx, leftBackWallArea, size, 0, -size.h/2, "back");
        }, backFillColorLight, backPattern);

        this.paintFilling((ctx) => {
            wallPath(ctx, rightBackWallArea, size, -size.h/2, 0, "back");
        }, backFillColorDark, backPattern);

        const backPaths: PathFunction[] = [
            (ctx) => rhombusPath(ctx, bottomRhombusArea, "bottom"),
            (ctx) => wallPath(ctx, leftBackWallArea, size, 0, -size.h/2, "back"),
            (ctx) => wallPath(ctx, rightBackWallArea, size, -size.h/2, 0, "back")
        ];

        if (divisions > 1) {
            const step = 100.0/divisions;

            for (let s = step; s < 100.0; s += step) {
                const separatorArea: Area = { x: rect.x, y: rect.y + rect.h - size.h - (rect.h - size.h) * s/100.0, w: size.w, h: size.h };
                backPaths.push((ctx) => separatorPath(ctx, separatorArea, separatorSize));
            }
        }

        this.paintEdges(backPaths, backStrokeColor, strokeWidth, clipEdges);

        if (value > 0) {
            const fillHeight = size.h + (value / 100.0 * (rect.h - size.h));

            const leftFillWallArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
            const rightFillWallArea: Area = { x: rect.x+rect.w/2, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
            const fillTopRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w, h: size.h };

            this.paintFilling((ctx) => {
                wallPath(ctx, leftFillWallArea, size, 0, size.h/2, "front");
            }, waterFillColorDark, waterPattern);

            this.paintFilling((ctx) => {
                wallPath(ctx, rightFillWallArea, size, size.h/2, 0, "front");
            }, waterFillColorLight, waterPattern);

            this.paintFilling((ctx) => {
                rhombusPath(ctx, fillTopRhombusArea, "top");
            }, waterFillColor, waterPattern);

            this.paintEdges([
                (ctx) => wallPath(ctx, leftFillWallArea, size, 0, size.h/2, "front"),
                (ctx) => wallPath(ctx, rightFillWallArea, size, size.h/2, 0, "front"),
                (ctx) => rhombusPath(ctx, fillTopRhombusArea, "top")
            ], waterStrokeColor, strokeWidth, clipEdges);
        }

        if (drawFront) {
            const leftFrontWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
            const rightFrontWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };
            const topRhombusArea: Area = { x: rect.x, y: rect.y, w: size.w, h: size.h };

            this.paintFilling((ctx) => {
                wallPath(ctx, leftFrontWallArea, size, 0, size.h/2, "front");
            }, frontFillColorDark, frontPattern);

            this.paintFilling((ctx) => {
                wallPath(ctx, rightFrontWallArea, size, size.h/2, 0, "front");
            }, frontFillColorLight, frontPattern);

            this.paintFilling((ctx) => {
                rhombusPath(ctx, topRhombusArea, "top");
            }, frontFillColor, frontPattern);

            this.paintEdges([
                (ctx) => wallPath(ctx, leftFrontWallArea, size, 0, size.h/2, "front"),
                (ctx) => wallPath(ctx, rightFrontWallArea, size, size.h/2, 0, "front"),
                (ctx) => rhombusPath(ctx, topRhombusArea, "top"),
            ], frontStrokeColor, strokeWidth, clipEdges);
        }

        this.canvasContext.clearRect(0, 0, width, height);
        this.canvasContext.drawImage(this.bufferCanvas, 0, 0);
    }

    paintFilling(
        pathFunction: PathFunction,
        fillColor: string,
        pattern: CanvasPattern | string = "transparent"
    ): void {
        const ctx = this.bufferContext;
        ctx.save();
        if (pattern !== "transparent") {
            const tmp = this.tempContext;
            tmp.save();
            tmp.clearRect(0, 0, this.width, this.height);
            pathFunction(tmp);
            tmp.fillStyle = fillColor;
            tmp.fill();
            tmp.globalCompositeOperation = "overlay";
            tmp.fillStyle = pattern;
            tmp.fill();
            tmp.globalCompositeOperation = "source-over";
            tmp.restore();
            ctx.drawImage(tmp.canvas, 0, 0);
        } else {
            pathFunction(ctx);
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        ctx.restore()
    }

    paintEdges(
        pathFunctions: PathFunction[],
        strokeColor: string,
        strokeWidth: number,
        clipEdges: boolean
    ): void {
        const ctx = this.bufferContext;
        const tmp = this.tempContext;
        tmp.clearRect(0, 0, this.width, this.height);

        tmp.lineWidth = strokeWidth;
        tmp.lineCap = "round";
        tmp.lineJoin = "round";

        pathFunctions.forEach((pathFunction, idx) => {
            tmp.save();
            pathFunction(tmp);
            tmp.restore();
            tmp.globalCompositeOperation = "destination-out";
            tmp.strokeStyle = "black";
            tmp.stroke();
            tmp.globalCompositeOperation = "source-over";
            tmp.strokeStyle = (clipEdges) ? "black" : strokeColor;
            tmp.stroke();
        });

        if (clipEdges) {
            ctx.globalCompositeOperation = "destination-out";
        }
        ctx.drawImage(tmp.canvas, 0, 0);
        ctx.globalCompositeOperation = "source-over";
    }
}

function rhombusPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, area: Area, position: "top" | "bottom"): void {
    const a = 0.5 * Math.hypot(area.w, area.h),
          b = Math.sqrt(2*a*a);;

    ctx.translate(area.x+area.w/2, area.y+area.h/2);
    ctx.scale(area.w/b, area.h/b);
    ctx.rotate(Math.PI / 4);

    ctx.beginPath();
    ctx.rect(-a/2, -a/2, a, a);

    const scale = area.w/2 / a;
    if (position === "top") {
        ctx.translate(-a/2, -a/2 + area.w/scale);
    } else {
        ctx.translate(a/2 - area.w/scale, a/2);
    }
}

function wallPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, area: Area, size: Size, leftOffset: number, rightOffset: number, facing: "back" | "front"): void {
    const x = area.x,
          y = area.y+size.h/2,
          w = area.w,
          h = area.h-size.h;

    const skewY = (w === 0) ? 0 : (rightOffset - leftOffset) / w;

    ctx.translate(x, y + leftOffset);
    ctx.transform(1, skewY, 0, 1, 0, 0);

    ctx.beginPath();
    ctx.rect(0, 0, w, h);

    ctx.translate(-x, (facing === "back") ? h : 0);

    const scale = w / Math.hypot(rightOffset - leftOffset, w);
    ctx.scale(scale, 1);
}

function separatorPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, area: Area, size: number): void {
    const s = size / 200.0;
    ctx.beginPath();
    ctx.moveTo(area.x+area.w/2-area.w*s, area.y+area.h*s);
    ctx.lineTo(area.x+area.w/2, area.y);
    ctx.lineTo(area.x+area.w/2+area.w*s, area.y+area.h*s);
}

function makePattern(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, canvas: OffscreenCanvas | null): CanvasPattern | string {
    if (!canvas) {
        return "transparent";
    }
    const pattern = ctx.createPattern(canvas, 'repeat');
    if (!pattern) {
        return "transparent";
    }
    return pattern;
}
