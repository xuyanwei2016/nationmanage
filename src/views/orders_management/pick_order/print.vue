<template>
  <!--startprint-->
  <div class="app-container calendar-list-container">
    <div class="print-btns">
      <el-button icon="el-icon-back" @click="$router.back()">返回</el-button>
      <el-button icon="el-icon-printer" @click="doPrint">打印</el-button>
    </div>

    <div class="print-content">
      <h3 style="text-align:center;font-size:18px; font-weight: normal">中国人事考试图书网配货单</h3>
      <p style="text-align: right;margin-right: 0px; font-size: 14px;">订单编号：{{orderDetail.orderCode}}</p>

      <table class="printOrder">
        <tr>
          <td align="left">收货人：{{orderDetail.receiverName}}</td>
          <td align="left" colspan="2">{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.area}}</td>
        </tr>
        <tr>
          <td colspan="3">详细地址：{{orderDetail.address}}</td>
        </tr>
        <tr>
          <td align="left">邮编</td>
          <td align="left">手机号{{orderDetail.phone}}</td>
        </tr>
        <tr>
          <td colspan="3">留言：{{orderDetail.remarks}}</td>
        </tr>
        <tr>
          <td align="left">总重量：{{orderDetail.sumWeight}}Kg</td>
          <td align="left">运费：￥{{orderDetail.carriage}}</td>
        </tr>
        <tr>
          <td colspan="3">发票抬头：{{orderDetail.invoiceTitle}}</td>
        </tr>
      </table>
      <table class="printOrder orderGood">
        <tr>
          <th style="width:200px">书代号</th>
          <th style="width:450px">商品名称</th>
          <th style="width:120px">定价</th>
          <th style="width:120px">数量</th>
          <th style="width:120px">售价</th>
        </tr>
        <tr v-for="(order,index) in orderGoods" :key="index">
          <td>{{order.goodsAttr1}}</td>
          <td>{{order.name}}</td>
          <td>{{order.price}}</td>
          <td>{{order.num}}</td>
          <td>{{order.salePrice}}</td>
        </tr>
      </table>


      <!--<el-table class="eltable" :data="orderGoods" border>
        <el-table-column prop="goodsAttr1" label="书代号" align="center" width="250"></el-table-column>
        <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="price" label="定价" align="center" width="150"></el-table-column>
        <el-table-column prop="num" label="数量" align="center" width="150"></el-table-column>
        <el-table-column prop="salePrice" label="售价" align="center" width="150"></el-table-column>
      </el-table>-->
      <p style="text-align:right">运费  <span style="color:red;font-size:14px">{{orderDetail.carriage}}</span>
        元,商品金额  <span style="color:red;font-size:14px">{{subtotal}}</span> 元,订单金额  <span
          style="color:red;font-size:14px">{{orderAmount}}</span> 元</p>
    </div>

  </div>
  <!---endprint-->
</template>

