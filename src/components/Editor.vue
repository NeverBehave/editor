<template>
  <div :style="editorStyle" class="editor-container"
          @pointermove="handleMove"
          @pointerup="handleUp"
          @pointerdown="handleDown"
          @pointercancel="handleCancel"
          @wheel.prevent="handleWheel"
          @dblclick.prevent="handleDoubleClick">
    <div
      :style="graphStyle"
      ref="graph"
    >
      <Node v-for="(node, uuid) in getNodes" :key="uuid" :uuid="uuid" />
      <Link v-for="(connection, uuid) in getConnections" :key="uuid" :uuid="uuid" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { Common, Zoom, Drag } from '../mixins'
import Node from './Node'
import Link from './Link'

export default {
  props: {},
  mixins: [Common, Zoom, Drag],
  created () {
    this.zoomInit()
    this.dragInit()
  },
  components: {
    Node,
    Link
  },
  computed: {
    ...mapGetters(['getScale', 'getEditorTransform', 'getNodes', 'getConnections', 'getIntensity']),
    el () {
      return this.$refs.graph
    },
    transformX: {
      get () {
        return this.getEditorTransform.x
      },
      set (x) {
        this.updateEditorTransform({
          x
        })
      }
    },
    transformY: {
      get () {
        return this.getEditorTransform.y
      },
      set (y) {
        this.updateEditorTransform({
          y
        })
      }
    },
    editorStyle () {
      return {
        ...this.dragStyle,
        overflow: 'hidden',
        width: '869px',
        height: '464px'
      }
    },
    graphStyle () {
      return {
        'transform-origin': '0px 0px 0px',
        transform: `translate(${this.getEditorTransform.x}px, ${this.getEditorTransform.y}px) scale(${this.getScale})`
      }
    }
  },
  methods: {
    ...mapMutations(['updateEditorTransform', 'updateEditorScale']),
    onZoom (delta, ox, oy) {
      this.zoom(this.getScale * (1 + delta), ox, oy)
    },
    zoom (zoom, ox = 0, oy = 0) { // @TODO source: touch/mouse
      const k = this.getScale

      // @TODO event zoom
      const d = (k - zoom) / ((k - zoom) || 1)

      this.updateEditorScale({ scale: zoom })
      this.transformX += ox * d
      this.transformY += oy * d
    },
    translate (x, y) {
      this.transformX = x
      this.transformY = y
    },
    onTranslate (dx, dy) {
      if (this.zoomTranslating) return // lock translation while zoom on multitouch
      if (this.startPosition) this.translate(this.startPosition.x + dx, this.startPosition.y + dy)
    },
    onDrag (dx, dy) {
      // @TODO Event
    },
    handleMove (e) {
      // this.zoomMove(e)
      // this.dragMove(e)
    },
    handleUp (e) {
      // this.zoomEnd(e)
      // this.dragUp(e)
    },
    handleDown (e) {
      this.zoomDown(e)
      this.dragDown(e)
    },
    handleCancel (e) {
      // this.zoomEnd(e)
    },
    handleWheel (e) {
      this.zoomWheel(e)
    },
    handleDoubleClick (e) {
      this.zoomDoubleClick(e)
    }
  }
}
</script>

<style scoped>
.editor-container {
  margin: 0;
  background: #ddd;
}
</style>
