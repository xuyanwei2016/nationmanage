<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('downloadbtn') >= 0" @click="downLoadFile">{{authBtns.filter(i => i.idName=='downloadbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='downloadbtn').length>0 && authBtns.filter(i => i.idName=='downloadbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('downloadbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="商品分类">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
          <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
          <el-select v-model="listQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="书代号">
        <el-input v-model="listQuery.bookNo" placeholder="请输入书代号" clearable></el-input>
      </el-form-item>
      <el-form-item label="图书名称">
        <el-input v-model="listQuery.bookName" placeholder="请输入图书名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="库区">
        <el-select v-model="listQuery.warehouseId" placeholder="请选择" @change="wareChange" value-key="ware">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in wareList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库位">
        <el-select v-model="listQuery.storageBinId" placeholder="请选择" >
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in warePlaceList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否上架">
        <el-select v-model="listQuery.bookstatus" placeholder="请选择">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in statusList' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="listData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column label="书代号" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图书名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属分类" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.diytypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库区" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库位" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageBinName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="存库数" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="锁定数" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.lockNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="码洋" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ministrial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实洋" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realOcean}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下限值" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.lowerNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否低于下限值" width="90" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.lowerNumZh}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="60" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="setLowNum(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;">
      <span>总码洋：{{sum.ministrial}}</span>&nbsp;&nbsp;
      <span>总实洋：{{sum.realOcean}}</span>&nbsp;&nbsp;
      <span>总数量：{{sum.num}}</span>&nbsp;&nbsp;
      <span>总锁定数：{{sum.lockNum}}</span>&nbsp;&nbsp;
    </div>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="设置库存下限值" :visible.sync="dialogVisible">
      <div class="filter-container">
        <el-form inline label-width="100px">
          <el-form-item label="书代号：">
            <el-input v-model="editBookNo" readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="图书名称：">
            <el-input v-model="editBookname" readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="库区：">
            <el-input v-model="editWare" readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="库位：">
            <el-input v-model="editWarePlace" readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="下限值：">
            <el-input-number v-model="editLowerNum" :min="0"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="setVal">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getListAPI, setLowNumAPI, getWareAPI, getWarePlace, getStatusAPI, getCountAPI  } from '@/api/stock-management/repertory'
  import {  getNavAPI, getOptionAPI } from '@/api/stock-management/purchase'
  import { requestPath } from '@/utils/global.js'
  import queryString from 'query-string'
  import store from '@/store'

  export default {
    data() {
      return{
        authBtns: [],
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          warehouseId: null,
          storageBinId: null,
          code: null,
          bookstatus: null
        },
        listData: [],
        tableKey: 0,
        listLoading: false,
        total:null,
        dialogVisible: false,
        editId:null,
        editBookNo:null,
        editBookname:null,
        editWare: null,
        editWarePlace:null,
        editLowerNum:null,
        wareList: '',
        warePlaceList: '',
        statusList:'',
        defaultVal: '',
        navTree: [],
        options: [],
        defaultProps: {
          children: 'list',
          label: 'showName'
        },
        popoverVisible: false,
        sum:{}
      }
    },
    mounted() {      
      if( ifUndefined(store.getters.repertorySerKeys.pageNum) ){
        this.listQuery = store.getters.repertorySerKeys
      }
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
      this.getList()
      this.getWare()
      this.getWarePlaceList()
      this.getStatus();
      this.getNav()
      this.getOption()
    },
    methods: {
      getList() {
        this.listLoading = true
        getListAPI(this.listQuery).then(res => {
          if(res.data.code === 0){
            this.listData = res.data.data.list
            this.total = res.data.data.total
          } else if(res.data.code === -2){
            this.$message.error(res.data.data);
          } else {
            this.$message.error('获取数据失败');
          }
          this.listLoading = false
        })
        getCountAPI(this.listQuery).then(res=>{
          this.sum = res.data.data
          console.log(this.sum);
          
        })
      },
      setLowNum(val){
        this.dialogVisible = true
        this.editId = val
        this.listData.map((i,v) => {
          if(i.id == val){
            this.editBookNo = i.bookNo
            this.editBookname = i.bookName
            this.editWare = i.warehouseName
            this.editWarePlace = i.storageBinName 
            this.editLowerNum = i.lowerNum 
            this.defaultVal = i.lowerNum
          }
        })
      },
      setVal() {
        this.dialogVisible = false
        const data = {
          lower: parseInt(this.editLowerNum),
          oid: this.editId
        }
        setLowNumAPI(data).then(res => {
          if(res.data.code === 0){
            this.$message.success('设置成功');
            this.getList();
          } else if(res.data.code == -2){
            this.$message.error(res.data.data);
          } else {
            this.$message.error('设置失败');
          }
        })
      },
      getWare(){//库区列表
        getWareAPI().then(res => {
          if(res.data.code === 0){
            this.wareList = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      wareChange() {//库位列表
        this.listQuery.storageBinId = null
        this.getWarePlaceList()
      },
      getWarePlaceList(){
        if(this.listQuery.warehouseId){
          getWarePlace(this.listQuery.warehouseId).then(res => {
            if(res.data.code === 0){
              this.warePlaceList = res.data.data
            } else {
              this.$message.error('获取数据失败');
            }
          })
        }       
      },
      getStatus() {//是否上架状态列表
        getStatusAPI().then(res => {
          if(res.data.code === 0){
            this.statusList = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      getNav(){
        getNavAPI().then(res => {
          res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败');
        })
      },
      checkChange(data, obj){
        this.listQuery.code = data.code
        this.popoverVisible = false
      },
      clearCheckedKeys(){
        this.$refs.searchTree.setCheckedKeys([])
      },
      getOption(){
        getOptionAPI().then(res => {
          if (res.data.code === 0) {
            this.options = res.data.data
          } else {
            this.$message.error(`获取分类选择器选项失败`);
          }
        })
      },
      downLoadFile() {//导出
        let {pageNum, pageSize, ...params} = this.listQuery;
        let tempParams = {}
        for (const key in params) {
          if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
            tempParams[key] = params[key]
          }
        }
        let paramStr = queryString.stringify(tempParams)
        paramStr ? window.open(`${process.env.BASE_API}${requestPath.stock}/stock/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.stock}/stock/export`)
        // let paramStr = queryString.stringify(params);
        // window.open(`${process.env.BASE_API}${requestPath.stock}/stock/export?${paramStr}`);
      },
      handleFilter() {
        store.dispatch('SetRepertorySerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        this.listQuery.pageNum = 1
        this.getList()
      },
      resetFilter() {
        this.listQuery = {
          pageNum: 1,
          pageSize: this.listQuery.pageSize,
          warehouseId: null,
          storageBinId: null,
          code: null,
          bookstatus: null
        }
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
    }
  }
</script>
