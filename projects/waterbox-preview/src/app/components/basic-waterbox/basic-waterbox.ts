import { Component, inject, input, signal, DestroyRef } from '@angular/core';

import { Waterbox } from 'ngx-waterbox';

@Component({
  selector: 'app-basic-waterbox',
  imports: [Waterbox],
  template: `
    <ngx-waterbox
        [value]="value()"
    /> 
  `,
  styles: `
      :host {
        --waterbox-stroke-width: 1;
        --waterbox-clip-edges: true;
        --waterbox-draw-front: true;
        --waterbox-back-pattern: grid;
        --waterbox-water-pattern: blocky 0 0.8;
    }

    :host.alternative-1 {
        --waterbox-water-fill-color: rgba(64, 64, 64, 0.8);
        --waterbox-water-fill-color-light: rgba(96, 96, 96, 0.8);
        --waterbox-water-fill-color-dark: rgba(32, 32, 32, 0.8);
        --waterbox-water-stroke-color: rgba(0, 0, 0, 0.8);
        --waterbox-back-pattern: dotted 10 0.5;
        --waterbox-water-pattern: none;
        --waterbox-stroke-width: 1;
        --waterbox-clip-edges: false;
        --waterbox-divisions: 5;
        --waterbox-separator-size: 50;
        --waterbox-draw-front: false;
    }

    :host.alternative-2 {
        --waterbox-back-pattern: none;
        --waterbox-water-pattern: grid;
        --waterbox-back-fill-color: rgb(75, 79, 90);
        --waterbox-back-fill-color-light: rgb(70, 74, 84);
        --waterbox-back-fill-color-dark: rgb(42, 44, 51);
        --waterbox-back-stroke-color: rgb(32, 32, 32);
    }
  `,
  host: {
    '[class]': '`alternative-${alternative()}`'
  }
})
export class BasicWaterbox {
  destroyRef = inject(DestroyRef);

  alternative = input<number>(0);
  value = signal<number>(Math.floor(100*Math.random()));

  constructor() {
    const interval = setInterval(() => {
      this.value.update(v => (v + 1) % 100);
    }, 50);

    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}
