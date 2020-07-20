<template>
<div>
    <p>hello {{ data.hello }}</p>
    <button @click="handleClick">addInput</button>
    <button @click="handleOutput">addOutput</button>
</div>
</template>

<script>
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
  },
  methods: {
    handleClick () {
      this.$editor.dispatch('addNodeInput', {
        uuid: this.control.parent,
        input: {
          name: 'any',
          type: 'string'
        }
      })
    },
    handleOutput () {
      this.$editor.dispatch('addNodeOutput', {
        uuid: this.control.parent,
        output: {
          name: 'any',
          type: 'string'
        }
      })
    }
  }
}
</script>
