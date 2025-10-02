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
        key: "strokeColor",
        type: "string",
        default: "black",
        variable: "stroke-color"
    },
    {
        key: "containerColor",
        type: "string",
        default: "gray",
        variable: "container-color"
    },
    {
        key: "waterColor",
        type: "string",
        default: "blue",
        variable: "water-color"
    },
    {
        key: "strokeWidth",
        type: "number",
        default: 0.5,
        variable: "stroke-width"
    },
    {
        key: "separators",
        type: "number",
        default: 5,
        variable: "separators"
    },
    {
        key: "drawTop",
        type: "boolean",
        default: false,
        variable: "draw-top"
    },
    {
        key: "contrast",
        type: "number",
        default: 20,
        variable: "contrast"
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
