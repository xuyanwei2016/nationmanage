<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div>
          <el-row>
            <router-link :to="{path:'../person_member'}">
              <el-button type="info" icon="el-icon-arrow-left" v-waves>返回</el-button>
            </router-link>
            <!-- <el-button type="info" icon="el-icon-arrow-left">返回</el-button> -->
            &nbsp;&nbsp;会员<span>&nbsp;&nbsp;{{account}}</span>
          </el-row>
      </div>
      <el-form inline :model="formInline"  class="form-inline" style="float:right;margin-right:60px;">
        <el-form-item label="记录时间">
            <el-col :span="11">
            <el-date-picker type="date"  v-model="formInline.beginTime" value-format="yyyy-MM-dd" placeholder="年/月/日" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" align='center'>至</el-col>
            <el-col :span="11">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="年/月/日" v-model="formInline.endTime" style="width: 100%;"></el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="类型">
            <el-select v-model="formInline.type" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="收入" value="1"></el-option>
              <el-option label="支出" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
<!--<<<<<<< HEAD
            <el-button @click="handleFilter">检索</el-button>
=======-->
            <el-button type="primary" @click="handleFilter">检索</el-button>
<!--&gt;>>>>>> xyw-->
        </el-form-item>
      </el-form>
      <el-table :data="list" :key='tablekey' v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column label="IP地址" align="center" width="100">
                <template slot-scope="scope">{{ scope.row.ip }}</template>
            </el-table-column>
            <el-table-column label="记录时间" align="center">
                <template slot-scope="scope">{{ scope.row.createTime }}</template>
            </el-table-column>
            <el-table-column label="类型" align="center" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.type===1">收入</span>
                <span v-else style="color: red;">支出</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" align="center" width="150">
                <template slot-scope="scope">{{ scope.row.info}}</template>
            </el-table-column>
            <el-table-column label="积分（分）" align="center" width="200">
                <template slot-scope="scope">{{ scope.row.score }}</template>
            </el-table-column>
            <el-table-column label="执行人" align="center" width="200" >
                <template slot-scope="scope">{{ scope.row.createrAccount }}</template>
            </el-table-column>
            <el-table-column label="备注" align="center" width="200" >
                <template slot-scope="scope">{{ scope.row.remark }}</template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,15,20, 30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
  import waves from "@/directive/waves"; // 水波纹指令
  import { operationMsg } from "@/utils/publicFunctions";
  import { getMultipleSelectionIDs, getMaxSort } from "@/filters/getIds";
  import {searchScoreAPI,searchAPI} from "@/api/member/personMember";

  export default{
    name: "complexTable",
    directives: {
      waves
    },
    data() {
      return{
        account:this.$route.query.account,
        ids:[],
        tablekey:0,
        list:null,
        listLoading: true,
        total:null,
        formInline:{
          beginTime:'',
          endTime:'',
          type:null
        },
        listQuery:{
          pageNum:1,
          pageSize:10
        }
        
      }

    },
    mounted(){
      this.getList();
    },
    methods:{
      getList(listQuery){
        this.listLoading = true;
        searchScoreAPI(listQuery).then(response => {
          if (response.data.code === 0) {
            this.list = response.data.data.list;
            this.total = response.data.data.total;
            this.formInline.beginTime = response.data.data.beginTime;
            this.formInline.endTime = response.data.data.endTime;
            this.formInline.type = response.data.data.type;
          } else {
            this.$message.error("获取数据失败");
          }
          this.listLoading = false;
        });
      },
     /*  search() {
        this.listLoading = true;
        searchScoreAPI({
          beginTime:this.formInline.beginTime,
          endTime:this.formInline.endTime,
          type: this.formInline.type,
          pageNum:this.listQuery.pageNum,
          pageSize:this.listQuery.pageSize
        }).then(response => {
          if (response.data.code === 0) {
            this.list = response.data.data.list;
            this.total = response.data.data.total;
          } else {
            this.$message.error("获取数据失败");
          }
          this.listLoading = false;
        });
    }, */
    handleSelectionChange(val) {
      //操作选中的数据，获取对应的id
      this.multipleSelection = val;
      this.ids = getMultipleSelectionIDs(this.multipleSelection);
      this.memberStatus.id = this.ids;
    },
    handleCurChange(val){
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val)
    },
    handleCurrentChange(val) {
    //当前页的列表和对应页码变化
    this.listQuery.pageNum = val;
    this.getList(this.listQuery);
    },
    handleFilter() {
      // 筛选、查询
      this.listQuery.pageNum = 1;
      this.getList(this.listQuery);
    },
    handleSizeChange(val) {
      //页数变化
      this.listQuery.pageSize = val;
      this.getList(this.listQuery);
    }

    }
  }
</script>
<style>
  .el-form-item--medium .el-form-item__content .el-button {
    background: #409EFF;
    border-color: #409EFF;
    border-radius: 0;
    color: #fff;
  }
</style>
