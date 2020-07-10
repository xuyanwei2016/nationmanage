<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
       <router-link :to="{ path:`activity/create`}" v-if="authBtns.filter(i => i.idName=='addbtn').length > 0">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0"> {{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
       </router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0"  @click="batchDeleteBtn"> {{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('onlineBtn') >= 0" @click="onlineBtn(1)"> {{authBtns.filter(i => i.idName=='onlineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='onlineBtn').length>0 && authBtns.filter(i => i.idName=='onlineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('onlineBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('offlineBtn') >= 0" @click="onlineBtn(0)"> {{authBtns.filter(i => i.idName=='offlineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='offlineBtn').length>0 && authBtns.filter(i => i.idName=='offlineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('offlineBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="活动名称">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="未上线" value="0"></el-option>
          <el-option label="已上线" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker v-model="timeLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="活动名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="统一折扣" min-width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.promotionRules==1">{{scope.row.discountOrRealPrice}}</span>
          <span v-else>---</span>
        </template>
      </el-table-column>
      <el-table-column label="统一价格" min-width="140" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.promotionRules==2">{{scope.row.discountOrRealPrice}}</span>
          <span v-else>---</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime.substr(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endTime.substr(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="140" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">未上线</span>
          <span v-else>已上线</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" width="180" label="操作"  align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`activity/create`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i>
          </router-link>
          <router-link :to="{ path:`activity/content`, query:{id:scope.row.id,discount:scope.row.discountOrRealPrice,discountType:scope.row.promotionRules}}" v-if="authBtns.filter(i => i.idName=='contentBtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='contentBtn')[0].icon" :title="authBtns.filter(i => i.idName=='contentBtn')[0].name" v-if="authBtns.filter(i => i.idName=='contentBtn').length > 0"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='deletebtn')[0].icon" :title="authBtns.filter(i => i.idName=='deletebtn')[0].name" v-if="authBtns.filter(i => i.idName=='deletebtn').length > 0" @click="deleteBtn(scope.row)"></i>
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
import { getListAPI, deleteAPI, batchDeleteAPI, changeStatusAPI } from '@/api/marketing-management/activity'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import Cookies from 'js-cookie'
import store from '@/store'

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
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList()
  },
  methods: {
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
    deleteBtn(row){//单条删除 只能删除未上架的
      confirm.apply(this,['确定要删除吗？']).then(() => {
        deleteAPI(row.id).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
        })
      })
    },
    batchDeleteBtn(){//批量删除--不能删除已上架的资源
      if(this.batchList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const ids = getMultipleSelectionIDs(this.batchList);
        confirm.apply(this,['确认删除吗？']).then(() => {
          batchDeleteAPI(ids).then(res => {
            requestMsg.apply(this,[res.data,'删除'])
            this.getList()
          })
        })
      }
    },
    onlineBtn(index) {//批量上/下线
      if(this.batchList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const ids = getMultipleSelectionIDs(this.batchList);
        const data = { //status (integer): 状态：0上线，1下线
          ids:ids,
          status:index
        }
        changeStatusAPI(data).then(res =>{
          if(res.data.code === 0){
            this.$message.success('操作成功');
            this.getList();
          } else {
            this.$message.error('操作失败');
          }
        })
      }
    },
    chioceList(val) {//勾选
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
      store.dispatch('SetSupplierSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){//重置
      this.timeLimit = []
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
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
.el-tabs__header,.el-tabs--card>.el-tabs__header{
  border: 0;
  margin-bottom: 0;
}
.aa{
  margin-left: 80px;
}
.aa input{
  height: 30px;
}
</style>
