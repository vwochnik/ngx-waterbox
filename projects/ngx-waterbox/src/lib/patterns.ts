import {
    createCoarseNoise,
    createDotMatrix,
    createGrid,
    createCheckeredPattern
} from './utils';

export function makePattern(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    name: string,
    width: number,
    height: number,
    size: number,
    alpha: number
): CanvasPattern | string {
    switch (name) {
    case "none":
        return "transparent";
    case "blocky":
        const blockyCanvas = createCoarseNoise(width, height, size || width * 0.1, alpha);
        const blockyPattern = ctx.createPattern(blockyCanvas, "repeat");
        if (!blockyPattern) {
            throw new Error("failed to create pattern");
        }
        return blockyPattern;
    case "noise":
        const noiseCanvas = createCoarseNoise(width, height, size || 1, alpha);
        const noisePattern = ctx.createPattern(noiseCanvas, "repeat");
        if (!noisePattern) {
            throw new Error("failed to create pattern");
        }
        return noisePattern;
    case "dotted":
        const dottedCanvas = createDotMatrix(width, height, size || width * 0.1, alpha);
        const dottedPattern = ctx.createPattern(dottedCanvas, "repeat");
        if (!dottedPattern) {
            throw new Error("failed to create pattern");
        }
        return dottedPattern;
    case "grid":
        const gridCanvas = createGrid(width, height, size || width * 0.1, alpha);
        const gridPattern = ctx.createPattern(gridCanvas, "repeat");
        if (!gridPattern) {
            throw new Error("failed to create pattern");
        }
        return gridPattern;
    case "checkered":
        const checkeredCanvas = createCheckeredPattern(size || width * 0.1, alpha);
        const checkeredPattern = ctx.createPattern(checkeredCanvas, "repeat");
        if (!checkeredPattern) {
            throw new Error("failed to create pattern");
        }
        return checkeredPattern;
    default:
        throw new Error(`unknown pattern name: ${name}`);
    }
}
