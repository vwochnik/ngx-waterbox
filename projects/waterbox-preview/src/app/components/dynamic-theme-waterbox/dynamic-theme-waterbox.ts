import { Component, inject, signal, DestroyRef, computed } from '@angular/core';
import { TinyColor } from '@ctrl/tinycolor';

import { Waterbox, Theme, getFromPartial } from 'ngx-waterbox';

@Component({
  selector: 'app-dynamic-theme-waterbox',
  imports: [Waterbox],
  template: `
    <ngx-waterbox
        [value]="value()"
        [theme]="theme()"
    />
  `
})
export class DynamicThemeWaterbox {
  destroyRef = inject(DestroyRef);

  value = signal<number>(0);
  theme = computed<Theme>(() => {
    const value = this.value();
    return this.generateTheme(value);
  });

  constructor() {
    const interval = setInterval(() => {
      this.value.update(v => (v + 1) % 100);
    }, 30);

    this.destroyRef.onDestroy(() => clearInterval(interval));
  }

  generateTheme(value: number): Theme {
    const contrast = 20;
    const container = `hsla(180, 30%, 60%, 1)`
    const water = `hsla(${value/100*(90+30)}, 90%, 50%, .7)`;

    return getFromPartial({
      backFillColor: color(container),
      backFillColorLight: lighten(container, contrast),
      backFillColorDark: darken(container, contrast),
      backStrokeColor: darken(container, 2*contrast),
      waterFillColor: color(water),
      waterFillColorLight: lighten(water, contrast),
      waterFillColorDark: darken(water, contrast),
      waterStrokeColor: darken(water, 2*contrast),
      waterPattern: {
        name: "blocky",
        size: 0,
        alpha: 0.5
      },
      strokeWidth: 0.5,
      divisions: 5
    });
  }
}

export function color(color: string): string {
	const col = new TinyColor(color);
  return col.toString();
}

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

export function alpha(color: string, alpha: number): string {
	const col = new TinyColor(color);
  return col.setAlpha(alpha).toString();
}

