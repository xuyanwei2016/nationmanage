<template>
  <div class="app-container calendar-list-container">
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="入库单号">
        <span>{{ note.code }}</span>
      </el-form-item>
      <el-form-item label="入库类型">
        <!-- 0:采购入库 :增益入库 4:退货入库 7:样书入库 8:调拨入库 -->
        <span v-if="note.type == 0">采购入库</span>
        <span v-if="note.type == 3">增益入库</span>
        <span v-if="note.type == 4">退货入库</span>
        <span v-if="note.type == 7">样书入库</span>
        <span v-if="note.type == 8">调拨入库</span>
      </el-form-item>
      <el-form-item label="库区">
        <span>{{ note.warehouseName }}</span>
      </el-form-item>
      <el-form-item label="库位">
        <span>{{ note.storageBinName }}</span>
      </el-form-item>
    </el-form>
    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="listTitle">商品清单</div>
      </div>
    </div>
    <el-table :data="bookList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column prop="date" label="条码书号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="商品名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="单价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="折扣值" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="进货价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storagePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ministrial}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="实洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realOcean}}</span>
        </template>
      </el-table-column>
    </el-table>

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
    width: 15%;
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
  .inputClass,.input{
    height: 20px;
    width:80%;
    border: solid 1px #ccc;
    display: block;
    margin: 0 auto;
    line-height: 20px;
    text-align: center;
  }
  .noteInput{
    display: inline-block;
    width: 30% !important;
  }
  .notes{
    width: 90px;
    display: inline-block;
    text-align: right;
    margin-right: 5px;
    font-size: 14px;
    font-weight: 700;
  }
</style>

<script>
  import { detailsListAPI } from '@/api/stock-management/storage'
  export default{
    data(){
      return {
        listLoading: true,
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
        const oldId = this.$route.query.bookId;
        detailsListAPI(oldId).then(res => {
          if(res.data.code === 0){
            this.note = res.data.data.note
            this.bookList = res.data.data.books
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