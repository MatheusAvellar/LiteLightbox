# LiteLightbox
A lightweight, plug'n'play lightbox plugin for the web, written in about 100 lines of pure vanilla JavaScript.
Minifies to about 1.5&nbsp;KB, `gzip`s to about 750&nbsp;B.
Comes with an optional default stylesheet mimicking Wikipedia's lightbox.

Check out the [demo/documentation](https://lab.avl.la/LiteLightbox/)! It's mobile friendly as well :)

## What is it?
It's a [lightbox](https://en.wikipedia.org/wiki/Lightbox_(JavaScript)) plugin for the web – when you click a thumbnail, it'll open a fullscreen modal displaying a higher resolution version of it, like this:

<table>
  <tr>
    <th>Main page</th><th>Lightbox open</th>
  </tr>
  <tr>
    <td>
      <img width="400" alt="2022-11-05_16-26-50" src="https://user-images.githubusercontent.com/1719996/200137549-27d3df60-cac0-4afa-b749-39d468cb24dd.png">
    </td>
    <td>
      <img width="400" alt="2022-11-05_16-26-59" src="https://user-images.githubusercontent.com/1719996/200137546-80fecc03-272d-4bf7-8f85-b7b86584f0f9.png">
    </td>
  </tr>
</table>

## Why did you make another lightbox library? Didn't you know we have like thousands of those?
I needed a small and lightweight lightbox that mimicked Wikipedia's to use in a personal project of mine. I figured it'd be easier to write my own than to figure out what's the best alternative out there that was customizable enough for my needs.

## Pros
- Very lightweight;
- Very simple to use;
- Progressive enhancement – browsers with no support will just have a regular `<a>` linking to the full-res image;

## TODO (= Cons)
- Figure out browser compatibility (probably nothing incredible, I'll be honest)
- Figure out if it's acceptably accessible (it probably is! I think)

## How about adding (...)?
No, thanks! This is mostly a personal project, fit to my (very) specific needs. If you'd like to add, remove, or change anything, feel free to fork this and build your own personalized version! :)
