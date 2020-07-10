<template>
  <div class="app-container calendar-list-container">
    <el-form inline>
      <el-form-item label="操作人">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.createrName" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <!-- <el-table-column align="center" type="selection"></el-table-column> -->
      <el-table-column label="操作人" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" min-width="140px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="300px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
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
import { getData } from "@/api/system-management/systemlog";
import store from '@/store'

export default {
  name: "complexTable",
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        createrName: '',
        beginTime: null,
        endTime: null
      },
      time:[],
      temp: {
        id: null,
        status: '',
        logo: '',
        name: '',
        description: ''
      },
      maxSort:0,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: '修改支付描述'
      },
      multipleSelection:[]
    };
  },
  mounted() {
    if( ifUndefined(store.getters.systemlogSerKeys.pageNum) ){
      this.listQuery = store.getters.systemlogSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.beginTime) || ifUndefined(this.listQuery.endTime)){
        this.time = []
        this.time[0] = this.listQuery.beginTime
        this.time[1] = this.listQuery.endTime
      }
    }
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getData(this.listQuery).then(response => {
        console.log(response)
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false;
      });
    },
    resetFilter(){
      this.time =[],
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        createrName: '',
        beginTime: null,
        endTime: null
      }
      this.getList()
    },
    handleFilter() {
      if (this.time) {
        this.listQuery.beginTime = this.time[0]
        this.listQuery.endTime = this.time[1]
      } else {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }
      store.dispatch('SetSystemlogSerKeys',this.listQuery).then(res => {
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
    }
  }
};
</script>
