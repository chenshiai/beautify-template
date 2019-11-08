<template>
  <div id="app">
    <router-view/>
    <div class="buttom-ann"></div>
  </div>
</template>

<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: transparent;
}
.buttom-ann{
  position: fixed;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border: solid 10px;
  border-color: transparent #919191 #919191 transparent;
}
</style>
