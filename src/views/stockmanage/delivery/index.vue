<template>
  <div class="app-container calendar-list-container" v-loading="pushing"  element-loading-text="正在推送...">
    <div class="nav-buttons-container">
      <router-link :to="{ path:`delivery/create_delivery`}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0"><el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button></router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchSubmitBtn') >= 0" @click="batchSubmitOrder"> {{authBtns.filter(i => i.idName=='batchSubmitBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchSubmitBtn').length>0 && authBtns.filter(i => i.idName=='batchSubmitBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchSubmitBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchConfirmBtn') >= 0" @click="batchConfirmOrder">{{authBtns.filter(i => i.idName=='batchConfirmBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchConfirmBtn').length>0 && authBtns.filter(i => i.idName=='batchConfirmBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchConfirmBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('downLoadFileBtn') >= 0" @click="downLoadFile">{{authBtns.filter(i => i.idName=='downLoadFileBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='downLoadFileBtn').length>0 && authBtns.filter(i => i.idName=='downLoadFileBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('downLoadFileBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('handleImport') >= 0" @click="handleImport">{{authBtns.filter(i => i.idName=='handleImport')[0].name}}<i v-if="authBtns.filter(i => i.idName=='handleImport').length>0 && authBtns.filter(i => i.idName=='handleImport')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('handleImport')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchPushBtn') >= 0" @click="batchPushOrder">{{authBtns.filter(i => i.idName=='batchPushBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchPushBtn').length>0 && authBtns.filter(i => i.idName=='batchPushBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchPushBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="出库单号">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.code" clearable placeholder="请输入出库单号"></el-input>
      </el-form-item>
      <el-form-item label="关联单号">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.relationCode" clearable placeholder="请输入关联单号"></el-input>
      </el-form-item>
      <el-form-item label="书代号">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.bookNo" clearable placeholder="请输入书代号"></el-input>
      </el-form-item>
      <el-form-item label="操作人">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.opName" clearable placeholder="请输入操作人"></el-input>
      </el-form-item>
      <el-form-item label="出库单状态">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.status" placeholder="请选择出库单状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in deliveryStatus' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库区">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.warehouseId" placeholder="请选择库区" @change="wareChange">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in ware' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库位">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.storageBinId" placeholder="请选择库位">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in warePlace' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出库类型">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.type" placeholder="请选择出库类型">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in deliveryType' :key="val"></el-option>
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

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList"  v-show="!pushing">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="出库单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.relationCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ministrial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realOcean}}</span>
        </template>
      </el-table-column>
      <el-table-column label="平均折扣" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库区" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageBinName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.typeZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.opName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`delivery/details_delivery`, query:{bookId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='review').length > 0"><i :class="authBtns.filter(i => i.idName=='review')[0].icon" :title="authBtns.filter(i => i.idName=='review')[0].name"></i></router-link>
          <router-link :to="{ path:`delivery/create_delivery`, query:{bookId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='edit').length > 0 && scope.row.status==='6'"><i :class="authBtns.filter(i => i.idName=='edit')[0].icon" :title="authBtns.filter(i => i.idName=='edit')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='cancel')[0].icon" :title="authBtns.filter(i => i.idName=='cancel')[0].name" v-if="authBtns.filter(i => i.idName=='cancel').length > 0 && (scope.row.status==='0' || scope.row.status==='2' || scope.row.status==='6')"  @click="cancelOrder(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='cancelPush')[0].icon" :title="authBtns.filter(i => i.idName=='cancelPush')[0].name" v-if="authBtns.filter(i => i.idName=='cancelPush').length > 0 && (scope.row.status==='3' || scope.row.status==='7')" @click="cancelPushOrder(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='checkbtn')[0].icon" :title="authBtns.filter(i => i.idName=='checkbtn')[0].name" v-if="authBtns.filter(i => i.idName=='checkbtn').length > 0 && scope.row.status==='6'" @click="submitOrder(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0 && scope.row.status==='6'" @click="deleteOrder(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='confirmbtn')[0].icon" :title="authBtns.filter(i => i.idName=='confirmbtn')[0].name" v-if="authBtns.filter(i => i.idName=='confirmbtn').length > 0 && (scope.row.type === '4' || scope.row.type === '5') && scope.row.status=='0' && scope.row.areaType =='0'" @click="confirmOrder(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='successbtn')[0].icon" :title="authBtns.filter(i => i.idName=='successbtn')[0].name" v-if="authBtns.filter(i => i.idName=='successbtn').length > 0 && (scope.row.status=='0' && (scope.row.areaType =='1' || scope.row.type === '7')) || scope.row.status=='2'" @click="pushOrder(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;">
      <span>总码洋：{{sum.ministrial}}</span>&nbsp;&nbsp;
      <span>总实洋：{{sum.realOcean}}</span>&nbsp;&nbsp;
      <span>总册数：{{sum.num}}</span>&nbsp;&nbsp;
      <span>平均折扣：{{sum.discount}}</span>&nbsp;&nbsp;
    </div>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="40%">
      <el-form :model="fileTemp" ref="massForm" label-width="100px" style='margin-right:10px;'>
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
    margin-left: 10px;
  }
