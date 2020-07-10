<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="nav-buttons-container">
        <router-link :to="{ path:`user/add_postage`}" v-if="authBtns.filter(i => i.idName=='addbtn').length > 0"><el-button  v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button></router-link>
      </div>
    </div>

    <el-table :key='tableKey' :data="listData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column label="模板名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否包邮" align="center">
        <template slot-scope="scope">
          <span>{{freeStatus[scope.row.freeStatus]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="计价方式" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.freeStatus === 1">{{priceType[scope.row.priceType]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否默认模板" align="center">
        <template slot-scope="scope">
          <span>{{isdefault[scope.row.isdefault]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{status[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`user/add_postage`, query:{editId:scope.row.id}}"  v-if="authBtns.filter(i => i.idName=='editbtn').length > 0"><i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="deleteList(scope.row.id)"></i>
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
  import { getListAPI, deleteAPI } from '@/api/postage/index'
  import { operationMsg, confirm } from '@/utils/publicFunctions'
  import store from '@/store'

  export default {
    data() {
      return{
        authBtns: [],
        listQuery: {
          pageNum: 1,
          pageSize: 100
        },
        listData: [],
        tableKey: 0,
        listLoading: false,
        total:null,
        freeStatus: ["包邮","自定义"],
        priceType: ["按件数","按重量"],
        isdefault: ["否","是"],
        status: ["禁用 ","启用"],
      }
    },
    mounted() {
      this.getList();
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
      console.log(this.authBtns);
    },
    methods: {
      getList() {
        this.listLoading = true
        getListAPI(this.listQuery).then(res => {
          if(res.data.code === 0){
            this.listData = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error('获取数据失败');
          }
          this.listLoading = false
        })
      },
      deleteList(id) {
        confirm.apply(this,['确定要删除吗？']).then(() => {
          deleteAPI(id).then(res => {
            operationMsg.apply(this,[res.data.code,'删除'])
          })
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      resetFilter() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 100
        }
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
    }
  }
</script>
