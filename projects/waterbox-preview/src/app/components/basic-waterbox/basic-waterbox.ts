import { Component, inject, signal, DestroyRef } from '@angular/core';

import { Waterbox } from 'ngx-waterbox';

@Component({
  selector: 'app-basic-waterbox',
  imports: [Waterbox],
  templateUrl: './basic-waterbox.html',
  styleUrl: './basic-waterbox.css'
})
export class BasicWaterbox {
  destroyRef = inject(DestroyRef);

  value = signal<number>(0);

  constructor() {
    const interval = setInterval(() => {
      this.value.update(v => (v + 1) % 100);
    }, 50);

    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}
