export default {
  data () {
    return {
      startPosition: { x: 0, y: 0 },
      windowListeners: []
    }
  },
  computed: {
    transform () {
      return {
        x: this.transformX,
        y: this.transformY
      }
    }
  },
  methods: {
    onStart () {
      this.startPosition = { ...this.transform }
    },
    listenWindow (event, handler) {
      window.addEventListener(event, handler)

      this.windowListeners.push(() => {
        window.removeEventListener(event, handler)
      })
    },
    destroyWindowListener () {
      this.windowListeners.forEach(e => e())
    }
  },
  destroy () {
    this.destroyWindowListener()
  }
}
