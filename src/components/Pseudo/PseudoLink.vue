<template>
<svg class="connection">
      <path class="main-path" :d="path" />
  </svg>
</template>

<script>
export default {
  name: 'Link',
  props: {
    points: { // x1, y1, x2, y2
      type: Object,
      required: true
    }
  },
  computed: {
    path () {
      const curvature = 0.4
      const { x1, y1, x2, y2 } = this.points
      const hx1 = x1 + Math.abs(x2 - x1) * curvature
      const hx2 = x2 - Math.abs(x2 - x1) * curvature

      return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`
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
