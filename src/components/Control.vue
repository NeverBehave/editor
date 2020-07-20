<template>
    <component :is="controlType" :data.sync="nodeData" :uuid="uuid" />
</template>

<script>
import vuex from 'vuex'
const { mapGetters, mapMutations } = vuex

export default {
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['getControl', 'getNode']),
    control () {
      return this.getControl(this.uuid)
    },
    nodeId () {
      return this.control.parent
    },
    node () {
      return this.getNode(this.nodeId)
    },
    controlType () {
      return this.control.type
    },
    nodeData: {
      get () { return this.node.data },
      set (v) {
        this.updateNodeData({ uuid: this.nodeId, data: v })
      }
    }
  },
  methods: {
    ...mapMutations(['updateNodeData'])
  },
  provide () {
    return {
      $editor: this.$store
    }
  }
}
</script>
