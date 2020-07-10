<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="topTitle">盘点单信息</div>
      </div>
    </div>

    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="盘点单号" label-width="120px">
        <span>{{ note.code  }}</span>
      </el-form-item>
      <el-form-item label="盘点库区、库位" label-width="120px">
        <span>{{ note.warehouseName }}、{{ note.storageBinName }}</span>
      </el-form-item>
      <el-form-item label="盘点开始时间" label-width="120px">
        <span>{{ note.startTime }}</span>
      </el-form-item>
      <el-form-item label="盘点结束时间" label-width="120px">
        <span>{{ note.endTime }}</span>
      </el-form-item>
      <el-form-item label="盘点人" label-width="120px">
        <span>{{ note.createrName }}</span>
      </el-form-item>
      <el-form-item label="状态" label-width="120px">
        <span>{{ note.statusName }}</span>
      </el-form-item>
    </el-form>

    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="topTitle">盘点库存明细</div>
      </div>
    </div>

    <el-table :data="listData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column prop="date" label="书代号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="商品名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="包册数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookpackage}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="所在库区" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="所在库位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageBinName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="库存数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="实盘包数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realPack}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="实盘零头" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realFra}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="实盘数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="备注" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    width: 25%;
    padding-left: 20px;
    border: solid 1px #ccc;
  }
  .topTitle,.listTitle{
    margin-right: 10px;
    line-height: 36px;
    font-size: 14px;
  }
  .listTitle{
    float: left;
  }
  .el-table{
    margin-bottom: 20px;
  }
</style>

<script>
  import { detailsListAPI } from '@/api/stock-management/inventory'
  export default{
    data(){
      return {
        listLoading: false,
        listData: [],
        tableKey: 0,
        note: {},
        id: null
      }
    },
    mounted() {
        this.getList()
    },
    methods:{
      getList() {
        this.listLoading = true;
        this.id = this.$route.query.detailsId
        detailsListAPI(this.id).then(res => {
          if(res.data.code === 0){
            this.note = res.data.data.note
            this.listData = res.data.data.books
          } else if(res.data.code === -2) {
            this.$message.error(res.data.data);
          } else {
            this.$message.error('获取数据失败')
          }
          this.listLoading = false;
        })
      },
    }
  }
</script>