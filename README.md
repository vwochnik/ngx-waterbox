<div align="center">
<h1>ngx-waterbox</h1>

![Waterbox](preview.png?raw=true "Waterbox")
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
| `--waterbox-front-fill-color`       | `rgba(100,130,160,0.2)`      |
| `--waterbox-front-fill-color-light` | `rgba(140,170,200,0.2)`      |
| `--waterbox-front-fill-color-dark`  | `rgba(70,100,130,0.2)`       |
| `--waterbox-front-stroke-color`     | `rgba(30,40,50,0.2)`         |
| `--waterbox-water-fill-color`           | `rgba(10,60,120,0.7)`   |
| `--waterbox-water-fill-color-light`     | `rgba(30,90,180,0.7)`   |
| `--waterbox-water-fill-color-dark`      | `rgba(0,40,80,0.7)`     |
| `--waterbox-water-stroke-color`                | `rgba(0,20,40,0.8)`     |
| `--waterbox-stroke-width`               | `0.5`                   |
| `--waterbox-divisions`                 | `5`                     |
| `--waterbox-separator-size`             | `10`                     |
| `--waterbox-clip-edges`                 | `false`                 |
| `--waterbox-draw-front`                   | `false`                 |

# Using TypeScript

1. Import `Theme` with the component:

```typescript
import { Waterbox, Theme } from 'ngx-waterbox';
```

2. Define your theme
```
theme: Theme = {
  "backFillColor": "rgb(100,130,160)",
  "backFillColorLight": "rgb(140,170,200)",
  "backFillColorDark": "rgb(70,100,130)",
  "backStrokeColor": "rgb(30,40,50)",
  "frontFillColor": "rgba(100,130,160,0.2)",
  "frontFillColorLight": "rgba(140,170,200,0.2)",
  "frontFillColorDark": "rgba(70,100,130,0.2)",
  "frontStrokeColor": "rgba(30,40,50,0.2)",
  "waterFillColor": "rgba(10,60,120,0.7)",
  "waterFillColorLight": "rgba(30,90,180,0.7)",
  "waterFillColorDark": "rgba(0,40,80,0.7)",
  "waterStrokeColor": "rgba(0,20,40,0.8)",
  "strokeWidth": 0.5,
  "divisions": 5,
  "separatorSize": 10,
  "clipEdges": false,
  "drawFront": false
}
```

3. Pass theme to waterbox component:

```html
<ngx-waterbox [value]="50" [theme]="theme"></ngx-waterbox>
```

## License

MIT
