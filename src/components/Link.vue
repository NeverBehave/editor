<template>
<div :style="divStyle">
  <svg :class="svgClasses">
      <path class="main-path" :d="path" />
  </svg>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { isEqual } from 'lodash'

export default {
  name: 'Link',
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['getConnection', 'getSocket']),
    connection () {
      return this.getConnection(this.uuid)
    },
    output () {
      return this.getSocket(this.connection.from)
    },
    input () {
      return this.getSocket(this.connection.to)
    },
    points () {
      const { x: x1, y: y1 } = this.output.position
      const { x: x2, y: y2 } = this.input.position

      return { x1, y1, x2, y2 }
    },
    path () {
      return this.connection.path
    },
    pathStyle () {
      return {
      }
    },
    divStyle () {
      return {
        position: 'absolute',
        zIndex: '-1'
      }
    },
    svgClasses () {
      return ['connection']
    //   return !connection ? [] : [
    //     'input-' + toTrainCase(connection.input.name),
    //     'output-' + toTrainCase(connection.output.name),
    //     'socket-input-' + toTrainCase(connection.input.socket.name),
    //     'socket-output-' + toTrainCase(connection.output.socket.name)
    //   ]
    }
  },
  methods: {
    ...mapMutations(['updateConnection']),
    defaultPath (points, curvature = 0.4) {
      const { x1, y1, x2, y2 } = points
      const hx1 = x1 + Math.abs(x2 - x1) * curvature
      const hx2 = x2 - Math.abs(x2 - x1) * curvature

      return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`
    },
    updatePath () {
      this.updateConnection({
        uuid: this.uuid,
        connection: {
          path: this.defaultPath(this.points)
        }
      })
    }
  },
  watch: {
    points (p, oldP) {
      if (isEqual(p, oldP)) return
      this.updatePath()
    }
  },
  mounted () {
    if (!this.path) {
      this.updatePath()
    }
  }
}
</script>

<style scoped>
.connection {
  overflow: visible !important;
  position: absolute;
  z-index: -1;
  pointer-events: none; }
  .connection > * {
    pointer-events: all; }
  .connection .main-path {
    fill: none;
    stroke-width: 5px;
    stroke: steelblue; }
</style>
