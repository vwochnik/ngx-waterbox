export interface WaterboxConfig {
    theme?: Theme;
}

export interface Theme {
    backFillColor: string;
    backFillColorLight: string;
    backFillColorDark: string;
    backStrokeColor: string;
    backPattern: Pattern;
    frontFillColor: string;
    frontFillColorLight: string;
    frontFillColorDark: string;
    frontStrokeColor: string;
    frontPattern: Pattern;
    waterFillColor: string;
    waterFillColorLight: string;
    waterFillColorDark: string;
    waterStrokeColor: string;
    waterPattern: Pattern;
    strokeWidth: number;
    divisions: number;
    separatorSize: number;
    clipEdges: boolean;
    drawFront: boolean;
}

export interface Pattern {
    name: string;
    size: number;
    alpha: number;
}