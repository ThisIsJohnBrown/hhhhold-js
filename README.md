HHHHold
======

Feel the insanity of user-generated content in your project by putting simple hhhhold! URLs in your code.

Forked from the [holder.js](https://github.com/imsky/holder) repo.

Why it exists
-------------

Because early on in the process of building a website or app, you should know what your design looks like with a variety of content.

How to use it
-------------

Include ``hhhhold.js`` in your HTML:

```html
<script src="hhhhold.js"></script>
```

HHHHold will then process all images with a specific ``src`` attribute, like this one:

```html
<img src="hhhhold.js/200x300">
```

The above tag will render as a placeholder 200 pixels wide and 300 pixels tall.

To avoid console 404 errors (and my prefered way), you can use ``data-src`` instead of ``src``.

```html
<img data-src="hhhhold.js/200x300">
```

Where the magic happens
------------------

You can use all the attributes documented on [hhhhold!](http://hhhhold.com).

Examples:

```html
<img data-src="hhhhold.js/l/t/b">
```

will get you an image that is between 500px and 900px in height, with a portrait aspect ratio, tending towards a lighter image.

```html
<img data-src="hhhhold.js/300/png/d">
```

will deliver you a 300x300 .png that is pretty dark.

Background placeholders
-----------------------

Holder can render placeholders as background images for elements with the `holderjs` class, like this:

```css
#sample {background:url(?holder.js/200x200/social) no-repeat}
```

```html
<div id="sample" class="holderjs"></div>
```

The Holder URL in CSS should have a `?` in front. You can change the default class by specifying a selector as the `bgnodes` property when calling `Holder.run`.


Using with ``lazyload.js``
--------------------------

Holder is compatible with ``lazyload.js`` and works with both fluid and fixed-width images. For best results, run `.lazyload({skip_invisible:false})`.

Browser support
---------------

* Chrome 1+
* Firefox 3+
* Safari 4+
* Internet Explorer 9+, with fallback for IE6-8
* Android 1+

Things missing from the Holder fork
-----------------------------------

Holder uses canvas and redrawing on resize to provide fluid layout placeholders. Because of the rasterized nature of the [hhhhold!](http://hhhhold.com) images, this isn't a good solution. I am working on a possible idea for this. Until then, enjoy!

License
-------

HHHHold is provided under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0). Commercial use requires attribution.

Credits
-------

HHHHold is a project by [John Brown](http://thisisjohnbrown.com).

forked from

Holder is a project by [Ivan Malopinsky](http://imsky.co).