</style>

<script>
  import { getListAPI, getDeliveryStatusAPI, getWareAPI, getWarePlace, deliveryTypeAPI, cancelOrderAPI, submitOrderAPI, deleteOrderAPI, confirmOrderAPI, pushOrderAPI, batchSubmitAPI, batchPushAPI, batchConfirmtAPI, cancelPushOrderAPI, batchImportAPI, getCountAPI } from '@/api/stock-management/delivery'
  import queryString from 'query-string'
  import { getMultipleSelectionIDs } from '@/filters/getIds'
  import { requestMsg, confirm } from '@/utils/publicFunctions'
  import { requestPath } from '@/utils/global.js'
  import store from '@/store'

  export default{
    data() {
      return{
        authBtns: [],
        tableKey:0,
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          warehouseId: null,
          storageBinId: null,
          status: null,
          type: null
        },
        pushing:false,
        listLoading: true,
        total:null,
        timeLimit:[],
        list:[],
        deliveryStatus:null,
        ware:null,
        warePlace:null,
        deliveryType:null,
        newList:[],
        dialogImportVisible: false,
        fileTemp: {},
        uploading: false,
        authBtns: [],
        sum:{}
      }
    },
    mounted() {
      if( ifUndefined(store.getters.deliverySerKeys.pageNum) ){
        this.listQuery = store.getters.deliverySerKeys
        console.log(this.listQuery,'读取搜索条件成功')
        if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
          this.timeLimit = []
          this.timeLimit[0] = this.listQuery.startTime
          this.timeLimit[1] = this.listQuery.endTime
        }
      }
      this.getList()
      this.getDeliveryStatus()
      this.getWare()
      this.getWarePlaceList()
      this.getdeliveryType()
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
      console.log(this.authBtns);
    },
    methods:{
      getList(){
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
        getCountAPI(this.listQuery).then(res=>{
          this.sum = res.data.data
        })
      },
      getDeliveryStatus() {//出库单状态列表
        getDeliveryStatusAPI().then(res => {
          if(res.data.code === 0){
            this.deliveryStatus = res.data.data
          } else {
            this.$message.error('获取出库单状态失败')
          }
        })
      },
      getWare(){//库区列表
        getWareAPI().then(res => {
          if(res.data.code === 0){
            this.ware = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      wareChange() {//库位列表
        this.listQuery.storageBinId = null
        this.getWarePlaceList()
      },
      getWarePlaceList(){
        if(this.listQuery.warehouseId){
          getWarePlace(this.listQuery.warehouseId).then(res => {
            if(res.data.code === 0){
              this.warePlace = res.data.data
              console.log("获取库位列表",this.warePlace);
            } else {
              this.$message.error('获取数据失败');
            }
          })
        }
      },
      getdeliveryType() {//类型列表
        deliveryTypeAPI().then(res => {
          if(res.data.code === 0){
            this.deliveryType = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      cancelOrder(id) {//取消按钮
        confirm.apply(this,['确定要取消吗？']).then(() => {
          cancelOrderAPI(id).then(res => {
            requestMsg.apply(this,[res.data,'取消'])
          })
        })
      },
      submitOrder(id) {//提交按钮
        confirm.apply(this,['确定要提交吗？']).then(() => {
          submitOrderAPI(id).then(res => {
            requestMsg.apply(this,[res.data,'提交'])
          })
        })
      },
      deleteOrder(id) {//删除按钮
        confirm.apply(this,['确定要删除吗？']).then(() => {
          deleteOrderAPI(id).then(res => {
            requestMsg.apply(this,[res.data,'删除'])
          })
        })
      },
      confirmOrder(id) {//确认按钮
        confirmOrderAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'确认'])
        })
      },
      pushOrder(id) {//推送百世
        confirm.apply(this,['确认推送吗？']).then(() => {
          pushOrderAPI(id).then(res => {
            requestMsg.apply(this,[res.data,'推送'])
            this.getList()
          })
        })
      },
      cancelPushOrder(id) {//取消推送按钮
        confirm.apply(this,['确定要取消推送吗？']).then(() => {
          cancelPushOrderAPI(id).then(res => {
            requestMsg.apply(this,[res.data,'取消'])
          })
        })
      },
      batchSubmitOrder() {//批量提交
        if(this.newList.length == 0){
          this.$message.error('请选择至少一条记录进行操作')
        } else{
          const status = this.newList.every(data => data.status == 6)
          if(status == true){
            const ids = getMultipleSelectionIDs(this.newList)
            batchSubmitAPI(ids).then(res => {
              if(res.data.code === 0){
                this.$message.success('提交成功');
                this.getList()
              } else {
                this.$message.error('提交失败');
                this.getList()
              }
            })
          } else{
            this.$message.error('只有未提交的数据才能提交')
          }
        }
      },
      batchPushOrder() {//批量推送-百世
        if(this.newList.length == 0){
          this.$message.error('请选择至少一条记录进行操作')
        } else{


          this.pushing = true

          const status = this.newList.every(data => data.status == 2 || (data.status == 0 && data.areaType == 1))
          if(status == true){
            const ids = getMultipleSelectionIDs(this.newList)
            batchPushAPI(ids).then(res => {
              if(res.data.code === 0){
                this.$message.success('推送成功');

              } else {
                this.$message.error('推送失败');

              }
              this.pushing = false
              this.getList()
            })


          } else{
            this.$message.error('推送数据必须为推送失败或者未确认的百世库且不能重复提交')
          }

        }
      },
      batchConfirmOrder() {//批量确认
        if(this.newList.length == 0){
          this.$message.error('请选择至少一条记录进行操作')
        } else{
          const status = this.newList.every(data => data.status == 0 && data.areaType == 0)
          if(status == true){
            const ids = getMultipleSelectionIDs(this.newList)
            batchConfirmtAPI(ids).then(res => {
              if(res.data.code === 0){
                this.$message.success('确认成功');
                this.getList()
              } else {
                this.$message.error('确认失败');
                this.getList()
              }
            })
          } else{
            this.$message.error('推送数据状态必须为未确认的本地库')
          }
        }
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
      downLoadFile() { //导出
        let {pageNum, pageSize, ...params} = this.listQuery;
        let tempParams = {}
        for (const key in params) {
          if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
            tempParams[key] = params[key]
          }
        }
        let paramStr = queryString.stringify(tempParams)
        paramStr ? window.open(`${process.env.BASE_API}${requestPath.stock}/delivery-order/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.stock}/delivery-order/export`)
      },
      chioceList(val) {
        this.newList = val;
      },
      handleFilter() {
        if(this.timeLimit){
          this.listQuery.startTime = this.timeLimit[0]
          this.listQuery.endTime = this.timeLimit[1];
        } else {
          this.listQuery.startTime = null
          this.listQuery.endTime = null
        }
        store.dispatch('SetDeliverySerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        this.listQuery.pageNum = 1
        this.getList()
      },
      resetFilter() {
        this.listQuery = {
          pageNum: 1,
          pageSize: this.listQuery.pageSize,
          warehouseId: null,
          storageBinId: null,
          status: null,
          type: null
        }
        this.timeLimit = null
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      },
    }
  }

</script>
