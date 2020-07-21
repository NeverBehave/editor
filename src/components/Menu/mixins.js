import { debounce } from 'lodash'

export default (hideMethod) => ({
  data () {
    return {
      timeoutHide: () => {}
    }
  },
  methods: {
    cancelHide () {
      const hide = this.timeoutHide

      if (hide && hide.cancel) { this.timeoutHide.cancel() }
    }
  },
  mounted () {
    this.timeoutHide = debounce(this[hideMethod], this.delay)
  }
})
