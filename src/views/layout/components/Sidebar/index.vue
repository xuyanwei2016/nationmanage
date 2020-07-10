<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <el-menu mode="vertical" unique-opened :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Hamburger from '@/components/Hamburger'

export default {
  components: { SidebarItem, Hamburger },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods:{
    toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
    }
  }
}
</script>

<style scoped>
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    text-align: center;
    padding-top: 6px;
    background-color: rgb(48, 65, 86);
  }
</style>
