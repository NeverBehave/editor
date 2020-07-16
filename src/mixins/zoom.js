// wheel => zoomWheel
// pointerdown => zoomDown
// dblclick => zoomDoubleClick
// window.pointermove => zoomMove
// window.pointerup => zoomEnd
// window.pointercancel => zoomEnd

// Required: onZoom
export default {
  data () {
    return {
      zoomPointers: [],
      zoomPrevious: null // { cx: number; cy: number; distance: number }
    }
  },
  computed: {
    zoomTranslating () {
      return this.zoomPointers.length >= 2
    }
  },
  methods: {
    zoomInit () {
      this.listenWindow('pointermove', this.zoomMove)
      this.listenWindow('pointerup', this.zoomEnd)
      this.listenWindow('pointercancel', this.zoomEnd)
    },
    zoomWheel (e) { // : WheelEvent
      const rect = this.el.getBoundingClientRect()
      const wheelDelta = e.wheelDelta //  as unknown as DeltaWheelEvent
      const delta = (wheelDelta ? wheelDelta / 120 : -e.deltaY / 3) * this.getIntensity

      const ox = (rect.left - e.clientX) * delta
      const oy = (rect.top - e.clientY) * delta

      this.onZoom(delta, ox, oy)
    },
    zoomDown (e) { // : PointerEvent
      this.zoomPointers.push(e)
    },
    zoomMove (e) { // : PointerEvent
      this.zoomPointers = this.zoomPointers.map(p => p.pointerId === e.pointerId ? e : p)
      if (!this.zoomTranslating) return

      const rect = this.el.getBoundingClientRect()

      const { cx, cy, distance } = this.zoomTouches()

      if (this.zoomPrevious !== null) {
        const delta = distance / this.zoomPrevious.distance - 1

        const ox = (rect.left - cx) * delta
        const oy = (rect.top - cy) * delta

        this.onZoom(delta, ox - (this.zoomPrevious.cx - cx), oy - (this.zoomPrevious.cy - cy))
      }
      this.zoomPrevious = { cx, cy, distance }
    },
    zoomEnd (e) { // : PointerEvent
      this.zoomPrevious = null
      this.zoomPointers = this.zoomPointers.filter(p => p.pointerId !== e.pointerId)
    },
    zoomTouches () {
      const e = { touches: this.zoomPointers }
      const [x1, y1] = [e.touches[0].clientX, e.touches[0].clientY]
      const [x2, y2] = [e.touches[1].clientX, e.touches[1].clientY]

      const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

      return {
        cx: (x1 + x2) / 2,
        cy: (y1 + y2) / 2,
        distance
      }
    },
    zoomDoubleClick (e) {
      const rect = this.el.getBoundingClientRect()
      const delta = 4 * this.getIntensity

      const ox = (rect.left - e.clientX) * delta
      const oy = (rect.top - e.clientY) * delta

      this.onZoom(delta, ox, oy)
    }
  }
}
