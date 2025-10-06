import { Component } from "@angular/core";

import { BasicWaterbox } from "./components/basic-waterbox/basic-waterbox";
import { DynamicThemeWaterbox } from "./components/dynamic-theme-waterbox/dynamic-theme-waterbox";
import { DiThemeWaterbox } from "./components/di-theme-waterbox/di-theme-waterbox";

@Component({
  selector: 'app-root',
  imports: [BasicWaterbox, DynamicThemeWaterbox, DiThemeWaterbox],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
