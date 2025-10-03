import { Component, inject, signal, DestroyRef, computed } from '@angular/core';
import { TinyColor } from '@ctrl/tinycolor';

import { Waterbox, Theme } from 'ngx-waterbox';

@Component({
  selector: 'app-dynamic-theme-waterbox',
  imports: [Waterbox],
  templateUrl: './dynamic-theme-waterbox.html',
  styleUrl: './dynamic-theme-waterbox.css'
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

    return {
      containerFillColor: color(container),
      containerFillColorLight: lighten(container, contrast),
      containerFillColorDark: darken(container, contrast),
      containerStrokeColor: darken(container, 2*contrast),
      waterFillColor: color(water),
      waterFillColorLight: lighten(water, contrast),
      waterFillColorDark: darken(water, contrast),
      waterStrokeColor: darken(water, 2*contrast),
      strokeWidth: 0.5,
      separators: 5,
      clipEdges: false,
      drawTop: false
    };
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
