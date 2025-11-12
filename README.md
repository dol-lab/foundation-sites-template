# Foundation for Sites Template

This originally was built using [Foundation for Sites 6](http://foundation.zurb.com/sites). It includes a Sass compiler and a starter HTML file for you.

## Installation

To use this template, your computer needs:

- [NodeJS](https://nodejs.org/en/) (0.12 or greater)
- [Git](https://git-scm.com/)


```bash
cd projectname
npm install
```

Finally, run `npm run start` to run the Sass compiler. It will re-run every time you save a Sass file.


## To Do

* Revisit color-mix declarations. Most of them have fallbacks, some do not, especially when declared through scss variables.
* Revisit text sizing.
* Increase global border-radius settings.


### Colors

Light and dark are not symetric.

```css
/** the Idea is "layers". LIGHT  */
--f-color-bg-0: var(--f-color-neutral-300); /* 94%  white -> background */
--f-color-bg-1: var(--f-color-neutral-100); /* 100% white -> card */
--f-color-bg-2: var(--f-color-neutral-200); /* 97%  white -> ...something */

/** the Idea is "layers". DARK  */
--f-color-bg-0: var(--f-color-neutral-300); /* 14%  white -> background */
--f-color-bg-1: var(--f-color-neutral-100); /* 4% white -> card */
--f-color-bg-2: var(--f-color-neutral-200); /* 9%  white -> ...something */
```
