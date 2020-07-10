<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <router-link :to="{path: 'print', query: {id: $route.query.id}}"><el-button icon="el-icon-printer">打印页面</el-button></router-link>
    </div>
    <h3>基础信息：</h3>
    <el-form ref="orderForm" :model="orderDetail" label-position="right" label-width="120px" class="order-form clearfix">
      <el-form-item label="订单编号：">{{orderDetail.orderCode}}</el-form-item>
      <el-form-item label="配货单号：">{{orderDetail.code}}</el-form-item>
      <el-form-item label="下单会员：">{{orderDetail.createrName}}</el-form-item>
      <el-form-item label="实际运费：">{{orderDetail.carriage}}</el-form-item>
      <el-form-item label="配货单状态：">{{orderDetail.statusZh}}</el-form-item>
      <el-form-item label="导出状态：">{{exportText[orderDetail.exportStatus]}}</el-form-item>
    </el-form>

    <p class="divider"></p>
    <h3>物流信息：</h3>
    <el-form ref="logisticsForm" :model="orderDetail" label-position="right" label-width="120px" class="order-form clearfix">
      <el-form-item label="物流公司：">{{orderDetail.distributionMode}}</el-form-item>
      <el-form-item label="物流编号：">{{orderDetail.courierNumber}}</el-form-item>
    </el-form>

    <p class="divider"></p>
      <h3>订单商品信息：</h3>
      <el-table :data="orderGoods" border highlight-current-row stripe>
        <el-table-column prop="goodsAttr1" label="书代号"></el-table-column>
        <el-table-column prop="name" label="商品名称">
          <template slot-scope="scope">
            <a class="bookLink" :href="`/#/bookItem?id=${scope.row.goodsid}`" target="_blank">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column prop="price" label="定价"></el-table-column>
        <el-table-column prop="discount" label="折扣值"></el-table-column>
        <el-table-column prop="salePrice" label="售价"></el-table-column>
        <el-table-column prop="subtotal" label="小计"></el-table-column>
        <el-table-column prop="goodsAttr7" label="所属套餐"></el-table-column>
      </el-table>
      <p style="text-align:right">商品总金额 <span style="color:red;font-size:20px">{{subtotal}}</span> 元,运费<span style="color:red;font-size:20px">{{orderDetail.carriage}}</span> 元,订单总金额<span style="color:red;font-size:20px">{{orderDetail.sumPrice}}</span> 元</p>

    <p class="divider"></p>
    <h3>收货人信息：</h3>
    <el-form :model="receiverForm" ref="receiverForm" label-position="right" label-width="120px" style="width:70%" :rules="rules">
      <el-form-item label="收货人：" class="inline-block" prop="consigneeName">
        <el-input v-model="receiverForm.consigneeName" :disabled="inputDisabled"></el-input>
      </el-form-item>
      <el-form-item label="省市：">
        <el-select v-model="cities.sheng" @change="choseProvince" placeholder="省级地区" :disabled="inputDisabled">
          <el-option v-for="item in cities.province" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="cities.shi" @change="choseCity" placeholder="市级地区" :disabled="inputDisabled">
          <el-option v-for="item in cities.shi1" :key="item.id" :label="item.value" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="cities.qu" @change="choseBlock" placeholder="区级地区" :disabled="inputDisabled">
          <el-option v-for="item in cities.qu1" :key="item.id" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址：" prop="address">
        <el-input v-model="receiverForm.address" :disabled="inputDisabled"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone" class="inline-block">
        <el-input v-model="receiverForm.phone" :disabled="inputDisabled"></el-input>
      </el-form-item>
      <el-form-item label="固定电话：" class="inline-block">
        <el-input v-model="receiverForm.tel" :disabled="inputDisabled"></el-input>
      </el-form-item>
      <el-form-item label="客户备注：">
        <el-input type="textarea" v-model="receiverForm.remarks" :autosize="{ minRows: 4}" :disabled="inputDisabled"></el-input>
      </el-form-item>
    </el-form>

    <p class="divider"></p>
    <div style="width:1000px;margin:0 auto;">
      <el-tabs type="border-card">
        <el-tab-pane label="备注历史">
          <div style="overflow-y:scroll;width:900px;height:200px;padding:20px 40px;">
            <div v-for="remark in orderRemark" :key="remark.id">
              <div>
                <h4><span>记录人：{{remark.createrName}}</span> <b style="float:right">记录时间：{{remark.createTime}}</b></h4>
                <p>{{remark.operationContent}}</p>
              </div>
              <p class="divider"></p>
            </div>
            <el-form>
              <el-form-item label="新备注：">
                <el-input type="textarea" v-model="newOrderRemark" row="5"></el-input>
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
        <el-tab-pane label="配货物流信息" v-if="listStatus == 2 || listStatus == 3">
          <el-table :data="logisticsList">
            <el-table-column prop="context" label="物流详情"></el-table-column>
            <el-table-column prop="ftime" label="时间"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="短信单列表">
          <el-table :data="orderBlankPhoneloglist">
            <el-table-column prop="code"  label="订单编号"></el-table-column>
                          <el-table-column label="订单状态">
              <template slot-scope="scope">
                <span v-if="scope.row.orderStatus ==0">待支付</span>
                <span v-if="scope.row.orderStatus ==1">已支付</span>
                <span v-if="scope.row.orderStatus ==2">已确认</span>
                <span v-if="scope.row.orderStatus ==3">待发货</span>
                <span v-if="scope.row.orderStatus ==4">配货中</span>
                <span v-if="scope.row.orderStatus ==5">待收货</span>
                <span v-if="scope.row.orderStatus ==6">已完成</span>
                <span v-if="scope.row.orderStatus ==7">缺货</span>
                <span v-if="scope.row.orderStatus ==8">已退货</span>
                <span v-if="scope.row.orderStatus ==9">已取消</span>
                <span v-if="scope.row.orderStatus ==10">已拒收</span>
                <span v-if="scope.row.orderStatus ==-1">已删除</span>
                <span v-if="scope.row.orderStatus ==11">退款中</span>
                <span v-if="scope.row.orderStatus ==12">已退款</span>
                <span v-if="scope.row.orderStatus ==13">退货中</span>
              </template>
            </el-table-column>
            <el-table-column label="配货单状态">
              <template slot-scope="scope">
                <span v-if="scope.row.orderBlankStatus ==0">待发货</span>
                <span v-if="scope.row.orderBlankStatus ==-1">推送失败</span>
                <span v-if="scope.row.orderBlankStatus ==-2">发货失败</span>
                <span v-if="scope.row.orderBlankStatus ==-3">拒收</span>
                <span v-if="scope.row.orderBlankStatus ==1">已推送</span>
                <span v-if="scope.row.orderBlankStatus ==2">已发货</span>
                <span v-if="scope.row.orderBlankStatus ==3">已签收</span>
                <span v-if="scope.row.orderBlankStatus ==4">已取消</span>
                <span v-if="scope.row.orderBlankStatus ==-4">取消失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime"  label="操作时间"></el-table-column>
            <el-table-column prop="creater"  label="操作人"></el-table-column>
            <el-table-column prop="content"  label="短信内容"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <div slot="footer" class="dialog-footer footer-margin">
      <el-button @click="$router.back()" v-if="listStatus === -2 || listStatus === 2 || listStatus === 3 || listStatus ===-3">关闭</el-button>
      <template v-else>
        <el-button type="primary" @click="submitDealOrder">确认</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </template>
    </div>

  </div>
