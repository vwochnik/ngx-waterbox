import { TinyColor } from '@ctrl/tinycolor';

export function lighten(color: string, amount: number): string {
	const col = new TinyColor(color),
		  brightness = col.getBrightness() / 255.0,
	      multiplier = 1.0 - 0.5*brightness;
	
    return col.brighten(amount * multiplier).toString() || color;
}

export function darken(color: string, amount: number): string {
	const col = new TinyColor(color),
		  brightness = col.getBrightness() / 255.0,
	      multiplier = 1.0 - 0.5*brightness;
	
    return col.darken(Math.round(amount * multiplier)).toString() || color;
}
