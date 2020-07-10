<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <div class="nav-buttons-container">
        <router-link :to="{ path:'common_position/create'}" v-if="authBtns.filter(i => i.idName=='btnadd').length > 0">
          <el-button v-if="authBtns.map(i => i.idName).indexOf('btnadd') >= 0">{{authBtns.filter(i => i.idName=='btnadd')[0].name}}<i v-if="authBtns.filter(i => i.idName=='btnadd').length>0 && authBtns.filter(i => i.idName=='btnadd')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('btnadd')].icon, 'el-icon--right']"></i></el-button>
        </router-link>

      </div>
    </div>
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="listSatus">
        <el-tab-pane label="所有图书" name="all"></el-tab-pane>
        <el-tab-pane v-for="(item) in status" :key="item" :label="item" :name="item"></el-tab-pane>
      </el-tabs>
    </template>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe ref="multipleTable">
      <el-table-column type="index" align="center"  label="序号" width="60"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center"  label="推荐位名称" >
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推荐位代码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.descriptions}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{ path: 'common_position/create', query: {id:scope.row.id} }" v-if="authBtns.filter(i => i.idName=='editBtn').length>0">
            <i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i>
          </router-link>

          <router-link :to="{ path: '../../database/recommend/content', query: {id:scope.row.id,code:scope.row.code} }" v-if="authBtns.filter(i => i.idName=='contentBtn').length>0">
            <i :class="authBtns.filter(i => i.idName=='contentBtn')[0].icon" v-if="authBtns.filter(i => i.idName=='contentBtn').length > 0" :title="authBtns.filter(i => i.idName=='contentBtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='deletebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='deletebtn').length > 0" :title="authBtns.filter(i => i.idName=='deletebtn')[0].name" @click="deleteBtn(scope.row.id)"></i>
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
import { getListAPI, deleteAPI } from '@/api/website-management/position'
import {operationMsg, errorMsg, requestMsg, confirm } from '@/utils/publicFunctions'
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
        recommendType: 1
      },
      activeName: 'all',
      status:[//1：web平台，2：特色疗法， 3：医道传承， 4：温故知疫；可多选，多个逗号隔开拼接
        'web平台',
        '特色疗法',
        '医道传承',
        '温故知“疫”'
      ],
    }
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(response=>{
        console.log(response);

        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      })
    },
    listSatus(tab,event) { //0待审核，1已上架，2已下架Tab切换
      console.log(2222, tab)
      if (tab.index == 0) {
        this.listQuery.platform = null
      } else{
        this.listQuery.platform = Number(tab.index);
      }
      this.getList();
    },
    deleteBtn(id) {//删除
      confirm.apply(this,['确定要删除吗？']).then(() => {
        deleteAPI({id:id}).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
        })
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        recommendType: 1
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
