<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <!-- <transition-group name="custom-classes-transition" enter-active-class="animated"> -->
        <el-form inline>
          <!-- <template v-if="moreFilter" > -->
            <el-form-item label="发票号">
            <el-input @keyup.enter.native="handleFilter" placeholder="发票号" v-model="listQuery.invoiceNumber" clearable></el-input>
            </el-form-item>
            <el-form-item label="发票抬头">
            <el-input @keyup.enter.native="handleFilter" placeholder="发票抬头" v-model="listQuery.invoiceTitle" clearable></el-input>
            </el-form-item>
            <el-form-item label="开票时间">
              <el-date-picker v-model="timeRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="发票接收邮箱">
            <el-input @keyup.enter.native="handleFilter" placeholder="发票接收邮箱" v-model="listQuery.invoiceEmail" clearable></el-input>
            </el-form-item>
            <el-form-item label="订单号">
            <el-input @keyup.enter.native="handleFilter" placeholder="订单号" v-model="listQuery.code" clearable></el-input>
            </el-form-item>
          <!-- </template> -->
          <!-- <template v-if="!moreFilter">
            <el-form-item label="综合搜索">
              <el-input @keyup.enter.native="handleFilter" placeholder="可输入发票号、发票抬头、订单号" v-model="listQuery.conds" clearable class="once-search-input"></el-input>
            </el-form-item>
          </template> -->
          <el-form-item>
            <el-button @click="handleFilter">检索</el-button>
            <el-button @click="resetFilter">重置</el-button>
            <!-- <el-button @click="moreFilter = !moreFilter">{{moreFilter ? '简洁' : '更多' }}<i :class="moreFilter ? 'el-icon-arrow-up' : 'el-icon-arrow-down' "></i></el-button> -->
          </el-form-item>
        </el-form>
      <!-- </transition-group> -->
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe
      @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="订单号" >
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发票号">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="发票抬头">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="下单人手机号">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceTel}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="开票时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getListAPI,getListFuzzyAPI} from '@/api/order/invoice'
import {operationMsg} from '@/utils/publicFunctions'
import store from '@/store'

export default {
  name: 'complexTable',
  data() {
    return {
      moreFilter:false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
      },
      massQuery: {
        ids: [],
        status:null
      },
      temp: {
        id: undefined,
        price: '',
        signValue: '',
        description: '',
        status: 1,
        type: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改广告位',
        create: '添加广告位'
      },
      dialogPvVisible: false,
      timeRange: null,
      multipleSelection:[]
    }
  },
  mounted() {    
    if( ifUndefined(store.getters.invoiceSerkeys.pageNum) ){
      this.listQuery = store.getters.invoiceSerkeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeRange = []
        this.timeRange[0] = this.listQuery.startTime
        this.timeRange[1] = this.listQuery.endTime
      }
    }
    this.getList()
  },
  // watch:{
  //   moreFilter:function(){
  //     this.resetFilter()
  //   }
  // },
  methods: {
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    resetFilter(){
      this.listQuery={
        pageNum : 1,
        pageSize: this.listQuery.pageSize
      }
      this.timeRange = null
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // this.multipleSelection.length>0 ? this.massQuery.ids = this.multipleSelection.map(item => item.id) : true
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(response=>{
        console.log(response)
        if(response.data.code === 0){
          this.list = response.data.data.list
          console.log(this.list)
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败');
          console.log(response.data.data)
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      store.dispatch('SetInvoiceSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      // if(Object.prototype.toString.call(this.listQuery.conds) !== '[object Undefined]'){
      //   this.getListFuzzy()
      // }else{
        if (this.timeRange) {
          this.listQuery.startTime = this.timeRange[0]
          this.listQuery.endTime = this.timeRange[1]
        } else {
          this.listQuery.startTime = null
          this.listQuery.endTime = null
        }
        this.getList()
      // }
    },
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
