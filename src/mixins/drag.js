// pointerdown => dragDown
// window.pointermove => dragMove
// window.pointerup => dragUp

// Required: onStart, onDrag, onTranslate

export default {
  data () {
    return {
      dragPointerStart: null // [number, number]
    }
  },
  computed: {
    dragStyle () {
      return {
        'touch-action': 'none'
      }
    }
  },
  methods: {
    dragInit () {
      this.listenWindow('pointermove', this.dragMove)
      this.listenWindow('pointerup', this.dragUp)
    },
    dragDown (e) { // : PointerEvent
      if ((e.pointerType === 'mouse') && (e.button !== 0)) return
      e.stopPropagation()
      this.dragPointerStart = [e.pageX, e.pageY]

      this.onStart(e)
    },

    dragMove (e) { // : PointerEvent
      if (!this.dragPointerStart) return
      e.preventDefault()

      const [x, y] = [e.pageX, e.pageY]

      const delta = [x - this.dragPointerStart[0], y - this.dragPointerStart[1]]

      const zoom = this.el.getBoundingClientRect().width / this.el.offsetWidth

      this.onTranslate(delta[0] / zoom, delta[1] / zoom, e)
    },
    dragUp (e) { // : PointerEvent
      if (!this.dragPointerStart) return

      this.dragPointerStart = null
      this.onDrag(e)
    }
  }
}
