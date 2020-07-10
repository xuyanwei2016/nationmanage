<template>
  <div class="app-container calendar-list-container">
    <el-form inline>
      <el-form-item label="下单会员">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="书代号">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.bookNo" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select @change="handleFilter" v-model="listQuery.status">
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
        <el-select @change="handleFilter" v-model="listQuery.isRefund">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="订单" :value="0"></el-option>
          <el-option label="退款单" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间">
        <el-date-picker v-model="commitTime" type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="订单来源">
        <el-select v-model="listQuery.orderSource">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="报名网" :value="1"></el-option>
          <el-option label="本系统" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货地区">
        <el-select v-model="listQuery.province">
          <el-option label="全部" :value="null"></el-option>
          <el-option v-for="(value, key) in provinces" :key="key" :label="value" :value="value"></el-option>
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

    <el-table :key='tableKey' stripe :data="list" @sort-change="handleSort" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row>
      <!-- <el-table-column type="index" align="center"></el-table-column> -->
      <el-table-column label="书代号" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="书名" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="套餐商品数量" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.packageNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.stockNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="num" sortable="custom" min-width="60" align="center"></el-table-column>
      <el-table-column label="码洋" prop="ministrial" sortable="custom" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ministrial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣额" prop="discountTotal" sortable="custom" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.discountTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实洋" prop="realOcean" sortable="custom" min-width="60" align="center"></el-table-column>
    </el-table>
    <div class="summary-data">
      不包含套餐商品、补差价商品 ———— 总商品数量: {{summaryData.totalNum}}、总码洋: {{summaryData.totalMinistrial}}、总折扣额: {{summaryData.totalDiscount}}、总实洋: {{summaryData.totalRealOcean}}<br>
      <!-- 补差价商品 ———— 总商品数量: {{0}}、总码洋: {{0.00}}、总折扣额: {{0.00}}、总实洋: {{0.00}} -->
    </div>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import { getNavAPI, getOptionAPI } from '@/api/book-infomation/package'
import { getListAPI, getSummaryAPI } from "@/api/statistic-management/bookDetail"
import { getAllStatusAPI } from "@/api/statistic-management/listDetails"
import { operationMsg, confirm, errorMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import queryString from 'query-string'
import { requestPath } from '@/utils/global.js'
import store from '@/store'
import axios from 'axios'

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
        name: undefined,
        bookNo: undefined,
        status: null,
        isRefund: null,
        orderAscription: 1,
        orderSource: null,
        province: null,
        code: null,
        beginCreateTime: null,
        endCreateTime: null,
        orderBy: null
      },
      allStatus: [],
      provinces: {},
      mapJson: '../src/utils/map.json', //mapJson,//'{"110000":"北京市"}',
      navTree: [],
      options: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      commitTime: [],
      popoverVisible: false
    };
  },
  mounted() {
    if( ifUndefined(store.getters.book_detailsSerKeys.pageNum) ){
      this.listQuery = store.getters.book_detailsSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.beginCreateTime) || ifUndefined(this.listQuery.endCreateTime)){
        this.commitTime = []
        this.commitTime[0] = this.listQuery.beginCreateTime
        this.commitTime[1] = this.listQuery.endCreateTime
      }
    }
    this.getList()
    this.getNav()
    this.getOption()
    this.getAllStatus()
    this.getProvince()
  },
  methods: {
    handleSort({column, prop, order}) {
      console.log(column, prop, order)
      if (order) {
        this.listQuery.orderBy = `${prop} ${order.substring(0,order.length-6)}`
      } else {
        this.listQuery.orderBy = null
      }
      this.getList()
    },
    exportData() {
      let {pageNum, pageSize, orderBy, ...params} = this.listQuery
      let tempParams = {}
      for (const key in params) {
        if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
          tempParams[key] = params[key]
        }
      }
      let paramStr = queryString.stringify(tempParams)
      paramStr ? window.open(`${process.env.BASE_API}${requestPath.order}/report/export/single-book-detail?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.order}/report/export/single-book-detail`)
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
        name: undefined,
        bookNo: undefined,
        status: null,
        isRefund: null,
        orderAscription: 1,
        orderSource: null,
        province: null,
        code: null,
        beginCreateTime: null,
        endCreateTime: null,
        orderBy: null
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
      store.dispatch('SetBookDetailsSerKeys',this.listQuery).then(res => {
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
