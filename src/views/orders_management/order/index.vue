<template>
  <div class="app-container calendar-list-container">
    <transition-group name="custom-classes-transition" enter-active-class="animated">
      <el-form inline class="form-inline" :key="formValue">
        <el-form-item label="订单编号">
          <el-input v-model="listQuery.code" clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('code')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="listQuery.createrName" clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('code')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="listQuery.status">
            <el-option :value="null" label="全部"></el-option>
            <el-option v-for="(value, key) in allStatus" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票状态">
          <el-select v-model="listQuery.invoiceStatus">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="已开" :value="1"></el-option>
            <el-option label="未开" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker v-model="timeRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </transition-group>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="订单号" min-width="170" align="center">
        <template slot-scope="scope">
          <router-link class="bookLink" v-if="true" :to="{path: 'order/order_processing', query: {id: scope.row.id}}">{{scope.row.code}}</router-link>
          <span v-else>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单用户名" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.payment?scope.row.payment.toFixed(2):'0.00'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="65" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" min-width="130" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单来源" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderSourceZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.payType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票" min-width="32" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.needInvoice == 1">是</span>
          <span v-else-if="scope.row.needInvoice == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column label="开票状态" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width operationBtns" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:`order/order_processing`, query: {id: scope.row.id}}" v-if="authBtns.filter(i => i.idName=='Orderprocessingbtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='Orderprocessingbtn')[0].icon" :title="authBtns.filter(i => i.idName=='Orderprocessingbtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='cancelOrderbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='cancelOrderbtn').length > 0)&&(scope.row.status == 0)" @click="cancelOrder(scope.row)" :title="authBtns.filter(i => i.idName=='cancelOrderbtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="sendValueVisible">
      <template v-if="dialogStatus === 'cancel'">
        <textarea type="textarea" placeholder="请填写说明，取消原因自动显示在备注历史中" style="width:98%;height:80px;resize:none" v-model="cancelTextarea"></textarea>
      </template>
      <template v-else-if="dialogStatus === 'sendMsg'">
        <el-container>
          <el-main>
            <h3>目标订单</h3>
            <el-table :data="sendList" border highlight-current-row stripe >
              <el-table-column label="订单号" prop="code" align="center"></el-table-column>
              <el-table-column label="电话" prop="phone" align="center"></el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination @current-change="handleSendMsgChange" :current-page="msgPageNum" :page-size="msgPageSize" layout="total, prev, pager, next" :total="msgTotal" align="center"></el-pagination>
            </div>
          </el-main>
          <el-aside width="200px">
            <br><h3>短信内容</h3>
            <el-input v-model="msgTextarea" type="textarea" placeholder="请输入短信内容，最多200字" :autosize="{ minRows: 10}"></el-input>
          </el-aside>
        </el-container>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOrderTrue" v-if="dialogStatus === 'cancel'">确 定</el-button>
        <el-button @click="sendMsgSubmit" v-if="dialogStatus === 'sendMsg'">确 定</el-button>
        <el-button @click="sendValueVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择退货商品" :visible.sync="returnFormVisible" width="70%">
      <el-table :data="returnGoodslist" border stripe ref="returnGoodsTable" @selection-change="handleReturnSelectionChange" v-loading="returnLoading" element-loading-text="请稍等" highlight-current-row>
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="商品名称" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="定价" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售价" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.salePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.num}}</span>
          </template>
        </el-table-column>
        <el-table-column label="可退数量" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.ddnum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="退货数量" width="200" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.returnNum" @change="numbersum(scope.row.returnNum,scope.row.id)" :step="1" :min="0" :max="scope.row.num"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="magintop">
        <el-col :span="5"><div class="reason">选择退货原因：</div></el-col>
        <el-col :span="19">
          <el-radio-group v-model="returnRadio">
            <el-radio label="1">客户原因退货（买错/买重/用不上/收件信息错误等）</el-radio><br>
            <el-radio label="2">物流原因退货（物流异常）</el-radio><br>
            <el-radio label="3">配货错误退货（错发/多发）</el-radio><br>
            <el-radio label="4">包裹破损（外包装或内部损坏）</el-radio><br>
            <el-radio label="5">书籍印刷问题</el-radio><br>
            <el-radio label="6">书籍内容问题</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row style="padding-top:25px; text-align:center">
        <el-button type="info" @click="submitReturnGoods">确定</el-button>
        <el-button type="info" @click="returnFormVisible = false">取消</el-button>
      </el-row>
    </el-dialog>

    <el-dialog :title="`输入查询的${textTitle[titleStatus]}`" :visible.sync="showTextVisible">
      <el-input type="textarea" v-model="Ttextarea" :autosize="{minRows: 6}" placeholder=""></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="submitText">确定</el-button>
        <el-button type="info" @click="showTextVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
  .el-radio:nth-child(n+2){
    margin-top: 15px;
  }
  .el-input-number{
    width: 150px;
  }
  .el-textarea__inner{
    height: 100%;
  }
  .magintop{
    margin-top: 20px
  }
</style>

<script>
import { getMultipleSelectionIDs } from '@/filters/getIds'
import {
  batchCancelOrderAPI, getNavAPI, getOptionAPI, getAllStatusAPI, refundAPI, rejectionAPI,
  batchConfirmOrderAPI,
  batchOrderPaidAPI,
  batchSoldOutAPI,
  batchSentAPI,
  genRationAPI,
  createinvoiceAPI,
  remarkHistoryAPI,
  returnPostGoods,
  sendMessageAPI,
  getListAPI,
  orderDetailAPI,
  sumSendinvoiceAPI
} from '@/api/order/order';
// import { mapJson } from '@/utils/map'
import axios from 'axios'
import { operationMsg, requestMsg, errorMsg, confirm } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  data() {
    return {
      finishStatus: ['未完成','部分完成','全部完成'],
      authBtns: [],
      msgTextarea: null,
      msgTotal: 0,
      msgPageSize: 10,
      msgPageNum: 1,
      sendList: [],
      returnLoading: true,
      multiReturnIds: [],
      multiReturnSelection: [],
      allStatus: null,
      navTree: [],
      options: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      popoverVisible: false,
      sendValueVisible:false,
      showTextVisible: false,
      titleStatus: '',
      Ttextarea:'',
      textTitle: {
        code: '订单号',
        bookcode: '书代号'
      },
      orderInfoId:0,
      rules:{
        consigneeName:[{ required: true, pattern:/^[\u4e00-\u9fa5]{2,5}$/,message: '请输入正确的收货人', trigger: 'blur' }],
        address:[{ required: true, pattern:/^[\u4e00-\u9fa5]{2,40}$/,message: '请输入正确的地址', trigger: 'blur' }],
        phone:[{ required: true, pattern:/^1[3|5|7|8|]\d{9}$/,message: '请输入正确的手机号', trigger: 'blur' }],
        tel:[{ required: true, pattern:/^\d{11}$/,message: '请输入正确的电话号码', trigger: 'blur' }],
        mail:[{ required:false, pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,message:'请输入正确的Email', trigger:'blur'}],
        title:[{ required:false, pattern:/^.{4,50}$/,message:'请输入正确的抬头', trigger:'blur' }],
        identity:[{ required:false,pattren:/^.{10,40}$/,message:'请输入正确的识别号', trigger:'blur' }]
      },
      returnFormVisible: false,  //退货弹框控制器
      returnGoodslist:[],  //退货商品列表
      tableKey: 0,
      cancelTextarea:'',
      list: null,
      orderObj: {},
      total: null,
      thisorderId:null,
      listLoading: true,
      formValue:false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        categoryCode: null,
        orderSource: null,
        invoiceStatus: null,
        payType: null,
        needInvoice: null,
        hasMessage: null,
        isDownload: null,
        orderAscription: null,
        status: null,
        phone:null            //手机号查询
      },
      multipleSelection: [],//选中的数字
      multipleSelectionIDs:[],//选中的id
      textMap: {
        cancel: '取消订单',
        sendMsg: '发送短信'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      timeRange: [],
      returnRadio: '1'
    }
  },
  watch: {
    sendValueVisible: function () {
    this.msgTextarea = ''
    }
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    if( ifUndefined(store.getters.orderSerKeys.pageNum) ){
      this.listQuery = store.getters.orderSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeRange = []
        this.timeRange[0] = this.listQuery.startTime
        this.timeRange[1] = this.listQuery.endTime
      }
    }
    this.getAllStatus()
    this.getNav()
    this.getOption()
    this.getList()
  },
  methods: {
    handleRejection(id) {
      rejectionAPI({orderIds: [id]}).then(res => {
        requestMsg.apply(this,[res.data,`操作拒收`])
      })
    },
    handleRefund(id) {
      confirm.apply(this,['确定退款吗?']).then(() => {
        refundAPI({orderIds: [id]}).then(res => {
          requestMsg.apply(this,[res.data,`退款`])
        })
      })
    },
    numbersum(num1,sid){
    this.returnGoodslist.map(i=>{
         if(i.id == sid){
           i.ddnum = i.num-num1
         }
       })
    },
    showTextarea(type){//显示文本域
      this.showTextVisible = true
      this.titleStatus = type
      this.Ttextarea = this.listQuery[type]
    },
    submitText(){
      this.listQuery[this.titleStatus] = this.Ttextarea
      this.showTextVisible = false
    },
    sendInfo(){ // 批量推送发票
      if(this.isSelected()){
        this.$confirm('是否确认推送发票？',"提示", {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sumSendinvoiceAPI( this.multipleSelectionIDs ).then(res => {
            if (res.data.code === 0) {
              this.$message.success('批量推送发票成功')
              this.getList();
            }else{
              res.data.code === -2 ? this.$message.error(res.data.msg) : this.$message.error('批量推送发票失败')
            }
          })
        })
      }
    },
    handleReturnGoods(id){
      this.thisorderId = id;
      this.returnLoading = true
      orderDetailAPI(id).then(res => {
        if (res.data.status) {
          this.returnFormVisible = true
          this.returnGoodslist = res.data.data.orderinfoList.map(i => {
            i.ddnum = 0
            i.returnNum = i.num
            return i
          })
          this.$nextTick(() => {
            // console.log(this.$refs.returnGoodsTable);
            this.$refs.returnGoodsTable.toggleAllSelection()
          })
        } else {
          errorMsg.apply(this, [ res.data, `获取订单详情` ])
        }
        this.returnLoading = false
      })
    },
    submitReturnGoods(){
      if (this.multiReturnSelection.length<1 || !this.multiReturnSelection[0]) {
        return this.$message.warning('未选择任何退货商品')
      }
      let returnGoods = this.multiReturnSelection.map(i => {
        let {num, returnNum, ...temp} = i
        return {num: returnNum, ...temp}
      })
      let returnData = {
        orderId: this.thisorderId,
        list: returnGoods,
        content: this.returnRadio
      }
      returnPostGoods(returnData).then(res=>{
        requestMsg.apply(this,[res.data,'退货'])
        res.data.status ? this.returnFormVisible = false : true
      })
    },
    handleFilter() {
      store.dispatch('SetOrderSerKey',this.listQuery).then(res => {
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
      this.listQuery = {
        pageNum: 1,
        categoryCode: null,
        orderSource: null,
        invoiceStatus: null,
        payType: null,
        needInvoice: null,
        hasMessage: null,
        status: null,
        isDownload: null,
        orderAscription: null,
        pageSize: this.listQuery.pageSize,
        phone:null
      }
      this.timeRange = []
      this.getList()
    },
    sendMsgSubmit() {
      if (this.msgTextarea === null || this.msgTextarea === '') {
        return this.$message.error('未填写短信内容')
      }
      if (this.msgTextarea && this.msgTextarea.length>200) {
        return this.$message.error(`最多200字，现${this.msgTextarea.length}字`)
      }
      sendMessageAPI({
        orderIds: this.multipleSelectionIDs,
        content: this.msgTextarea
      }).then(res => {
        requestMsg.apply(this,[res.data, this.textMap[this.dialogStatus] ])
      })
    },
    sendMessage(){
      if(this.isSelected()){
        this.dialogStatus = 'sendMsg'
        this.sendValueVisible = true
        this.msgPageNum = 1
        this.sendList = this.multipleSelection.filter((el,idx) => idx<this.msgPageSize)
        this.msgTotal = this.multipleSelection.length
      }
    },
    isSelected(){
      if (this.multipleSelectionIDs.length <= 0){
        this.$message.warning('请选择需要操作的条目')
        return false
      }
      return true
    },
    batchEnsure(){
      if(this.isSelected()){
        if (this.multipleSelection.some(i => i.orderAscription!=1) || this.multipleSelection.some(i => i.status!=1 && i.status!=7)) {
          return this.$message.warning('只能操做属于百世的已支付和已缺货状态的订单')
        }
        confirm.apply(this,['是否确认订单信息？']).then(() => {
          batchConfirmOrderAPI({ orderIds: this.multipleSelectionIDs }).then(res => {
            requestMsg.apply(this,[res.data,`批量确认订单`])
          })
        })
      }
    },
    batchGen(){
      if(this.isSelected()){
        if (this.multipleSelection.some(i => i.orderAscription!=1) || this.multipleSelection.some(i => i.status!=2)) {
          return this.$message.warning('只能操做属于百世的已确认状态的订单')
        }
        confirm.apply(this,['是否生成配货单？']).then(() => {
          genRationAPI(this.multipleSelectionIDs).then(res => {
            requestMsg.apply(this,[res.data,`批量生成配货单`])
          })
        })
      }
    },
    batchSoldout(){
      if(this.isSelected()){
        if (this.multipleSelection.some(i => i.orderAscription!=1) || this.multipleSelection.some(i => i.status!=1)) {
          return this.$message.warning('只能操做属于百世的已支付状态的订单')
        }
        confirm.apply(this,['是否确认缺货？']).then(() => {
          batchSoldOutAPI({ orderIds: this.multipleSelectionIDs }).then(res => {
            requestMsg.apply(this,[res.data,`批量确认缺货`])
            // if (res.data.code === 0) {
            //   this.$message.success('批量确认成功')
            //   this.getList()
            // }else{
            //   this.$message.error(res.data.data.split(':')[1])
            // }
          })
        })
      }
    },
    cancelOrder(order){
      this.dialogStatus = 'cancel'
      this.sendValueVisible=true
      this.orderObj = order
    },
    cancelOrderTrue(){  //取消订单
      remarkHistoryAPI({orderId: this.orderObj.id, remark: this.cancelTextarea}).then((res) => {
        // console.log(this.cancelTextarea)
        if (res.data.status) {
          this.$message.success('填写取消理由成功')
          this.cancelTextarea = ''
        } else {
          errorMsg.apply(this, [ res.data, `填写取消理由` ])
        }
      })
      batchCancelOrderAPI({orderId: [this.orderObj.id]}).then(res => {
        if (res.data.status) {
          this.$message.success('取消订单成功')
          this.getList()
          this.sendValueVisible = false
        }else{
          errorMsg.apply(this, [ res.data, `取消订单` ])
        }
      })
    },
    confirmOk(id){
      confirm.apply(this,['已验证库存并确认订单？']).then(()=>{
        batchConfirmOrderAPI({orderIds:[id]}).then((res) => {
          requestMsg.apply(this, [res.data,`确认订单`])
        })
      })
    },
    orderStatus(id,status){
      confirm.apply(this,['是否继续操作？']).then(() => {
        if (status == 'soldout') {
          batchSoldOutAPI({orderIds:[id]}).then((res) => {
            requestMsg.apply(this, [res.data,`缺货操作`])
          })
        } else {
          genRationAPI([id]).then((res) => {
            requestMsg.apply(this, [res.data,`生成配货单`])
          })
        }
      })
      this.orderInfoId = id
    },
    pushInvoice(id){ // 推送发票
      confirm.apply(this,['是否确认推送发票？']).then(() => {
        createinvoiceAPI(id).then(res=>{
          requestMsg.apply(this, [res.data,`推送发票`])
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelectionIDs = getMultipleSelectionIDs(val)
    },
    handleReturnSelectionChange(val) {
      this.multiReturnSelection = val
      this.multiReturnIds = getMultipleSelectionIDs(val)
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.status){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          errorMsg.apply(this, [ res.data, `获取表格数据` ])
        }
        this.listLoading = false
      })
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.status ? this.navTree = res.data.data : errorMsg.apply(this, [ res.data, `获取树形自定义分类` ])
      })
    },
    checkChange(data, obj){
      console.log(data, obj);
      // const [code] = obj.checkedKeys
      this.listQuery.categoryCode = data.code
      this.popoverVisible = false
    },
    clearCheckedKeys(){
      this.$refs.searchTree.setCheckedKeys([])
    },
    getOption(){
      getOptionAPI().then(res => {
        res.data.status ? this.options = res.data.data : errorMsg.apply(this, [ res.data, `获取分类选择器选项` ])
      })
    },
    getAllStatus() {
      getAllStatusAPI().then(res => {
        res.data.status ? this.allStatus = res.data.data : errorMsg.apply(this, [ res.data, `获取订单所有状态` ])
      })
    },
    handleSendMsgChange(val) {
      this.msgPageNum = val
      this.sendList = this.multipleSelection.filter((el,idx) => idx<this.msgPageSize*this.msgPageNum && idx>=(this.msgPageSize-1)*this.msgPageNum)
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  },
  /*store.dispatch('SetOrderSerKey',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })*/

}
</script>
