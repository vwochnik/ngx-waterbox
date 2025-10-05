import { Component, inject, input, signal, DestroyRef } from '@angular/core';

import { Waterbox } from 'ngx-waterbox';

@Component({
  selector: 'app-basic-waterbox',
  imports: [Waterbox],
  templateUrl: './basic-waterbox.html',
  styleUrl: './basic-waterbox.css',
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
