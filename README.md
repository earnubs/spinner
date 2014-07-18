Spinner
=======

Customisable ```<canvas>``` based spinner that allows changing props like speed on the fly.

Usage
-----

Add a ```canvas``` element to the document, a square with same height and width attribute values:
```html
<canvas id="foo" width="100" height="100"></canvas>
```

Create a spinner instance using the ```@id``` of your canvas element:

```javascript

var my_spinner = new Spinner({
  canvas_id: 'foo',
  speed: 1, // '1' should be approx 1 rotation per second
  segment_angle: 30, // rotational angle of each segment
  segment_gap_angle: 0, // rotational angle of spaces between segments, 0 for continuous
  segment_radius: 30, // the overall radius of the spinning element
  segment_depth: 1, // thickness of the spinning element
  foreground: [0,0,0], // rgb values for foreground colour
  background: [255,255,255] // rgb values for background colour
});

my_spinner.play();
```
