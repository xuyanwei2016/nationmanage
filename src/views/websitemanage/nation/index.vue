<template>
  <el-container>

    <el-main>
    <div class="nav-buttons-container">
      <router-link :to="{ path:`nation/add_nation`}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0">
        <el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i>
        </el-button>
      </router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('onlineBtn') >= 0" @click="batchExamine(1)">
        {{authBtns.filter(i => i.idName=='onlineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='onlineBtn').length>0 && authBtns.filter(i => i.idName=='onlineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('onlineBtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('offlineBtn') >= 0" @click="batchExamine(0)">
        {{authBtns.filter(i => i.idName=='offlineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='offlineBtn').length>0 && authBtns.filter(i => i.idName=='offlineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('offlineBtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe  @selection-change="chioceList">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="民族名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.nationalName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序号" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sequence}}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板" min-width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.template === 0">楼层模板</span>
          <span v-if="scope.row.template === 1">模板2</span>
          <span v-if="scope.row.template === 2">模板3</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">上线</span>
          <span v-if="scope.row.status === 0">下线</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`nation/add_nation`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i></router-link>
          <router-link :to="{ path:`../../database/recommend/content`, query:{type:scope.row.nationsType, recommendType: 3}}" v-if="authBtns.filter(i => i.idName=='contentBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='contentBtn')[0].icon" :title="authBtns.filter(i => i.idName=='contentBtn')[0].name"></i></router-link>
          <router-link :to="{ path:`nation/add_nation`, query:{detailsId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='queryBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='queryBtn')[0].icon" :title="authBtns.filter(i => i.idName=='queryBtn')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0" @click="deleteBtn(scope.row.id)"></i>
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
import { getListAPI, editStatusAPI, deleteAPI, deleteNationAPI } from '@/api/website-management/nation'
import queryString from 'query-string'
import { uploadPath, requestPath } from '@/utils/global.js'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import tinymce from '@/components/Tinymce'
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
        pageSize: 100,
        nationsType: ''
      },
      timeLimit: null,
      batchList: [],
      activeName: 'books',
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      ids:[],
      dialogVisible: false,
      dialogPrice:false,
      nationsType: '',
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    let str=`0123456789Aa`;
    this.subWord(str);
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        console.log(res);
        // const nationsType = res.data.data.list.nationsType;

        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },


    batchExamine(status) { // 批量上下线
      // console.log(status);

      if(this.batchList.length > 0){
        const ids = getMultipleSelectionIDs(this.batchList);
        const data = {
            ids: ids,
            status: status
          }
        if(status == 1) {//批量上线
          const type = this.batchList.every(data => data.status == 0)
          if(type){
            data.status = 1;
            confirm.apply(this,['确认上线吗？']).then(() => {
              editStatusAPI(data).then(res => {
                if(res.data.code === 0){
                  this.$message.success('操作成功');
                  this.getList();
                }
              })
            })

          } else{
            this.$message.error('您选择的状态数据不能执行此操作，请重新选择');
          }
        } else{//批量下线
          const type = this.batchList.every(data => data.status == 1)
          if(type){
            data.status = 0;
            confirm.apply(this,['确认下线吗？']).then(() => {
              editStatusAPI(data).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('操作成功');
                  this.getList();
                }
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

    deleteBtn(id){//单条删除
      const ids = [];
      ids.push(id);
      confirm.apply(this,['确认删除吗？']).then(() => {
        deleteAPI(ids).then(res => {
          if(res.data.code === 0) {
            requestMsg.apply(this,[res.data,'删除'])
            this.getList()
          }
        })
      })
    },


    chioceList(val) {
      this.batchList = val;
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
