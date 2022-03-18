<template>
  <div id="app">
    <router-view></router-view>

  </div>
</template>

<script>
export default {
  name: 'App'
}

</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
}
body{
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  font-size: 13px;
  line-height: 1.1;
  color: #4A4A4A;
  background-color: #F3F7FA;
}
p{
  margin: 0;
}
.container {
  margin-top: 10px;
  width: 100%;
  padding-right: 10px;
  padding-left: 10px;
  margin-right: auto;
  margin-left: auto;
  box-sizing: border-box;
}
.row{
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
}
.col-12, .col-sm-4, .col-sm-8, .col-4 {
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}
.col-12{
  width: 100%;
}
.col-4{
  width: 33.3333%;
}
.mb-10{
  margin-bottom: 10px;
}
@media (max-width: 559px){
  .container {
    max-width: none;
  }
}
@media (min-width: 560px) {
  .container {
    max-width: 540px;
  }
  .col-sm-4{
    width: 33.33333%;
  }
  .col-sm-8{
    width: 66.66666%;
  }
}
@media (min-width: 780px) {
    .container {
      max-width: 754px;
    }
  }

</style>
