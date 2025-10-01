import { Theme } from "./types";

export function getDefaultTheme(): Theme {
    return {
        strokeColor: '#000',
        containerColor: '#aaa',
        fillColor: '#88f',
        strokeWidth: 2,
        separators: 5,
        drawTop: false,
        contrast: 0.1
    };
}

export function getFromCssVariables(element: HTMLElement): Theme {
    const result = getDefaultTheme();

    result.strokeColor = cssStringVariable(element, "waterbox-stroke-color", result.strokeColor);

    result.containerColor = cssStringVariable(element, "waterbox-container-color", result.containerColor);

    result.fillColor = cssStringVariable(element, "waterbox-fill-color", result.fillColor);

    result.strokeWidth = cssNumericVariable(element, "waterbox-stroke-width", result.strokeWidth);

    result.separators = cssNumericVariable(element, "waterbox-separators", result.separators);

    result.drawTop = cssBooleanVariable(element, "waterbox-draw-top", result.drawTop);

    result.contrast = cssNumericVariable(element, "waterbox-contrast", result.contrast);

    return result;
}

function cssStringVariable(element: HTMLElement, v: string, def: string): string {
    const r = getComputedStyle(element).getPropertyValue(`--${v}`);
    if (!r) { return def; }
    return r;
}

function cssBooleanVariable(element: HTMLElement, v: string, def: boolean) {
    const r = cssStringVariable(element, v, `${def}`);
    if (r.toLowerCase() === "true") {
        return true;
    } else if (r.toLowerCase() === "false") {
        return false;
    }
    return def;
}

function cssNumericVariable(element: HTMLElement, v: string, def: number) {
    const r = cssStringVariable(element, v, `${def}`);
    const n = parseFloat(r);
    if (isNaN(n)) { return def; }
    return n;
}