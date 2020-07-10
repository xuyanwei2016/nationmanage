<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button  v-if="authBtns.map(i => i.idName).indexOf('exportbtn') >= 0" @click="exportMemberInfo">{{authBtns.filter(i => i.idName=='exportbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportbtn').length>0 && authBtns.filter(i => i.idName=='exportbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline" style="border-top: none">
      <el-form-item label="操作人">
        <el-input @keyup.enter.native="handleFilter" style="width: 180px;" clearable v-model="listQuery.loginAccount">
        </el-input>
      </el-form-item>
      <el-form-item label="登录时间">
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      <!-- <el-form-item label="登录时间">
        <el-col :span="11">
          <el-date-picker type="date" v-model="listQuery.createTime" value-format="yyyy-MM-dd" placeholder="年/月/日" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center;">至</el-col>
        <el-col :span="11">
          <el-date-picker type="date" v-model="listQuery.createTime" value-format="yyyy-MM-dd" placeholder="年/月/日" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button style="margin-left: 10px;" @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @current-change="handleCurChange" ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column min-width="100px" align="center" label="操作人">
        <template slot-scope="scope">
          <span>{{scope.row.loginAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="IP">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录方式" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.channel == 0">PC端</span>
          <span v-else-if="scope.row.channel == 1">WAP端</span>
          <span v-else-if="scope.row.channel == 2">Android端</span>
          <span v-else-if="scope.row.channel == 3">iOS端</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getListAPI, deleteData, changeType } from "@/api/website-management/errorCorrection";
import {operationMsg} from '@/utils/publicFunctions'
import {getMultipleSelectionIDs} from '@/filters/getIds'
import store from '@/store'


export default {
  name: "complexTable",
  data() {
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      time: null,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        status: null,
        title: null,
        type: null
      },
      massQuery: {
        ids: [],
        status: null
      },
      temp: {
        commitTime: '',
        type: null,
        status: null,
        name: '',
        title: '',
        content: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      multipleSelection:[]
    };
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList()
  },
  methods: {
    exportMemberInfo() {},
    handleCurChange(val){
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val)
      },
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        console.log(res)
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection): true
    },
    massReview(){
      if (this.multipleSelection.length!=0) {
        const unreviewed = this.multipleSelection.every(arg => arg.status === 0 )
        if (unreviewed) {
          this.$confirm('确定标记为已审核状态?', '批量审核', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.massQuery.status = 1
            changeType(this.massQuery).then(res => {
              operationMsg.apply(this,[res.data.code,'审核'])
            })
          });
        } else {
          this.$message.warning('只能操作未审核数据！')
        }
      } else {
        this.$message.warning('请先选择需要审核的内容')
      }
    },
    corrected(){
      if (this.multipleSelection.length!=0) {
        const unreviewed = this.multipleSelection.every(arg => arg.status === 1 )
        if (unreviewed) {
          this.$confirm('确定标记为已纠错状态?', '完成纠错', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.massQuery.status = 2
            changeType(this.massQuery).then(res => {
              operationMsg.apply(this,[res.data.code,'纠错'])
            })
          });
        } else {
          this.$message.warning('只能操作已审核数据！')
        }
      } else {
        this.$message.warning('请先选择完成纠错的内容')
      }
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        status: null,
        title: null,
        type: null
      }
      this.time = null;
      this.getList()
    },
    handleFilter() {
      if (this.time) {
          this.listQuery.beginTime = this.time[0]
          this.listQuery.endTime = this.time[1]
        } else {
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
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
    },
    singleDelete(id) {
      this.$confirm('确定要删除这条纠错吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(id).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      });
    },
    checkDetail(row){
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.dialogFormVisible = true
    }
  }
};
</script>
<style>

</style>
