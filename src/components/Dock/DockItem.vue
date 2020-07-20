<template>
    <div class="dock-item" @click="handleClick" draggable="true" @dragstart="handleDragStart">
      <PseudoNode :node="component" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PseudoNode from '../Pseudo/PseudoNode'

export default {
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  components: {
    PseudoNode
  },
  computed: {
    ...mapGetters(['getComponent']),
    component () {
      return this.getComponent(this.uuid)
    }
  },
  methods: {
    ...mapActions(['addNodeFromComponent']),
    handleClick () {
      this.addNodeFromComponent({ component: this.uuid })
    },
    handleDragStart (e) {
      if (!e.dataTransfer) return
      e.dataTransfer.setData('componentId', this.uuid)
    }
  }
}
</script>
<style scoped>
.dock-item {
 margin:1em
}
</style>
