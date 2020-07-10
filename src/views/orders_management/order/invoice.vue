<template>
  <div class="app-container calendar-list-container">
    <transition-group name="custom-classes-transition" enter-active-class="animated">
      <el-form inline class="form-inline" :key="formValue">
        <el-form-item label="发票号">
          <el-input v-model="listQuery.invoiceCode" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="发票抬头">
          <el-input v-model="listQuery.invoiceTitle" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="listQuery.code" clearable>
          </el-input>
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

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe ref="multipleTable">
      <el-table-column label="发票号" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票抬头" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" min-width="65" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票人手机" min-width="130" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceTel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票时间" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="接收邮箱" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceEmail}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { getInvoiceListAPI } from '@/api/order/order';
import axios from 'axios'
import { operationMsg, requestMsg, errorMsg, confirm } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 100,
      },
      tableKey: 0,
      total: null,
      listLoading:false,
      timeRange: [],
      formValue:false,
      list: [],
    }
  },
  mounted() {  
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getInvoiceListAPI(this.listQuery).then(res => {
        if(res.data.status){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          errorMsg.apply(this, [ res.data, `获取表格数据` ])
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      // store.dispatch('SetOrderSerKey',this.listQuery).then(res => {
      //   console.log(res,'保存查询成功')
      // })
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
        pageSize: this.listQuery.pageSize,
      }
      this.timeRange = []
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
