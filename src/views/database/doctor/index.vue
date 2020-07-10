<template>
  <el-container>
    <el-aside width="200px" class="tree-aside">
      <el-tree :data="navTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-aside>

    <el-main>
    <div class="nav-buttons-container">
      <router-link :to="{ path:`doctor/create_doctor`}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0"><el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button></router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('showonBtn') >= 0"  @click="editStatus(1)"> {{authBtns.filter(i => i.idName=='showonBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='showonBtn').length>0 && authBtns.filter(i => i.idName=='showonBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('showonBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('setoutBtn') >= 0"  @click="editStatus(2)"> {{authBtns.filter(i => i.idName=='setoutBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='setoutBtn').length>0 && authBtns.filter(i => i.idName=='setoutBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('setoutBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDeleteBtn') >= 0" @click="batchDelete"> {{authBtns.filter(i => i.idName=='batchDeleteBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchDeleteBtn').length>0 && authBtns.filter(i => i.idName=='batchDeleteBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDeleteBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="姓名">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="机构名称">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.institutionName" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="timeLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 状态 0已录入 1上架 2下架 -->
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="listSatus">
        <el-tab-pane label="所有作者" name="books"></el-tab-pane>
        <el-tab-pane v-for="(item) in status" :key="item" :label="item" :name="item"></el-tab-pane>
      </el-tabs>
    </template>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" @sort-change="handleSort" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="姓名" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="机构名称" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.institutionName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="180" align="center" sortable="custom" prop="uploadTime">
      </el-table-column>
      <el-table-column label="状态" min-width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">已录入</span>
          <span v-if="scope.row.status == 1">已上架</span>
          <span v-if="scope.row.status == 2">已下架</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`doctor/create_doctor`, query:{detailsId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='review').length > 0"><i :class="authBtns.filter(i => i.idName=='review')[0].icon" :title="authBtns.filter(i => i.idName=='review')[0].name"></i></router-link>
          <router-link :to="{ path:`doctor/create_doctor`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i></router-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>
    </el-main>
</el-container>
</template>

<script>
import { getNavAPI } from '@/api/database/theory'
import { getListAPI, editStatusAPI, batchDeleteAPI } from '@/api/database/doctor'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'
import { mapGetters } from 'vuex'

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
        pageSize: 100,
        nationsType: this.$store.getters.getNation
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
  computed: {
    ...mapGetters([
      'getNation'
    ])
  },
  watch: {
    getNation: function (val) {
      this.listQuery.nationsType = val
      this.getList()
    },
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList()
    this.getNav()
  },
  methods: {
    getNav(){
      getNavAPI('医家').then(res => {
        //res.data.data = [{showName:'全部'}].concat(res.data.data)
        // res.data.code === 0 ? this.navTree = [{showName:'全部'}].concat(res.data.data[0].list) : this.$message.error('获取nav数据失败')
        if (res.data.code === 0) {
          let treeList = [];
          res.data.data.map(el => {
            treeList = treeList.concat(el.list);
          });
          this.navTreeDia = treeList;
          this.navTree = [{ showName: "全部" }].concat(treeList);
        }
      })
    },
    handleNodeClick(data){ //点击树节点获取table数据
      this.listQuery.diyTypeId = data.id
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
            editStatusAPI(data).then(res => {
              if(res.data.code === 0){
                this.$message.success('操作成功');
                this.getList();
              }
            })
          } else{
            this.$message.error('您选择的状态数据不能执行此操作，请重新选择');
          }
        } else{//批量下架--已上架状态作者数据点击【下架】按钮
          const type = this.batchList.every(data => data.status == 1)
          if(type){
            editStatusAPI(data).then(res => {
              if(res.data.code === 0){
                this.$message.success('操作成功');
                this.getList();
              }
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
        nationsType: this.listQuery.nationsType,
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
</style>
