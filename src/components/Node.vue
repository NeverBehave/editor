<template>
    <div  :style="nodeStyle"
            class="node"
            @pointerdown="handleDown"
            @contextmenu.stop.prevent="handleContextMenu"
            ref="node"
        >
        <div class="title">{{ node.name }}</div>
        <div class="subtitle">{{ node.type }}</div>
        <Socket v-for="uuid in outputs" :key="uuid" :uuid="uuid"/>
        <Control v-for="uuid in controls" :key="uuid" :uuid="uuid" />
        <Socket v-for="uuid in inputs" :key="uuid" :uuid="uuid"/>
    </div>
</template>

<script>
import Socket from './Socket'
import Control from './Control'
import { mapGetters, mapMutations } from 'vuex'
import { Common, Drag } from '../mixins'

export default {
  mixins: [Common, Drag],
  created () {
    this.dragInit()
  },
  components: {
    Socket,
    Control
  },
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['getNode']),
    el () {
      return this.$refs.node
    },
    node () {
      return this.getNode(this.uuid)
    },
    inputs () {
      return this.node.inputs
    },
    outputs () {
      return this.node.outputs
    },
    controls () {
      return this.node.controls
    },
    transformX: {
      get () {
        return this.node.position.x
      },
      set (v) {
        this.updateNode({
          uuid: this.uuid,
          node: {
            position: {
              ...this.node.position,
              x: v
            }
          }
        })
      }
    },
    transformY: {
      get () {
        return this.node.position.y
      },
      set (v) {
        this.updateNode({
          uuid: this.uuid,
          node: {
            position: {
              ...this.node.position,
              y: v
            }
          }
        })
      }
    },
    nodeStyle () {
      return {
        position: 'absolute',
        transform: `translate(${this.transformX}px, ${this.transformY}px)`
      }
    }
  },
  methods: {
    ...mapMutations(['updateNode']),
    onDrag (dx, dy) {
      // @TODO Event
    },
    onStart () {
      // @TODO also select event
      this.startPosition = { ...this.node.position }
    },
    onTranslate (dx, dy) {
      const x = this.startPosition.x + dx
      const y = this.startPosition.y + dy

      this.translate(x, y)
    },
    translate (x, y) {
      this.transformX = x
      this.transformY = y
    },
    handleDown (e) {
      this.dragDown(e)
    },
    handleContextMenu (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
.node {
  background: rgba(110, 136, 255, 0.8);
  border: 2px solid #4e58bf;
  border-radius: 10px;
  cursor: pointer;
  min-width: 180px;
  height: auto;
  padding-bottom: 6px;
  box-sizing: content-box;
  position: relative;
  user-select: none; }
  .node:hover {
    background: rgba(130, 153, 255, 0.8); }
.selected {
    background: #ffd92c;
    border-color: #e3c000; }
.title {
    color: white;
    font-family: sans-serif;
    font-size: 18px;
    padding: 8px; }
.control {
    padding: 6px 18px; }
</style>
