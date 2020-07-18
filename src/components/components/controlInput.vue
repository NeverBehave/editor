<template>
    <p>hello {{ data.hello }}</p>
</template>

<script>
export default {
  inject: {
    $editor: {
      default: undefined
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      temp: true
    }
  },
  computed: {
    isDemo () {
      return this.$editor === undefined
    }
  }
}
</script>