<script>
  import {getMultipleSelectionIDs} from '@/filters/getIds'
  import {
    sendMessageAPI,
    getListAPI,
    cancelAPI,
    sendFailAPI,
    cancelPushAPI,
    pushBsAPI,
    refushAPI,
    orderDetailAPI,
    getStatusHisByIdAPI,
    getRemarkByIdAPI,
    remarkHistoryAPI,
    getRationByIdAPI,
    changeOrderInfoAPI,
    getListFuzzyAPI,
    getLogisticsByIdAPI
  } from '@/api/order/pickorder';
  import axios from 'axios'
  import {operationMsg, requestMsg, confirm} from '@/utils/publicFunctions'


  export default {
    data() {
      return {
        inputDisabled: false,//控制是否可以修改该
        distributionList: [], //配货单列表
        statusHis: [],
        orderRemark: '',
        newOrderRemark: '',
        orderInfoId: 0,
        receiverForm: {},
        mapJson: '../src/utils/map.json', //mapJson,//'{"110000":"北京市"}',
        bookNum: 0,
        subtotal: 0,
        orderAmount: 0,
        orderGoods: [],
        orderDetail: {},
        cities: {
          province: [],
          sheng: [],
          shi: [],
          shi1: [],
          qu: [],
          qu1: [],
          city: [],
          block: [],
        },
        dialogVisible: false,
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        logisticsList: [],
        moreFilter: false,
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          orderType: ''
        },
        multipleSelection: [],
        multipleSelectionIDs: [],
        textMap: {
          update: '修改库区',
          create: '添加库区'
        },
        invoiceText: ['否', '是'],
        exportText: ['未导出', '已导出'],
        listStatus: '',
      }
    },
    mounted() {
      this.getList(this.$route.query.id)
    },
    methods: {
      getList(id) {//根据id 获取详情数据
        this.orderInfoId = id;
        orderDetailAPI(id).then(res => {
          this.subtotal = 0
          this.bookNum = 0
          this.orderDetail = res.data.data
          if (!this.orderDetail.carriage) {
            this.orderDetail.carriage = 0
          }
          if (this.orderDetail.status === -3 || this.orderDetail.status === -2 || this.orderDetail.status === 2 || this.orderDetail.status === 3 || this.orderDetail.status === 4) {
            this.inputDisabled = true
          }
          this.orderGoods = res.data.data.list
          this.listStatus = res.data.data.status
          this.listCode = res.data.data.code
          if (res.data.data.list.length > 0) {
            this.orderGoods.map((item, index) => {
              item.price = '¥' + item.price
              this.subtotal += item.salePrice * item.num
              item.subtotal = '¥' + item.salePrice * item.num
              this.orderAmount = parseFloat(this.subtotal) + parseFloat(this.orderDetail.carriage)       //订单总金额
              this.bookNum += item.num
              item.salePrice = '¥' + item.salePrice   //给售价 + ￥
            })
          }
          // if(this.listStatus === -2 || this.listStatus === 2 || this.listStatus === 3 || this.listStatus ===-3){//有个人信息
          //   this.receiverForm.address = res.data.data.address
          //   this.receiverForm.consigneeName = res.data.data.receiverName
          //   this.receiverForm.note = res.data.data.remarks
          //   this.receiverForm.phone = res.data.data.phone
          //   this.receiverForm.tel = res.data.data.tel
          //   this.cities.qu = res.data.data.area
          //   this.cities.shi = res.data.data.city
          //   this.cities.sheng = res.data.data.province
          // }
          this.dialogVisible = true
        })
      },
      doPrint() {
        window.print()
      }
    }
  }
</script>

<style>
  .printOrder td {
    font-size: 14px;
    padding: 0px 0px 0px 10px;
    font-weight: normal;
  }

  .el-table td, .el-table th {
    /*padding: 3px 0;*/
  }

  @media print {
    .sidebar-container, .navbar, .print-btns {
      display: none;
    }

    .print-content {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
    }

    .eltable {
      width: 100%;
      border-color: #ccc;
    }

    .eltable .el-table__header {
      width: 100% !important;
      padding-left: 1px !important;
    }

    .eltable .el-table__header col:nth-child(1) {
      width: 20% !important;

    }

    .eltable .el-table__header col:nth-child(2) {
      width: 40% !important;
    }

    .eltable .el-table__header col:nth-child(3) {
      width: 13% !important;
    }

    .eltable .el-table__header col:nth-child(4) {
      width: 13% !important;
    }

    .eltable .el-table__header col:nth-child(5) {
      width: 14% !important;
    }

    .eltable .el-table__body {
      width: 100% !important;
    }

    .eltable .el-table__body col:nth-child(1) {
      width: 20% !important;
    }

    .eltable .el-table__body col:nth-child(2) {
      width: 40% !important;
    }

    .eltable .el-table__body col:nth-child(3) {
      width: 13% !important;
    }

    .eltable .el-table__body col:nth-child(4) {
      width: 13% !important;
    }

    .eltable .el-table__body col:nth-child(5) {
      width: 14% !important;
    }

  }

  .orderGood {
    font-size: 14px;
    font-weight: normal !important;
    line-height: 22px;
    text-align: center;
    border-color: #ddd;
    margin-bottom: 15px !important;
  }

  .orderGood tr td {
    padding: 8px;
    line-height: 22px;
    color: #606266;
  }

  .orderGood tr:nth-child(1) {
    height: 40px;
    line-height: 40px;
    color: #909399;
    background: #f5f6fa;
  }
</style>

