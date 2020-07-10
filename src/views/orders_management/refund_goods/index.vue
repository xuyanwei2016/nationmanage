<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <!-- <el-button icon="el-icon-circle-plus" @click="exportExcel">导出退货单</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('exportExcelbtn') >= 0" @click="exportExcel">
        {{authBtns.filter(i => i.idName=='exportExcelbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportExcelbtn').length>0 && authBtns.filter(i => i.idName=='exportExcelbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportExcelbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchAudit(1)btn') >= 0" @click="batchAudit(1)">
        {{authBtns.filter(i => i.idName=='batchAudit(1)btn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchAudit(1)btn').length>0 && authBtns.filter(i => i.idName=='batchAudit(1)btn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchAudit(1)btn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-circle-check-outline" @click="batchAudit(1)">审核通过</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchAudit(2)btn') >= 0" @click="batchAudit(2)">
        {{authBtns.filter(i => i.idName=='batchAudit(2)btn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchAudit(2)btn').length>0 && authBtns.filter(i => i.idName=='batchAudit(2)btn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchAudit(2)btn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-circle-close-outline" @click="batchAudit(2)">审核不通过</el-button> -->

    </div>
    <transition-group name="custom-classes-transition" enter-active-class="animated">
      <el-form inline class="form-inline" :key="moreFilter">
        <el-form-item label="订单类型">
          <el-select v-model="listQuery.status">
            <el-option :value="null" label="全部"></el-option>
            <el-option :value="0" label="未确认"></el-option>
            <el-option :value="1" label="未审核"></el-option>
            <el-option :value="2" label="已入库"></el-option>
            <el-option :value="3" label="已完成"></el-option>
            <el-option :value="4" label="退款失败"></el-option>
            <el-option :value="5" label="审核通过"></el-option>
            <el-option :value="6" label="已取消"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="moreFilter" >
          <el-form-item label="订单号">
            <el-input  placeholder="订单号、退货单号" v-model="listQuery.conds" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="退货单号">
            <el-input  placeholder="退货单号" v-model="listQuery.salesReturnCode" clearable></el-input>
          </el-form-item> -->
          <el-form-item label="物流单号">
            <el-input  placeholder="物流单号" v-model="listQuery.trackingCode" clearable></el-input>
          </el-form-item>
          <el-form-item label="下单会员">
            <el-input  placeholder="下单会员" v-model="listQuery.createrName" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="timeRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="退货方式">
            <el-select v-model="listQuery.returnMode">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="退货" :value="1"></el-option>
              <el-option label="拒收" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="整单退货">
            <el-select v-model="listQuery.isAllSalesRefunds">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="整单" :value="1"></el-option>
              <el-option label="部分" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="!moreFilter">
          <el-form-item label="综合搜索">
            <el-input  placeholder="可输入订单号、退货单号、物流单号" v-model="listQuery.conds" clearable class="once-search-input"></el-input>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button @click="resetFilter">重置</el-button>
          <el-button @click="moreFilter = !moreFilter">{{moreFilter ?  '简洁' : '更多' }}<i :class="moreFilter ?  'el-icon-arrow-up' : 'el-icon-arrow-down' "></i> </el-button>
        </el-form-item>
      </el-form>
    </transition-group>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" ref="multipleTable" >
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column label="退货单号" align="center">
        <template slot-scope="scope">
          <router-link class="bookLink" v-if="true" :to="{path:'refund_goods/goods_processing',query:{id:scope.row.id}}">{{scope.row.code}}</router-link>
          <span v-else>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单会员" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.refundTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货单状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusStr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="整单退货" align="center">
        <template slot-scope="scope">
          <span>{{wholeRefund[scope.row.isAllSalesRefunds]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width operationBtns" label="操作" align="center">
        <template slot-scope="scope">
          <ul style="text-align:center">
            <li>
              <router-link :to="{path:'refund_goods/goods_processing',query:{id:scope.row.id}}" >
                <i>{{(scope.row.statusStr === '未确认'||scope.row.statusStr === '未审核')||(scope.row.status == 1 && scope.row.orderAscription == 2) ? '编辑' : '查看'}}</i>
              </router-link>
              <!-- <i @click="dealOrder(scope.row.id)">查看</i> -->
            </li>

            <li v-if="authBtns.map(i => i.idName).indexOf('cancelbtn') >= 0&&(scope.row.statusStr === '未确认' || ((scope.row.statusStr === '未审核' || scope.row.statusStr === '审核成功') && scope.row.orderAscription == 1) || scope.row.statusStr === '审核失败') "><i @click="cancel(scope.row.id)">{{authBtns.filter(i => i.idName=='cancelbtn')[0].name}}</i></li>

            <li v-if="authBtns.map(i => i.idName).indexOf('confirmbtn') >= 0 && scope.row.statusStr === '未确认'"><i @click="confirm(scope.row.id)">{{authBtns.filter(i => i.idName=='confirmbtn')[0].name}}</i></li>

            <li v-if="authBtns.map(i => i.idName).indexOf('checkbtn') >= 0 && (scope.row.statusStr === '未审核' || scope.row.statusStr === '审核失败')"><i @click="check(scope.row.id)">{{authBtns.filter(i => i.idName=='checkbtn')[0].name}}</i></li>

            <li v-if="authBtns.map(i => i.idName).indexOf('storagebtn') >= 0 && scope.row.statusStr === '审核成功' && scope.row.orderAscription == 1" @click="storage(scope.row.id)"><i>{{authBtns.filter(i => i.idName=='storagebtn')[0].name}}</i></li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="审核信息" :visible.sync="checkVisible" width="30%">
      <template>
        <el-radio v-model="reviewVal" label="0">审核通过</el-radio>
        <el-radio v-model="reviewVal" label="1">审核不通过</el-radio>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviewConfirm">确 定</el-button>
        <el-button @click="checkVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="确认库存入库" :visible.sync="storageVisible" width="30%">
      <template>
        <el-form inline ref="dataForm" :rules="rules" :model="storageForm" >
          <el-form-item label="库区：" label-width="100px" prop="wareStatus">
            <el-select v-model="storageForm.wareStatus" placeholder="请选择库区" @change="choiceWare">
              <el-option :label="item.name" :value="item" v-for='item in wareList' :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库位：" label-width="100px" prop="warePlaceStatus">
            <el-select v-model="storageForm.warePlaceStatus" placeholder="请选择库位">
              <el-option :label="item.name" :value="item.id" v-for='item in warePlaceList' :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storages()">确 定</el-button>
        <el-button @click="storageVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
  .ib{
    display:inline-block;
  }
  .orderBasic tr{
      height: 70px;
  }
  .divider{
    border-bottom: 1px solid #eee;
  }
  .el-main{
    padding: 0 100px;
  }
  textarea{
    margin-left: 100px;
    margin-top: -70px;
  }
  .carriage{
    height: 36px;
    display: inline-block;
    line-height: 36px;
  }
  .operationBtns ul{
    padding: 0;
  }
  .operationBtns ul li{
    text-align: center;
  }
</style>

<script>
import { getMultipleSelectionIDs } from '@/filters/getIds'
import queryString from 'query-string'
import { requestPath } from '@/utils/global'
import {
  getListAPI,
  cancelAPI,
  checkAPI,
  confirmAPI,
  checkSucAPI,
  checkFailAPI,
  getRemarkByIdAPI,
  getStatusHisByIdAPI,
  remarkHistoryAPI,
  storageAPI,
  orderDetailAPI,
  changeOrderInfoAPI,
  adoptAPI,
  NoadoptAPI
} from '@/api/order/goods';
import { operationMsg, requestMsg, confirm } from '@/utils/publicFunctions'
import store from '@/store'
import { wareListAPI, warePlaceListAPI } from '@/api/stock-management/purchase'

export default {
  data() {
    return {
      wholeRefund: ['部分', '整单'],
      authBtns: [],
      checkVisible: false,
      statusHis:[],
      bookNum:0,
      subtotal:0,
      orderRemark:'',
      newOrderRemark:'',
      orderInfoId:0,
      orderGoods:{},
      orderDetail:{},
      dialogVisible:false,
      tableKey: 0,
      listLoading: true,
      moreFilter:false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        returnMode: null,
        isAllSalesRefunds: null,
        status: null
      },
      list: null,
      total: null,
      multipleSelection: [],
      multipleSelectionIDs:[],
      listStatus: '',
      noteOrder:'',
      checkOrder: false,
      reviewVal:'0',
      storageVisible: false,
      rules: {
        wareStatus: [{ required: true, message: '请选择库区', trigger: 'change'}],
        warePlaceStatus: [{ required: true, message: '请选择库位', trigger: 'change'}],
        linkNan:[
          { required: true, pattern:/^[\u4e00-\u9fa5a-zA-Z]{0,50}$/ ,message: '请输入正确联系人', trigger: 'blur' }
        ],
        address:[
          { required: true, pattern:/^[\u4e00-\u9fa5]{0,40}$/,message: '请输入正确的地址', trigger: 'blur' }
        ],
        phone:[
          { required: true, pattern:/^1[3|5|7|8|]\d{9}$/,message: '请输入正确的手机号', trigger: 'blur' }
        ],
        postcode:[
          { required: true, pattern:/^\d{1,50}$/, message: '请输入正确的邮编', trigger: 'blur' }
        ],
        pinkage: [
          { required: true, pattern:/^\d{0,50}$/, trigger: 'blur', message:'请输入正确的金额' }
        ],
        pinkageStatus:[
          { required: true, message: '是否承担退货运费', trigger: 'change' }
        ],
        company: [
          { required: true, pattern:/^[\u4e00-\u9fa5]{0,40}$/,message: '请输入正确的物流公司', trigger: 'blur' }
        ],
        code: [
          { required: true, pattern:/^\d{0,50}$/, message: '请输入正确的物流单号', trigger: 'blur' }
        ],
        totalPrice: [
          {required: true, pattern:/^\d{0,50}$/ ,message: '请输入正确的退货总码洋', trigger: 'blur'}
        ],
        refundTotal: [
          {required: true, pattern:/^\d{0,50}$/ ,message: '请输入正确的退款总金额', trigger: 'blur'}
        ]
      },
      storageForm:{
        wareId:null,
        wareStatus:'',
        warePlaceStatus:'',
      },
      logisticsForm: {
        company:'',
        code: ''
      },
      carriageForm:{
      },
      refundForm:{
        totalPrice: '',
        refundTotal: '',
      },
      storageForm:{
        wareStatus: '',
        warePlaceStatus: ''
      },
      wareList: [],
      warePlaceList: [],
      receiverForm: {},
      pinkageText: ['否','是'],
      lastVal: '',
      refresh: 0,
      note: '',
      checkId:'',
      timeRange: []
    }
  },
  mounted() {

      if( ifUndefined(store.getters.refund_goodsSerKeys.pageNum) ){
      this.listQuery = store.getters.refund_goodsSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeRange = []
        this.timeRange[0] = this.listQuery.startTime
        this.timeRange[1] = this.listQuery.endTime
      }
    }
    this.getList()
    this.getStorageList()
  },
  watch:{
    // moreFilter:function(){
    //   this.resetFilter()
    // }
  },
created() {
  this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
},
  methods: {
    batchAudit(type) {
      if(this.isSelected()){
        if(type == 1){
          this.$confirm('是否确认批量审核通过？', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            adoptAPI({"orderIds":this.multipleSelectionIDs}).then(res=>{
              if(res.data.code ==0){
                this.$message.success("批量审核通过成功")
                this.getList()
              }else{
                this.$message.error(res.data.msg)
              }
            })
          })
        }
        if(type == 2){
          this.$confirm('是否确认批量审核不通过？', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            NoadoptAPI({"orderIds":this.multipleSelectionIDs}).then(res=>{
              if(res.data.code ==0){
                this.$message.success("批量审核不通过成功")
                this.getList()
              }else{
                this.$message.error(res.data.msg)
              }
            })
          })
        }
      }
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
    exportExcel(){//导出excel
      let {pageNum, pageSize, ...params} = this.listQuery
      let tempParams = {}
      for (const key in params) {
        if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
          tempParams[key] = params[key]
        }
      }
      let paramStr = queryString.stringify(tempParams)
      paramStr ? window.open(`${process.env.BASE_API}${requestPath.order}/sales-return/export-all?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.order}/sales-return/export-all`)
    },
    getStorageList() {//获取库区
      wareListAPI().then(res => {
        if(res.data.code === 0){
          this.wareList = res.data.data
        }
      })
    },
    cancel(id) { //取消
      this.$confirm('是否确认取消订单？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        cancelAPI({oid:id}).then(res => {
          requestMsg.apply(this,[res.data,'取消'])
        })
      })
    },
    confirm(id) { //确认
      confirmAPI({oid:id}).then(res => {
        requestMsg.apply(this,[res.data,'确认'])
      })
    },
    check(id) {//审核
      this.checkId = id
      this.checkVisible = true
    },
    reviewConfirm (){//审核通过/审核不通过
      if(this.reviewVal == '0'){//审核通过
        checkSucAPI({oid:this.checkId}).then(res => {
          this.checkVisible = false
          requestMsg.apply(this,[res.data,'操作'])
        })
      } else{//审核不通过
        checkFailAPI({oid:this.checkId}).then(res => {
          this.checkVisible = false
          requestMsg.apply(this,[res.data,'操作'])
        })
      }
    },
    storage(id) {//入库
      this.storageVisible = true
      this.storageForm.wareId = id;
    },
    storages(){

      let nameStorages='';
      for(let i=0;i<this.warePlaceList.length;i++){
        if(this.warePlaceList[i].id==this.storageForm.warePlaceStatus){
          nameStorages=this.warePlaceList[i].name;
        }
      }
      let storagePostdata = {
        "oid": this.storageForm.wareId,
        "storagebinId": this.storageForm.warePlaceStatus,
        "storagebinName": nameStorages,
        "warehouseId": this.storageForm.wareStatus.id,
        "warehouseName": this.storageForm.wareStatus.name,
      }
      storageAPI(storagePostdata).then(res => {
        requestMsg.apply(this,[res.data,'入库'])
        this.storageVisible = false;
        this.storageForm.warePlaceStatu='';
      })
    },
    dealOrder(id){//详情展示
      this.orderInfoId = id
      orderDetailAPI(id).then(res => {
        console.log(res);
        this.orderDetail = res.data.data
        this.orderGoods = res.data.data.infoList
        this.orderGoods.map((item,index) => {
          item.price = '¥' + item.price
          item.subtotal = '¥' + item.salePrice * item.num
          this.subtotal += item.salePrice * item.num
          this.bookNum += item.num
          item.salePrice = '¥' + item.salePrice
        })
        this.note = res.data.data.reson
        //寄回信息
        this.receiverForm.linkNan = res.data.data.linkNan
        this.receiverForm.postcode = res.data.data.postcode
        this.receiverForm.phone = res.data.data.phone
        this.receiverForm.address = res.data.data.address
        //运费
        this.carriageForm.pinkage = res.data.data.freight
        this.carriageForm.readerFreight = res.data.data.readerFreight
        this.carriageForm.pinkageStatus = res.data.data.isFreight
        //物流信息
        this.logisticsForm.expressCompany = res.data.data.trackingCode
        this.logisticsForm.code = res.data.data.trackingCode
        //退款总金额
        this.refundForm.totalPrice = res.data.data.totalPrice
        this.refundForm.refundTotal = res.data.data.refundTotal

        this.dialogVisible = true
      })
    },
    changeVal(val) {
      if(!val){
        this.lastVal = this.carriageForm.readerFreight
      }
      else{
        this.lastVal = val
      }
    },
    changePinkage(val) {
      if(this.carriageForm.readerFreight < val){
        this.carriageForm.pinkage = this.lastVal
      }
      if(this.refresh == 0) {
          this.refresh = 1
      } else {
        this.refresh = 0
      }
    },
    changeCarriage(val) {
      if(this.refresh == 0) {
          this.refresh = 1
      } else {
        this.refresh = 0
      }
    },
    choiceWare() {//库位(根据库区的变化而改变)
      this.storageForm.warePlaceStatus = ''
      warePlaceListAPI(this.storageForm.wareStatus.id).then(res => {
        if(res.data.code === 0){

          this.warePlaceList = res.data.data
        }
      })
    },
    resetForm(formName) {
      this[formName] = {
      }
      this.$refs[formName].clearValidate();
    },
    isSelected(){
      if (this.multipleSelectionIDs.length <= 0){
        this.$message.warning('请选择需要操作的条目')
        return false
      }
      return true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelectionIDs = getMultipleSelectionIDs(val)
    },

    handleFilter() {
      store.dispatch('SetRefundGoodsSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      if (this.timeRange) {
        this.listQuery.startTime = this.timeRange[0]
        this.listQuery.endTime = this.timeRange[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.listQuery= {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        returnMode: null,
        isAllSalesRefunds: null,
        status: null
      }
      this.timeRange = null
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
