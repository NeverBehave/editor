<template>
    <div :style="editorStyle"
        @pointerdown="handleDown"
        @pointermove="handleMove"
        @wheel.prevent="handleWheel"
        @dblclick.prevent="handleDoubleClick"
        @dragover.prevent
        @drop="handleDrop"
        ref="editor" class="editor-container">
        <div
            :style="graphStyle"
            ref="graph">
            <Picker />
            <Node v-for="(node, uuid) in getNodes" :key="uuid" :uuid="uuid" />
            <Link v-for="(connection, uuid) in getConnections" :key="uuid" :uuid="uuid" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Common, Zoom, Drag, Resize } from '../mixins'
import Node from './Node'
import Link from './Link'
import Picker from './Picker'

export default {
  props: {},
  mixins: [Common, Zoom, Drag, Resize],
  created () {
    this.zoomInit()
    this.dragInit()
  },
  components: {
    Node,
    Link,
    Picker
  },
  computed: {
    ...mapGetters(['getEditorTransform', 'getNodes', 'getConnections', 'getIntensity', 'eventResize', 'getEditorSize']),
    el () {
      return this.$refs.graph
    },
    transformX () {
      return this.getEditorTransform.x
    },
    transformY () {
      return this.getEditorTransform.y
    },
    scale () {
      return this.getEditorTransform.scale
    },
    editorStyle () {
      return {
        ...this.dragStyle,
        overflow: 'hidden',
        width: `${this.editorWidth}px`,
        height: `${this.editorHeight}px`
      }
    },
    graphStyle () {
      return {
        'transform-origin': '0px 0px 0px',
        transform: `translate(${this.transformX}px, ${this.transformY}px) scale(${this.scale})`
      }
    },
    editorHeight () {
      return this.getEditorSize.height
    },
    editorWidth () {
      return this.getEditorSize.width
    }
  },
  methods: {
    ...mapMutations(['updateEditorScale', 'updateMouse', 'updateEditorSize']),
    ...mapActions(['addNodeFromComponent', 'updateEditorZoom', 'updateEditorTranslate']),
    onZoom (delta, ox, oy) {
      this.updateEditorZoom({
        x: ox,
        y: oy,
        scale: this.scale * (1 + delta)
      })
    },
    translate (x, y) {
      this.updateEditorTransform({
        x,
        y
      })
    },
    onTranslate (dx, dy) {
      if (this.zoomTranslating) return // lock translation while zoom on multitouch
      if (this.startPosition) this.translate(this.startPosition.x + dx, this.startPosition.y + dy)
    },
    onDrag (dx, dy) {
      // @TODO Event
    },
    handleDown (e) {
      this.zoomDown(e)
      this.dragDown(e)
    },
    handleWheel (e) {
      this.zoomWheel(e)
    },
    handleMove (e) {
      this.observeMouseMove(e)
    },
    observeMouseMove (e) {
      const { clientX, clientY } = e
      const rect = this.el.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const k = this.scale

      this.updateMouse({
        position: { x: x / k, y: y / k }
      })
    },
    handleDoubleClick (e) {
      this.zoomDoubleClick(e)
    },
    handleDrop (e) {
      if (!e.dataTransfer) return
      const uuid = e.dataTransfer.getData('componentId')
      if (uuid) {
        this.observeMouseMove(e) // Update mouse position
        this.addNodeFromComponent({ component: uuid, followMouse: true })
      }
    },
    resize () {
      const container = this.$refs.editor

      if (!container.parentElement) { throw new Error('Container doesn\'t have parent element') }

      this.updateEditorSize({
        size: {
          width: container.parentElement.clientWidth,
          height: container.parentElement.clientHeight
        }
      })
    }
  },
  watch: {
    eventResize () {
      this.resize()
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
