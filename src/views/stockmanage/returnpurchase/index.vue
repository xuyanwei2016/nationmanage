<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <router-link to="returnpurchase/create_returnpurchase" v-if="authBtns.filter(i => i.idName=='addbtn').length > 0">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" >{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
      </router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('downloadbtn') >= 0" @click="downLoadFile">{{authBtns.filter(i => i.idName=='downloadbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='downloadbtn').length>0 && authBtns.filter(i => i.idName=='downloadbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('downloadbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('uploadbtn') >= 0" @click="uploadFile">{{authBtns.filter(i => i.idName=='uploadbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='uploadbtn').length>0 && authBtns.filter(i => i.idName=='uploadbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('uploadbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="退货单号"> 
        <el-input v-model="listQuery.rcode" placeholder="请输入退货单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="供应商名称"> 
        <el-input v-model="listQuery.name" placeholder="请输入供应商名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="供应商编号"> 
        <el-input v-model="listQuery.scode" placeholder="请输入供应商编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.status" placeholder="请选择状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in statusList' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker v-model="timeLimit" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="listData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column label="采购单退货号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.rcode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商编号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realOcean}}</span>
        </template>
      </el-table-column>
      <el-table-column label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ministrial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.opName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`returnpurchase/details_returnpurchase`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='viewbtn').length > 0"><i :class="authBtns.filter(i => i.idName=='viewbtn')[0].icon" :title="authBtns.filter(i => i.idName=='viewbtn')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='cancel')[0].icon" :title="authBtns.filter(i => i.idName=='cancel')[0].name" class="el-icon-close" v-if="authBtns.filter(i => i.idName=='cancel').length > 0 && (scope.row.status==='0' || scope.row.status==='1' || scope.row.status==='3')" @click="cancel(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='success')[0].icon" v-if="scope.row.status=='1' && authBtns.filter(i => i.idName=='success').length > 0" :title="authBtns.filter(i => i.idName=='success')[0].name" @click="review(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='tickets')[0].icon" v-if="scope.row.status==='2' && authBtns.filter(i => i.idName=='tickets').length > 0" :title="authBtns.filter(i => i.idName=='tickets')[0].name"  @click="settle(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='check')[0].icon" :title="authBtns.filter(i => i.idName=='check')[0].name" v-if="authBtns.filter(i => i.idName=='check').length > 0 && (scope.row.status==='0' || scope.row.status==='3')" @click="submitOrder(scope.row.id)"></i>
          <router-link :to="{ path:`returnpurchase/create_returnpurchase`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0 && (scope.row.status==='0' || scope.row.status==='3')"><i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i></router-link>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;">
      <span>总码洋：{{sum.ministrial}}</span>&nbsp;&nbsp;
      <span>总实洋：{{sum.realOcean}} </span>&nbsp;&nbsp;
      <span>退货数量：{{sum.num}} </span>&nbsp;&nbsp;
    </div>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" width="30%">
      <template v-if="dialogStatus === 'review'">
        <el-radio v-model="reviewVal" label="2">审核通过</el-radio>
        <el-radio v-model="reviewVal" label="3">审核不通过</el-radio>
      </template>
      <el-form ref="dataForm" v-else-if="dialogStatus === 'import'" label-width="130px">
        <el-form-item label="选择excel文件：" :rules="{required: true, message: '未上传', trigger: 'change'}">
          <input type="file" @change="fileSelect" ref="file" accept=".xls,.xlsx">
          <a :href="`${baseUrl}/repertory/采购退货单导入模板.xls`" style="margin-left:10px; color:#409EFF; text-decoration: underline;" target="_blank">导入文件模板</a>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus === 'review'" @click="reviewConfirm">确定</el-button>
        <el-button v-else-if="dialogStatus === 'import'" @click="importSubmit" :loading="loading">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { getListAPI, getStatusAPI, cancelAPI, reviewAPI, settleAPI, submitOrderAPI,getCountAPI, importAPI } from '@/api/stock-management/returnpurchase'
  import { requestMsg, confirm } from '@/utils/publicFunctions'
  import queryString from 'query-string'
  import { requestPath } from '@/utils/global.js'
  import store from '@/store'

  export default{
    data() {
      return{
        authBtns: [],
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          status: null
        },
        listData: [],
        tableKey: 0,
        total: null,
        listLoading: false,
        timeLimit: null,
        statusList: [],
        dialogVisible:false,
        reviewId: null,
        reviewVal: null,
        textMap: {
          review: '审核信息',
          import: '导入采购退货记录'
        },
        dialogStatus: '',
        loading: false,
        baseUrl: '',
        sum:{
          ministrial:0,
          realOcean:0,
          num:0
        }
      }
    },
    mounted () {     
      if( ifUndefined(store.getters.returnPurchaseSerKeys.pageNum) ){
        this.listQuery = store.getters.returnPurchaseSerKeys
        console.log(this.listQuery,'读取搜索条件成功')
        if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
          this.timeLimit = []
          this.timeLimit[0] = this.listQuery.startTime
          this.timeLimit[1] = this.listQuery.endTime
        }
      }
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
      this.getList()
      this.getStatus()
      this.baseUrl = process.env.BASE_API
    },
    methods: {
      importSubmit() {
        if (this.$refs.file.files[0]) {
          let formData = new FormData()
          formData.append('file', this.$refs.file.files[0])
          this.loading = true
          importAPI(formData).then(res => {
            this.loading = false
            requestMsg.apply(this, [res.data, '导入'])
            res.data.status ? this.dialogVisible = false : true
          })
        } else {
          this.$message.warning('请选择文件后再执行导入！')
        }
      },
      fileSelect() {
        if (this.$refs.file.files[0]) {
          let file = this.$refs.file.files[0]
          if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.$message.warning('导入文件格式不正确，请重新导入！')
            this.$refs.file.value = null
          }
        }
      },
      uploadFile() {
        this.dialogVisible = true
        this.dialogStatus = 'import'
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.$refs.file.value = null
        })
      },
      getList() {
        getListAPI(this.listQuery).then(res => {//获取列表数据
          this.listLoading = true
          if(res.data.code === 0){
            this.listData = res.data.data.list
            this.total = res.data.data.total
            if(this.listData.length>0){
              getCountAPI(this.listQuery).then(res=>{
              this.sum = res.data.data
            })}else{
                this.sum={
                ministrial:0,
                realOcean:0,
                num:0
              }
            }
          } else if(res.data.code === -2){
            this.$message.error(res.data.data);
          } else {
            this.$message.error('获取数据失败');
          }
          this.listLoading = false
        })

      },
      getStatus() {
        getStatusAPI().then(res => {
          if(res.data.code === 0){
            this.statusList = res.data.data
          } else {
            this.$message.error(`获取数据失败：${res.data.msg}`);
          }
        })
      },
      cancel(id) {//取消
        confirm.apply(this,['确定要取消吗？']).then(() => {
          cancelAPI(id).then(res => {
            requestMsg.apply(this,[res.data,'取消'])
          })
        })
      },
      review(id) {//审核
        this.dialogStatus = 'review'
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
          if(res.data.code === 0){
            this.$message.success('操作成功');
            this.getList()
          } else if(res.data.code == -2){
            this.$message.error(res.data.data);
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      settle(id) {//结算
        confirm.apply(this,['确定要结算吗？']).then(() => {
          settleAPI({oid:id}).then(res => {
            requestMsg.apply(this,[res.data,'结算'])
          })
        })
      },
      submitOrder(id) {//提交
        submitOrderAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'提交'])
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
        paramStr ? window.open(`${process.env.BASE_API}${requestPath.stock}/returnpurchase-note/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.stock}/returnpurchase-note/export`)
        // let paramStr = queryString.stringify(params);
        // window.open(`${process.env.BASE_API}${requestPath.stock}/returnpurchase-note/export?${paramStr}`);
      },
      handleFilter() {
        if(this.timeLimit){
          this.listQuery.startTime = this.timeLimit[0]
          this.listQuery.endTime = this.timeLimit[1];
        } else {
          this.listQuery.startTime = null
          this.listQuery.endTime = null
        }
        store.dispatch('SetReturnPurchaseSerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        this.listQuery.pageNum = 1
        this.getList()
      },
      resetFilter() {
        this.listQuery = {
          pageNum: 1,
          pageSize: this.listQuery.pageSize,
          status: null
        }
        this.timeLimit = null
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