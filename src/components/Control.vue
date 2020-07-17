<template>
    <component :is="controlType" :data.sync="controlProps"/>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['getControl']),
    control () {
      return this.getControl(this.uuid)
    },
    controlType () {
      return this.control.name
    },
    controlProps: {
      get () { return this.control.props },
      set (v) {
        this.updateControlProp({ uuid: this.uuid, props: v })
      }
    }
  },
  methods: {
    ...mapMutations(['updateControlProp'])
  }
}
</script>
