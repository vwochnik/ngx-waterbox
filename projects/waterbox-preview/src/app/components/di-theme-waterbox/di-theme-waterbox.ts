import { Component, inject, signal, DestroyRef, computed } from '@angular/core';
import { TinyColor } from '@ctrl/tinycolor';

import { Waterbox, Theme, getFromPartial, provideWaterboxConfig } from 'ngx-waterbox';

@Component({
  selector: 'app-di-theme-waterbox',
  imports: [Waterbox],
  template: `
    <ngx-waterbox
        [value]="value()"
    />
  `,
  providers: [
    provideWaterboxConfig({
      theme: getFromPartial({
        backFillColor: 'rgba(80, 80, 111, 1)',
        backFillColorLight: 'rgba(80, 80, 111, 1)',
        backFillColorDark: 'rgba(80, 80, 111, 1)',
        backStrokeColor: 'rgba(80, 80, 111, 1)',
        waterFillColor: 'rgba(176, 68, 188, 0.6)',
        waterFillColorLight: 'rgba(176, 68, 188, 0.6)',
        waterFillColorDark: 'rgba(176, 68, 188, 0.6)',
        waterStrokeColor: 'rgba(176, 68, 188, 0.6)',
        waterPattern: {
          name: "grid",
          size: 10,
          alpha: 1.0
        },
        strokeWidth: 2,
        clipEdges: true
      })
    })
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
