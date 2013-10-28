# talkie [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

A small module for handling animation frames in smaller, stackable pieces.

This has been extracted from [mrdoob](http://github.com/mrdoob)'s
[frame.js](http://github.com/mrdoob/frame.js/) so that it can be used in
isolation - there's also been a few API changes.

## Usage ##

[![talkie](https://nodei.co/npm/talkie.png?mini=true)](https://nodei.co/npm/talkie)

### `timeline = require('talkie')()` ###

Creates a new timeline.

### `section = timeline.between(start, end)` ###

Creates a new section that is active between times `start` and `end`.
Note that times are agnostic, as long as you're consistent you could
use milliseconds, seconds, days, months, years, etc.

### `section.on('start', handler)` ###

Called when a section becomes active.

### `section.on('end', handler)` ###

Called when a section stops being active.

### `section.on('data', handler(t))` ###

Called each step that the section is active - `t` is the fraction of its
duration that has passed, i.e. how far it is between `start` and `end`,
and will always be between 0 and 1.

### `timeline.step(time)` ###

Sets the timeline to the point at `time` - updating all of the associated
sections as a result.

## Example ##

``` javascript
var talkie = require('talkie')()

// t is a value between 0 and 1
talkie.between(0, 1000)
  .on('start', function(t) {})
  .on('end', function(t) {})
  .on('data', function(t) {
    console.log(t * 100 + '!')
  })

talkie.step(50)   // 5!
talkie.step(250)  // 25!
talkie.step(905)  // 90.5!
talkie.step(1100) //
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/talkie/blob/master/LICENSE.md) for details.
