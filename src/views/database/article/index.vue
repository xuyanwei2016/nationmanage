<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchExamineBtn') >= 0" @click="batchExamine"> {{authBtns.filter(i => i.idName=='batchExamineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchExamineBtn').length>0 && authBtns.filter(i => i.idName=='batchExamineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchExamineBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchChangePriceBtn') >= 0" @click="batchPrice"> {{authBtns.filter(i => i.idName=='batchChangePriceBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchChangePriceBtn').length>0 && authBtns.filter(i => i.idName=='batchChangePriceBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchChangePriceBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchSetBtn') >= 0" @click="batchSet"> {{authBtns.filter(i => i.idName=='batchSetBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchSetBtn').length>0 && authBtns.filter(i => i.idName=='batchSetBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchSetBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDeleteBtn') >= 0" @click="batchDeleteBtn"> {{authBtns.filter(i => i.idName=='batchDeleteBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchDeleteBtn').length>0 && authBtns.filter(i => i.idName=='batchDeleteBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDeleteBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="文章标题">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.author" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属图书">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.bookName" clearable></el-input>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker v-model="timeLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <template >
      <el-tabs v-model="activeName" type="card" @tab-click="statusChange">
        <el-tab-pane label="所有文章" name="article"></el-tab-pane>
        <el-tab-pane label="待审核" name="examine"></el-tab-pane>
      </el-tabs>
    </template>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" @sort-change="handleSort" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="文章标题" min-width="160" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" min-width="180" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属图书" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.bookName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价" min-width="140" align="center" prop="realPrice" sortable="custom">
      </el-table-column>
      <el-table-column label="上传时间" min-width="140" align="center" prop="uploadTime" sortable="custom">
      </el-table-column>
      <el-table-column label="状态" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{status[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" width="180" label="操作"  align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`article/edit_article`, query:{detailsId:scope.row.id,articleType:49}}" v-if="authBtns.filter(i => i.idName=='review').length > 0"><i :class="authBtns.filter(i => i.idName=='review')[0].icon" :title="authBtns.filter(i => i.idName=='review')[0].name"></i></router-link>
          <router-link :to="{ path:`article/edit_article`, query:{id:scope.row.id,articleType:49}}" v-if="authBtns.filter(i => i.idName=='edit').length > 0"><i :class="authBtns.filter(i => i.idName=='edit')[0].icon" :title="authBtns.filter(i => i.idName=='edit')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='delete')[0].icon" :title="authBtns.filter(i => i.idName=='delete')[0].name" v-if="authBtns.filter(i => i.idName=='delete').length > 0" @click="deleteBtn(scope.row)"></i>
         <i :class="authBtns.filter(i => i.idName=='relevant')[0].icon" :title="authBtns.filter(i => i.idName=='relevant')[0].name" v-if="authBtns.filter(i => i.idName=='relevant').length > 0"></i>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogSetVisible" width="40%" title="批量修改阅读权限">
      <el-form>
        <el-form-item label="数据类型：">
          <el-select v-model="dataType" placeholder="请选择活动区域" >
            <el-option :label="typeItem"
              :value="index" v-for="(typeItem,index) in typeList"
              :key="typeItem" v-if="index != 0 && index != '49' && index != '50' && index != '1' && index != '2' ">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置全文阅读权限：" >
          <el-radio v-model="readType" :label="0">游客可见</el-radio>
          <el-radio v-model="readType" :label="1">会员可见</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRead">确认</el-button>
        <el-button @click="dialogSetVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="审核信息" :visible.sync="dialogVisible" width="30%">
      <template>
        <span>统一售价：</span>
        <el-radio v-model="priceType" :label="1" checked="checked">付费</el-radio>
        <el-radio v-model="priceType" :label="0">免费</el-radio>
        <el-form :model="dataForm" v-if="priceType == 1" :rules="rules" class="aa" ref="dataForm">
          <el-form-item label="" prop="money">
            <el-input v-model="dataForm.money"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviewConfirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getListAPI, batchExamineAPI, batchPriceAPI, batchDeleteAPI, editReadTypeAPI, deleteAPI } from '@/api/database/article'
import { resourceListAPI } from '@/api/database/article'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { mapGetters } from 'vuex'
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
        nationsType: this.$store.getters.getNation
      },
      timeLimit: null,
      batchList: [],
      activeName: 'article',
      dialogVisible:false,
      dialogSetVisible:false,
      readType: 0,
      status:[
        '待审核',
        '已上架',
        '已下架'
      ],
      priceType: 1,
      typeList: [],
      dataType: null,
      dataForm: {
        money: '',
      },
      rules: {
        money: [{required: true,  trigger: 'change', message: '请输入价格'},{ trigger: 'change', message: '请输入0.1-99999之间的数字，最多保留两位小数', pattern: /^(^[1-9](\d{1,4})?(\.[1-9]{1,2})?$)|(^\d{1,4}\.\d{1,2}$)$/ }]
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
    //文章类型 0全部,1医著 2医家 31理论 32药物 33方剂 34临床 35医案 36文化 37机构 38医论 48其他 49未分类 50蒙文
    this.listQuery.resourceType = 49
    this.getList()
    this.getResource()
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
    getResource() {
      resourceListAPI({isMedia:0}).then(res => {
        if(res.data.code === 0){
          this.typeList = res.data.data
        } else {
          this.$message.error('获取数据失败');
        }
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
    statusChange(tab,event) {//切换列表状态
      if(tab.index == 1){
        this.listQuery.status = 0; //待审核
      } else{
        this.listQuery.status = null;
      }
      this.getList();
    },
    deleteBtn(row){//单条删除 只能删除未上架的
      if(row.status != 1){
        confirm.apply(this,['确定要删除吗？']).then(() => {
          deleteAPI(row.id).then(res => {
            requestMsg.apply(this,[res.data,'删除'])
          })
        })
      } else{
        this.$message.error('已上架数据不能删除')
      }
    },
    batchPrice() {//修改价格弹窗
      if(this.batchList.length > 0){
        this.dataForm.money = ''
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
          this.dialogVisible = true
        } else{
          this.$message.error('请至少选择一条数据进行操作');
      }
    },
    reviewConfirm() {//确认修改价格
      const ids = getMultipleSelectionIDs(this.batchList);
      const data = {
        ids:ids,
        priceOption:this.priceType
      }
      if(this.priceType == 1){//付费
          data.realPrice = this.money
          this.$refs['dataForm'].validate((valid) => {
            batchPriceAPI(data).then(res =>{
              if(res.data.code === 0){
                this.$message.success('操作成功');
                this.dialogVisible = false
                this.getList();
              }
            })
          })
      } else{
        data.realPrice = 0
        batchPriceAPI(data).then(res =>{//免费
          this.dialogVisible = false
          if(res.data.code === 0){
            this.$message.success('操作成功');
            this.getList();
          } else{
            this.$message.success('修改失败');
          }
        })
      }
    },
    batchExamine(){//批量审核 ---待审核状态
      if(this.batchList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{ //待审核状态
        const status = this.batchList.every(el => el.status == 0)
        if(status) {
          confirm.apply(this,['确认审核通过已选文章吗？']).then(() => {
            const ids = getMultipleSelectionIDs(this.batchList);
            batchExamineAPI(ids).then(res => {
              if(res.data.code === 0){
                this.$message.success('操作成功');
                this.getList();
              }
            })
          })
          // const ids = getMultipleSelectionIDs(this.batchList);
          // batchExamineAPI(ids).then(res => {
          //   if(res.data.code === 0){
          //     this.$message.success('审核成功');
          //     this.getList();
          //   } else {
          //     this.$message.error('批量审核失败');
          //   }
          // })
        } else{
          this.$message.error('只有未审核状态数据才能进行审核哦');
        }
      }
    },
    batchSet(){//批量设置
      if(this.batchList.length > 0){
        this.dialogSetVisible = true
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },
    editRead() {//确认修改阅读权限
      const ids = getMultipleSelectionIDs(this.batchList);
      const data = {
        readTextPower: this.readType,
        resourceType:this.dataType,
        ids:ids
      }
      editReadTypeAPI(data).then(res => {
        this.dialogSetVisible = false
        if(res.data.code === 0){
          this.$message.success('操作成功');
          this.getList();
        } else{
          this.$message.success('修改失败');
        }
      })
    },
    batchDeleteBtn(){//批量删除--不能删除已上架的资源
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
      this.listQuery.pageNum = 1
      this.listQuery.status = this.listQuery.status
      this.getList()
    },
    resetFilter(){//重置
      this.timeLimit = []
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        nationsType: this.listQuery.nationsType,
        status: this.listQuery.status,
        resourceType: 49 //文章类型 0全部,1医著 2医家 31理论 32药物 33方剂 34临床 35医案 36文化 37机构 38医论 48其他 49未分类 50蒙文
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
</style>
