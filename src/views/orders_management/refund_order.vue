<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <!-- <el-button icon="el-icon-circle-plus" @click="exportExcel">导出退款单</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('exportExcelbtn') >= 0" @click="exportExcel">
        {{authBtns.filter(i => i.idName=='exportExcelbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportExcelbtn').length>0 && authBtns.filter(i => i.idName=='exportExcelbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportExcelbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-circle-plus" @click="batchCheck">批量审核通过</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchCheckbtn') >= 0" @click="batchCheck">
        {{authBtns.filter(i => i.idName=='batchCheckbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchCheckbtn').length>0 && authBtns.filter(i => i.idName=='batchCheckbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchCheckbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-document" @click="batchConfirm">批量确认退款</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchConfirmbtn') >= 0" @click="batchConfirm">
        {{authBtns.filter(i => i.idName=='batchConfirmbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchConfirmbtn').length>0 && authBtns.filter(i => i.idName=='batchConfirmbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchConfirmbtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="订单类型">
        <el-select v-model="listQuery.status">
          <el-option :value="null" label="全部"></el-option>
          <el-option :value="0" label="待审核"></el-option>
          <el-option :value="1" label="已审核"></el-option>
          <el-option :value="3" label="退款完成"></el-option>
          <el-option :value="4" label="已取消"></el-option>
          <el-option :value="2" label="退款失败"></el-option>
        </el-select>
      </el-form-item>
      <!-- <template v-if="moreFilter" > -->
        <el-form-item label="订单号">
          <el-input  placeholder="订单号、退货单号、退款单号" v-model="listQuery.orderCode" clearable style="width:230px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="退货单号">
          <el-input  placeholder="退货单号" v-model="listQuery.salesReturnCode" clearable></el-input>
        </el-form-item>
        <el-form-item label="退款单号">
          <el-input  placeholder="退款单号" v-model="listQuery.refundOrderCode" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="下单会员">
          <el-input  placeholder="下单会员" v-model="listQuery.createrName" clearable></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="timeRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      <!-- </template> -->
      <!-- <template v-if="!moreFilter">
        <el-form-item label="综合搜索">
          <el-input  placeholder="可输入订单号、下单会员、退款单号" v-model="listQuery.conds" clearable class="once-search-input"></el-input>
        </el-form-item>
      </template> -->
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
        <!-- <el-button @click="moreFilter = !moreFilter">{{moreFilter ?  '简洁' : '更多' }}<i :class="moreFilter ?  'el-icon-arrow-up' : 'el-icon-arrow-down' "></i></el-button> -->
      </el-form-item>
    </el-form>

    <!-- </div> -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" ref="multipleTable" >
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column label="退款单号" align="center">
        <template slot-scope="scope">
          <span v-if="true" class="bookLink" @click="dealOrder(scope.row.id,scope.row.orderCode)">{{scope.row.code}}</span>
          <span v-else>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.salesReturnCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="原订单号" align="center">
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
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusStr}}</span>
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
            <li><i v-if="(authBtns.map(i => i.idName).indexOf('dealOrderbtn') >= 0)" @click="dealOrder(scope.row.id,scope.row.orderCode)">{{authBtns.filter(i => i.idName=='dealOrderbtn')[0].name}}</i></li>

            <!-- <li v-if="(authBtns.map(i => i.idName).indexOf('cancelRefundbtn') >= 0)&&(scope.row.status ==0||scope.row.status ==1||scope.row.status ==2 )"><i @click="cancelRefund(scope.row.id)">{{authBtns.filter(i => i.idName=='cancelRefundbtn')[0].name}}</i></li> -->

            <li v-if="authBtns.map(i => i.idName).indexOf('refundbtn') >= 0 && (scope.row.status ==1 || scope.row.status ==2)"><i @click="refund(scope.row.id)">{{authBtns.filter(i => i.idName=='refundbtn')[0].name}}</i></li>

            <li v-if="(authBtns.map(i => i.idName).indexOf('checkbtn') >= 0)&&(scope.row.status ==0||scope.row.status ==2)"><i @click="check(scope.row.id)">{{authBtns.filter(i => i.idName=='checkbtn')[0].name}}</i></li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="查看详情" :visible.sync="dialogVisible" width="90%">
      <h3>基础信息：</h3>
      <el-form ref="orderForm" :model="orderDetail" label-position="right" label-width="120px" class="order-form clearfix">
        <el-form-item label="订单编号：">{{orderDetail.orderCode}}</el-form-item>
        <el-form-item label="退款单号：">{{orderDetail.code}}</el-form-item>
        <el-form-item label="退货单号：">{{orderDetail.salesReturnCode}}</el-form-item>
        <el-form-item label="退款单状态：">{{orderDetail.status}}</el-form-item>
        <el-form-item label="退款金额：">￥{{orderDetail.refundTotal}}</el-form-item>
        <el-form-item label="操作人：">{{orderDetail.operatorName}}</el-form-item>
        <el-form-item label="操作时间：">{{orderDetail.createTime}}</el-form-item>
      </el-form>
      <el-form class="demo-ruleForm" ref="dataForm">
        <el-form-item label="退款原因：" label-width="120px" class="form" style="margin-right: 20px;">
          <el-input type="textarea" v-model="orderDetail.reason" cols="100" rows="2" readonly="readonly"></el-input>
        </el-form-item>
      </el-form>

      <p class="divider"></p>
      <div style="width:800px;margin:0 auto;">
        <el-tabs type="border-card">
          <el-tab-pane label="备注历史">
            <div style="overflow-y:scroll;height:200px;padding:20px 40px;">
              <div v-for="remark in orderRemark" :key="remark.id">
                <h4><span>记录人：{{remark.createrName}}</span> <b style="float:right">记录时间：{{remark.createTime}}</b></h4>
                <p>{{remark.operationContent}}</p>
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
            <el-table :data="statusHis">
              <el-table-column prop="createTime" label="操作时间"></el-table-column>
              <el-table-column prop="operationContent" label="操作内容"></el-table-column>
              <el-table-column prop="createrName" label="操作人"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div slot="footer" class="dialog-footer footer-margin">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
  .operationBtns ul{
    padding: 0;
  }
  .operationBtns ul li{
    text-align: center;
  }
</style>
<script>
import queryString from 'query-string'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import {
  getListAPI,
  refundAPI,
  cancelAPI,
  checkAPI,
  batchConfirmAPI,
  batchCheckAPI,
  orderDetailAPI,
  getRemarkByIdAPI,
  getStatusHisByIdAPI,
  remarkHistoryAPI,
  continueRefundsAPI,
  continuebatchRefundsAPI
} from '@/api/order/refund';
import { operationMsg, requestMsg, confirm, errorMsg } from '@/utils/publicFunctions'
import { requestPath } from '@/utils/global.js'
import store from '@/store'

export default {
  data() {
    return {
      authBtns: [],
      statusHis:[],
      orderRemark:[],
      newOrderRemark:'',
      orderInfoId:0,
      orderGoods:{},
      orderDetail:{},
      dialogVisible:false,
      tableKey: 0,
      listLoading: true,
      // moreFilter:false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        status: null
      },
      list: null,
      total: null,
      multipleSelection: [],
      multipleSelectionIDs:[],
      listStatus: '',
      timeRange: []
    }
  },
created() {
  this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
},
  mounted() {

    if( ifUndefined(store.getters.refund_orderSerKeys.pageNum) ){
      this.listQuery = store.getters.refund_orderSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeRange = []
        this.timeRange[0] = this.listQuery.startTime
        this.timeRange[1] = this.listQuery.endTime
      }
    }
    this.getList()

  },
  methods: {
    exportExcel(){//导出excel
      let {pageNum, pageSize, ...params} = this.listQuery
      let tempParams = {}
      for (const key in params) {
        if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
          tempParams[key] = params[key]
        }
      }
      let paramStr = queryString.stringify(tempParams)
      paramStr ? window.open(`${process.env.BASE_API}${requestPath.order}/refund-order/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.order}/refund-order/export`)
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
    cancelRefund(id) { //取消退款
      cancelAPI({oid:id}).then(res => {
        requestMsg.apply(this,[res.data,'取消'])
      })
    },
    refund(id) {//退款
        this.$confirm('是否确认退款？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        refundAPI({oid:id}).then(res => {
          if(res.data.code ==-1){
            this.$confirm('冲红失败,是否继续退款？', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
              }).then(()=>{//冲红失败继续进行退款操作
                continueRefundsAPI({oid:id}).then(res=>{
                  if(res.data.code ==0){
                    this.$message.success("退款成功")
                  }else{
                    this.$message.error("退款失败")
                  }
                })
              })
          }else if(res.data.code == 0){
            this.$message.success("退款成功")
          }else{
            this.$message.error("退款失败")
          }
        })
      })
    },
    check(id) {//审核
      this.$confirm('是否确认审核？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        checkAPI({oid:id}).then(res => {
          requestMsg.apply(this,[res.data,'审核'])
        })
      })
    },
    batchCheck() {//批量审核通过
      if(this.isSelected()){
        confirm.apply(this,['确定要批量审核通过吗？']).then(() => {
          batchCheckAPI({ids:this.multipleSelectionIDs}).then(res => {
            if(res.data.code ===0){
              this.$message.success("批量审核通过成功")
              this.getList();
            }else if(res.data.code ==-1){
              if(res.data.msg=="不能变更的状态" ||res.data.msg=="已完成不提供变更状态操作"||res.data.msg=="已取消不提供变更状态操作"){
                this.$message.warning("您选择的退款单不能执行此操作，请重新操作")
              }else{
                this.$message.warning(res.data.msg)
              }
            }else{
              this.$message.error("批量审核失败")
            }
          })
        })
      }
    },
    batchConfirm() {//批量退款
      if(this.isSelected()){
        confirm.apply(this,['确定要批量确认退款吗？']).then(() => {
          batchConfirmAPI({ids:this.multipleSelectionIDs}).then(res => {
            // requestMsg.apply(this,[res.data,'批量确认退款'])
            if(res.data.code == -1 ){
              this.$confirm('冲红失败,是否继续退款？', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(()=>{//冲红失败继续进行批量退款操作
                continuebatchRefundsAPI({"ids":res.data.data}).then(res=>{
                  if(res.data.code ==0){
                    this.$message.success("批量退款成功")
                  }else{
                    this.$message.error("批量退款失败")
                  }
                })
              })
            }else if(res.data.code == 0){
              this.$message.success("批量退款成功")
            }else{
              this.$message.error("批量退款失败")
            }
          })
        })
      }
    },
    dealOrder(id,code){//详情展示
      this.orderInfoId = id
      orderDetailAPI(id).then(res => {
        if (res.data.status) {
          this.orderDetail = res.data.data
          this.dialogVisible = true
          this.getOrderRemark()
        } else {
          errorMsg.apply(this, [ res.data, `获取退款单详情` ])
        }
      })
    },
    addOrderRemark(){//添加
      remarkHistoryAPI({refundOrderId: this.orderInfoId, remark: this.newOrderRemark}).then((res) => {
        if (res.data.code === 0) {
          this.newOrderRemark = ''
          this.getOrderRemark()
        } else {
          errorMsg.apply(this, [ res.data, `添加备注历史` ])
        }
      })
    },
    getOrderRemark(){//tab详情
      getRemarkByIdAPI({refundOrderId:this.orderInfoId,pageNum:1,pageSize:9999}).then((res) => {//获取备注历史列表
        if (res.data.code === 0) {
          this.orderRemark = res.data.data.list
          console.log(222222,res)
        } else {
          errorMsg.apply(this, [ res.data, `获取备注历史` ])
        }
      })
      getStatusHisByIdAPI({id:this.orderInfoId,pageNum:1,pageSize:9999}).then(res => {//状态改变的历史列表
        if(res.data.code === 0) {
          this.statusHis = res.data.data.list
          console.log(333333,res)
        } else {
          errorMsg.apply(this, [ res.data, `获取状态变更历史` ])
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
      store.dispatch('SetRefundOrderSerKey',this.listQuery).then(res => {
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
        status: null,
        pageSize: this.listQuery.pageSize
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
