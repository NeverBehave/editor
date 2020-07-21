<template>
<div
  ref="menu"
  v-if="shouldShow"
  :style="style"
  @mouseleave='timeoutHide()'
  @mouseover="cancelHide()"
  @contextmenu.prevent
  @wheel.stop
>
  <div class="item" @click="handleDelete">Delete</div>
  <div class="item" @click="handleClone">Clone</div>
</div>
</template>

<script>
import hideMixin from './mixins'
import { fitViewport } from './utils'
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  mixins: [hideMixin('hide')],
  data () {
    return {
      delay: 3000
    }
  },
  computed: {
    ...mapGetters(['eventContextMenu', 'getMouse', 'eventClick']),
    shouldShow () {
      return this.eventContextMenu.type && this.eventContextMenu.uuid
    },
    x () {
      return this.eventContextMenu.x
    },
    y () {
      return this.eventContextMenu.y
    },
    location () {
      const coor = { x: this.x, y: this.y }
      if (this.$refs.menu) {
        return fitViewport(coor, this.$refs.menu)
      }
      return coor
    },
    style () {
      return {
        position: 'fixed',
        padding: '10px',
        width: '120px',
        top: this.location.y + 'px',
        left: this.location.x + 'px'
      }
    }
  },
  watch: {
    eventClick (e) {
      this.hide()
    }
  },
  methods: {
    ...mapMutations(['emitContextMenu']),
    ...mapActions(['removeNode', 'cloneNode']),
    hide () {
      this.emitContextMenu({
        type: null,
        uuid: null
      })
    },
    handleDelete () {
      this.removeNode({ uuid: this.eventContextMenu.uuid })
    },
    handleClone () {
      this.cloneNode({ uuid: this.eventContextMenu.uuid, position: this.location })
    }
  }
}
</script>

<style scoped>
.item {
  color: #fff;
  padding: 4px;
  border-bottom: 1px solid darken(rgba(110,136,255,0.8),8%);
  background-color: rgba(110,136,255,0.8);
  cursor: pointer;
  width: 100%;
  position: relative;
}

.item :hover {
      background-color: lighten(rgba(110,136,255,0.8),4%);
}
</style>
