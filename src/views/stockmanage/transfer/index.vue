<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <router-link :to="{ path:`transfer/create_transfer`}" v-if="authBtns.filter(i => i.idName=='addbtn').length > 0"><el-button  v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button></router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('submitbtn') >= 0" @click="batchSubmitOrder">{{authBtns.filter(i => i.idName=='submitbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='submitbtn').length>0 && authBtns.filter(i => i.idName=='submitbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('submitbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('confirmbtn') >= 0" @click="batchConfirmOrder">{{authBtns.filter(i => i.idName=='confirmbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='confirmbtn').length>0 && authBtns.filter(i => i.idName=='confirmbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('confirmbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('downloadbtn') >= 0" @click="downLoadFile">{{authBtns.filter(i => i.idName=='downloadbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='downloadbtn').length>0 && authBtns.filter(i => i.idName=='downloadbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('downloadbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline>
      <el-form-item label="调拨单状态">
        <el-select v-model="listQuery.status" placeholder="请选择调拨单状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in statusList' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调入库区">
        <el-select v-model="listQuery.toWarehouseId" placeholder="请选择库区" @change="changeToWare">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in wareList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调入库位">
        <el-select v-model="listQuery.toStorageBinId" placeholder="请选择库位">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in toWarePlaceList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调拨单号">
        <el-input v-model="listQuery.code" placeholder="请输入调拨单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="listQuery.opName" placeholder="请输入操作人" clearable></el-input>
      </el-form-item>
      <el-form-item label="调出库区">
        <el-select v-model="listQuery.fromWarehouseId" placeholder="请选择库区" @change="changeFromWare">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in wareList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调出库位">
        <el-select v-model="listQuery.fromStorageBinId" placeholder="请选择库位">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in fromWarePlaceList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker v-model="timeLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="listData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="choiceList">
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="调拨单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="调拨数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ministrial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="调入库位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.toFmtName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="调出库位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.formFmtName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="调拨日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`transfer/details_transfer`, query:{bookId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0"><i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='closebtn')[0].icon" :title="authBtns.filter(i => i.idName=='closebtn')[0].name" v-if="authBtns.filter(i => i.idName=='closebtn').length > 0 && (scope.row.status==='0' || scope.row.status==='6')" @click="cancelOrder(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='confirmbtn')[0].icon" v-if="scope.row.status=='0' && authBtns.filter(i => i.idName=='confirmbtn').length > 0" :title="authBtns.filter(i => i.idName=='confirmbtn')[0].name" @click="confirmOrder(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='submitbtn')[0].icon" v-if="scope.row.status==='6' && authBtns.filter(i => i.idName=='submitbtn').length > 0" :title="authBtns.filter(i => i.idName=='submitbtn')[0].name" @click="submitOrder(scope.row.id)"></i>
          <router-link :to="{ path:`transfer/create_transfer`, query:{bookId:scope.row.id}}" v-if="scope.row.status==='6' && authBtns.filter(i => i.idName=='editbtn2').length > 0"><i :class="authBtns.filter(i => i.idName=='editbtn2')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn2')[0].name"></i></router-link>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;">
      <span>总码洋：{{sum.ministrial}}</span>&nbsp;&nbsp;
      <span>总调拨数量：{{sum.num}} </span>&nbsp;&nbsp;
    </div>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getListAPI, batchSubmitAPI, batchConfirmAPI, getWareAPI, getWarePlace, getStatusAPI, cancelOrderAPI, confirmOrderAPI, submitOrderAPI, getCountAPI } from '@/api/stock-management/transfer'
  import { getMultipleSelectionIDs } from '@/filters/getIds'
  import { requestMsg, confirm } from '@/utils/publicFunctions'
  import { requestPath } from '@/utils/global.js'
  import queryString from 'query-string'
  import store from '@/store'

  export default {
    data() {
      return{
        authBtns: [],
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          toWarehouseId: null,
          toStorageBinId: null,
          fromWarehouseId: null,
          fromStorageBinId: null,
          status: null
        },
        listData: [],
        tableKey: 0,
        timeLimit: null,
        newList:[],
        total: null,
        listData: [],
        ids: [],
        wareList: [],
        statusList: [],
        toWarePlaceList: [],
        fromWarePlaceList: [],
        listLoading: false,
        sum:{}
      }
    },
    mounted() {
      if( ifUndefined(store.getters.transferSerKeys.pageNum) ){
        this.listQuery = store.getters.transferSerKeys
        console.log(this.listQuery,'读取搜索条件成功')
        if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
          this.timeLimit = []
          this.timeLimit[0] = this.listQuery.startTime
          this.timeLimit[1] = this.listQuery.endTime
        }
      }
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
      this.getList()
      this.getWare()
      this.getFromWarePlaceList()
      this.getToWarePlaceList()
      this.getStatus()
    },
    methods: {
      getList() {
        this.listLoading = true
        getListAPI(this.listQuery).then(res => {
          if(res.data.code === 0){
            this.listData = res.data.data.list
            this.total = res.data.data.total
          } else if(res.data.code === -2){
            this.$message.error(res.data.data);
          } else {
            this.$message.error('获取数据失败');
          }
          this.listLoading = false
        })
        getCountAPI(this.listQuery).then(res=>{
          this.sum = res.data.data
        })
      },
      getStatus() {
        getStatusAPI().then(res => {
          if(res.data.code === 0){
            this.statusList = res.data.data
          } else {
            this.$message.error('获取数据失败')
          }
        })
      },
      getWare(){//库区列表
        getWareAPI().then(res => {
          if(res.data.code === 0){
            this.wareList = res.data.data
          } else {
            this.$message.error('获取数据失败')
          }
        })
      },
      changeToWare() {//调入库位列表
        this.listQuery.toStorageBinId = null
        this.getToWarePlaceList()
      },
      changeFromWare() {//调出库位列表
        this.listQuery.fromStorageBinId = null
        this.getFromWarePlaceList()
      },
      //获取调出库位列表
      getFromWarePlaceList(){
        if(this.listQuery.fromWarehouseId){
          getWarePlace(this.listQuery.fromWarehouseId).then(res => {
            if(res.data.code === 0){
              this.fromWarePlaceList = res.data.data
            } else {
              this.$message.error('获取数据失败')
            }
          })
        }
      },
      //获取调入库位列表
      getToWarePlaceList(){
        if(this.listQuery.toWarehouseId){
          getWarePlace(this.listQuery.toWarehouseId).then(res => {
            if(res.data.code === 0){
              this.toWarePlaceList = res.data.data
            } else {
              this.$message.error('获取数据失败')
            }
          })
        }
      },
      cancelOrder(id) {//取消订单
        confirm.apply(this,['确定要取消吗？']).then(() => {
          cancelOrderAPI(id).then(res => {
            requestMsg.apply(this,[res.data,'取消'])
          })
        })
      },
      submitOrder(id) {//提交订单
        submitOrderAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'提交'])
        })
      },
      confirmOrder(id) {//确认订单
        confirmOrderAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'确认'])
        })
      },
      batchSubmitOrder() {//批量提交
        if(this.newList.length == 0){
          this.$message.error('请选择至少一条记录进行操作')
        } else{
          const status = this.newList.every(data => data.status == 6)
          console.log(this.ids);
          if(status){
            batchSubmitAPI(this.ids).then(res => {
              requestMsg.apply(this,[res.data,'提交'])
            })
          } else{
            this.$message.error('只有未提交的数据才能批量提交')
          }
        }
      },
      batchConfirmOrder() {//批量确认
        if(this.newList.length == 0){
          this.$message.warning('请选择至少一条记录进行操作')
        } else{
          const status = this.newList.every(data => data.status == 0)
          if(status){
            batchConfirmAPI(this.ids).then(res => {
              requestMsg.apply(this,[res.data,'确认'])
            })
          } else{
            this.$message.error('只有未确认的数据才能批量确认')
          }
        }
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
        paramStr ? window.open(`${process.env.BASE_API}${requestPath.stock}/allotion-note/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.stock}/allotion-note/export`)
        // let paramStr = queryString.stringify(params);
        // window.open(`${process.env.BASE_API}${requestPath.stock}/allotion-note/export?${paramStr}`);
      },
      choiceList(val) {
        this.newList = val
        this.newList.length > 0 ? this.ids = getMultipleSelectionIDs(this.newList) : true
      },
      handleFilter() {
        if(this.timeLimit){
          this.listQuery.startTime = this.timeLimit[0]
          this.listQuery.endTime = this.timeLimit[1]
        } else {
          this.listQuery.startTime = null
          this.listQuery.endTime = null
        }
        store.dispatch('SetTransferSerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        this.listQuery.pageNum = 1
        this.getList()
      },
      resetFilter() {
        this.listQuery = {
          pageNum: 1,
          pageSize: this.listQuery.pageSize,
          startTime: null,
          endTime: null,
          toWarehouseId: null,
          toStorageBinId: null,
          fromWarehouseId: null,
          fromStorageBinId: null,
          status: null
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
