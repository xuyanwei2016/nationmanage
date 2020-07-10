<template>
  <el-container>
    <el-aside width="200px" class="tree-aside">
      <el-tree :data="navTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-aside>

    <el-main style="padding-top: 100px;padding-left:100px;">
        <el-button style="width:300px;height:200px;font-size:20px;">导出sql文件</el-button>
        <el-button style="width:300px;height:200px;font-size:20px;margin-left:100px;">导出资源文件</el-button>
        <el-button style="width:300px;height:200px;font-size:20px;display:block;margin-top:50px;">生成秘钥</el-button>
    </el-main>
</el-container>
</template>

<script>
import { getNavAPI } from '@/api/database/theory'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import { getListAPI, editStatusAPI, batchDeleteAPI } from '@/api/database/doctor'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100
      },
      timeLimit: null,
      batchList: [],
      activeName: 'books',
      status:[ 
        '已录入',
        '已上架',
        '已下架',
      ],
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
  },
  mounted() {    
    this.getList()
    this.getNav()
  },
  methods: {
    getNav(){
      getNavAPI({name:'著作'}).then(res => {
        res.data.data.map(el => {
          el.list = [{showName:'全部'}].concat(el.list)
        })
        if(res.data.code == 0) {
          res.data.data.map(el => {
            this.navTree = el.list
          })
        } else {
          this.$message.error('获取nav数据失败')
        }
      })
    },
    handleNodeClick(data){ //点击树节点获取table数据
      // this.listQuery.diyTypeId = data.id
      this.listQuery.diyTypeCode = data.code
      this.getList()
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    handleSort({column, prop, order}) {
      if (order) {
        this.listQuery.orderBy = `${prop} ${order.substring(0,order.length-6)}`
      } else {
        this.listQuery.orderBy = null
      }
      this.getList()
    },
    editStatus(status) {//批量上下架
      if(this.batchList.length > 0){   
        const ids = getMultipleSelectionIDs(this.batchList);
        const data = {
          id: ids,
          status: status
        }
        if(status == 1) {//批量上架--已录入或已下架状态作者数据点击【上架】按钮
          const type = this.batchList.every(data => data.status == 2 || data.status == 0)
          if(type){
            confirm.apply(this,['确认上架吗？']).then(() => {
              editStatusAPI(data).then(res => {
                requestMsg.apply(this,[res.data,'上架'])
                this.getList()
              })
            })
          } else{
            this.$message.error('您选择的状态数据不能执行此操作，请重新选择');
          }
        } else{//批量下架--已上架状态作者数据点击【下架】按钮
          const type = this.batchList.every(data => data.status == 1)
          if(type){
            confirm.apply(this,['确认下架吗？']).then(() => {
              editStatusAPI(data).then(res => {
                requestMsg.apply(this,[res.data,'下架'])
                this.getList()
              })
            })
          } else{
            this.$message.error('您选择的状态数据不能执行此操作，请重新选择');
          }
        }
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },
    listSatus(tab,event) { //0已录入，1已上架，2已下架Tab切换
      if (tab.index == 0) {
        this.listQuery.status = null
      } else{
        this.listQuery.status = tab.index-1 // 0已录入 1上架 2下架
      }
      this.getList();
    },
    batchDelete(){//批量删除--不能删除已上架的资源
      if(this.batchList.length == 0){ 
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const dataType = this.batchList.every(data => data.status != 1)
        if(dataType){
          const ids = getMultipleSelectionIDs(this.batchList);
          confirm.apply(this,['确认删除吗？']).then(() => {
            batchDeleteAPI(ids).then(res => {
              requestMsg.apply(this,[res.data,'删除'])
              this.getList()
            })
          })
        } else{
          this.$message.error('已上架数据不能删除')
        }      
      }
    },
    deleteBtn(row){//单条删除 只能删除未上架的
      const ids = []
      if(row.status != 1){
        ids.push(row.id)
        confirm.apply(this,['确定要删除吗？']).then(() => {
          batchDeleteAPI(ids).then(res => {
            requestMsg.apply(this,[res.data,'删除'])
            this.getList()
          })
        })
      } else{
        this.$message.error('已上架数据不能删除')
      }
    },
    chioceList(val) {
      this.batchList = val;
    },
    handleFilter(){
      if(this.timeLimit){
        this.listQuery.beginTime = this.timeLimit[0]
        this.listQuery.endTime = this.timeLimit[1]
      } else {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }
      this.listQuery.pageNum = 1
      this.listQuery.status = this.listQuery.status
      this.getList()
    },
    resetFilter(){
      this.timeLimit = []
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        status: this.listQuery.status,
        // nationsType: this.listQuery.nationsType,
        diyTypeId: this.listQuery.diyTypeId,
        diyTypeCode: this.listQuery.diyTypeCode
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.listQuery.status = this.listQuery.status
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.listQuery.status = this.listQuery.status
      this.getList()
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
</style>