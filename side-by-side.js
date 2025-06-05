var mapWasDragEnabled
var mapWasTapEnabled


function getRangeEvent(rangeInput) {
  return 'oninput' in rangeInput ? 'input' : 'change'
}

function cancelMapDrag() {
  mapWasDragEnabled = this._map.dragging.enabled()
  mapWasTapEnabled = this._map.tap && this._map.tap.enabled()
  this._map.dragging.disable()
  this._map.tap && this._map.tap.disable()
}

function uncancelMapDrag(e) {
  this._refocusOnMap(e)
  if (mapWasDragEnabled) {
    this._map.dragging.enable()
  }
  if (mapWasTapEnabled) {
    this._map.tap.enable()
  }
}

L.Control.SplitMap = L.Control.extend({
  options: {
    thumbSize: 42,
    padding: 0
  },

  initialize: function (leftLayers, rightLayers, options) {
    this._leftLayerGroup = leftLayers
    this._rightLayerGroup = rightLayers

    this._updateClip()

    L.Util.setOptions(this, options)
  },

  getPosition: function () {
    var rangeValue = this._range.value
    var offset = (0.5 - rangeValue) * (2 * this.options.padding + this.options.thumbSize)
    return this._map.getSize().x * rangeValue + offset
  },

  includes: L.Evented.prototype,

  addTo: function (map) {
    this.remove()
    this._map = map
    var container = this._container = L.DomUtil.create('div', 'leaflet-sbs', map._controlContainer)
    this._divider = L.DomUtil.create('div', 'leaflet-sbs-divider', container)
    var range = this._range = L.DomUtil.create('input', 'leaflet-sbs-range', container)
    range.type = 'range'
    range.min = 0
    range.max = 1
    range.step = 'any'
    range.value = 0.5
    range.style.paddingLeft = range.style.paddingRight = this.options.padding + 'px'
    this._addEvents()
    this._updateClip()
    return this
  },

  remove: function () {
    if (!this._map) {
      return this
    }
    this._leftLayerGroup.eachLayer((left_layer) => {
        left_layer.getPane().style.clip = ""
    })

    this._rightLayerGroup.eachLayer((right_layer) => {
        right_layer.getPane().style.clip = ""
    })
    this._removeEvents()
    L.DomUtil.remove(this._container)
    this._map = null
    return this
  },

  _updateClip: function () {
    if (!this._map) {
      return this
    }
    var map = this._map
    var nw = map.containerPointToLayerPoint([0, 0])
    var se = map.containerPointToLayerPoint(map.getSize())
    var clipX = nw.x + this.getPosition()
    var dividerX = this.getPosition()
    this._divider.style.left = dividerX + 'px'
    this.fire('dividermove', { x: dividerX })
    var clipLeft = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)'
    var clipRight = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)'

    this._leftLayerGroup.eachLayer((left_layer) => {
      left_layer.getPane().style.clip = clipLeft
    })

    this._rightLayerGroup.eachLayer((right_layer) => {
      right_layer.getPane().style.clip = clipRight
    })
  },

  _addEvents: function () {
    var range = this._range
    var map = this._map

    if (!map || !range) return

    map.on('move', this._updateClip, this)

    L.DomEvent.on(range, getRangeEvent(range), this._updateClip, this);
    L.DomEvent.on(range, "touchstart", cancelMapDrag, this);
    L.DomEvent.on(range, "touchend", uncancelMapDrag, this);
    L.DomEvent.on(range, "mousedown", cancelMapDrag, this);
    L.DomEvent.on(range, "mouseup", uncancelMapDrag, this);
  },

  _removeEvents: function () {
    var range = this._range
    var map = this._map

    if (range) {
      L.DomEvent.off(range, getRangeEvent(range), this._updateClip, this);
      L.DomEvent.off(range, "touchstart", cancelMapDrag, this);
      L.DomEvent.off(range, "touchend", uncancelMapDrag, this);
      L.DomEvent.off(range, "mousedown", cancelMapDrag, this);
      L.DomEvent.off(range, "mouseup", uncancelMapDrag, this);
    }
    if (map) {
      map.off("move", this._updateClip, this);
    }
  }
})

L.control.splitMap = function (leftLayers, rightLayers, options) {
  return new L.Control.SplitMap(leftLayers, rightLayers, options)
}
