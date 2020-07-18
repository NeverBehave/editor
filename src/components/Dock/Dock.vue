<template>
    <div class="dock-menu">
        <DockItem v-for="(value, uuid) in getComponents" :key="uuid" :uuid="uuid" />
    </div>
</template>

<script>
import DockItem from './DockItem'
import { mapGetters } from 'vuex'

export default {
  components: {
    DockItem
  },
  computed: {
    ...mapGetters(['getComponents'])
  },
  methods: {
    // DragEvent
  }
}
</script>

<style scoped>
.dock-menu {
 display:-webkit-box;
 display:-ms-flexbox;
 display:flex;
 position:absolute;
 top:80%;
 width:100%;
 -webkit-transform:scale(.6);
 transform:scale(.6);
 -webkit-transform-origin:0 0;
 transform-origin:0 0;
 -webkit-transition:.5s;
 transition:.5s;
 opacity:.7;
 background:-webkit-gradient(linear,left bottom,left top,color-stop(90%,#fff),to(transparent));
 background:linear-gradient(0deg,#fff 90%,transparent)
}
.dock-menu:hover {
 top:70%;
 opacity:1
}
</style>
