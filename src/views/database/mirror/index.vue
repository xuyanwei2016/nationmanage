<template>
  <el-container>
    <el-aside width="200px" class="tree-aside">
      <el-tree  :data="navTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-aside>

    <el-main style="padding-top: 100px;padding-left:100px;">
        <el-button style="width:300px;height:200px;font-size:20px;" @click="exportSQL" :loading="sqlLoading">导出sql文件</el-button>
        <el-button style="width:300px;height:200px;font-size:20px;margin-left:100px;position:relative;" @click="exportResource" :loading="resLoading">导出资源文件
          <el-progress type="circle" :percentage="num" v-if="cancel" style="z-index:100;position:absolute;top:40px;right:80px;"></el-progress>
        </el-button>
        <el-button style="width:300px;height:200px;font-size:20px;display:block;margin-top:50px;">生成秘钥</el-button>
    </el-main>
    

    <el-dialog title="导出资源文件" :visible.sync="dialogVisible" width="20%">

    </el-dialog>
</el-container>
</template>

<script>

import { getNavAPI } from '@/api/database/theory'
import { exportSqlAPI, exportResourceAPI, getPercentageAPI } from '@/api/database/mirror'
import { uploadUrl, uploadPath, requestPath, uploadZip } from '@/utils/global.js'
import store from '@/store'
import { getListAPI } from "@/api/database/classfiy";


export default {
  data() {
    return {
      uploadZip:uploadZip,
      uploadUrl:uploadUrl,
      uploadPath:uploadPath,
      authBtns: [],
      listQuery: { },
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      dialogVisible: false,
      num: 0,
      cancel: false,
      sqlLoading: false,
      resLoading: false
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {    
    this.getNav()
    this.getPercentage()
  },
  methods: {
    getNav(){
      getListAPI().then(res => {
        res.data.code == 0 ? this.navTree =  [{showName:'全部'}].concat(res.data.data) : this.$message.error('获取nav数据失败')
      })
    },
    handleNodeClick(data){ //点击树节点获取table数据
      // this.listQuery.diyTypeId = data.id
      this.listQuery.codes = data.code
    },
    exportSQL() { //导出sql文件 
      if(this.listQuery.codes) {
        this.sqlLoading = true
        if(this.sqlLoading) {
          this.$message.warning('正在导出')
          exportSqlAPI(this.listQuery).then(res =>　{
            let data = this.uploadZip + res.data
            if(res.status == 200) {
              this.$message.success('导出sql文件成功')
              window.open(data,'_blank')
            }
            this.sqlLoading = false
          })
        } 
      } else {
        this.$message.error('请先选择自定义分类')
      }
      
    },
    exportResource() { //导出资源文件
      if(this.listQuery.codes) {
        this.resLoading = true
        if(this.resLoading) {
          this.$message.warning('正在导出')
          exportResourceAPI(this.listQuery).then(res => {
            let data = this.uploadZip + res.data
            if(res.status == 200) {
              this.$message.success('导出资源文件成功')
              window.open(data,'_blank')
            }
            this.resLoading = false
          })
        }
      } else {
        this.$message.error('请先选择自定义分类')
      }
    },
    getPercentage() {
      getPercentageAPI().then(res => {
        console.log(res,66666666666);
        
      })
    }
  }
}
</script>

<style>
.el-tabs__header,.el-tabs--card>.el-tabs__header{
  border: 0;
  margin-bottom: 0;
}
.el-table{
  width:99.9%;
}
.treeBack {
  background: #fff;
}
.treeBackActive {
  background: #999;
}
</style>
