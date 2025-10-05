<div align="center">
<h1>ngx-waterbox</h1>

![Waterbox](preview.png?raw=true "Waterbox")

[![npm version](https://img.shields.io/npm/v/ngx-waterbox.svg)](https://www.npmjs.com/package/ngx-waterbox)
[![npm downloads](https://img.shields.io/npm/dm/ngx-waterbox.svg)](https://www.npmjs.com/package/ngx-waterbox)
[![license](https://img.shields.io/npm/l/ngx-waterbox.svg)](https://github.com/vwochnik/ngx-waterbox/blob/master/LICENSE.md)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/ngx-waterbox)](https://bundlephobia.com/package/ngx-waterbox)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://www.typescriptlang.org/)
</div>

An isometric water box component for Angular.

## Installation

Install the library via NPM:

```bash
npm install --save ngx-waterbox
```

## Basic Usage

1. Import the component in your Angular application:

```typescript
import { Waterbox } from 'ngx-waterbox';
```

2. Import the waterbox component into your component where you want to use it:

```typescript
@Component({
  // ...
  imports: [Waterbox]
})
```

3. Use the component in your template:

```html
<ngx-waterbox [value]="50"></ngx-waterbox>
```

4. Customize the appearance using inputs or CSS variables as needed.

# Adjusting size

The canvas will adapt to the size of the component. Simply change it via CSS in your parent component:

```css
ngx-waterbox {
  width: 50px;
  height: 200px;
}
```

# Themeing

## Using CSS variables

| CSS Variable                           | Default Value           |
|-----------------------------------------|-------------------------|
| `--waterbox-back-fill-color`       | `rgb(100,130,160)`      |
| `--waterbox-back-fill-color-light` | `rgb(140,170,200)`      |
| `--waterbox-back-fill-color-dark`  | `rgb(70,100,130)`       |
| `--waterbox-back-stroke-color`            | `rgb(30,40,50)`         |
| `--waterbox-back-pattern`  | `blocky 0 0.5`       |
| `--waterbox-front-fill-color`       | `rgba(100,130,160,0.2)`      |
| `--waterbox-front-fill-color-light` | `rgba(140,170,200,0.2)`      |
| `--waterbox-front-fill-color-dark`  | `rgba(70,100,130,0.2)`       |
| `--waterbox-front-stroke-color`     | `rgba(30,40,50,0.2)`         |
| `--waterbox-front-pattern`  | `blocky 0 0.5`       |
| `--waterbox-water-fill-color`           | `rgba(10,60,120,0.7)`   |
| `--waterbox-water-fill-color-light`     | `rgba(30,90,180,0.7)`   |
| `--waterbox-water-fill-color-dark`      | `rgba(0,40,80,0.7)`     |
| `--waterbox-water-stroke-color`                | `rgba(0,20,40,0.8)`     |
| `--waterbox-water-pattern`  | `blocky 0 0.5`       |
| `--waterbox-stroke-width`               | `0.5`                   |
| `--waterbox-divisions`                 | `5`                     |
| `--waterbox-separator-size`             | `10`                     |
| `--waterbox-clip-edges`                 | `false`                 |
| `--waterbox-draw-front`                   | `false`                 |

## Using TypeScript

1. Import `Theme` with the component:

```typescript
import { Waterbox, Theme, getFromPartial } from 'ngx-waterbox';
```

2. Define your theme
```
theme: Theme = {
  "backFillColor": "rgb(100,130,160)",
  "backFillColorLight": "rgb(140,170,200)",
  "backFillColorDark": "rgb(70,100,130)",
  "backStrokeColor": "rgb(30,40,50)",
  "backPattern": {
    "name": "none",
    "size": 0,
    "alpha": 0
  },
  "frontFillColor": "rgba(100,130,160,0.2)",
  "frontFillColorLight": "rgba(140,170,200,0.2)",
  "frontFillColorDark": "rgba(70,100,130,0.2)",
  "frontStrokeColor": "rgba(30,40,50,0.2)",
  "frontPattern": {
    "name": "none",
    "size": 0,
    "alpha": 0
  },
  "waterFillColor": "rgba(10,60,120,0.7)",
  "waterFillColorLight": "rgba(30,90,180,0.7)",
  "waterFillColorDark": "rgba(0,40,80,0.7)",
  "waterStrokeColor": "rgba(0,20,40,0.8)",
  "waterPattern": {
    "name": "blocky",
    "size": 0,
    "alpha": 0.5
  },
  "strokeWidth": 0.5,
  "divisions": 5,
  "separatorSize": 10,
  "clipEdges": false,
  "drawFront": false
}
```

You can also define a partial theme:
```typescript
theme = getFromPartial({
  "drawFront": true
});
```

3. Pass theme to waterbox component:

```html
<ngx-waterbox [value]="50" [theme]="theme"></ngx-waterbox>
```

## Available patterns

The following patterns are available:

* `none`: No pattern. Default.
* `noise`: Random noise
* `blocky`: Random blocky texture
* `dotted`: Dot matrix
* `grid`: Grid texture

# License

MIT
