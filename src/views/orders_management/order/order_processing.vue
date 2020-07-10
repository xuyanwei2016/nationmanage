<template>
  <div class="app-container calendar-list-container">
    <h3>订单基础信息：下单会员：{{orderDetail.createrName}}（{{orderDetail.level_zh}}）</h3>
    <el-form ref="orderForm" :model="orderDetail" label-position="right" label-width="120px" class="order-form clearfix">
      <el-form-item label="订单编号：">{{orderDetail.code}}</el-form-item>
      <el-form-item label="订单来源：">{{orderDetail.orderSource}}</el-form-item>
      <el-form-item label="订单状态：">{{orderDetail.statusZh}}</el-form-item>
      <el-form-item label="支付方式：" v-if="orderDetail.status != 0">{{payMap[orderDetail.payType]}}</el-form-item>
      <el-form-item label="订单总额：">
        <span class="color-red">￥{{orderDetail.orderPayment?orderDetail.orderPayment.toFixed(2):'0.00'}}</span>
      </el-form-item>
      <el-form-item label="支付金额：">
        <span class="color-red">￥{{orderDetail.payment?orderDetail.payment.toFixed(2):'0.00'}}</span>
      </el-form-item>
      <el-form-item label="下单时间：">{{orderDetail.createTime}}</el-form-item>
      <el-form-item label="支付时间：" v-if="orderDetail.status != 0">{{orderDetail.payTime}}</el-form-item>
    </el-form>
    <p class="divider"></p>
    <h3>订单商品信息：</h3>
    <el-table :data="orderGoods" border highlight-current-row stripe>
      <el-table-column label="商品名称" min-width="80" align="center">
        <template slot-scope="scope">
          <a class="bookLink" :href="`/#/bookItem?id=${scope.row.goodsid}`" target="_blank">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" min-width="50" align="center"></el-table-column>
      <el-table-column prop="num" label="数量" min-width="50" align="center"></el-table-column>
      <el-table-column prop="price" label="定价" min-width="50" align="center">
      </el-table-column>
      <el-table-column prop="salePrice" label="售价" min-width="50" align="center"></el-table-column>
      <el-table-column label="小计" min-width="50" align="center">
        <template slot-scope="scope">
          ¥{{scope.row.totalPrice?scope.row.totalPrice.toFixed(2):'0.00'}}
        </template>
      </el-table-column>
    </el-table>
      <p style="text-align:right">共{{orderGoods.length}}个数字资源，总金额 <span style="color:red;font-size:20px">{{sumsubtotal}}</span> 元</p>
    <p class="divider"></p>
    <p class="divider"></p>
    <h3>发票信息：</h3>
    <el-form :model="invoiceForm" ref="invoiceForm" :rules="rules" label-position="right" label-width="120px" style="width: 70%;">
      <el-form-item label="是否开发票:">
        <el-radio-group v-model="invoiceForm.invoiceStatus" :disabled="Twodis">
          <el-radio :label="'1'" >是</el-radio>
          <el-radio :label="'0'" >否</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="invoiceForm.invoiceStatus == '1'">
        <el-form-item label="发票类型：" prop="invoiceType">
          <el-radio-group v-model="invoiceForm.invoiceType" :disabled="Twodis">
            <el-radio :label="0">个人</el-radio>
            <el-radio :label="1">单位</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="invoiceTitle" label="发票抬头：">
          <el-input v-model="invoiceForm.invoiceTitle" style="width:250px" :disabled="Twodis"></el-input>
        </el-form-item>
        <el-form-item prop="identity" label="纳税人识别号：" v-if="invoiceForm.invoiceType == 1">
          <el-input v-model="invoiceForm.taxpayerIdentificationNumber" style="width:250px" :disabled="Twodis"></el-input>
        </el-form-item>
        <el-form-item label="发票内容：">
          <el-radio-group v-model="invoiceForm.invoiceContext" :disabled="Twodis">
            <el-radio label="1">图书</el-radio>
            <el-radio label="2">明细</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
    </el-form>

    <p class="divider"></p>
    <div style="width:1000px;margin:0 auto;">
      <el-tabs type="border-card">
        <el-tab-pane label="订单处理备注">
          <div style="overflow-y:auto;width:900px;height:200px;padding:20px 40px;">
            <div v-for="remark in orderRemark" :key="remark.id">
              <div>
                <h4><span>记录人：{{remark.createrName}}</span> <b style="float:right">记录时间：{{remark.createTime}}</b></h4>
                <p>{{remark.operationContent}}</p>
              </div>
              <p class="divider"></p>
            </div>
            <el-form>
              <el-form-item label="新备注：" >
                <el-input type="textarea" v-model="newOrderRemark" row="5"></el-input>
              </el-form-item>
              <el-button type="primary" @click="addOrderRemark()">添加</el-button>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="状态变更记录">
          <el-table :data="statusHis" border stripe highlight-current-row>
            <el-table-column prop="createTime" label="操作时间"></el-table-column>
            <el-table-column prop="operationContent" label="操作内容"></el-table-column>
            <el-table-column prop="createrName" label="操作人"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div slot="footer" class="dialog-footer footer-margin">
      <el-button type="primary" @click="submitDealOrder">确认</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>

  </div>
