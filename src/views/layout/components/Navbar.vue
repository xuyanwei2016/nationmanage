<template>
  <el-menu class="navbar" mode="horizontal">

    <img :src="Logo" alt="logo" class="logo">
    <span class="text-medium logo-text">中电云V1.0</span>
    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
        <div class="avatar-wrapper">
          <el-select v-model="nationsType" placeholder="请选择活动区域"  @change="selectNation()">
            <el-option :label="typeItem" :value="index" v-for="(typeItem,index) in nationList" :key="index"></el-option>
          </el-select>
        </div>

        <div class="avatar-wrapper">
          <svg-icon icon-class="user" />
          <span>{{username}}</span>

        </div>

        <div class="avatar-wrapper" @click="quit">
          <i class="el-icon-error"></i>
          <a>退出</a>
        </div>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { nationsListAPI } from '@/api/website-management/position'
import Breadcrumb from '@/components/Breadcrumb'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import Logo from '@/assets/img/ciic_logo.png'
import Cookies from 'js-cookie'

export default {
  components: {
    Breadcrumb,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker,
    Logo
  },
  data() {
    return {
      Logo: Logo,
      username:'',
      nationsType:'2',
      nationList:[],
      // nationShow: null,
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  mounted() {
    this.username = Cookies.get('username')
    this.getNations()
  },
  // watch: {
  //   $route( to , from ){
  //     if(to.name == 'order'){

  //     }
  //   }
  // },
  methods: {
    quit(){
      this.$store.dispatch('FedLogOut').then(res => {
        if(res){
          location.reload()
        }
      })
    },
    getNations() {//切换民族
      nationsListAPI().then(res => {
        res.data.code === 0 ? this.nationList = res.data.data : this.$message.error('获取民族数据失败')
      })
    },
    selectNation() {//选择民族
      this.$store.dispatch('setNation',this.nationsType)
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.avatar-wrapper{
  float: left;
  font-size: 14px;
  margin-right: 20px;
  &:nth-of-type(2){
    cursor: pointer;
    &:hover{color: #97a8be;}
  }
}
.navbar {
  .logo-text{
    color:aliceblue;
    float: left;
    margin: 0 10px;
  }
  .logo{
    float: left;
    margin-top: 13px;
  }
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  background: #373d41;

  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    color:#fff;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
