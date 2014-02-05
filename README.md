jquery-radar
============

A jQuery plugin for Radial Menus

Author: @mcuznz / Mike Cousins

This is still in *very* early development - I don't even consider it ready for public use yet. There's no Demo page, and some pretty half-assed documentation.

I intend this Plugin to be very easy to style and override, but during development many things will be hard-coded.

Currently, the Radial Items are all same-sized, circular DIVs.  I'd like to see this changed to an SVG-based implementation, but that might be a far-off, lofty goal...

Installation
------------

Requires jQuery.  jQuery UI also recommended for additional easements.
Include jquery.radar.js and jquery.radar.css in your project.


Usage
-----

```Javascript
$('#someElement').radar(options, items);
```

*options* is an array of options which override the defaults.  For now, see the source for the default options array for reference, as its ever-changing.
*items* is an array describing the items spawned around the target element, in the following format:

```Javascript
var items = [
	{
		label: "Item A",
		contents: "A",
		click: function() { alert('A clicked'); }
	},
	{
		label: "Item B",
		contents: "B",
		click: function() { alert('B clicked'); }
	}
]
```

You get the idea.  Currently these are the only 3 properties needed for each item, though that is subject to change... and a better method of defining them may be introduced.

Feedback is encouraged. Jackassery is not.

Cheers,
Mike

