import { Theme } from "./types";

type ThemePropertyMap = {
  [K in keyof Theme]: {
    key: K;
    type: Theme[K] extends string
      ? "string"
      : Theme[K] extends number
      ? "number"
      : Theme[K] extends boolean
      ? "boolean"
      : never;
    default: Theme[K];
    variable: string;
  };
};

type ThemeProperty = ThemePropertyMap[keyof Theme];

const THEME_PROPERTIES: ThemeProperty[] = [
    {
        key: "backFillColor",
        type: "string",
        default: "rgb(100,130,160)",
        variable: "back-fill-color"
    },
    {
        key: "backFillColorLight",
        type: "string",
        default: "rgb(140,170,200)",
        variable: "back-fill-color-light"
    },
    {
        key: "backFillColorDark",
        type: "string",
        default: "rgb(70,100,130)",
        variable: "back-fill-color-dark"
    },
    {
        key: "backStrokeColor",
        type: "string",
        default: "rgb(30,40,50)",
        variable: "back-stroke-color"
    },
    {
        key: "frontFillColor",
        type: "string",
        default: "rgba(100,130,160,0.2)",
        variable: "front-fill-color"
    },
    {
        key: "frontFillColorLight",
        type: "string",
        default: "rgba(140,170,200,0.2)",
        variable: "front-fill-color-light"
    },
    {
        key: "frontFillColorDark",
        type: "string",
        default: "rgba(70,100,130,0.2)",
        variable: "front-fill-color-dark"
    },
    {
        key: "frontStrokeColor",
        type: "string",
        default: "rgba(30,40,50,0.2)",
        variable: "front-stroke-color"
    },
    {
        key: "waterFillColor",
        type: "string",
        default: "rgba(10,60,120,0.7)",
        variable: "water-fill-color"
    },
    {
        key: "waterFillColorLight",
        type: "string",
        default: "rgba(30,90,180,0.7)",
        variable: "water-fill-color-light"
    },
    {
        key: "waterFillColorDark",
        type: "string",
        default: "rgba(0,40,80,0.7)",
        variable: "water-fill-color-dark"
    },
    {
        key: "waterStrokeColor",
        type: "string",
        default: "rgba(0,20,40,0.8)",
        variable: "water-stroke-color"
    },
    {
        key: "strokeWidth",
        type: "number",
        default: 0.5,
        variable: "stroke-width"
    },
    {
        key: "divisions",
        type: "number",
        default: 5,
        variable: "divisions"
    },
    {
        key: "separatorSize",
        type: "number",
        default: 10,
        variable: "separator-size"
    },
    {
        key: "clipEdges",
        type: "boolean",
        default: false,
        variable: "clip-edges"
    },
    {
        key: "drawFront",
        type: "boolean",
        default: false,
        variable: "draw-front"
    }
];

export function getDefaultTheme(): Theme {
    return THEME_PROPERTIES.reduce((theme, property) => {
        return {
            ...theme,
            [property.key]: property.default
        };
    }, {} as Theme);
}

export function getFromCssVariables(element: HTMLElement): Theme {
    return THEME_PROPERTIES
        .reduce((theme, property) => {
            let value: string | number | boolean | null = null;
            switch (property.type) {
            case 'boolean':
                value = cssBooleanVariable(element, property.variable);
                break;
            case 'string':
                value = cssStringVariable(element, property.variable);
                break;
            case 'number':
                value = cssNumericVariable(element, property.variable);
                break;
            }
            if (value !== null) {
                return {
                    ...theme,
                    [property.key]: value
                };
            }
            return theme;
        }, getDefaultTheme());
}

function cssStringVariable(element: HTMLElement, v: string): string | null {
    const r = getComputedStyle(element).getPropertyValue(`--waterbox-${v}`);
    if (!r) return null;
    return r;
}

function cssBooleanVariable(element: HTMLElement, v: string): boolean | null {
    const r = cssStringVariable(element, v);
    if (r === null) return null;
    if (r.toLowerCase() === "true") {
        return true;
    }
    return false;
}

function cssNumericVariable(element: HTMLElement, v: string): number | null {
    const r = cssStringVariable(element, v);
    if (r === null) return null;
    const n = parseFloat(r);
    if (isNaN(n)) { return null; }
    return n;
}
