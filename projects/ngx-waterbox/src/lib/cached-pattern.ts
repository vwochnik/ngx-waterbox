import { Pattern } from "./types";
import { createCanvasFromPattern } from "./utils";

export class CachedPattern {

    private lastPattern: Pattern = { name: 'none', size: 0, alpha: 0 };
    private lastCanvas: OffscreenCanvas | null = null;

    constructor() {}

    getPattern(pattern: Pattern): OffscreenCanvas | null {
        if (patternToString(pattern) !== patternToString(this.lastPattern)) {
            this.lastCanvas = createCanvasFromPattern(pattern.name, pattern.size, pattern.alpha);
        }
        return this.lastCanvas;
    }
}

function patternToString(pattern: Pattern): string {
    return `${pattern.name}-${pattern.size}-${pattern.alpha}`;
}
