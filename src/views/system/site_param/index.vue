<template>
  <div class="tab-container">
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <!-- <keep-alive> -->
          <tab-pane :active-name='item.key' ></tab-pane>
        <!-- </keep-alive> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './components/tabPane'

export default {
  name: 'tab',
  components: { tabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '基础参数设置', key: 'basic' },
        { label: '会员参数设置', key: 'members' },
        { label: '邮件参数设置', key: 'email' },
        { label: '短信参数设置', key: 'message' },
      ],
      activeName: 'basic',
      createdTimes: 0
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
