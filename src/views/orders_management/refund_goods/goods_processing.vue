<template>
  <div class="app-container">
    <el-button icon="el-icon-back" @click="back">返回</el-button>
    <h3>基础信息：</h3>
    <el-form ref="orderForm" :model="orderDetail" label-position="right" label-width="120px" class="order-form clearfix">
      <el-form-item label="订单编号：">{{orderDetail.orderCode}}</el-form-item>
      <el-form-item label="退货单号：">{{orderDetail.code}}</el-form-item>
      <el-form-item label="退款单号：">{{orderDetail.refundOrderCode}}</el-form-item>
      <el-form-item label="退货单状态：">{{orderDetail.status}}</el-form-item>
      <el-form-item label="订单总额：">￥{{orderDetail.orderPayment}}</el-form-item>
      <el-form-item label="退款单状态：">{{orderDetail.refundOrderStatus}}</el-form-item>
      <el-form-item label="操作人：">{{orderDetail.operatorName}}</el-form-item>
      <el-form-item label="下单会员：">{{orderDetail.createrName}}</el-form-item>
      <el-form-item label="操作时间：">{{orderDetail.updateTime}}</el-form-item>
    </el-form>
    <el-form class="demo-ruleForm" ref="dataForm">
      <el-form-item label="退货原因：" label-width="120px" class="form">
        <el-radio-group v-model="note" :disabled="inputController">
          <el-radio v-for="(val,key) in noteMap" :label="key" :key="key">{{val}}</el-radio>
        </el-radio-group>
        <!-- <el-input type="textarea" v-model="noteMap[note]" cols="100" rows="2" :disabled="inputController"></el-input> -->
      </el-form-item>
      <div class="refund-pics" v-if="Object.keys(refundPic).length>0">
        <div class="refund-pic" v-for="(val, key) in refundPic" :key="key"><img :src="`${domain}${requestPath.file}?fileName=${val}&isOnLine=true`" :alt="val" @click="openPic(val)"></div>
      </div>
      <!-- <el-upload action="${domain}${requestPath.file}upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :disabled="inputController">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="FileDialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog> -->
    </el-form>
        <!-- v-if="logisticsForm.company && logisticsForm.code" -->
    <template >
      <p class="divider"></p>
      <h3>退货物流信息：</h3>
      <el-form :model="logisticsForm" ref="logisticsForm" label-position="right" label-width="120px" style="width:80%" :rules="rules">
        <el-form-item label="物流公司：" class="inline-block" prop="company">
          <template>
            <el-select
              :disabled="inputController"
              v-model="wuliuList"
              :placeholder="logisticsForm.company" value-key="id">
              <el-option
                v-for="item in LogistList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="物流单号：" class="inline-block" prop="code">
          <el-input v-model="logisticsForm.code" :disabled="inputController"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="refundGoodsList" border stripe highlight-current-row>
        <el-table-column prop="ftime" label="处理时间" width="380" align="center"></el-table-column>
        <el-table-column prop="context" label="处理信息" align="center"></el-table-column>
      </el-table>
    </template>

    <p class="divider"></p>
    <h3>订单商品清单：</h3>
    <el-table :data="orderGoods" border stripe>
      <el-table-column prop="goodsAttr1" label="书代号" width="180" align="center"></el-table-column>
      <el-table-column label="商品名称" align="center" width="180">
        <template slot-scope="scope">
          <a class="bookLink" :href="`/#/bookItem?id=${scope.row.goodsid}`" target="_blank">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="数量" align="center"></el-table-column>
      <el-table-column prop="price" label="定价" align="center"></el-table-column>
      <el-table-column prop="discount" label="折扣值" align="center"></el-table-column>
      <el-table-column prop="salePrice" label="售价" align="center"></el-table-column>
      <el-table-column prop="goodsAttr3" label="商品状态" align="center"></el-table-column>
      <el-table-column prop="subtotal" label="小计" align="center"></el-table-column>
    </el-table>
    <p style="text-align:right">共 {{bookNum}} 本图书商品，总金额 <span style="color:red;font-size:20px">{{subtotal}}</span> 元</p>

    <p class="divider"></p>
    <h3>寄回地址：</h3>
    <el-form :model="receiverForm" ref="receiverForm" label-position="right" label-width="120px" style="width:70%" :rules="rules">
      <el-form-item label="联系人：" class="inline-block" prop="linkNan">
        <el-input v-model="receiverForm.linkNan" :disabled="inputController"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" class="inline-block" prop="phone">
        <el-input v-model="receiverForm.phone" :disabled="inputController"></el-input>
      </el-form-item>
      <el-form-item label="邮编：" prop="postcode" class="inline-block">
        <el-input v-model="receiverForm.postcode" :disabled="inputController"></el-input>
      </el-form-item>
      <el-form-item label="详细地址：" prop="address">
        <el-input type="textarea" v-model="receiverForm.address" :disabled="inputController"></el-input>
      </el-form-item>
    </el-form>

    <p class="divider"></p>
    <h3>运费相关：</h3>
    <el-form :model="carriageForm" ref="carriageForm" label-position="right" label-width="120px" style="width:85%" :rules="rules" inline class="form-inline">
      <el-form-item label="运费退款：" prop="pinkage">
        <el-input v-model="carriageForm.pinkage" @blur="changePinkage(carriageForm.pinkage)" @focus="changeVal(carriageForm.pinkage)" :disabled="inputController"></el-input>
      </el-form-item>
      <span v-if='refresh== 3'>{{refresh}}</span>
      <span class="carriage">订单已付运费：{{carriageForm.readerFreight}}元,已退运费：{{carriageForm.pinkage}}</span>
      <span></span>
      <el-form-item label="是否承担退货运费：" prop="pinkageStatus">
        <el-select v-model="carriageForm.pinkageStatus" @change="changeCarriage(carriageForm.pinkageStatus)" :disabled="inputController">
          <el-option label="否" value="0">否</el-option>
          <el-option label="是" value="1">是</el-option>
        </el-select>
        <span>是否承担运费：{{pinkageText[carriageForm.pinkageStatus]}}（是否需出版社承担退货过程中的运费，如承担，须告知用户退货寄回时选择到付。）</span>
      </el-form-item>
    </el-form>

    <p class="divider"></p>
    <h3>退款总金额：</h3>
    <el-form :model="refundForm" ref="refundForm" style="width:70%" label-position="right" label-width="120px" :rules="rules">
      <el-form-item label="退货总码洋：" class="inline-block" prop="totalPrice">
        <el-input v-model="refundForm.totalPrice" disabled></el-input>
      </el-form-item>
      <el-form-item label="退款总金额：" class="inline-block" prop="refundTotal">
        <el-input v-model="refundForm.refundTotal" disabled></el-input>
      </el-form-item>
    </el-form>

    <p class="divider"></p>
    <div style="width:1000px;margin:0 auto;">
      <el-tabs type="border-card">
        <el-tab-pane label="备注历史">
          <div style="overflow-y:auto;width:800px;height:200px;padding:20px 40px;">
            <div v-for="remark in orderRemark" :key="remark.id">
              <h4><span>记录人：{{remark.createrName}}</span> <b style="float:right">记录时间：{{remark.createTime}}</b></h4>
              <p>{{remark.operationContent}}</p>
              <p class="divider"></p>
            </div>

            <el-form>
              <el-form-item label="新备注：" >
                <el-input type="textarea" v-model="newOrderRemark" row="4"></el-input>
              </el-form-item>
              <el-button type="primary" @click="addOrderRemark()">添加</el-button>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="状态变更记录">
          <el-table :data="statusHis">
            <el-table-column prop="createTime" label="操作时间"></el-table-column>
            <el-table-column prop="operationContent" label="操作内容"></el-table-column>
            <el-table-column prop="createrName" label="操作人"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer footer-margin" v-if="orderDetail.status === '未确认'|| orderDetail.status === '未审核'">
      <el-button type="primary" @click="submitDealOrder">确认</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  <!-- </el-dialog> -->
  </div>
