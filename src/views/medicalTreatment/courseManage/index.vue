<template>
  <el-container>
    <el-main>
    <div class="nav-buttons-container">
      <router-link :to="{ path:`addCourse`}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0">
        <el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button>
      </router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchExamineBtn') >= 0" @click="batchExamine"> {{authBtns.filter(i => i.idName=='batchExamineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchExamineBtn').length>0 && authBtns.filter(i => i.idName=='batchExamineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchExamineBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('showonBtn') >= 0" @click="editStatus('4')"> {{authBtns.filter(i => i.idName=='showonBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='showonBtn').length>0 && authBtns.filter(i => i.idName=='showonBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('showonBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('setoutBtn') >= 0" @click="editStatus('5')"> {{authBtns.filter(i => i.idName=='setoutBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='setoutBtn').length>0 && authBtns.filter(i => i.idName=='setoutBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('setoutBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDeleteBtn') >= 0" @click="batchDelete"> {{authBtns.filter(i => i.idName=='batchDeleteBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchDeleteBtn').length>0 && authBtns.filter(i => i.idName=='batchDeleteBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDeleteBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="课程名称">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="timeLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>
    
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="listSatus">
        <!-- <el-tab-pane label="所有课程" name="books"></el-tab-pane> -->
        <el-tab-pane v-for="(item) in statusLabel" :key="item.index" :label="item.name" :name="item.name"></el-tab-pane>
      </el-tabs>
    </template>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" @sort-change="handleSort" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号"  width="60px;"></el-table-column>
      <el-table-column label="缩略图" min-width="160" align="center" >
        <template slot-scope="scope">
            <img class="showImg" :src="imgUrl(scope.row.cover)" alt="" v-if="scope.row.cover">           
        </template>
      </el-table-column>
      <el-table-column label="课程名称" min-width="180" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" min-width="180" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.author">{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新课时数" min-width="120" align="center" prop="consumeHour">
      </el-table-column>
      <el-table-column label="上传时间" min-width="180" align="center" prop="createTime" sortable="createTime">
      </el-table-column>
      <el-table-column label="状态" min-width="120" align="center">
        <template slot-scope="scope">
          <span v-if="statusObj[scope.row.status]">{{statusObj[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`addCourse`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i></router-link>
          <router-link :to="{ path:`addCourse`, query:{detailsId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='detailsBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='detailsBtn')[0].icon" :title="authBtns.filter(i => i.idName=='detailsBtn')[0].name"></i></router-link>
          <router-link :to="{ path:`linkCourse`, query:{id:scope.row.id,memberId:scope.row.memberId}}" v-if="authBtns.filter(i => i.idName=='relevant').length > 0"><i :class="authBtns.filter(i => i.idName=='relevant')[0].icon" :title="authBtns.filter(i => i.idName=='relevant')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0 && scope.row.status != 4" @click="deleteBtn(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    </el-main>
    <el-dialog title="批量审核" :visible.sync="examDialog" width="30%" style="padding-left:15px">
      <el-form :model="videoStatus"  label-position="right" label-width="140px" style='margin-right:20px'>
        <el-form-item label="批量认证审核信息：">
          <el-radio-group v-model="videoStatus.status">
            <el-radio label="2">审核通过</el-radio>
            <el-radio label="3">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button class="form-submit" type="primary" @click="massSettingSubmit">确定</el-button>
        <el-button class="form-submit" @click="examDialog = false">取消</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import { getListAPI, batchExamineAPI, batchDeleteAPI } from '@/api/medicalTreatment/courseManage'
import queryString from 'query-string'
import { uploadPath, requestPath } from '@/utils/global.js'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import tinymce from '@/components/Tinymce'
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
        name:'',
        status:''
      },
      timeLimit: null,
      batchList: [],
      examDialog:false,
      videoStatus:{
        status:'2',
        ids:[]
      },
      activeName: '所有课程',
      statusObj:{
          '1':'待审核',
          '2':'审核通过',
          '3':'审核不通过',
          '4':'已上架',
          '5':'已下架'
      },
      statusLabel:[
        {
          name:"所有课程",
          index:''
        },
        {
          name:"待审核",
          index:'1'
        },
        {
          name:"审核通过",
          index:'2'
        },
        {
          name:"审核不通过",
          index:'3'
        },
        {
          name:"已上架",
          index:'4'
        },
        {
          name:"已下架",
          index:'5'
        },
      ],// 状态：1：待审核 2：审核通过 3：审核不通过 4：已上架 5：已下架
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      ids:[],
      dialogVisible: false,
      dialogPrice:false,
    }
  },
  computed: {
  },
  watch: {
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
    handleSort({column, prop, order}) {
      if (order) {
        this.listQuery.orderBy = `${prop} ${order.substring(0,order.length-6)}`
      } else {
        this.listQuery.orderBy = null
      }
      this.getList()
    },
    listSatus(tab,event) { // 状态：1：待审核 2：审核通过 3：审核不通过 4：已上架 5：已下架
      if (tab.index == 0) {
        this.listQuery.status = ''
      } else{
        this.listQuery.status = tab.index
      }
      this.getList();
    },
    batchExamine(){//打开批量审核
      if(this.batchList.length > 0){
        const status = this.batchList.every(el => el.status == 1)
        if (status) {
          this.examDialog = true
          // confirm.apply(this,['确认审核通过已选视频吗？']).then(() => {
          //   const ids = getMultipleSelectionIDs(this.batchList);
          //   batchExamineAPI(ids).then(res => {
          //     if(res.data.code === 0){
          //       this.$message.success('操作成功');
          //       this.getList();
          //     }
          //   })
          // })
        } else{
          this.$message.error('只有未审核状态数据才能进行审核哦');
        }  
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },

    // 批量设置状态
      massSettingSubmit() {
        this.videoStatus.ids = getMultipleSelectionIDs(this.batchList)
        if (this.videoStatus.status !== null) {
          batchExamineAPI(this.videoStatus).then(response => {
            if (response.data.code === 0) {
              this.getList()
              this.examDialog = false
              this.$message.success(`批量设置${this.batchList.length}项成功`)
            } else {
              this.$message.error("批量设置失败")
            }
          })
          this.examDialog = false
        } else {
          this.$message.error("请选择批量设置状态后提交！")
        }
      },

    editStatus(status) {//批量上下架--已下架才能批量上架-已上架才能批量下架
      if(this.batchList.length > 0){   
        const ids = getMultipleSelectionIDs(this.batchList);
        const data = {
            ids: ids,
            status: status
          }
        if(status == 4) {//批量上架
          const type = this.batchList.every(data => data.status == 2||data.status == 5)
          if(type){
            batchExamineAPI(data).then(res => {
              if(res.data.code === 0){
                this.$message.success('操作成功');
                this.getList();
              }
            })
          } else{
            this.$message.error('您选择的状态数据不能执行此操作，请重新选择');
          }
        } else{//批量下架
          const type = this.batchList.every(data => data.status == 4)
          if(type){
            batchExamineAPI(data).then(res => {
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

    deleteBtn(id){//单条删除
      const ids = [];
      ids.push(id);
      confirm.apply(this,['确定要删除此条课程吗？']).then(() => {
        batchDeleteAPI(ids).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
          this.getList()
        })
      })
    },
    batchDelete(){//批量删除--不能删除已上架的资源
      if(this.batchList.length == 0){ 
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const dataType = this.batchList.every(data => data.status != 4)
        if(dataType){
          const ids = getMultipleSelectionIDs(this.batchList);
          confirm.apply(this,['确定要删除已选课程吗？']).then(() => {
            batchDeleteAPI(ids).then(res => {
              requestMsg.apply(this,[res.data,'删除'])
              this.getList()
            })
          })
        } else{
          this.$message.error('请先下架，再删除数据')
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
        status: this.listQuery.status
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
.aa{
  margin-left: 80px;
}
.aa input{
  height: 30px;
}
.showImg{
  max-width: 200px;
  max-height: 100px;
}
</style>