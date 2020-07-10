<template>
  <div class="app-container calendar-list-container">
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="调拨单号">
        <span>{{ note.code }}</span>
      </el-form-item>
      <el-form-item label="调出库区">
        <span>{{ note.fromWarehouseName }}</span>
      </el-form-item>
      <el-form-item label="调出库位">
        <span>{{ note.fromStorageBinName }}</span>
      </el-form-item>
    </el-form>

    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="listTitle">商品清单</div>
      </div>
    </div>

    <el-table :data="bookList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
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
      <el-table-column prop="date" label="库存数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.stockNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="调拨数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="单价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num*scope.row.price}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="调入库区">
        <span>{{ note.toWarehouseName }}</span>
      </el-form-item>
      <el-form-item label="调入库区">
        <span>{{ note.toStorageBinName }}</span>
      </el-form-item>
    </el-form>

    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="topTitle">备注</div>
        <el-form class="demo-ruleForm">
          <el-form-item>
            <el-input type="textarea" v-model="note.note" :autosize="{ minRows: 2}" readonly="readonly"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-form align="center">
      <el-form-item>
        <el-button @click="closePage">关闭</el-button>
      </el-form-item>
    </el-form>
   
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
    width: 20%;
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
  import { detailsListAPI } from '@/api/stock-management/transfer'
  export default{
    data(){
      return {
        listLoading: false,
        note: {},
        bookList: [],
      }
    },
    mounted() {
      this.getList()
    },
    methods:{
      getList() {
        this.listLoading = true;
        const oid = this.$route.query.bookId;
        detailsListAPI(oid).then(res => {
          if(res.data.code === 0){
            this.note = res.data.data.note
            this.bookList = res.data.data.books
          } else if(res.data.code === -2){
            this.$message.error(res.data.data)
          } else {
            this.$message.error('获取数据失败')
          }
          this.listLoading = false;
        })
      },
      closePage() {
          this.$router.go(-1);
      },
    }
  }
</script>