</template>

<style lang="less" scoped>
  .ib{
    display:inline-block;
  }
  .carriage{
    height: 36px;
    display: inline-block;
    line-height: 36px;
  }
  .refund-pics{
    width: 100%;
    padding: 10px 0;;
    overflow: hidden;
    .refund-pic{
      &:first-child{
        margin-left: 0;
      }
      width: 100px;
      margin-left: 20px;
      float: left;
      text-align: center;
      img{
        width: 100%;
      };
    }
  }
</style>

<script>
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
  getLogisticsAPI,
  getLogistListAPI

} from '@/api/order/goods';
import { operationMsg, requestMsg, confirm, errorMsg } from '@/utils/publicFunctions'
import { wareListAPI, warePlaceListAPI } from '@/api/stock-management/purchase'
import { requestPath } from '@/utils/global.js'

export default {
  data() {
    return {
      LogistList:[],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      refundPic: {},
      logisticList: [],
      dialogImageUrl: '',//文件相关
      FileDialogVisible: false,//文件相关
      checkVisible: false,
      statusHis:[],
      inputController:false,//输入框控制器
      bookNum:0,
      subtotal:0,
      orderRemark:'',
      newOrderRemark:'',
      orderInfoId:0,
      orderGoods:[],
      orderDetail:{},
      tableKey: 0,
      listLoading: false,
      moreFilter:false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        orderType:''
      },
      wuliuList:{
        // name:'',
        // code:''
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
        // wareStatus: [{ required: true, message: '请选择库区', trigger: 'change'}],
        // warePlaceStatus: [{ required: true, message: '请选择库位', trigger: 'change'}],
        // linkNan:[
        //   { required: true, pattern:/^[\u4e00-\u9fa5a-zA-Z]{0,50}$/ ,message: '请输入正确联系人', trigger: 'blur' }
        // ],
        //  pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]{0,40}$/,
        address:[
          { required: true,message: '请输入详细收货地址', trigger: 'blur' }
        ],
        // phone:[
        //   { required: true, pattern:/^1[3|5|7|8|]\d{9}$/,message: '请输入正确的手机号', trigger: 'blur' }
        // ],
        // postcode:[
        //   { required: true, pattern:/^\d{1,50}$/, message: '请输入正确的邮编', trigger: 'blur' }
        // ],
        // pinkage: [
        //   { required: true, pattern:/^\d{0,50}$/, trigger: 'blur', message:'请输入正确的金额' }
        // ],
        // pinkageStatus:[
        //   { required: true, message: '是否承担退货运费', trigger: 'change' }
        // ],
        // company: [
        //   { required: true, pattern:/^[\u4e00-\u9fa5]{0,40}$/,message: '请输入正确的物流公司', trigger: 'blur' }
        // ],
        // code: [
        //   { required: true, pattern:/^\d{0,50}$/, message: '请输入正确的物流单号', trigger: 'blur' }
        // ],
        // totalPrice: [
        //   {required: true, pattern:/^\d{0,50}$/ ,message: '请输入正确的退货总码洋', trigger: 'blur'}
        // ],
        // refundTotal: [
        //   {required: true, pattern:/^\d{0,50}$/ ,message: '请输入正确的退款总金额', trigger: 'blur'}
        // ]
      },
      storageForm:{
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
      receiverForm: {

      },
      pinkageText: ['否','是'],
      lastVal: '',
      refresh: 0,
      noteMap: {
        1: '客户原因退货（买错/买重/用不上/收件信息错误等）',
        2: '物流原因退货（物流异常）',
        3: '配货错误退货（错发/多发）',
        4: '包裹破损（外包装或内部损坏）',
        5: '书籍印刷问题',
        6: '书籍内容问题'
      },
      note: '',
      checkId:'',
      refundGoodsList:null
    }
  },
  mounted() {
    this.getList(this.$route.query.id)
    this.getStorageList()
  },
  methods: {
    openPic(val){
      window.open(`${this.domain}${requestPath.file}?fileName=${val}&isOnLine=true`)
    },
    handleRemove(file, fileList) {//文件相关
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {//文件相关
      this.dialogImageUrl = file.url;
      this.FileDialogVisible = true;
    },
    back(){
      this.$router.back();
    },
    getList(id) {
      this.orderInfoId = id
      orderDetailAPI(id).then(res => {
        if (res.data.status) {
          this.orderDetail = res.data.data
          if(this.orderDetail.status !== '未确认' && this.orderDetail.status !== '未审核'){
            this.inputController =true
          }
          this.orderGoods = res.data.data.infoList
          this.orderGoods.map((item,index) => {
            item.price = '¥' + item.price
            item.subtotal = '¥' + item.salePrice * item.num
            this.subtotal += item.salePrice * item.num
            this.bookNum += item.num
            item.salePrice = '¥' + item.salePrice
          })
          this.note = res.data.data.reason
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
          this.logisticsForm.company = res.data.data.expressCompany
          this.logisticsForm.code = res.data.data.trackingCode
          //退款总金额
          this.refundForm.totalPrice = res.data.data.totalPrice
          this.refundForm.refundTotal = res.data.data.refundTotal
          //图片
          for (let index = 1; index < 6; index++) {
            if (res.data.data[`cover${index}`]) {
              this.refundPic[`cover${index}`] = res.data.data[`cover${index}`]
            }
          }
          // console.log(Object.keys(this.refundPic));
          this.getOrderRemark()
        } else {
          errorMsg.apply(this, [ res.data, `获取退货单详情` ])
        }
      })
      getLogisticsAPI({oid:id}).then(res =>{
        if(res.data.code ===0){
          this.refundGoodsList = res.data.data
        }
      })
      getLogistListAPI().then(res=>{
        this.LogistList = res.data.data;
      })
    },
    getStorageList() {//获取库区
      wareListAPI().then(res => {
        if(res.data.code === 0){
          this.wareList = res.data.data
        } else {
          errorMsg.apply(this, [ res.data, `获取库区` ])
        }
      })
    },
    cancel(id) { //取消
      this.$confirm('是否确认取消订单？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        cancelAPI({oid:this.$route.query.id}).then(res => {
          requestMsg.apply(this,[res.data,'取消'])
          this.$router.back()
        })
      })
    },
    check(id) {//审核
      this.checkId = id
      this.checkVisible = true
    },
    reviewConfirm() {//审核
      if(this.reviewVal == '0'){//审核通过
        checkSucAPI({oid:this.checkId}).then(res => {
          res.data.status ? this.checkVisible = false : true
          requestMsg.apply(this,[res.data,'操作'])
        })
      } else{//审核不通过
        checkFailAPI({oid:this.checkId}).then(res => {
          res.data.status ? this.checkVisible = false : true
          requestMsg.apply(this,[res.data,'操作'])
        })
      }
    },
    storage(id) {//入库
      this.storageVisible = true
      // storageAPI({oid:id}).then(res => {
      //   requestMsg.apply(this,[res.data,'入库'])
      // })
    },
    submitDealOrder() {//提交
      this.$refs['receiverForm'].validate((valid) => {
        if(valid) {
          this.$refs['carriageForm'].validate((valid) => {
            if(valid) {
              // this.$refs['logisticsForm'].validate((valid) => {
              //   if(valid) {
                  this.$refs['refundForm'].validate((valid) => {
                    if(valid) {
                      let OrderInfo = {
                        address: this.receiverForm.address,//(string, optional): 详细地址 ,
                        expressCompany: this.wuliuList.name?this.wuliuList.name:this.logisticsForm.company, //(string, optional): 快递公司 ,
                        trackingCompanyCode: this.wuliuList.code, //(string, optional): 快递公司 ,
                        trackingCode: this.logisticsForm.code ,// (string, optional): 物流单号
                        freight: this.carriageForm.pinkage, // (number, optional): 运费退款 ,
                        id: this.orderInfoId, // (integer, optional): id ,
                        isFreight: this.carriageForm.pinkageStatus, // (string, optional): 是否承担退货运费 :0否 1是 ,
                        linkNan: this.receiverForm.linkNan, // (string, optional): 联系人 ,
                        phone: this.receiverForm.phone, // (string, optional): 联系电话 ,
                        postcode: this.receiverForm.postcode, // (string, optional): 邮编 ,
                        reason: this.note, // (string, optional): 退货原因 ,
                        refundTotal:  this.refundForm.refundTotal,//(number, optional), //: 退款总金额 ,
                        totalPrice: this.refundForm.totalPrice, // (number, optional): 退货总码洋 ,
                      }
                      console.log(OrderInfo)
                      changeOrderInfoAPI(OrderInfo).then(res => {
                        if (res.data.code === 0) {
                          this.$message.success('修改成功')
                          this.back()
                        } else{
                          this.$message.error('修改失败')
                        }
                      })
                    } else{
                      this.$message.error('请检查输入内容')
                    }
                  })
                // } else{
                //   this.$message.error('请检查输入内容')
                // }
              // })
            } else{
              this.$message.error('请检查输入内容')
            }
          })
        } else{
          this.$message.error('请检查输入内容')
        }
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
      this.refundForm.refundTotal = parseInt(this.subtotal) + parseInt(this.carriageForm.pinkage)
    },
    changeCarriage(val) {
      if(this.refresh == 0) {
          this.refresh = 1
      } else {
        this.refresh = 0
      }
    },
    addOrderRemark(){//添加
      remarkHistoryAPI({salesReturnId: this.orderInfoId, remark: this.newOrderRemark}).then((res) => {
        if (res.data.code === 0) {
          this.newOrderRemark = ''
          this.getOrderRemark()
        } else {
          errorMsg.apply(this, [ res.data, `添加备注历史` ])
        }
      })
    },
    getOrderRemark(){//tab详情
      getRemarkByIdAPI({salesReturnId:this.orderInfoId,pageNum:1,pageSize:9999}).then((res) => {//获取备注历史列表
        if (res.data.code === 0) {
          if(res.data.data){
            this.orderRemark = res.data.data.list
          }
        } else {
          errorMsg.apply(this, [ res.data, `获取备注历史` ])
        }
      })
      getStatusHisByIdAPI({id:this.orderInfoId,pageNum:1,pageSize:9999}).then(res => {//状态改变的历史列表
        if(res.data.code === 0) {
          if(res.data.data){
            this.statusHis = res.data.data.list
          }
        } else {
          errorMsg.apply(this, [ res.data, `获取状态变更历史` ])
        }
      })
    }
  }
}
</script>
