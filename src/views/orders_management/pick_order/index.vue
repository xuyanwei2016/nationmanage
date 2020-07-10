<template>
  <div class="app-container calendar-list-container"  v-loading="pushing"  element-loading-text="正在推送...">
    <div class="nav-buttons-container">
      <!-- <el-button icon="el-icon-circle-plus" @click="batchPushBs">批量推送百世</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchPushBsbtn') >= 0" @click="batchPushBs">
        {{authBtns.filter(i => i.idName=='batchPushBsbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchPushBsbtn').length>0 && authBtns.filter(i => i.idName=='batchPushBsbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchPushBsbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-document" @click="sendMessage">发短信</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('sendMessagebtn') >= 0" @click="sendMessage">
        {{authBtns.filter(i => i.idName=='sendMessagebtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='sendMessagebtn').length>0 && authBtns.filter(i => i.idName=='sendMessagebtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('sendMessagebtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-circle-plus" @click="exportExcel">导出明细清单</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('exportExcelbtn') >= 0" @click="exportExcel">
        {{authBtns.filter(i => i.idName=='exportExcelbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportExcelbtn').length>0 && authBtns.filter(i => i.idName=='exportExcelbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportExcelbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-circle-plus" @click="exportExcelTWo">导出汇总清单</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('exportExcelTWobtn') >= 0" @click="exportExcelTWo">
        {{authBtns.filter(i => i.idName=='exportExcelTWobtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportExcelTWobtn').length>0 && authBtns.filter(i => i.idName=='exportExcelTWobtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportExcelTWobtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>
    <transition-group name="custom-classes-transition" enter-active-class="animated">
      <el-form inline class="form-inline" :key="moreFilter">
        <el-form-item label="配货单类型">
          <el-select v-model="listQuery.status">
            <el-option :value="null" label="全部"></el-option>
            <el-option :value="0" label="待发货"></el-option>
            <el-option :value="-1" label="推送失败"></el-option>
            <el-option :value="-2" label="发货失败"></el-option>
            <el-option :value="-3" label="用户拒收"></el-option>
            <el-option :value="1" label="已推送"></el-option>
            <el-option :value="2" label="已发货"></el-option>
            <el-option :value="3" label="已签收"></el-option>
            <el-option :value="4" label="已取消"></el-option>
            <el-option :value="-4" label="取消失败"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input  placeholder="订单号、配货单号" v-model="listQuery.orderCode" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="配货单号">
          <el-input  placeholder="配货单号" v-model="listQuery.code" clearable></el-input>
        </el-form-item> -->
        <template v-if="moreFilter" >
          <el-form-item label="下单会员">
            <el-input  placeholder="下单会员" v-model="listQuery.createrName" clearable></el-input>
          </el-form-item>
          <el-form-item label="书代号">
            <el-input  placeholder="书代号" v-model="listQuery.goodsAttr1" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input  placeholder="手机号" v-model="listQuery.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="收货人名">
            <el-input  placeholder="收货人名" v-model="listQuery.receiverName" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="timeRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="发货地区">
            <el-input  placeholder="发货地区" v-model="listQuery.address" clearable></el-input>
          </el-form-item>
          <el-form-item label="导出状态">
            <el-select v-model="listQuery.exportStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已导出" value="1"></el-option>
              <el-option label="未导出" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开票状态">
            <el-select v-model="listQuery.invoiceStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已开票" :value="1"></el-option>
              <el-option label="未开票" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否需要开发票">
            <el-select v-model="listQuery.needInvoice">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号">
            <el-input  placeholder="快递单号" v-model="listQuery.courierNumber" clearable></el-input>
          </el-form-item>
        </template>
        <!-- <template v-if="!moreFilter">
          <el-form-item label="综合搜索">
            <el-input placeholder="可输入配货单号、书代号、手机号" v-model="listQuery.conds" clearable class="once-search-input"></el-input>
          </el-form-item>
        </template> -->
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button @click="resetFilter">重置</el-button>
          <el-button @click="moreFilter = !moreFilter">{{moreFilter ? '简洁' : '更多' }}<i :class="moreFilter ? 'el-icon-arrow-up' : 'el-icon-arrow-down' "></i></el-button>
        </el-form-item>
      </el-form>
    </transition-group>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" ref="multipleTable"  v-show="!pushing">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column label="配货单号" align="center">
        <template slot-scope="scope">
          <router-link class="bookLink" v-if="true" :to="{path: 'pick_order/pick_processing', query: {id: scope.row.id}}">{{scope.row.code}}</router-link>
          <span v-else>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人姓名" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.receiverName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单会员" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否开票" align="center">
        <template slot-scope="scope">
          <span>{{invoiceText[scope.row.needInvoice]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="配货单状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否导出" align="center">
        <template slot-scope="scope">
          <span>{{exportText[scope.row.exportStatus]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageLocation}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际运费" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.carriage}}</span>
        </template>
      </el-table-column>
      <el-table-column label="配货单日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width operationBtns" label="操作" align="center">
        <template slot-scope="scope">
          <ul style="padding:0;">
            <li style="">
              <!-- <router-link :to="{path: 'pick_order/pick_processing', query: {id: scope.row.id}}">配货单处理</router-link> -->
            <router-link :to="{path:`pick_order/pick_processing`, query: {id: scope.row.id}}" v-if="authBtns.filter(i => i.idName=='pickbtn').length > 0">{{authBtns.filter(i => i.idName=='pickbtn')[0].name}}
          </router-link>
            </li>
            <li v-if="(authBtns.map(i => i.idName).indexOf('pushBsbtn') >= 0)&&(scope.row.statusZh === '待发货' || scope.row.statusZh === '推送失败')"   @click="pushBs(scope.row.id)">{{authBtns.filter(i => i.idName=='pushBsbtn')[0].name}}</li>

            <li v-if="(authBtns.map(i => i.idName).indexOf('cancelbtn') >= 0)&&(scope.row.statusZh === '待发货' || scope.row.statusZh === '已推送' || scope.row.statusZh === '发货失败')" @click="cancel(scope.row.id,scope.row.status)">{{authBtns.filter(i => i.idName=='cancelbtn')[0].name}}</li>
            <li v-if="(authBtns.map(i => i.idName).indexOf('sendFailbtn') >= 0)&&(scope.row.statusZh === '推送失败')" @click="sendFail(scope.row.id)" >{{authBtns.filter(i => i.idName=='sendFailbtn')[0].name}}</li>
            <!-- <li v-if="scope.row.statusZh === '已推送' || scope.row.statusZh === '取消失败'" @click="pushBsSec(scope.row.id)">二次推送百世</li> -->
            <li v-if="(authBtns.map(i => i.idName).indexOf('cancelPushbtn') >= 0)&&(scope.row.statusZh === '取消失败')" @click="cancelPush(scope.row.id)">{{authBtns.filter(i => i.idName=='cancelPushbtn')[0].name}}</li>
            <li v-if="(authBtns.map(i => i.idName).indexOf('refusebtn') >= 0)&&(scope.row.statusZh === '已发货')" @click="refuse(scope.row.id)">{{authBtns.filter(i => i.idName=='refusebtn')[0].name}}</li>
            <li v-if="(authBtns.map(i => i.idName).indexOf('signbtn') >= 0)&&(scope.row.statusZh === '已发货')" @click="handleSign(scope.row.id)">{{authBtns.filter(i => i.idName=='signbtn')[0].name}}</li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .ib{
    display:inline-block;
  }
  .operationBtns ul li{
    text-align: center;
  }
</style>

<script>
import queryString from 'query-string'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import {
  sendMessageAPI, signInAPI,
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
  // getListFuzzyAPI
} from '@/api/order/pickorder';
import { operationMsg, requestMsg, confirm, errorMsg } from '@/utils/publicFunctions'
import { requestPath } from '@/utils/global'
import store from '@/store'

export default {
  data() {
    return {
      authBtns: [],
      navTree: [],
      options: [],
      popoverVisible: false,
      pushing:false,
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      statusHis:[],
      orderRemark:'',
      newOrderRemark:'',
      orderInfoId:0,
      receiverForm:{
      },
      rules:{
        consigneeName:[
          { required: true, pattern:/^[\u4e00-\u9fa5]{2,5}$/,message: '请输入正确的收货人', trigger: 'blur' }
        ],
        address:[
          { required: true, pattern:/^[\u4e00-\u9fa5]{2,40}$/,message: '请输入正确的地址', trigger: 'blur' }
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
      orderGoods:{},
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
      dialogVisible:false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      moreFilter:false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        categoryCode: null,
        invoiceStatus: null,
        needInvoice:null,
        exportStatus: null,
        status: null
      },
      multipleSelection: [],
      multipleSelectionIDs:[],
      textMap: {
        update: '修改库区',
        create: '添加库区'
      },
      invoiceText:['否','是'],
      exportText: ['未导出','已导出'],
      timeRange: [],
      listStatus: '',
    }
  },
created() {
  this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
},
  mounted() {
    if( ifUndefined(store.getters.pick_orderSerKeys.pageNum) ){
      this.listQuery = store.getters.pick_orderSerKeys
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeRange[0] = this.listQuery.startTime
        this.timeRange[1] = this.listQuery.endTime
      }
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.getList()
  },
  watch:{
    moreFilter:function(){
      this.listQuery.conds = undefined
      // this.resetFilter()
    }
  },
  methods: {
    handleSign(id) {
      signInAPI({ids: [id]}).then(res => {
        requestMsg.apply(this, [res.data, '签收'])
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
      if (paramStr) {
        window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export/list-detail?${paramStr}`)
      } else {
        window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export/list-detail`)
      }
      // paramStr ? window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export-all?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export-all`)
    },
    exportExcelTWo(){//汇总清单
      let {pageNum, pageSize, ...params} = this.listQuery
      let tempParams = {}
      for (const key in params) {
        if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
          tempParams[key] = params[key]
        }
      }
      let paramStr = queryString.stringify(tempParams)
      if (paramStr) {
        window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export-all?${paramStr}`)
      } else {
        window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export-all`)
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
    pushBs(id) {//推送百世
      confirm.apply(this,['确定要推送百世吗？']).then(() => {

        pushBsAPI([id]).then(res => {
          if (res.data.status) {
            if (res.data.data) {
              this.$notify.error({
                title: '失败',
                message: res.data.data,
                duration: 0
              })
            } else {
              this.$message.success('批量推送百世成功')
            }
            this.getList()
          } else {
            errorMsg.apply(this, [ res.data, `批量推送百世` ])
          }
        })
      })
    },
    cancel(id,statusd) {//取消配货单
      this.$confirm('确认取消配货单？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        cancelAPI({ids:[id],status:statusd.toString()}).then(res => {
          requestMsg.apply(this,[res.data,'取消'])
        })
      })
    },
    sendFail(id) {//发送失败
      sendFailAPI({ids:[id]}).then(res => {
        requestMsg.apply(this,[res.data,'操作'])
      })
    },
    pushBsSec(id) {//二次推送百世
      confirm.apply(this,['确定要二次推送百世吗？']).then(() => {
        pushBsAPI([id]).then(res => {
          requestMsg.apply(this,[res.data,'二次推送百世'])
        })
      })
    },
    cancelPush(id) {//取消推送
      cancelPushAPI({ids:[id]}).then(res => {
        requestMsg.apply(this,[res.data,'取消推送'])
      })
    },
    refuse(id) {//拒收
      confirm.apply(this,['确定要拒收吗？']).then(() => {
        refushAPI({ids:[id]}).then(res => {
          console.log(res)
          requestMsg.apply(this,[res.data,'拒收'])
        })
      })
    },
    batchPushBs() {//批量推送百世
      if(this.isSelected()){

        confirm.apply(this,['确定推送百世吗？']).then(() => {
          this.pushing = true
          pushBsAPI(this.multipleSelectionIDs).then(res => {
            // requestMsg.apply(this,[res.data,'推送百世'])
            if (res.data.status) {
              if (res.data.data) {
                this.$notify.error({
                  title: '失败',
                  message: res.data.data,
                  duration: 0
                })
              } else {
                this.$message.success('批量推送百世成功')
              }

            } else {
              errorMsg.apply(this, [ res.data, `批量推送百世` ])
            }
            this.pushing = false
            this.getList()
          })
        })
      }
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
      this.listQuery.pageNum = 1
      store.dispatch('SetPickOrderSerKey',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      if(Object.prototype.toString.call(this.listQuery.conds) !== '[object Undefined]'){
        this.getListFuzzy()
      }else{
        if (this.timeRange) {
          this.listQuery.startTime = this.timeRange[0]
          this.listQuery.endTime = this.timeRange[1]
        } else {
          this.listQuery.startTime = null
          this.listQuery.endTime = null
        }
      }
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        categoryCode: null,
        invoiceStatus: null,
        needInvoice:null,
        exportStatus: null,
        status: null,
        pageSize: this.listQuery.pageSize
      }
      this.timeRange = null
      this.getList()
    },
    sendMessage(){
      if(this.isSelected()){
        this.$prompt('发送短信给已选订单', '发送短信', {
          confirmButtonText: '发送',
          cancelButtonText: '取消',
          inputPattern: /^.{1,100}$/,
          inputErrorMessage: '不能为空,100字以内',
          inputType:'textarea'
        }).then(value => {
          sendMessageAPI({
            orderIds: this.multipleSelectionIDs,
            content: value.value
          }).then(res => {
            if (res.data.code === 0) {
              this.$message.success(`短信内容： ${value.value} 发送成功`)
            } else {
              errorMsg.apply(this, [ res.data, `短信发送` ])
            }
          })
        })
      }
    },
    // orderStatus(status){
    //   this.listQuery.status = status
    // },
    // getListFuzzy(){
    //   this.listLoading = true
    //   getListFuzzyAPI(this.listQuery).then(res => {
    //     if(res.data.code === 0){
    //       this.list = res.data.data.list
    //       this.total = res.data.data.total
    //     } else {
    //       this.$message.error('获取数据失败');
    //     }
    //     this.listLoading = false
    //   })
    // },
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
