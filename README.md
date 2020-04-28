# Filter Elements

Let's you filter HTML Elements by tag based filters by setting an data attribute. Supports clickable handles and selects.

## Installation

```bash
npm install @pxlrbt/filter-elements
```

## Usage

```js
import FilterElements from '@pxlrbt/filter-elements';
var filter = new FilterElements();
```

```html
<a data-filter-key="tags" data-filter-value="">All</a>
<a data-filter-key="tags" data-filter-value="js">JavaScript</a>
<a data-filter-key="tags" data-filter-value="html">HTML</a>

<div>
  <div data-filterable data-filter-tags="js"></div>
  <div data-filterable data-filter-tags="js,html"></div>
  <div data-filterable data-filter-tags="html"></div>
</div>
```

```css
[data-filterable] {
    display: none;
}

[data-filter-filtered="false"] {
    display: block;
}
```
