export default {
  inject: {
    $editor: {
      default: undefined
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    uuid: {
      type: String,
      default: ''
    }
  },
  computed: {
    isDemo () {
      return this.$editor === undefined
    },
    control () {
      return this.isDemo ? null : this.$editor.getters.getControl(this.uuid)
    },
    node () {
      return this.control ? this.$editor.getters.getNode(this.control.parent) : null
    }
  }
}
