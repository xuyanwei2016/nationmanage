<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App',
    provide(){
      return {
        reload:this.reload
      }
    },
    data() {
      return {
        isRouterAlive:true
      }
    },
    methods:{
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function(){
          this.isRouterAlive = true
        })
      }
    }
  }
</script>
<style lang="less">
  .inputCss{
    .el-input.is-disabled .el-input__inner {
      background-color:#fff;
      border-color: #e4e7ed;
      color: #606266;
      cursor: not-allowed;
    }
    .el-radio__input.is-disabled+span.el-radio__label {
      color: inherit;
      cursor: not-allowed;
    }
    .el-textarea.is-disabled .el-textarea__inner {
      background-color:#fff;
      border-color: #e4e7ed;
      color: #606266;
      cursor: not-allowed;
    }
  }
  .authoryizhu{
    ul{
      li{
        padding-left:20px;
      }
      li:hover{
        background: #efefef;
      }
    }
  }

</style>
