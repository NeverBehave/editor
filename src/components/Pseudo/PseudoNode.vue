<template>
    <div  :style="nodeStyle"
            class="node"
            ref="node"
        >
        <div class="title">{{ node.name }}</div>
        <PseudoControl v-for="item in controls" :key="item.name" :control="item" />
        <PseudoSocket v-for="item in inputs" :key="item.name" :socket="item" :type="`input`"/>
        <PseudoSocket v-for="item in outputs" :key="item.name" :socket="item" :type="`output`"/>
    </div>
</template>

<script>
import PseudoSocket from './PseudoSocket'
import PseudoControl from './PseudoControl'

export default {
  components: {
    PseudoSocket,
    PseudoControl
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  computed: {
    el () {
      return this.$refs.node
    },
    inputs () {
      return this.node.inputs
    },
    outputs () {
      return this.node.outputs
    },
    controls () {
      return this.node.controls
    }
  },
  methods: {}
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
