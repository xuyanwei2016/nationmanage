<template>
  <div class="app-container calendar-list-container">
    <el-form inline>
      <el-form-item label="下单会员">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="listQuery.status">
          <el-option :value="null" label="全部"></el-option>
          <el-option v-for="(value, key) in allStatus" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库位">
        <el-select v-model="listQuery.orderAscription">
          <el-option label="百世" :value="1"></el-option>
          <el-option label="网店宝" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="清单类型">
        <el-select v-model="listQuery.isRefund">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="订单" :value="0"></el-option>
          <el-option label="退款单" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间">
        <el-date-picker v-model="commitTime" type="datetimerange" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="发货地区">
        <el-select v-model="listQuery.province">
          <el-option label="全部" :value="null"></el-option>
          <el-option v-for="(value, key) in provinces" :key="key" :label="value" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="listQuery.payType">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="支付宝" :value="0"></el-option>
          <el-option label="微信" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
          <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
          <el-select v-model="listQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="全部">
            <el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.code"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button><el-button @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="订单号" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单会员" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发货地区" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.province}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品数量" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总销售额" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.payment}}</span>
        </template>
      </el-table-column>
      <el-table-column label="码洋" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderPayment}}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣额" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.discountPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实洋" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realPayment}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单日期" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.payTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票状态" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceStatus===1 ? '已开票' : '未开票'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单来源" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderSourceZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="读者运费" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.readerCarriage}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际运费" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realReaderCarriage}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="summary-data">总订单数: {{summaryData.totalOrderNum }}、总商品数量: {{summaryData.totalGoodsNum }}、总销售额: {{summaryData.totalPayment }}、总码洋: {{summaryData.totalOrderPayment}}、总实洋: {{summaryData.totalRealPayment }}、总折扣额: {{summaryData.totalDiscountPrice }}、总读者运费: {{summaryData.totalReaderCarriage }}、总实际运费: {{summaryData.totalRealReaderCarriage}}</div>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import { getNavAPI, getOptionAPI } from '@/api/book-infomation/package'
import { getListAPI, getAllStatusAPI, getSummaryAPI } from "@/api/statistic-management/listDetails"
import { operationMsg, confirm, errorMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import queryString from 'query-string'
import { requestPath } from '@/utils/global.js'
import axios from 'axios'
import store from '@/store'

export default {
  data() {
    return {
      tableKey: 0,
      summaryData:{},
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        name: null,
        status: null,
        orderAscription: 1,
        isRefund: null,
        province: null,
        payType: null,
        code: null,
        beginCreateTime: null,
        endCreateTime: null
      },
      navTree: [],
      options: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      allStatus: [],
      provinces: {},
      mapJson: '../src/utils/map.json', //mapJson,//'{"110000":"北京市"}',
      commitTime: null,
      popoverVisible: false
    };
  },
  mounted() {
    if( ifUndefined(store.getters.list_detailsSerKeys.pageNum) ){
      this.listQuery = store.getters.list_detailsSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.beginCreateTime) || ifUndefined(this.listQuery.endCreateTime)){
        this.commitTime = []
        this.commitTime[0] = this.listQuery.beginCreateTime
        this.commitTime[1] = this.listQuery.endCreateTime
      }
    }
    this.getNav()
    this.getOption()
    this.getAllStatus()
    this.getProvince()
    this.getList()
  },
  methods: {
    exportData() {
      let {pageNum, pageSize, ...params} = this.listQuery
      let tempParams = {}
      for (const key in params) {
        if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
          tempParams[key] = params[key]
        }
      }
      let paramStr = queryString.stringify(tempParams)
      paramStr ? window.open(`${process.env.BASE_API}${requestPath.order}/report/export/list-detail?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.order}/report/export/list-detail`)
    },
    // checkChange、clearCheckedKeys搜索单选树
    checkChange(data, obj){
      this.listQuery.code = data.code
      this.popoverVisible = false
    },
    clearCheckedKeys(){
      this.$refs.searchTree.setCheckedKeys([])
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      })
      getSummaryAPI(this.listQuery).then(res=>{
        if(res.data.code === 0){
          this.summaryData = res.data.data
        } else {
          this.$message.error('获取数据失败')
        }
      })
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        name: null,
        status: null,
        orderAscription: 1,
        isRefund: null,
        province: null,
        payType: null,
        code: null,
        beginCreateTime: null,
        endCreateTime: null
      }
      this.commitTime = null
      this.getList()
    },
    handleFilter() {
      if (this.commitTime) {
        this.listQuery.beginCreateTime = this.commitTime[0]
        this.listQuery.endCreateTime = this.commitTime[1]
      } else {
        this.listQuery.beginCreateTime = null
        this.listQuery.endCreateTime = null
      }
      store.dispatch('SetListDetailsSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1
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
    getProvince() {
      axios.get(this.mapJson).then(res =>{
        if (res.status == 200) {
          let allData = res.data
          for (const key in allData) {
            if (allData.hasOwnProperty(key) && key.match(/0000$/)) {
              this.provinces[key] = allData[key]
            }
          }
        } else {
          this.$message.error('获取地区数据失败')
        }
      })
    },
    getAllStatus() {
      getAllStatusAPI().then(res => {
        res.data.status ? this.allStatus = res.data.data : errorMsg.apply(this, [ res.data, `获取订单所有状态` ])
      })
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.code === 0 ? this.navTree = res.data.data : errorMsg.apply(this, [ res.data, `获取树形分类失败` ])
      })
    },
    getOption(){
      getOptionAPI().then(res => {
        res.data.code === 0 ? this.options = res.data.data : errorMsg.apply(this, [ res.data, `获取分类选择器选项失败` ])
      })
    }
  }
}
</script>
