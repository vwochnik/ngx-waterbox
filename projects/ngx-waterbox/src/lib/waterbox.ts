import { Component, inject, ElementRef, DestroyRef, signal, input, viewChild, effect } from '@angular/core';

@Component({
  selector: 'ngx-waterbox',
  imports: [],
  template: `
    <!--canvas #canvas [width]="width()" [height]="height()"></canvas-->
    <canvas #canvas width="400" height="400"></canvas>
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
  destroyRef = inject(DestroyRef);
  el = inject(ElementRef);
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  value = input.required<number>();

  width = signal<number>(0);
  height = signal<number>(0);

  constructor() {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        this.width.set(newWidth);
        this.height.set(newHeight);
        console.info("fire", {newWidth, newHeight});
      }
    });

    this.destroyRef.onDestroy(() => observer.disconnect());
    observer.observe(this.el.nativeElement);

    effect(() => {
      const value = this.value();
      const width = this.width();
      const height = this.height();
      const canvas = this.canvas();
      this.render(canvas.nativeElement, width, height, value);
    });
  }

  render(element: HTMLCanvasElement, width: number, height: number, value: number) {
    const ctx = element.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, width, height);
  }
}
