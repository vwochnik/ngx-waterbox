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

export class Renderer {
    private canvasContext: CanvasRenderingContext2D;
    private bufferCanvas: OffscreenCanvas;
    private bufferContext: OffscreenCanvasRenderingContext2D;
    private tempCanvas: OffscreenCanvas;
    private tempContext: OffscreenCanvasRenderingContext2D;

    private _theme: Theme = getDefaultTheme();

    private cachedBackPattern: CachedPattern;
    private cachedFrontPattern: CachedPattern;
    private cachedWaterPattern: CachedPattern;

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

        this.cachedBackPattern = new CachedPattern(this.bufferContext, width, height);
        this.cachedFrontPattern = new CachedPattern(this.bufferContext, width, height);
        this.cachedWaterPattern = new CachedPattern(this.bufferContext, width, height);
    }

    get theme(): Theme {
        return this._theme;
    }

    set theme(value: Theme) {
        this._theme = value;
    }

    render(value: number): void {
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
        } = this._theme;

        const width = this.width,
              height = this.height;

        const actualWidth = Math.min(width, height),
            rect: Area = { x: width/2 - actualWidth/2 + strokeWidth/2, y: strokeWidth/2, w: actualWidth - strokeWidth - 1, h: height - strokeWidth - 1 },
            size: Size = { w: rect.w, h: rect.w/2 };

        const backPattern = this.cachedBackPattern.getPattern(this._theme.backPattern);
        const frontPattern = this.cachedFrontPattern.getPattern(this._theme.frontPattern);
        const waterPattern = this.cachedWaterPattern.getPattern(this._theme.waterPattern);

        this.bufferContext.clearRect(0, 0, width, height);

        this.bufferContext.lineWidth = strokeWidth;
        this.bufferContext.lineCap = "round";

        const bottomRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - size.h, w: size.w, h: size.h };
        this.paint((ctx) => {
            rhombusPath(ctx, bottomRhombusArea);
        }, backFillColor, backStrokeColor, clipEdges, backPattern);

        const leftBackWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
        this.paint((ctx) => {
            wallPath(ctx, leftBackWallArea, size, 0, -size.h/2);
        }, backFillColorLight, backStrokeColor, clipEdges, backPattern);

        const rightBackWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };
        this.paint((ctx) => {
            wallPath(ctx, rightBackWallArea, size, -size.h/2, 0);
        }, backFillColorDark, backStrokeColor, clipEdges, backPattern);

        if (divisions > 1) {
            const step = 100.0/divisions;

            for (let s = step; s < 100.0; s += step) {
                const separatorArea: Area = { x: rect.x, y: rect.y + rect.h - size.h - (rect.h - size.h) * s/100.0, w: size.w, h: size.h };
                this.paint((ctx) => {
                    separatorPath(ctx, separatorArea, separatorSize);
                }, null, backStrokeColor, clipEdges, backPattern);
            }
        }

        if (value > 0) {
            const fillHeight = size.h + (value / 100.0 * (rect.h - size.h));

            const leftFillWallArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
            this.paint((ctx) => {
                wallPath(ctx, leftFillWallArea, size, 0, size.h/2);
            }, waterFillColorDark, waterStrokeColor, clipEdges, waterPattern);

            const rightFillWallArea: Area = { x: rect.x+rect.w/2, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
            this.paint((ctx) => {
                wallPath(ctx, rightFillWallArea, size, size.h/2, 0);
            }, waterFillColorLight, waterStrokeColor, clipEdges, waterPattern);

            const fillTopRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w, h: size.h };
            this.paint((ctx) => {
                rhombusPath(ctx, fillTopRhombusArea);
            }, waterFillColor, waterStrokeColor, clipEdges, waterPattern);
        }

        if (drawFront) {
            const leftFrontWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
            this.paint((ctx) => {
                wallPath(ctx, leftFrontWallArea, size, 0, size.h/2);
            }, frontFillColorDark, frontStrokeColor, clipEdges, frontPattern);

            const rightFrontWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };
            this.paint((ctx) => {
                wallPath(ctx, rightFrontWallArea, size, size.h/2, 0);
            }, frontFillColorLight, frontStrokeColor, clipEdges, frontPattern);

            const topRhombusArea: Area = { x: rect.x, y: rect.y, w: size.w, h: size.h };
            this.paint((ctx) => {
                rhombusPath(ctx, topRhombusArea);
            }, frontFillColor, frontStrokeColor, clipEdges, frontPattern);
        }

        this.canvasContext.clearRect(0, 0, width, height);
        this.canvasContext.drawImage(this.bufferCanvas, 0, 0);
    }

    paint(
        pathFunction: (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => void,
        fillColor: string | null,
        strokeColor: string | null,
        clipEdges: boolean,
        pattern: CanvasPattern | string = "transparent"
    ): void {
        const ctx = this.bufferContext;
        if (fillColor !== null) {
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
                ctx.save();
                pathFunction(ctx);
                ctx.fillStyle = fillColor;
                ctx.fill();
                ctx.restore();
            }
        }
        if (strokeColor !== null) {
            ctx.save();
            pathFunction(ctx);
            if (clipEdges) {
                ctx.globalCompositeOperation = "destination-out";
            }
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
            ctx.restore();
        }
        ctx.restore()
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

