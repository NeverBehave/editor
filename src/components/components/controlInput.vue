<template>
<div>
    <p>hello {{ data.hello }}</p>
    <button @click="handleClick">addInput</button>
    <button @click="handleOutput">addOutput</button>
</div>
</template>

<script>
import common from './mixins'
export default {
  mixins: [common],
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
