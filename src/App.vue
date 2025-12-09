<template>
  <div id="app">
    <ColorPalette />
  </div>
</template>

<script>
import ColorPalette from './ColorPalette.vue'

export default {
  name: 'App',
  components: {
    ColorPalette
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>