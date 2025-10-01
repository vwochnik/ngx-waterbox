import { Theme } from './types';
import { lighten, darken } from './color';

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

export function renderer(ctx: CanvasRenderingContext2D, value: number, width: number, height: number, theme: Theme): void {
    const { strokeColor, fillColor, containerColor, strokeWidth, separators, drawTop, contrast } = theme;

    const containerColorLight = lighten(containerColor, contrast),
          containerColorDark = darken(containerColor, contrast),
          fillColorLight = lighten(fillColor, contrast),
          fillColorDark = darken(fillColor, contrast);

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";

    const actualWidth = Math.min(width, height),
          rect: Area = { x: width/2 - actualWidth/2 + strokeWidth/2, y: strokeWidth/2, w: actualWidth - strokeWidth - 1, h: height - strokeWidth - 1 },
          size: Size = { w: rect.w, h: rect.w/2 };

    const bottomRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - size.h, w: size.w, h: size.h };
    rhombusPath(ctx, bottomRhombusArea);
    ctx.fillStyle = containerColor;
    ctx.fill();
    ctx.stroke();

    const leftBackWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
    wallPath(ctx, leftBackWallArea, size, 0, -size.h/2);
    ctx.fillStyle = containerColorLight;
    ctx.fill();
    ctx.stroke();

    const rightBackWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };
    wallPath(ctx, rightBackWallArea, size, -size.h/2, 0);
    ctx.fillStyle = containerColorDark;
    ctx.fill();
    ctx.stroke();

    if (separators > 1) {
        const step = 100.0/separators;

        for (let s = step; s < 100.0; s += step) {
            const separatorArea: Area = { x: rect.x, y: rect.y + rect.h - size.h - (rect.h - size.h) * s/100.0, w: size.w, h: size.h };
            separatorPath(ctx, separatorArea);
            ctx.stroke();
        }
    }


    if (value > 0) {
        const fillHeight = size.h + (value / 100.0 * (rect.h - size.h));

        const leftFillWallArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
        wallPath(ctx, leftFillWallArea, size, 0, size.h/2);
        ctx.fillStyle = fillColorDark;
        ctx.fill();
        ctx.stroke();

        const rightFillWallArea: Area = { x: rect.x+rect.w/2, y: rect.y + rect.h - fillHeight, w: size.w/2, h: fillHeight };
        wallPath(ctx, rightFillWallArea, size, size.h/2, 0);
        ctx.fillStyle = fillColorLight;
        ctx.fill();
        ctx.stroke();

        const fillTopRhombusArea: Area = { x: rect.x, y: rect.y + rect.h - fillHeight, w: size.w, h: size.h };
        rhombusPath(ctx, fillTopRhombusArea);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.stroke();
    }

    if (!drawTop) {
        return;
    }

    const leftFrontWallArea: Area = { x: rect.x, y: rect.y, w: size.w/2, h: rect.h };
    wallPath(ctx, leftFrontWallArea, size, 0, size.h/2);
    ctx.stroke();

    const rightFrontWallArea: Area = { x: rect.x+rect.w/2, y: rect.y, w: size.w/2, h: rect.h };
    wallPath(ctx, rightFrontWallArea, size, size.h/2, 0);
    ctx.stroke();

    const topRhombusArea: Area = { x: rect.x, y: rect.y, w: size.w, h: size.h };
    rhombusPath(ctx, topRhombusArea);
    ctx.fillStyle = containerColor;
    ctx.fill();
    ctx.stroke();
}

function rhombusPath(ctx: CanvasRenderingContext2D, area: Area) {
    ctx.beginPath();
    ctx.moveTo(area.x+area.w/2, area.y);
    ctx.lineTo(area.x+area.w, area.y+area.h/2);
    ctx.lineTo(area.x+area.w/2, area.y+area.h);
    ctx.lineTo(area.x,area.y+area.h/2);
    ctx.closePath();
}

function wallPath(ctx: CanvasRenderingContext2D, area: Area, size: Size, leftOffset: number, rightOffset: number): void {
    ctx.beginPath();
    ctx.moveTo(area.x, area.y+size.h/2+leftOffset);
    ctx.lineTo(area.x+area.w, area.y+size.h/2+rightOffset);
    ctx.lineTo(area.x+area.w, area.y+area.h-size.h/2+rightOffset);
    ctx.lineTo(area.x, area.y+area.h-size.h/2+leftOffset);
    ctx.closePath();
}

function separatorPath(ctx: CanvasRenderingContext2D, area: Area): void {
    ctx.beginPath();
    ctx.moveTo(area.x+area.w/2-area.w/10, area.y+area.h/10);
    ctx.lineTo(area.x+area.w/2, area.y);
    ctx.lineTo(area.x+area.w/2+area.w/10, area.y+area.h/10);
}
