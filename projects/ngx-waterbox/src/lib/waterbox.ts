import { Component, inject, ElementRef, DestroyRef, signal, input, viewChild, effect, computed } from '@angular/core';

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
export class Waterbox {
  private destroyRef = inject(DestroyRef);
  private el = inject(ElementRef);
  protected canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  value = input.required<number>();
  theme = input<Theme | null>(null);

  protected _theme = signal<Theme>(getDefaultTheme());
  protected width = signal<number>(0);
  protected height = signal<number>(0);

  protected renderer = computed(() => {
      const width = this.width();
      const height = this.height();
      if (width === 0 || height === 0) {
        return () => {};
      }
      const canvas = this.canvas();
      return Renderer(canvas.nativeElement, width, height);
  })

  constructor() {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        this.width.set(newWidth);
        this.height.set(newHeight);
      }
    });

    const rect = this.el.nativeElement.getBoundingClientRect();
    this.width.set(rect.width);
    this.height.set(rect.height);

    this.destroyRef.onDestroy(() => observer.disconnect());
    observer.observe(this.el.nativeElement);

    effect(() => {
      const theme = this.theme();
      if (theme !== null) {
        this._theme.set(theme);
      } else {
        this._theme.set(getFromCssVariables(this.el.nativeElement));
      }
    });

    effect(() => {
      const value = this.value();
      const theme = this._theme();
      const renderer = this.renderer();
      renderer(value, theme);
    });
  }
}
