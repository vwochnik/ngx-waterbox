import { Component, inject, ElementRef, DestroyRef, OnInit, signal, input, viewChild, effect, computed } from '@angular/core';

import { Theme } from './types';
import { getDefaultTheme, getFromCssVariables } from './theme';
import { Renderer } from './renderer';

@Component({
  selector: 'ngx-waterbox',
  imports: [],
  template: `
    <canvas #canvas></canvas>
  `,
  styles: `
    :host {
      display: block;
      width: 4rem;
      height: 6rem;
      overflow: hidden;
    }
  `
})
export class Waterbox implements OnInit {
  destroyRef = inject(DestroyRef);
  el = inject(ElementRef);
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  value = input.required<number>();

  width = signal<number>(0);
  height = signal<number>(0);

  renderer = computed(() => {
      const width = this.width();
      const height = this.height();
      const canvas = this.canvas();
      return Renderer(canvas.nativeElement, width, height);
  })

  theme = signal<Theme>(getDefaultTheme());

  constructor() {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        this.width.set(newWidth);
        this.height.set(newHeight);
      }
    });

    this.destroyRef.onDestroy(() => observer.disconnect());
    observer.observe(this.el.nativeElement);

    effect(() => {
      const value = this.value();
      const theme = this.theme();
      const renderer = this.renderer();
      renderer(value, theme);
    });
  }

  ngOnInit(): void {
    this.theme.set(getFromCssVariables(this.el.nativeElement));
  }
}
