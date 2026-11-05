# Typography

Roboto as one variable font (any weight from 100 to 900; latin and latin-ext, the latter loaded only when a page needs it), body text in `--f-color-text-1`. Headings grow from phone width up to the large breakpoint. Text written by members sits in `.user-generated`, where h1 and h4 to h6 are normal weight and h4 to h6 take `--f-color-text-0`, h6 also italic (Spaces adds `.brand-links` for links in the brand color).

```html example
<div class="user-generated brand-links">
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>
    <p class="lead">A lead paragraph introduces a page.</p>
    <p>Body text with a <a href="#">link</a>, <strong>strong</strong>, <em>emphasis</em>, <code>inline code</code>, a key <kbd>Esc</kbd> and <small>small print</small>.</p>
    <blockquote>A quote, as the block editor prints it.<cite>Someone</cite></blockquote>
    <ul>
        <li>An unordered list</li>
        <li>with two items</li>
    </ul>
    <ol>
        <li>An ordered list</li>
        <li>with two items</li>
    </ol>
    <pre class="code-block" tabindex="0"><code>.card { background: var(--f-color-bg-1); }</code></pre>
</div>
```

## Sizes and weights

Set a size from the scale, not a literal; a size relative to the element's own text (an icon beside a label, a badge) stays in `em`. `--f-font-size-h1` to `-h6` are the fluid heading sizes (h3 and h4, h5 and h6 share one).

| Token | Value | Used for |
| --- | --- | --- |
| `--f-font-size-xs` | 0.75rem (12px) | Badges, progress, form errors, small chips |
| `--f-font-size-sm` | 0.8125rem (13px) | `small`, `.small`, tooltips, help text |
| `--f-font-size-md` | 0.875rem (14px) | Menus, tabs, breadcrumbs, inputs, user names |
| `--f-font-size-base` | 0.96875rem (15.5px) | Paragraphs, also in `.prose-layout` |
| `--f-font-size-lg` | 1rem (16px) | Card titles, large chips |
| `--f-font-size-xl` | 1.25rem (20px) | `.lead`, clipped titles |
| `--f-font-size-2xl` | 1.5rem (24px) | Large user names |

Weights: `--f-font-weight-normal` (400), `--f-font-weight-medium` and `--f-font-weight-bold` (both 500, the design's bold). Icon-font glyphs set 900, the solid face, outside the tokens.

## Tables

A table is unstyled unless it asks: `.table` splits the rows with hairlines (the block editor's tables in `.user-generated` keep their own look). Wrap a wide one in `.table-scroll`.

```html example
<div class="table-scroll">
    <table class="table">
        <thead>
            <tr><th>Token</th><th>Role</th></tr>
        </thead>
        <tbody>
            <tr><td><code>--f-color-bg-1</code></td><td>Cards</td></tr>
            <tr><td><code>--f-color-text-2</code></td><td>Muted text</td></tr>
        </tbody>
    </table>
</div>
```
