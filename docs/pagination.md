# Pagination

The markup WordPress' `paginate_links()` prints, inside a `.pagination` (defaultspace's copy, `ds_paginate_links()`, adds the screen reader labels).

```html example
<div class="pagination">
    <span aria-current="page" aria-label="Current Page 1" class="page-numbers current" tabindex="0">1</span>
    <a class="page-numbers" href="#"><span class="sr-only">Page</span>2</a>
    <a class="page-numbers" href="#"><span class="sr-only">Page</span>3</a>
    <span class="page-numbers dots">…</span>
    <a class="page-numbers" href="#"><span class="sr-only">Page</span>12</a>
    <a class="next page-numbers" href="#"><i class="fa fa-chevron-right"></i><span class="sr-only">next »</span></a>
</div>
```