</template>

<script>
import {
  batchCancelOrderAPI,
  batchConfirmOrderAPI,
  batchOrderPaidAPI,
  batchSoldOutAPI,
  batchSentAPI,
  genRationAPI,
  remarkHistoryAPI,
  sendMessageAPI,
  changeOrderInfoAPI,
  getRationByIdAPI,
  getRemarkByIdAPI,
  getStatusHisByIdAPI,
  orderDetailAPI,
  returnOrderlistAPI,
  refundOrderlistAPI,
  getPhoneloglistAPI
} from '@/api/order/order';
import axios from 'axios'
import { operationMsg, errorMsg } from '@/utils/publicFunctions'

export default {
  data() {
    return {
      payMap: {
        0: '支付宝',
        1: '微信',
        2: '易宝'
      },
      Twodis:false,       //控制发票信息是否可以修改该
      statusHis:[],         //状态变更记录
      distributionList:[], //配货单列表
      returnOrderlist:[],  //退货单列表
      refundOrderlist:[],   //  退款单列表
      Phoneloglist:[],    //短信列表
      orderRemark:[],
      newOrderRemark:'',
      orderInfoId:0,
      invoiceForm: {
        invoiceStatus: '0',
        invoiceType: 0,
        invoiceContext: 1,
        taxpayerIdentificationNumber:'',
      },
      rules:{
        invoiceType:[
          { required: true, message: '请选择发票类型', trigger: 'blur' },
        ],
        invoiceTitle: [
          { required: true, message: '请输入发票抬头', trigger: 'blur' },
        ],
        identity:[
          {
            required:false,pattren:/^.{10,40}$/,message:'请输入正确的识别号', trigger:'blur'
          }
        ]
      },
      bookNum:0,
      sumsubtotal:0,
      orderGoods:[],
      orderDetail:{},
      cities:{
        province:[],
        sheng: [],
        shi: [],
        shi1: [],
        qu: [],
        qu1: [],
        city:[],
        block:[],
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      moreFilter:false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        orderType:''
      },
      orderInfoBasic:{},
      dialogStatus: '',
      dialogFormVisible: false,
    }
  },
  mounted() {
    this.getOrderRemark()
    this.dealOrder(this.$route.query.id)
  },
  methods: {
    sunnum(num1){//当优惠后读者运费改变  重新计算总金额
      this.orderDetail.payment =parseFloat(parseFloat(num1) + parseFloat(this.sumsubtotal))
    },
    addOrderRemark(){
      remarkHistoryAPI({orderId: this.orderInfoId, remark: this.newOrderRemark}).then((res) => {
        if (res.data.status) {
          this.newOrderRemark = ''
          this.getOrderRemark()
        } else {
          errorMsg.apply(this, [ res.data, `添加备注历史` ])
        }
      })
    },
    getOrderRemark(){
      getRemarkByIdAPI({orderId:this.orderInfoId,pageNum:1,pageSize:9999}).then((res) => {
        res.data.status ? this.orderRemark = res.data.data.list : errorMsg.apply(this, [ res.data, `查询备注历史列表` ])
      }),
      getStatusHisByIdAPI({orderId:this.orderInfoId,pageNum:1,pageSize:9999}).then(res => {
        res.data.status ? this.statusHis = res.data.data.list : errorMsg.apply(this, [ res.data, `查询状态改变历史列表` ])
      })
    },
    submitDealOrder(){
      if(this.invoiceForm.invoiceStatus == 1){//开发票
        this.$refs['invoiceForm'].validate((valid) => {
          if(this.invoiceForm.invoiceType == 1&&!this.invoiceForm.taxpayerIdentificationNumber){
            this.$message.error('请输入纳税人识别号!')
            return
          }else if(this.invoiceForm.invoiceType == 0){
            this.invoiceForm.taxpayerIdentificationNumber='';
          }
          this.invoiceForm.orderId = this.orderInfoId
          changeOrderInfoAPI(this.invoiceForm).then(res => {
            if(res.data.status){
              this.$message.success('修改订单成功')
              this.$router.back()
            } else {
              errorMsg.apply(this, [ res.data, `修改订单` ])
            }
          })
          /*if((this.invoiceForm.invoiceType == 2 && this.invoiceForm.taxpayerIdentificationNumber != null) || this.invoiceForm.invoiceType == 1){

          } else{
            this.$message.error('请输入纳税人识别号')
          }*/
        })
      }
    },
    dealOrder(id){ //获取详情
      this.orderInfoId = id
      orderDetailAPI(id).then(res => {
        if (res.data.status) {
          this.orderDetail = res.data.data
          this.orderDetail.readerCarriage=  parseFloat(this.orderDetail.readerCarriage)
          //发票信息
          this.invoiceForm.invoiceContext = this.orderDetail.invoiceContext
          this.invoiceForm.invoiceTitle = this.orderDetail.invoiceTitle
          this.invoiceForm.invoiceType = this.orderDetail.invoiceType
          this.invoiceForm.invoiceStatus = this.orderDetail.invoiceStatus
          this.invoiceForm.taxpayerIdentificationNumber = this.orderDetail.taxpayerIdentificationNumber
          //是否可以修改发票信息
          if(this.orderDetail.status == -1){ //除了已取消
            this.Twodis = true
          }else{
            this.Twodis = false
          }
          this.orderGoods = res.data.data.orderinfoList
          this.sumsubtotal = 0
          this.bookNum = 0
          this.orderGoods.map((item,index) => {
            if(item.goodsAttr3 == "1"){item.goodsAttr3 = "上架"}
            if(item.goodsAttr3 == "0"){item.goodsAttr3 = "下架"}
            if(item.goodsAttr3 == "-1"){item.goodsAttr3 = "获取失败"}
            item.price = '¥' + (item.price?item.price.toFixed(2):'0.00');
            item.subtotal = item.salePrice * item.num
            this.sumsubtotal += parseFloat(item.subtotal)
            this.bookNum += item.num
            item.salePrice = '¥' + (item.salePrice?item.salePrice.toFixed(2):'0.00')
            item.subtotal = '¥' + parseFloat(item.subtotal ).toFixed(2)
          })
          this.sumsubtotal = parseFloat(this.sumsubtotal ).toFixed(2)
          this.getOrderRemark()
        } else {
          errorMsg.apply(this, [ res.data, `获取订单详情` ])
        }
      })
    }
  }
}
</script>
