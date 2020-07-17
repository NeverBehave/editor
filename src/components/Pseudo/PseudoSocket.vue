<template>
<div :class="socketType" ref="socket">
        <template v-if="socketType === 'input'">
             <div :title="socket.type" :class="dotClasses" ref="dot"></div>
            <div :class="nameClasses">{{ socket.name }}</div>
        </template>
        <template v-else>
              <div :class="nameClasses">{{ socket.name }}</div>
            <div :title="socket.type" :class="dotClasses" ref="dot"></div>
        </template>
</div>
</template>

<script>
export default {
  props: {
    socket: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    el () {
      return this.$refs.socket
    },
    dotClasses () {
      return ['socket', this.socketType]
    },
    socketType () {
      return this.type
    },
    nameClasses () {
      return [`${this.socketType}-title`]
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
