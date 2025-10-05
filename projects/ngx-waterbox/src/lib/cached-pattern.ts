import { Pattern } from "./types";
import { makePattern } from "./patterns";

export class CachedPattern {

    private lastPattern: Pattern = { name: 'none', size: 0, alpha: 0 };
    private canvasPattern: CanvasPattern | string = "transparent";

    constructor(
        private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        private width: number,
        private height: number
    ) {}

    getPattern(pattern: Pattern): CanvasPattern | string {
        if (patternToString(pattern) !== patternToString(this.lastPattern)) {
            this.canvasPattern = makePattern(this.ctx, pattern.name, this.width, this.height, pattern.size, pattern.alpha);
            this.lastPattern = pattern;
        }
        return this.canvasPattern
    }
}

function patternToString(pattern: Pattern): string {
    return `${pattern.name}-${pattern.size}-${pattern.alpha}`;
}