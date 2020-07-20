<template>
  <div style="width: 100%; height: 100%">
      <Editor />
      <Dock />
  </div>
</template>

<script>
import Dock from './Dock/Dock'
import Editor from './Editor'

export default {
  components: {
    Editor,
    Dock
  }
}
</script>
