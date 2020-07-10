<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <div class="nav-buttons-container">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchaudit') >= 0" @click="handleCheck">{{authBtns.filter(i => i.idName=='batchaudit')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchaudit').length>0 && authBtns.filter(i => i.idName=='batchaudit')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchaudit')].icon, 'el-icon--right']"></i></el-button>
      </div>
      <el-form inline class="form-inline">
        <el-form-item label="用户名">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.userName" clearable></el-input>
        </el-form-item>
        <el-form-item label="留言标题">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select clearable v-model="listQuery.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="已通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @current-change="handleCurChange" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center"  label="序号" width="60"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="标题" >
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="140" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="140" label="真实姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="投稿时间">
        <template slot-scope="scope">
          <span>{{scope.row.uploadTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status ===0" style="color:#CC6600;">未审核</span>
          <span v-if="scope.row.status ===2" style="color:#CC6600;">未通过</span>
          <span v-else-if="scope.row.status ===1" style="color:#008000;">已通过</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{ path: 'contribute/edit', query: {id:scope.row.id} }" v-if="authBtns.filter(i => i.idName=='editBtn').length>0">
            <i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i>
          </router-link>
          <router-link :to="{ path: 'contribute/edit', query: {detailsId:scope.row.id} }" v-if="authBtns.filter(i => i.idName=='editBtn').length>0">
            <i :class="authBtns.filter(i => i.idName=='queryBtn')[0].icon" v-if="authBtns.filter(i => i.idName=='queryBtn').length > 0" :title="authBtns.filter(i => i.idName=='queryBtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='download')[0].icon" v-if="authBtns.filter(i => i.idName=='download').length > 0" :title="authBtns.filter(i => i.idName=='download')[0].name" @click="downLoad(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="批量审核" :visible.sync="dialogVisible" width="20%">
      <el-form>
        <el-form-item label="批量审核稿件：" class="el-form_label">
          <el-radio-group v-model="status">
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingSubmit">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getListAPI, batchExamineAPI } from '@/api/website-management/contribute'
import {operationMsg, errorMsg} from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { requestPath } from '@/utils/global.js'
import store from '@/store'

export default {
  name: 'complexTable',
  data() {
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        title: null,
        userName: null,
        status: ''
      },
      batchList:[],
      status:1,
      dialogVisible:false

    }
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(response=>{
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      })
    },
    handleCheck() {//批量审核
      if(this.batchList.length > 0){
        this.dialogVisible = true;
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },
    settingSubmit() {//确认审核----0未审核，1已通过，2未通过
      //const status = this.batchList.every(el => el.status == 0)
      const ids = getMultipleSelectionIDs(this.batchList);
      const data = {
        ids:ids,
        status:this.status
      }
      batchExamineAPI(data).then(res => {
        this.dialogVisible = false;
        if(res.data.code === 0){
          this.$message.success('操作成功');
          this.getList();
        }
      })
    },
    downLoad(row) {//下载
      if(row.accessories){
        window.open(`${process.env.BASE_API}${requestPath.file}download/${row.accessories}`)
      } else{
        this.$message.error('当前投稿暂无附件');
      }
    },
    handleSelectionChange(val) {
      this.batchList = val;
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        title: null,
        id: null
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
<style>
 .app-container .el-form__label {
   text-align: left;
   display: block;
   float: inherit;
 }
 .app-container .el-dialog__body {
   padding: 20px 96px;
 }

 .app-container .el-dialog__footer {
   padding-top: 0;
 }
</style>
