import { Component, inject, signal, DestroyRef } from '@angular/core';

import { Waterbox } from 'ngx-waterbox';

@Component({
  selector: 'app-root',
  imports: [Waterbox],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  destroyRef = inject(DestroyRef);

  value = signal<number>(0);

  constructor() {
    const interval = setInterval(() => {
      this.value.update(v => (v + 1) % 100);
    }, 50);

    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}
