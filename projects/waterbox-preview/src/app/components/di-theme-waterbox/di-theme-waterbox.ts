import { Component, inject, signal, DestroyRef, computed } from '@angular/core';
import { TinyColor } from '@ctrl/tinycolor';

import { Waterbox, Theme, getFromPartial, WATERBOX_THEME } from 'ngx-waterbox';

@Component({
  selector: 'app-di-theme-waterbox',
  imports: [Waterbox],
  template: `
    <ngx-waterbox
        [value]="value()"
    />
  `,
  providers: [
    {
      provide: WATERBOX_THEME, useValue: getFromPartial({
        backFillColor: 'transparent',
        backFillColorLight: 'transparent',
        backFillColorDark: 'transparent',
        backStrokeColor: 'transparent',
        waterFillColor: 'rgba(68, 188, 68, 0.6)',
        waterFillColorLight: 'rgba(100, 232, 100, 0.6)',
        waterFillColorDark: 'rgba(41, 133, 41, 0.6)',
        clipEdges: true
      })
    }
  ]
})
export class DiThemeWaterbox {
  destroyRef = inject(DestroyRef);

  value = signal<number>(0);

  constructor() {
    const interval = setInterval(() => {
      this.value.update(v => (v + 1) % 100);
    }, 30);

    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}