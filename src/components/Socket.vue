<template>
<div :class="socketType" ref="socket">
        <template v-if="socketType === 'input'">
             <div :title="socket.type" :class="dotClasses" ref="dot" @click="handleClick"></div>
            <div :class="nameClasses">{{ socket.name }}</div>
        </template>
        <template v-else>
              <div :class="nameClasses">{{ socket.name }}</div>
            <div :title="socket.type" :class="dotClasses" ref="dot" @click="handleClick"></div>
        </template>
</div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { isEqual } from 'lodash'

export default {
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.updatePosition(this.nodePosition)
  },
  computed: {
    ...mapGetters(['getSocket', 'getNode']),
    el () {
      return this.$refs.socket
    },
    socket () {
      return this.getSocket(this.uuid)
    },
    node () {
      return this.getNode(this.socket.parent)
    },
    dotClasses () {
      return ['socket', this.socketType]
    },
    socketType () {
      return this.socket.ioType
    },
    nameClasses () {
      return [`${this.socketType}-title`]
    },
    nodePosition () {
      return this.node.position
    }
  },
  methods: {
    ...mapMutations(['updateSocket']),
    ...mapActions(['socketClicked']),
    updatePosition (position) {
      const el = this.$refs.dot

      this.updateSocket({
        uuid: this.uuid,
        socket: {
          position: {
            x: position.x + el.offsetLeft + el.offsetWidth / 2,
            y: position.y + el.offsetTop + el.offsetHeight / 2
          }
        }
      })
    },
    handleClick () {
      this.socketClicked({ uuid: this.uuid })
    }
  },
  watch: {
    nodePosition (position, oldPosition) {
      if (isEqual(position, oldPosition)) return // Work around listener cannot cache method
      this.updatePosition(position)
    }
  }
}
</script>

<style scoped>
.output {
    text-align: right; }
.input {
    text-align: left; }
.input-title, .output-title {
    vertical-align: middle;
    color: white;
    display: inline-block;
    font-family: sans-serif;
    font-size: 14px;
    margin: 6px;
    line-height: 24px; }
.socket {
  display: inline-block;
  cursor: pointer;
  border: 1px solid white;
  border-radius: 12px;
  width: 24px;
  height: 24px;
  margin: 6px;
  vertical-align: middle;
  background: #96b38a;
  z-index: 2;
  box-sizing: border-box; }
  .socket:hover {
    border-width: 4px; }
  .socket.multiple {
    border-color: yellow; }
  .socket.output {
    margin-right: -12px; }
  .socket.input {
    margin-left: -12px; }
</style>
