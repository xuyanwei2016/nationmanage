<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('exportbtn') >= 0" @click="downLoadFile">{{authBtns.filter(i => i.idName=='exportbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportbtn').length>0 && authBtns.filter(i => i.idName=='exportbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>
    <el-form inline class="form-inline">
    <template v-if="moreFilter" >
      <el-form-item label="书代号">
        <el-input v-model="listQuery.bookNo" placeholder="请输入书代号" clearable></el-input>
      </el-form-item>
      <el-form-item label="ISBN">
        <el-input v-model="listQuery.isbn" placeholder="请输入ISBN" clearable></el-input>
      </el-form-item>
      <el-form-item label="图书名称">
        <el-input v-model="listQuery.bookName" placeholder="请输入图书名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="出版社">
        <el-select v-model="listQuery.publisherid" placeholder="请选择出版社">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.publisherid" v-for='item in publisherList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="制品类型">
        <el-input v-model="listQuery.goodstype" placeholder="请输入制品类型" clearable></el-input>
      </el-form-item>
      <el-form-item label="版印次">
        <el-input v-model="listQuery.revision" placeholder="请输入版印次" clearable></el-input>
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="listQuery.price" placeholder="请输入单价" clearable></el-input>
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="listQuery.num" placeholder="请输入数量" clearable></el-input>
      </el-form-item>
      <el-form-item label="码洋">
        <el-input v-model="listQuery.ministrial" placeholder="请输入码洋" clearable></el-input>
      </el-form-item>
      <el-form-item label="实洋">
        <el-input v-model="listQuery.realOcean" placeholder="请输入实洋" clearable></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="listQuery.author" placeholder="请输入作者" clearable></el-input>
      </el-form-item>
      <el-form-item label="责任编辑">
        <el-input v-model="listQuery.executiveEditor" placeholder="请输入责任编辑" clearable></el-input>
      </el-form-item>
      <el-form-item label="策划编辑">
        <el-input v-model="listQuery.schemeEditor" placeholder="请输入策划编辑" clearable></el-input>
      </el-form-item>
      <el-form-item label="编室编号">
        <el-input v-model="listQuery.roomNo" placeholder="请输入编室编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="丛书名">
        <el-input v-model="listQuery.seriesname" placeholder="请输入丛书名" clearable></el-input>
      </el-form-item>
      <el-form-item label="入库单号">
        <el-input v-model="listQuery.code" placeholder="请输入入库单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="入库类型">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.type" placeholder="请选择入库类型">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in storageType' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入库单状态">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.status" placeholder="请选择入库单状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in storageStatus' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库区">
        <el-select v-model="listQuery.warehouseId" placeholder="请选择库区" @change="wareChange" value-key="ware">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in wareList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库位">
        <el-select v-model="listQuery.storageBinId" placeholder="请选择库位" >
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in warePlaceList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择入库时间">
        <el-date-picker v-model="timeLimit" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="销售分类"> 
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
          <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
          <el-select v-model="listQuery.diycode" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      </template>
        <template v-if="!moreFilter">
            <el-form-item label="书代号">
              <el-input v-model="listQuery.bookNo" placeholder="请输入书代号" clearable></el-input>
            </el-form-item>
            <el-form-item label="ISBN">
              <el-input v-model="listQuery.isbn" placeholder="请输入ISBN" clearable></el-input>
            </el-form-item>
            <el-form-item label="图书名称">
              <el-input v-model="listQuery.bookName" placeholder="请输入图书名称" clearable></el-input>
            </el-form-item>
        </template>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        <el-button @click="moreFilter = !moreFilter">{{moreFilter ?  '简洁' : '更多' }}<i :class="moreFilter ?  'el-icon-arrow-up' : 'el-icon-arrow-down' "></i></el-button>
        
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="listData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column label="书代号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图书名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="ISBN" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isbn}}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ministrial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realOcean}}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库区" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageBinName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.typeZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.relationCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.supplierName}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;">
      <span>总码洋：{{sum.ministrial}}</span>&nbsp;&nbsp;
      <span>总实洋：{{sum.realOcean}}</span>&nbsp;&nbsp;
      <span>总数量：{{sum.num}}</span>&nbsp;&nbsp;
      <span>平均折扣：{{sum.discount}}</span>&nbsp;&nbsp;
    </div>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { requestPath } from '@/utils/global.js'
  import queryString from 'query-string'
  import { getListAPI, getWareAPI, getWarePlace, storageTypeAPI, getStorageStatusAPI, getpublisherAPI, getNavAPI, getOptionAP, getCountAPI } from '@/api/stock-management/storage-book'
  import store from '@/store'

  export default {
    data() {
      return{
        authBtns: [],
        listLoading:false,
        moreFilter:false,
        total: null,
        listData: [],
        tableKey: 0,
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          storageBinId: null,
          warehouseId: null,
          diycode: null,
          type: null,
          status: null,
          publisherid: null
        },
        wareList: [],
        warePlaceList: [],
        storageType: [],
        storageStatus: [],
        publisherList: [],
        timeLimit: [],
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
      if( ifUndefined(store.getters.storageBookSerKeys.pageNum) ){
        this.listQuery = store.getters.storageBookSerKeys
        console.log(this.listQuery,'读取搜索条件成功')
        if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
          this.timeLimit = []
          this.timeLimit[0] = this.listQuery.startTime
          this.timeLimit[1] = this.listQuery.endTime
        }
      }
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
      this.getList()
      this.getWare()
      this.getWarePlaceList()
      this.getStorageType()
      this.getPublisher()
      this.getStorageStatus()
      this.getNav()
      this.getOption()
    },
    methods: {
      getList() {
        this.listLoading = true
        // console.log(this.listQuery.publisherid);
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
        })
      },
      getWare() {//库区
        getWareAPI().then(res => {
          if(res.data.code === 0){
            this.wareList = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      wareChange() {//库位
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
      getPublisher() {//出版社
        getpublisherAPI().then(res => {
          if(res.data.code === 0){
            this.publisherList = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      getStorageType() {//类型列表
        storageTypeAPI().then(res => {
          if(res.data.code === 0){
            this.storageType = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      getStorageStatus() {//状态
        getStorageStatusAPI().then(res => {
          if(res.data.code === 0){
            this.storageStatus = res.data.data
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
        this.listQuery.diycode = data.code
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
        paramStr ? window.open(`${process.env.BASE_API}${requestPath.stock}/storage-book/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.stock}/storage-book/export`)
        // let paramStr = queryString.stringify(params);
        // window.open(`${process.env.BASE_API}${requestPath.stock}/storage-book/export?${paramStr}`);
      },
      handleFilter() {
        if(this.timeLimit){
          this.listQuery.startTime = this.timeLimit[0]
          this.listQuery.endTime = this.timeLimit[1];
        } else {
          this.listQuery.startTime = null
          this.listQuery.endTime = null
        }
        store.dispatch('SetStorageBookSerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        this.listQuery.pageNum = 1
        this.getList()
      },
      resetFilter() {
        this.listQuery = {
          pageNum: 1,
          pageSize: this.listQuery.pageSize,
          storageBinId: null,
          warehouseId: null,
          diycode: null,
          type: null,
          status: null,
          publisherid: null
        }
        this.timeLimit = null
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
