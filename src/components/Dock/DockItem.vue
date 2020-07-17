<template>
    <div class="dock-item">
      <PseudoNode :node="component"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
  }
}
</script>
<style scoped>
.dock-item {
 margin:1em
}
</style>
