<template>
  <!--特色疗法-->
  <el-container>
    <el-aside width="200px" class="tree-aside">
      <el-tree :data="navTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-aside>

    <el-main>
    <div class="nav-buttons-container">

      <router-link :to="{ path:`create`,query:{articleType:39,articleName:'特色疗法'}}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0"><el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button></router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchExamineBtn') >= 0" @click="batchExamine"> {{authBtns.filter(i => i.idName=='batchExamineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchExamineBtn').length>0 && authBtns.filter(i => i.idName=='batchExamineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchExamineBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('editPriceBtn') >= 0" @click="editPriceDialog"> {{authBtns.filter(i => i.idName=='editPriceBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='editPriceBtn').length>0 && authBtns.filter(i => i.idName=='editPriceBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('editPriceBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('editTypeBtn') >= 0" @click="editType"> {{authBtns.filter(i => i.idName=='editTypeBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='editTypeBtn').length>0 && authBtns.filter(i => i.idName=='editTypeBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('editTypeBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('setBtn') >= 0" @click="editReadDialog"> {{authBtns.filter(i => i.idName=='setBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='setBtn').length>0 && authBtns.filter(i => i.idName=='setBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('setBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('showonBtn') >= 0" @click="editStatus(1)"> {{authBtns.filter(i => i.idName=='showonBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='showonBtn').length>0 && authBtns.filter(i => i.idName=='showonBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('showonBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('setoutBtn') >= 0" @click="editStatus(2)"> {{authBtns.filter(i => i.idName=='setoutBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='setoutBtn').length>0 && authBtns.filter(i => i.idName=='setoutBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('setoutBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDeleteBtn') >= 0" @click="batchDelete"> {{authBtns.filter(i => i.idName=='batchDeleteBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchDeleteBtn').length>0 && authBtns.filter(i => i.idName=='batchDeleteBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDeleteBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="标题">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.author" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属图书">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.source" clearable></el-input>
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
        <el-tab-pane label="所有文章" name="books"></el-tab-pane>
        <el-tab-pane v-for="(item) in status" :key="item" :label="item" :name="item"></el-tab-pane>
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
      <el-table-column label="来源" min-width="180" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.bookName != null">{{scope.row.bookName}}</span>
          <span v-else>{{scope.row.source}}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价" min-width="120" align="center" prop="realPrice" sortable="custom">
      </el-table-column>
      <el-table-column label="上传时间" min-width="180" align="center" prop="uploadTime" sortable="custom">
      </el-table-column>
      <el-table-column label="状态" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{status[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`create`, query:{id:scope.row.id,articleType:39,articleName:'特色疗法'}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i></router-link>
          <router-link :to="{ path:`create`, query:{detailsId:scope.row.id,articleName:'特色疗法'}}" v-if="authBtns.filter(i => i.idName=='detailsBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='detailsBtn')[0].icon" :title="authBtns.filter(i => i.idName=='detailsBtn')[0].name"></i></router-link>
          <!--<router-link :to="{ path:`doctor/create_doctor`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='relevant').length > 0"><i :class="authBtns.filter(i => i.idName=='relevant')[0].icon" :title="authBtns.filter(i => i.idName=='relevant')[0].name"></i></router-link>-->
          <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0 && scope.row.status != 1" @click="deleteBtn(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>


    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    </el-main>

    <el-dialog :visible.sync="dialogVisible" width="450px" title="批量修改阅读权限">
      <el-form>
        <el-form-item label="设置全文阅读权限：" >
          <el-radio v-model="readType" :label="0">游客可见</el-radio>
          <el-radio v-model="readType" :label="1">会员可见</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRead">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量修改价格" :visible.sync="dialogPrice" width="400px">
      <template >
        <span>统一售价：</span>
        <el-radio v-model="priceType" :label="1">付费</el-radio>
        <el-radio v-model="priceType" :label="0">免费</el-radio>
        <el-form ref="dataForm" :model="dataForm"  v-if="priceType == 1" :rules="rules" class="aa">
          <el-form-item label="" prop="money">
            <el-input v-model="dataForm.money"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPrice">确 定</el-button>
        <el-button @click="dialogPrice = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改分类"
      width="456px"
      :visible.sync="typeDialog"
      class="updatePriceDialog backgroundDialog"
      style="height:auto !important;"
    >
      <treeselect
        v-model="treeSelectValue"
        placeholder="请选择"
        :multiple="false"
        :options="treeSelectOptions"
        data-vv-scope="baseInfo"
        :normalizer="normalizer"
        :disable-branch-nodes="true"
        v-validate="'required'"
        @select="selectFun"
        @deselect="deselectFun"
      />
      <div slot="footer" class="dialog-footer specialFooter">
        <el-button @click="confirmType">确 定</el-button>
        <el-button @click="typeDialog = false">取 消</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import { getListAPI, getNavAPI, batchExamineAPI, batchDeleteAPI, deleteAPI, editReadTypeAPI, editPriceTypeAPI, editStatusAPI } from '@/api/database/theory'
import queryString from 'query-string'
import { uploadPath, requestPath } from '@/utils/global.js'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import tinymce from '@/components/Tinymce'
import { mapGetters } from 'vuex'
import store from '@/store'
import {getTreeAPI ,updateTypeAPI} from '@/api/database/article';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  data() {
    return {
      typeDialog:false,
      treeSelectOptions: [],
      treeSelectValue: null,
      typeform: {
        ids: [],
        diyTypeCode: [],
        diyTypeId: [],
        objectType:39
      },
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
        '待审核',
        '已上架',
        '已下架',
      ],
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      ids:[],
      dialogVisible: false,
      dialogPrice:false,
      readType:0,//阅读权限-游客
      priceType:1,
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
  components: {Treeselect},
  watch: {
    getNation: function (val) {
      this.listQuery.nationsType = val
      this.getList()
    },
    dialogVisible(n,o){
      if(!n){
        this.readType=0;
      }
    },
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
  },
  mounted() {
    //文章类型 0全部,1医著 2医家 31理论 32药物 33方剂 34临床 35医案 36文化 37机构 38医论 39其他 49未分类 50蒙文
    this.listQuery.resourceType = 39;
    this.getList()
    this.getNav()
  },
  methods: {
    getNav(){
      getNavAPI('特色疗法').then(res => {
        //res.data.data = [{showName:'全部'}].concat(res.data.data)
        // res.data.code === 0 ? this.navTree = res.data.data[0].list : this.$message.error('获取nav数据失败')、
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
    listSatus(tab,event) { //0待审核，1已上架，2已下架Tab切换
      if (tab.index == 0) {
        this.listQuery.status = null
      } else{
        this.listQuery.status = tab.index-1
      }
      this.getList();
    },
    batchExamine(){//批量审核
      if(this.batchList.length > 0){
        const status = this.batchList.every(el => el.status == 0)
        if (status) {
          confirm.apply(this,['确认审核通过已选文章吗？']).then(() => {
            const ids = getMultipleSelectionIDs(this.batchList);
            batchExamineAPI(ids).then(res => {
              if(res.data.code === 0){
                this.$message.success('操作成功');
                this.getList();
              }
            })
          })
        } else{
          this.$message.error('只有未审核状态数据才能进行审核哦');
        }
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },
    editReadDialog() {//修改阅读权限
      if(this.batchList.length > 0){
        this.dialogVisible = true
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },
    editRead() {//确认修改阅读权限
        const ids = getMultipleSelectionIDs(this.batchList);
        const data = {
          readTextPower: this.readType,
          ids:ids
        }
        editReadTypeAPI(data).then(res => {
          this.dialogVisible = false
          if(res.data.code === 0){
            this.$message.success('操作成功');
            this.getList();
          } else{
            this.$message.success('修改失败');
          }
        })
    },
    editPriceDialog() {//修改价格弹窗
      if(this.batchList.length > 0){
        this.dataForm.money = '';
        this.dialogPrice = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })

        } else{
          this.$message.error('请至少选择一条数据进行操作');
      }
    },
    editPrice() {//确认修改价格
      const ids = getMultipleSelectionIDs(this.batchList);
      const data = {
        ids:ids,
        priceOption:this.priceType,
      }
      if(this.priceType == 1){//付费
          data.realPrice = this.dataForm.money
          this.$refs['dataForm'].validate((valid) => {
            editPriceTypeAPI(data).then(res =>{
              if(res.data.code === 0){
                this.$message.success('操作成功');
                this.dialogPrice = false
                this.getList();
              }
            })
          })
      } else{
        data.realPrice = 0
        editPriceTypeAPI(data).then(res =>{//免费
          if(res.data.code === 0){
            this.$message.success('操作成功');
            this.dialogPrice = false
            this.getList();
          } else{
            this.$message.error('操作失败');
          }
        })
      }
    },
    editStatus(status) {//批量上下架--已下架才能批量上架-已上架才能批量下架
      if(this.batchList.length > 0){
        const ids = getMultipleSelectionIDs(this.batchList);
        const data = {
            ids: ids,
            status: status
          }
        if(status == 1) {//批量上架
          const type = this.batchList.every(data => data.status == 2)
          if(type){
            confirm.apply(this,['确认上架吗？']).then(() => {
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
        } else{//批量下架
          const type = this.batchList.every(data => data.status == 1)
          if(type){
            confirm.apply(this,['确认下架吗？']).then(() => {
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
        }
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },
    editType(){//修改自定义类型
      if (this.batchList.length > 0) {
        this.typeDialog = true;
        this.getTree();
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //确认修改分类
    confirmType() {
      if(!this.treeSelectValue){
        this.$message.warning('请选择分类')
      }else{
        this.typeform.ids = this.batchList.map(item => item.id);
        updateTypeAPI(this.typeform).then(res => {
          if(res.data.code==0){
            this.$message.success('修改成功')
            this.typeDialog = false;
            this.treeSelectValue = null;
          }else{
            operationMsg.apply(this, [res.data, `批量修改`]);
          }
        })
      }
    },
    selectFun(node) {
      this.typeform.diyTypeId=[];
      this.typeform.diyTypeCode=[];
      this.typeform.diyTypeId.push(node.id);
      this.typeform.diyTypeCode.push(node.code);
    },
    deselectFun(node) {
      for (var i = 0; i < this.typeform.diyTypeId.length; i++) {
        if (this.typeform.diyTypeId[i] == node.id) {
          this.typeform.diyTypeId.splice(i, 1);
          this.typeform.diyTypeCode.splice(i, 1);
        }
      }
    },
    getTree() {
      getTreeAPI('特色疗法').then(res => {
        this.treeSelectOptions = res.data.data[0].list;
        //this.treeSelectOptions = res.data.data;
      });
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list.length>0?node.list:undefined
      };
    },
    deleteBtn(id){//单条删除
      const ids = [];
      ids.push(id);
      confirm.apply(this,['确认删除吗？']).then(() => {
        deleteAPI(ids).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
          this.getList()
        })
      })
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
              requestMsg.apply(this,[res.data,'批量删除'])
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
        resourceType: 39,//文章类型 0全部,1医著 2医家 31理论 32药物 33方剂 34临床 35医案 36文化 37机构 38医论 39其他 49未分类 50蒙文
        nationsType: this.listQuery.nationsType,
        status: this.listQuery.status,
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
.aa{
  margin-left: 74px;
  display: block;
  margin-top: 20px;
}
.aa input{
  height: 30px;
}
</style>
