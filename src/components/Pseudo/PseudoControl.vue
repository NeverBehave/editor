<template>
    <component :is="controlType" :data="controlProps"/>
</template>

<script>
export default {
  props: {
    control: {
      type: Object,
      required: true
    }
  },
  computed: {
    controlType () {
      return this.control.type
    },
    controlProps () {
      return this.control.data
    }
  }
}
</script>
