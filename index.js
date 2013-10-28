var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

module.exports = Talkie

inherits(Talkie, EventEmitter)
function Talkie() {
  if (!(this instanceof Talkie)) return new Talkie
  EventEmitter.call(this)

  var timeline = this
  this.prevtime = 0
  this.next = 0
  this.sections = []
  this.active = []

  this.between = function(start, end) {
    return new TalkieSection(start, end)
  }

  inherits(TalkieSection, EventEmitter)
  function TalkieSection(start, end, data) {
    if (!(this instanceof TalkieSection)) return new TalkieSection(start, end)
    this.data = arguments.length > 2 ? data : null
    this.start = start
    this.end = end
    this.duration = end - start
    timeline.sections.push(this)
    timeline.sort()

    EventEmitter.call(this)
  }

  TalkieSection.prototype.remove = function() {
    return this.removeFrom(timeline)
  }

  TalkieSection.prototype.removeFrom = function(timeline) {
    var idx = timeline.sections.indexOf(this)
    if (idx !== -1) timeline.sections.splice(idx, 1)
    return this
  }
}

Talkie.prototype.reset = function() {
  this.active.length = 0
  this.next = 0
  return this
}

Talkie.prototype.remove = function(node) {
  return node.removeFrom(this)
}

Talkie.prototype.step = function(time) {
  if (time < this.prevtime) this.reset()

  var sections = this.sections
  var active = this.active
  var section

  while (section = sections[this.next]) {
    if (section.start > time) break
    if (section.end > time) {
      active[active.length] = section
      section.emit('start', (time - section.start) / section.duration)
    }
    this.next += 1
  }

  var i = 0
  while (section = active[i]) {
    if (section.end < time) {
      active.splice(i, 1)
      section.emit('end', (time - section.start) / section.duration)
      continue
    }
    i += 1
  }

  active.sort(function(a, b) {
    return a.layer - b.layer
  })

  for (var i = 0; i < active.length; i += 1) {
    section = active[i]
    section.emit('data', (time - section.start) / section.duration)
  }

  this.prevtime = time
  this.emit('data', time)

  return this
}

Talkie.prototype.sort = function() {
  this.sections.sort(function(a, b) {
    return a.start - b.start
  })
  return this
}
