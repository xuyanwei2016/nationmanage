<template>
  <div class="app-container calendar-list-container">
    <div class="topTitle">盘点单信息</div>
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="盘点单号" label-width="120px">
        <span>{{ note.code }}</span>
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

    <div class="nav-buttons-container">
      <div class="topTitle">
        <span>盘点库存明细</span>
        <el-button icon="el-icon-success" @click="commit">盘点完成</el-button>
        <el-button icon="el-icon-check" @click="save">保存</el-button>
      </div>
    </div>

    <el-table :data="listData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column label="书代号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="包册数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookpackage}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在库区" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在库位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageBinName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实盘包数" align="center">
        <template slot-scope="scope">
          <input type="number" v-model='scope.row.realPack' @input="changeRealPack(scope.row.id,scope.row.realPack)" class="input">
        </template>
      </el-table-column>
      <el-table-column label="实盘零头" align="center">
        <template slot-scope="scope">
          <input type="number" v-model='scope.row.realFra' @input="changeRealFra(scope.row.id,scope.row.realFra)" class="input">
        </template>
      </el-table-column>
      <el-table-column label="实盘数量" align="center">
        <template slot-scope="scope">
          <input type="number" v-model='scope.row.realNum' @input="changeRealNum(scope.row.id,scope.row.realNum)" class="input">
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <input v-model='scope.row.note' @input="changeNote(scope.row.id,scope.row.note)" class="input">
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
  .topTitle{
    margin-right: 10px;
    line-height: 36px;
    font-size: 14px;
  }
  .el-table{
    margin-bottom: 20px;
  }
  .topTitle>span{
    margin-right: 20px;
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
</style>

<script>
  import { detailsListAPI, updateSaveAPI, submitAPI } from '@/api/stock-management/inventory'
  export default{
    data(){
      return {
        listLoading: false,
        listData: [],
        tableKey: 0,
        note: {},
        id: null,
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
      changeRealPack(id,val) {//更改实盘包数
        this.listData.forEach(i => {
          if(i.id == id){
            i.realPack = val
            i.realNum = parseInt(i.bookpackage*val)+parseInt(i.realFra)
          }
        })
      },
      changeRealFra(id,val) {//更改实盘零头
        this.listData.forEach(i => {
          if(i.id == id){
            i.realFra = val
            i.realNum = parseInt(i.bookpackage*i.realPack)+parseInt(val)
          }
        })
      },
      changeRealNum(id,val){
        this.listData.forEach(i => {
          if(i.id == id){
            i.realPack = 0
            i.realNum = val
            i.realFra = val
          }
        })
      },
      changeNote(id,val) {
        this.listData.forEach(i => {
          if(i.id == id){
            i.note = val
          }
        })
      },
      save() { //保存
        if(this.listData.length > 0){
          const data = {
            forms: this.listData,
            oid: Number(this.id)
          }
          // console.log(data)
          updateSaveAPI(data).then(res => {
            if(res.data.code === 0){
              this.$message.success('保存成功')
              this.getList()
            } else if(res.data.code === -2) {
              this.$message.error(res.data.data)
            } else {
              this.$message.error('保存失败')
            }
          })
        } else {
          this.$message.error('没有数据可以保存')
        }
      },
      commit() {//盘点成功
       if(this.listData.length > 0){
          const data = {
            forms: this.listData,
            oid: Number(this.id)
          }
          // console.log(data)
          submitAPI(data).then(res => {
            if(res.data.code === 0){
              this.$message.success('盘点成功')
              this.$router.go(-1);
            } else if(res.data.code === -2) {
              this.$message.error(res.data.data)
            } else {
              this.$message.error('盘点失败')
            }
          })
        } else {
          this.$message.error('没有数据可以盘点')
        }
      }
    }
  }
</script>