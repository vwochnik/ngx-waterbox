import {
    createCoarseNoise,
    createDotMatrix,
    createGrid
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
        const blockyCanvas = createCoarseNoise(width, height,width * 0.1, 0.5);
        const blockyPattern = ctx.createPattern(blockyCanvas, "repeat");
        if (!blockyPattern) {
            throw new Error("failed to create pattern");
        }
        return blockyPattern;
    case "noise":
        const noiseCanvas = createCoarseNoise(width, height, 1, 0.5);
        const noisePattern = ctx.createPattern(noiseCanvas, "repeat");
        if (!noisePattern) {
            throw new Error("failed to create pattern");
        }
        return noisePattern;
    case "dotted":
        const dottedCanvas = createDotMatrix(width, height, width * 0.1, 0.5);
        const dottedPattern = ctx.createPattern(dottedCanvas, "repeat");
        if (!dottedPattern) {
            throw new Error("failed to create pattern");
        }
        return dottedPattern;
    case "grid":
        const gridCanvas = createGrid(width, height, width * 0.1, 0.5);
        const gridPattern = ctx.createPattern(gridCanvas, "repeat");
        if (!gridPattern) {
            throw new Error("failed to create pattern");
        }
        return gridPattern;
    default:
        throw new Error(`unknown pattern name: ${name}`);
    }
}