<template>
    <div :style="pickerStyle">
        <PseudoLink v-if="show" :points="points" @click.native="handleClick"/>
    </div>
</template>

<script>
import PseudoLink from './Pseudo/PseudoLink'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    PseudoLink
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['getMouse', 'getSelectedSocket', 'getSocket']),
    show () {
      return this.getSelectedSocket !== null
    },
    io () {
      return this.getSocket(this.getSelectedSocket)
    },
    points () {
      if (this.io) {
        if (this.io.ioType === 'input') {
          return {
            x1: this.getMouse.x,
            y1: this.getMouse.y,
            x2: this.io.position.x,
            y2: this.io.position.y
          }
        }
        return {
          x2: this.getMouse.x,
          y2: this.getMouse.y,
          x1: this.io.position.x,
          y1: this.io.position.y
        }
      }
      return { x1: 0, y1: 0, x2: 0, y2: 0 }
    },
    pickerStyle () {
      return {
        position: 'absolute'
      }
    }
  },
  methods: {
    ...mapMutations(['updateSelectedSocket']),
    handleClick () {
      this.updateSelectedSocket({ uuid: null })
    }
  }
}
</script>