</template>

<script>
import { getMultipleSelectionIDs } from '@/filters/getIds'
import {sendMessageAPI,
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
        changeOrderInfoAPI, 
        getListFuzzyAPI, 
        getLogisticsByIdAPI,
        getorderBlankPhoneloglistAPI, 
        express100 
} from '@/api/order/pickorder';
import axios from 'axios'
import { operationMsg, requestMsg, confirm, errorMsg } from '@/utils/publicFunctions'

export default {
  data() {
    return {
      inputDisabled:false,//控制是否可以修改该
      distributionList:[], //配货单列表
      orderBlankPhoneloglist:[],  //短信列表
      statusHis:[],
      orderAmount:0,  //订单总金额
      orderRemark:'',
      newOrderRemark:'',
      orderInfoId:0,
      receiverForm:{
      },
      rules:{
        consigneeName:[
          { required: true, pattern:/^[A-Za-z0-9\u4e00-\u9fa5]{2,10}$/,message: '请输入正确的收货人', trigger: 'blur' }
        ],
        address:[
          { required: true, pattern:/^[A-Za-z0-9\u4e00-\u9fa5]{2,40}$/, message: '请输入正确的地址', trigger: 'blur' }
          
        ],
        phone:[
          { required: true, pattern:/^1[3|5|7|8|]\d{9}$/,message: '请输入正确的手机号', trigger: 'blur' }
        ],
        tel:[
          { required: true, pattern:/^\d{11}$/,message: '请输入正确的电话号码', trigger: 'blur' }
        ],
        mail:[
          {
            required:false, pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,message:'请输入正确的Email', trigger:'blur'
          }
        ],
        title:[
            {
              required:false, pattern:/^.{4,50}$/,message:'请输入正确的抬头', trigger:'blur'
            }
        ],
        identity:[
            {
              required:false,pattren:/^.{10,40}$/,message:'请输入正确的识别号', trigger:'blur'
            }
        ]
      },
      mapJson: '../src/utils/map.json', //mapJson,//'{"110000":"北京市"}',
      bookNum:0,
      subtotal:0,
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
      logisticsList:[],
      moreFilter:false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        orderType:''
      },
      multipleSelection: [],
      multipleSelectionIDs:[],
      textMap: {
        update: '修改库区',
        create: '添加库区'
      },
      invoiceText:['否','是'],
      exportText: ['未导出','已导出'],
      listStatus: '',
    }
  },
  mounted() {
    this.getList(this.$route.query.id)
    this.getCityData()
    this.getOrderRemark();
  },
  methods: {
    getList(id) {//根据id 获取详情数据
      this.orderInfoId = id;
      orderDetailAPI(id).then(res => {
        if (res.data.status) {
          this.subtotal = 0
          this.bookNum = 0
          this.orderDetail = res.data.data
          if(this.orderDetail.status === -3 ||this.orderDetail.status === -2 ||this.orderDetail.status === 2 ||this.orderDetail.status === 3 ||this.orderDetail.status === 4 ){
            this.inputDisabled = true
          }
          if(!this.orderDetail.carriage){
          this.orderDetail.carriage = 0
          }
          this.orderGoods = res.data.data.list
          this.listStatus = res.data.data.status
          this.listCode = res.data.data.code
          if(res.data.data.list.length > 0){
            this.orderGoods.map((item,index) => {
              item.price = '¥' + item.price
              item.subtotal = '¥' + item.salePrice * item.num
              this.subtotal += item.salePrice * item.num
              this.orderAmount  =   parseFloat(this.subtotal) + parseFloat(this.orderDetail.carriage)       //订单总金额
              this.bookNum += item.num
              item.salePrice = '¥' + item.salePrice
            })
          }
          // if(this.listStatus === -2 || this.listStatus === 2 || this.listStatus === 3 || this.listStatus ===-3){//有个人信息
            this.receiverForm.address = res.data.data.address 
            this.receiverForm.consigneeName = res.data.data.receiverName  
            this.receiverForm.remarks = res.data.data.remarks
            this.receiverForm.phone = res.data.data.phone 
            this.receiverForm.tel = res.data.data.tel 
            this.cities.qu =  res.data.data.area 
            this.cities.shi =res.data.data.city 
            this.cities.sheng = res.data.data.province
          // }
          this.getOrderRemark()
          getorderBlankPhoneloglistAPI({code:this.orderDetail.code}).then(res=>{
              res.data.status ? this.orderBlankPhoneloglist = res.data.data : errorMsg.apply(this, [ res.data, `查询短信列表` ])
          })
        } else {
          errorMsg.apply(this, [ res.data, `获取配货单详情` ])
        }
      })
    },
    addOrderRemark(){//添加
      remarkHistoryAPI({id:this.orderInfoId.toString() , remark: this.newOrderRemark}).then((res) => {
        if (res.data.code === 0) {
          this.newOrderRemark = ''
          this.getOrderRemark()
        } else {
          errorMsg.apply(this, [ res.data, `添加备注历史` ])
        }
      })
    },
    getOrderRemark(){//tab详情
      getRemarkByIdAPI({orderBlankId:this.orderInfoId,pageNum:1,pageSize:9999}).then((res) => {//获取备注历史列表
        res.data.status ? this.orderRemark = res.data.data.list : errorMsg.apply(this, [ res.data, `查询备注历史列表` ])
      })
      getStatusHisByIdAPI({orderBlankId:this.orderInfoId,pageNum:1,pageSize:9999}).then(res => {//状态改变的历史列表
        res.data.status ? this.statusHis = res.data.data.list : errorMsg.apply(this, [ res.data, `查询状态改变历史列表` ])
      })
      if (this.listStatus == 2 || this.listStatus == 3) {
        express100({"company": this.orderDetail.distributionMode, "number": this.orderDetail.courierNumber}).then(res=>{
          res.data.status ? this.logisticsList = res.data.data : errorMsg.apply(this, [ res.data, `获取配货单物流信息` ])
        })
      }

    },
    submitDealOrder(){
      this.$refs['receiverForm'].validate((valid) => {
        if (valid) {
          let OrderInfo = {
            address:this.receiverForm.address, // (string, optional): 详细地址 ,
            area:this.cities.qu, // (string, optional): 区 ,
            city:this.cities.shi, // (string, optional): 市 ,
            receiverName:this.receiverForm.consigneeName, // (string, optional): 收货人名字 ,
            id:this.orderInfoId, // (integer, optional): 订单id ,
            remarks:this.receiverForm.remarks, // (string, optional): 备注 ,
            phone:this.receiverForm.phone, // (string, optional): 手机号码 ,
            province:this.cities.sheng, // (string, optional): 省 ,
            tel:this.receiverForm.tel, // (string, optional): 固定电话
            //distributionMode (string, optional): 物流公司 （配送方式） ,
            status: this.listStatus, //status (integer, optional): 配货单状态 ,
            code: this.listCode, //code (string, optional): 配货单号 ,
          }
          changeOrderInfoAPI(OrderInfo).then(res => {
            if (res.data.code === 0) {
              this.$message.success('修改成功')
              this.$router.back();
            } else{
              this.$message.error('修改失败')
            }
          })
        }else{
          this.$message.error('请检查输入内容')
        }
      })
    },
    // 加载china地点数据，三级
    getCityData:function(){
      axios.get(this.mapJson).then((response)=>{
        if (response.status==200) {
          var data = response.data
          this.cities.province = []
          this.cities.city = []
          this.cities.block = []
          // 省市区数据分类
          for (var item in data) {
            if (item.match(/0000$/)) {//省
              this.cities.province.push({id: item, value: data[item], children: []})
            } else if (item.match(/00$/)) {//市
              this.cities.city.push({id: item, value: data[item], children: []})
            } else {//区
              this.cities.block.push({id: item, value: data[item]})
            }
          }
          // 分类市级
          for (var index in this.cities.province) {
            for (var index1 in this.cities.city) {
              if (this.cities.province[index].id.slice(0, 2) === this.cities.city[index1].id.slice(0, 2)) {
                this.cities.province[index].children.push(this.cities.city[index1])
              }
            }
          }
          // 分类区级
          for(var item1 in this.cities.city) {
            for(var item2 in this.cities.block) {
              if (this.cities.block[item2].id.slice(0, 4) === this.cities.city[item1].id.slice(0, 4)) {
                this.cities.city[item1].children.push(this.cities.block[item2])
              }
            }
          }
        } else {
          console.log(response.status)
        }
      }).catch(function(error){console.log(typeof+ error)})
    },
    // 选省
    choseProvince:function(e) {
      for (var index2 in this.cities.province) {
        if (e === this.cities.province[index2].id) {
          this.cities.shi1 = this.cities.province[index2].children
          this.cities.shi = this.cities.province[index2].children[0].value
          this.cities.qu1 =this.cities.province[index2].children[0].children
          this.cities.qu = this.cities.province[index2].children[0].children[0].value
          this.E = this.cities.qu1[0].id
        }
      }
    },
    // 选市
    choseCity:function(e) {
      for (var index3 in this.cities.city) {
        if (e === this.cities.city[index3].id) {
          this.cities.qu1 = this.cities.city[index3].children
          this.cities.qu = this.cities.city[index3].children[0].value
          this.E = this.cities.qu1[0].id
        }
      }
    },
    // 选区
    choseBlock:function(e) {
      this.E=e;
    }
  }
}
</script>
