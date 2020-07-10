<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <router-link :to="{path:`purchase/create_purchase`}" v-if="authBtns.filter(i => i.idName=='addbtn').length > 0">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0">
        {{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      </router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('exportbtn') >= 0" @click="downLoadFile">
        {{authBtns.filter(i => i.idName=='exportbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportbtn').length>0 && authBtns.filter(i => i.idName=='exportbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('importbtn') >= 0" @click="handleImport">
        {{authBtns.filter(i => i.idName=='importbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='importbtn').length>0 && authBtns.filter(i => i.idName=='importbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('importbtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-form inline class="form-inline">
      <template v-if="moreFilter">
        <el-form-item label="采购单号">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.pcode" clearable placeholder="请输入采购单号"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable placeholder="请输入供应商名称" ></el-input>
        </el-form-item>
        <el-form-item label="供应商编号">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.scode" clearable placeholder="请输入供应商编号" ></el-input>
        </el-form-item>
        <el-form-item label="操作人">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.opName" clearable placeholder="请输入操作人" ></el-input>
        </el-form-item>
        <el-form-item label="采购单状态">
          <el-select @keyup.enter.native="handleFilter" v-model="listQuery.status" placeholder="请选择采购单状态">
            <el-option label="全部" :value="null"></el-option>
            <el-option :label="item" :value="val" v-for='(item,val) in listStatus' :key="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣开始值">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.startDiscount" clearable placeholder="请输入开始值" ></el-input>
        </el-form-item>
        <el-form-item label="折扣结束值">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.endDiscount" clearable placeholder="请输入结束值" ></el-input>
        </el-form-item>
        <el-form-item label="选择时间">
          <el-date-picker v-model="timeLimit" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </template>
      <template v-if="!moreFilter">
        <el-form-item label="综合搜索">
            <el-input  placeholder="可输入采购单号" v-model="listQuery.pcode" clearable class="once-search-input"></el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
        <el-button @click="moreFilter = !moreFilter">{{moreFilter ?  '简洁' : '更多' }}<i :class="moreFilter ?  'el-icon-arrow-up' : 'el-icon-arrow-down' "></i> </el-button>
      </el-form-item>
    </el-form>
    
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe height="500px">
      <el-table-column label="采购单号" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pcode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" min-width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商编号" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="码洋" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ministrial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实洋" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realOcean}}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣" min-width="40" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购日期" min-width="130" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.opName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:`purchase/details_purchase`, query:{bookId:scope.row.id,pageType:1}}" v-if="authBtns.filter(i => i.idName=='seebtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='seebtn')[0].icon" :title="authBtns.filter(i => i.idName=='seebtn')[0].name"></i>
          </router-link>

          <i :class="authBtns.filter(i => i.idName=='submission')[0].icon" v-if="(authBtns.filter(i => i.idName=='submission').length > 0)&&(scope.row.status==='0' || scope.row.status==='3')" @click="submitOrder(scope.row.id)" :title="authBtns.filter(i => i.idName=='submission')[0].name"></i>
          
          <i :class="authBtns.filter(i => i.idName=='cancelbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='cancelbtn').length > 0)&&(scope.row.status==='0' || scope.row.status==='1' || scope.row.status=='3')" @click="cancel(scope.row.id)" :title="authBtns.filter(i => i.idName=='cancelbtn')[0].name"></i>
          <router-link :to="{path:`purchase/create_purchase`, query:{id:scope.row.id}}" v-if="(authBtns.filter(i => i.idName=='editbtn').length > 0)&&(scope.row.status==='0' || scope.row.status==='3')">
            <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='examinebtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='examinebtn').length > 0)&&(scope.row.status=='1')" @click="review(scope.row.id)" :title="authBtns.filter(i => i.idName=='examinebtn')[0].name"></i>
          <router-link :to="{path:`purchase/details_purchase`, query:{bookId:scope.row.id,pageType:2}}" v-if="(authBtns.filter(i => i.idName=='warehousingbtn').length > 0)&&(scope.row.status==='2' )">
            <i :class="authBtns.filter(i => i.idName=='warehousingbtn')[0].icon" :title="authBtns.filter(i => i.idName=='warehousingbtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='settlementbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='settlementbtn').length > 0)&&(scope.row.status=='4')" @click="settle(scope.row.id)" :title="authBtns.filter(i => i.idName=='settlementbtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;">
      <span>总码洋：{{sum.ministrial}}&nbsp;&nbsp;</span>
      <span>总实洋：{{sum.realOcean}} &nbsp;&nbsp;</span>
      <span>采购数量：{{sum.num}} &nbsp;&nbsp;</span>
      <span>平均折扣：{{sum.discount}} &nbsp;&nbsp;</span>
    </div>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="审核信息" :visible.sync="dialogVisible" width="30%">
      <template>
        <el-radio v-model="reviewVal" label="2">审核通过</el-radio>
        <el-radio v-model="reviewVal" label="3">审核不通过</el-radio>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviewConfirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="40%">
      <el-form :model="fileTemp" ref="massForm" style='margin-right:10px;'>
        <el-form-item label="选择文件：" :rules="{required: true, message: '未上传', trigger: 'change'}">
          <input type="file" @change="fileSelect" ref="file" accept=".xls">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ImportSubmit" :loading="uploading">执行导入</el-button>
        <el-button @click="dialogImportVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style scoped>
  .upload-demo{
    display: inline-block;
  }
</style>


<script>
import { requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { getListAPI, statusAPI, downLoadAPI, cancelAPI, submitOrderAPI, reviewAPI, settleAPI, batchImportAPI, getCountAPI } from '@/api/stock-management/purchase'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  data() {
    return {
      authBtns: [],
      moreFilter:false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        status:null
      },
      timeLimit:'',
      listStatus:'',
      dialogVisible: false,
      reviewVal:'2',
      reviewId:'',
      dialogImportVisible: false,
      fileTemp: {},
      uploading: false,
      sum:{
        ministrial:0,
        realOcean:0,
        num:0,
        discount:0
      }
    }
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {   
    if( ifUndefined(store.getters.purchaseSerKeys.pageNum) ){
      this.listQuery = store.getters.purchaseSerKeys
      console.log(this.listQuery,'读取搜索条件成功')   
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeLimit = []
        this.timeLimit[0] = this.listQuery.startTime
        this.timeLimit[1] = this.listQuery.endTime
      }   
    }
    this.getList();
    this.getStatus();
  },
  methods: {
    getList() {
      if(this.timeLimit){
        this.listQuery.startTime = this.timeLimit[0];
        this.listQuery.endTime = this.timeLimit[1];
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else if(res.data.code === -2){
          this.$message.error(res.data.data);
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
      getCountAPI(this.listQuery).then(res=>{
        this.sum = res.data.data
      })
    },
    getStatus() {//状态查询
      statusAPI().then(res => {
        if(res.data.code === 0){
          this.listStatus = res.data.data;
        }else{
          this.message.error('获取数据失败');
        }
      })
    },
    handleImport(){//导入
      this.dialogImportVisible = true
      this.resetTemp()
    },
    resetTemp(){
      this.$refs.file ? this.$refs.file.value = null : true
    },
    fileSelect(){
      if (this.$refs.file.files[0]) {
        let file = this.$refs.file.files[0]
        if (file.type !== 'application/vnd.ms-excel') {
          this.$message.warning('元数据只能上传xls格式的excel！');
          this.$refs.file.value = null
        }
      }
    },
    ImportSubmit(){
      if (this.$refs.file.files[0]) {
        this.uploading = true
        this.$message.warning('导入中');
        let formData = new FormData()
        formData.append('file', this.$refs.file.files[0])
        this.invokeUpload(batchImportAPI, formData)
      } else {
        this.$message.warning('请选择文件后再执行导入！');
      }
    },
    invokeUpload(api, data){
      api(data).then(res => {
        this.uploading = false
        if(res.data.code === 0){
          this.$message.success(`导入成功`);
          this.dialogFormVisible = false
          this.getList() 
        } else{
          this.$message.error(`导入失败`);
        }
      })
    },
    downLoadFile() {//导出
      let {pageNum, pageSize, ...params} = this.listQuery;
      let tempParams = {}
      for (const key in params) {
        if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
          tempParams[key] = params[key]
        }
      }
      let paramStr = queryString.stringify(tempParams)
      paramStr ? window.open(`${process.env.BASE_API}${requestPath.stock}/purchase-note/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.stock}/purchase-note/export`)
      // let paramStr = queryString.stringify(params);
      // window.open(`${process.env.BASE_API}${requestPath.stock}/purchase-note/export?${paramStr}`);
    },
    cancel(id) {//取消
      confirm.apply(this,['确定要取消吗？']).then(() => {
        cancelAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'取消'])
        })
      })
    },
    submitOrder(id) {//提交
      submitOrderAPI(id).then(res => {
        requestMsg.apply(this,[res.data,'提交'])
      })
    },
    review(id) {//审核
      this.dialogVisible = true
      this.reviewId = id
    },
    reviewConfirm() {//提交审核
      this.dialogVisible = false
      const params = {
        oid:this.reviewId,
        code:this.reviewVal
      }
      reviewAPI(params).then(res => {
        requestMsg.apply(this,[res.data,'审核'])
      })
     
    },
    settle(id) {//结算
      confirm.apply(this,['确定要结算吗？']).then(() => {
        settleAPI({oid:id}).then(res => {
          requestMsg.apply(this,[res.data,'结算'])
        })
      })
    },
    handleFilter(){
      store.dispatch('SetPurchaseSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.timeLimit = ''
      this.listQuery = {
        pageNum: 1,
        pageSize: 100,
        status: null
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
