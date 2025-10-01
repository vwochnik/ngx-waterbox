import { Component, signal } from '@angular/core';

import { Waterbox } from 'ngx-waterbox';

@Component({
  selector: 'app-root',
  imports: [Waterbox],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('waterbox-preview');
}
