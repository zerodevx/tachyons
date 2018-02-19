# TACHYONS-AMP-BUILD

A barebones AMP-compatible TACHYONS build. Based off TACHYONS v4.9.1.

Conforming to [Google's Accelerated Mobile Pages, or AMP, project](https://www.ampproject.org/) CSS specs, *external stylesheets*, the `!important` qualifier, and the `behavior` and `-moz-binding` properties are disallowed. Furthermore, the custom CSS should not exceed a *50kb* size limit.

This convenience build aims to provide a CSS snippet that passes AMP validation, while providing a reduced set of the most-used features from the original [TACHYONS](http://tachyons.io/) (as much as possible).

## Usage

The [minified build](https://raw.githubusercontent.com/zerodevx/tachyons-amp-build/amp-build/amp-build/tachyons-amp.min.css) (currently at 44kb) is located in the [`./amp-build`](https://github.com/zerodevx/tachyons-amp-build/tree/amp-build/amp-build) directory in the [`amp-build`](https://github.com/zerodevx/tachyons-amp-build/tree/amp-build) branch.

Simply copy & paste into your AMP HTML's `<style amp-custom>` tag.


## Set up locally

1. Clone this repo and switch to the `amp-build` branch.

```
git clone https://github.com/zerodevx/tachyons-amp-build.git
cd tachyons-amp-build
git checkout amp-build
```

2. Install `tachyons-cli` and `gulp-cli` globally, and install local dependencies.
```
npm install -g tachyons-cli gulp-cli
npm install
```

3. Run `gulp` to build.
```
gulp
```

## Upgrade to a newer TACHYONS release

1. [Set up locally](#Set-up-locally).

2. Checkout `master` branch and pull upstream.
```
git checkout master
git pull https://github.com/tachyons-css/tachyons.git master
```

3. Checkout `amp-build` branch and rebase from new version. (eg v4.9.1)
```
git checkout amp-build
git rebase tags/v4.9.1
```

4. Rebuild.
```
gulp
```

## What's different from the full TACHYONS

Most of TACHYONS' classes should work; most modules are loaded *except* for the following:

```
@import './_aspect-ratios';
@import './_images';
@import './_background-size';
@import './_background-position';
@import './_rotations';
@import './_negative-margins';
@import './_tables';
@import './_visibility';
@import './_vertical-align';
@import './_nested';

/* Custom styles */
@import './_styles';

/* All debugging stuff */
@import './_debug-children';
@import './_debug-grid';
@import './_debug';
```

So classes defined in the list above will not.

Another major change is **only one media query breakpoint** is included, and that is the extension `-l`. The `-l` breakpoint is defined as `(min-width: 45em)`, so per [Google's responsive web design best practices](https://developers.google.com/web/fundamentals/design-and-ux/responsive/), design **mobile-first**, then use the `-l` extension to render the desktop look.

## Why TACHYONS with AMP?

It's atomic, has good documentation, and is actively maintained. Atomic (or functional) CSS works well with AMP, because 80% of what you'll probably need is generalised into 20% of reusable well-defined style classes. Also, the web should be as semantic as possible - so something like this:

```html
<div class="this-is-a-grid it-should-wrap it-should-center blue-background">
  <div class="this-is-an-item red-background">Item 1</div>
  <div class="this-is-an-item yellow-background">Item 2</div>
  <div class="this-is-an-item orange-background">Item 3</div>
</div>
```

probably trumps this:

```html
<style>
  .class1 {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: blue;
  }
  .class2 {
    -ms-flex: 1 1 0.000000001px;
    -webkit-flex: 1;
    flex: 1;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;
    background-color: red;
  }
  .class3 {
    -ms-flex: 1 1 0.000000001px;
    -webkit-flex: 1;
    flex: 1;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;
    background-color: yellow;
  }
  .class2 {
    -ms-flex: 1 1 0.000000001px;
    -webkit-flex: 1;
    flex: 1;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;
    background-color: orange;
  }
</style>
...
<div class="class1">
  <div class="class2">Item 1</div>
  <div class="class3">Item 2</div>
  <div class="class4">Item 3</div>
<div>
```

Read more about TACHYONS [here](https://github.com/tachyons-css/tachyons).
