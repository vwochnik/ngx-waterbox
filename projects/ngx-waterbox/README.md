# ngx-waterbox

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

For more advanced usage and configuration, refer to the documentation or source code.

