<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline class="form-inline">
        <el-form-item label="资源名称：" label-width="100px">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="选择时间：" label-width="100px">
          <el-date-picker
            v-model="timeLimit" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container">
      <div class="nav-buttons-container">
        <router-link :to="{ path:`video/add_video` }"><el-button icon="el-icon-download" @click="addData">添加</el-button></router-link>
        <el-button icon="el-icon-download" @click="sold">上架</el-button>
        <el-button icon="el-icon-download" @click="soldout">下架</el-button>
        <el-button icon="el-icon-download" @click="downLoadFile">导出二维码</el-button>
        <el-button icon="el-icon-upload2" @click="batchDelete">批量删除</el-button>
      </div>
    </div>

    <template>
      <el-tabs v-model="status" type="card" @tab-click="handleClick" tab-position="bottom">
        <el-tab-pane label="所有视频" name="total">所有视频</el-tab-pane>
        <el-tab-pane label="已录入" name="record">已录入</el-tab-pane>
        <el-tab-pane label="已上架" name="sold">已上架</el-tab-pane>
        <el-tab-pane label="已下架" name="soldout">已下架</el-tab-pane>
      </el-tabs>
    </template>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList">
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="资源名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.timeLength}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.size}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
         <span v-if='scope.row.status === 0'>已录入</span>
         <span v-if='scope.row.status === 1'>已上架</span>
         <span v-if='scope.row.status === 2'>已下架</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`video/add_video`, query:{id:scope.row.id,isEdit:false} }"><i class="el-icon-zoom-in" title="查看"></i></router-link>
          <router-link :to="{ path:`video/add_video`, query:{id:scope.row.id} }"><i class="el-icon-edit" title="编辑"></i></router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

  </div>
</template>

<style scoped>
  .upload-demo{
    display: inline-block;
  }
  .ib{
    display:inline-block;
  }
  .el-tab-pane{
    display: none;
  }
  .el-tabs__header{
    margin-bottom: 0;
  }
</style>

<script>
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { getListAPI, upDownAPI, batchDeleteAPI } from '@/api/resource/video'
import { requestMsg, confirm } from '@/utils/publicFunctions'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 100
      },
      timeLimit:'',
      dialogVisible: false,
      dialogImportVisible: false,
      uploading: false,
      multipleSelection: [],
      multipleSelectionIDs: [],
      resourceForm: {},
      status: 'total',
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      if(this.timeLimit){
        this.listQuery.beginTime = this.timeLimit[0];
        this.listQuery.endTime = this.timeLimit[1];
      } else {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else if(res.data.code === -2){
          this.$message.error(res.data.data);
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    handleClick(tab, event) {
      if(this.status == "total"){
        this.listQuery.status = ''
      } else if(this.status == "record"){
        this.listQuery.status = 0
      } else if(this.status == "sold"){
        this.listQuery.status = 1
      } else if(this.status == "soldout"){
        this.listQuery.status = 2
      }
      this.getList()
    },
    addData() {//添加数据
      this.dialogVisible = true
    },
    batchDelete() {//批量删除
      if(this.isSelected()){
        const deleteData = this.multipleSelection.every(data => data.status != 1) //判断是否有已上架的数据
        if(deleteData == true){
          confirm.apply(this,['确定要批量删除吗？']).then(() => {
            batchDeleteAPI(this.multipleSelectionIDs).then(res => {
              requestMsg.apply(this,[res.data,'批量删除'])
            })
          })
        } else{
          this.$message.error('请先下架，再删除数据');
        }
      }
    },
    sold() {//上架
      if(this.isSelected()){
        confirm.apply(this,['确定要上架吗？']).then(() => {
          upDownAPI({ids:this.multipleSelectionIDs,status:1}).then(res => {
            requestMsg.apply(this,[res.data,'上架'])
          })
        })
      }
    },
    soldout() {//下架
      if(this.isSelected()){
        confirm.apply(this,['确定要下架吗？']).then(() => {
          upDownAPI({ids:this.multipleSelectionIDs,status:2}).then(res => {
            requestMsg.apply(this,[res.data,'下架'])
          })
        })
      }
    },
    downLoadFile() {//导出
      // if(!this.timeLimit){
      //   let {pageNum, pageSize,startTime,endTime, ...params} = this.listQuery;
      //   let paramStr = queryString.stringify(params);
      //   window.open(`${process.env.BASE_API}${requestPath.resource}/purchase-note/export?${paramStr}`);
      // } else{
      //   let {pageNum, pageSize, ...params} = this.listQuery;
      //   let paramStr = queryString.stringify(params);
      //   window.open(`${process.env.BASE_API}${requestPath.resource}/purchase-note/export?${paramStr}`);
      // }
    },
    chioceList(val) {
      this.multipleSelection = val;
      this.multipleSelectionIDs = getMultipleSelectionIDs(val)
    },
    isSelected(){
      if (this.multipleSelectionIDs.length <= 0){
        this.$message('已选不能为空')
        return false
      }
      return true
    },
    handleFilter(){
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.timeLimit = ''
      this.listQuery = {
        pageNum: 1,
        pageSize: 100
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
</script>
