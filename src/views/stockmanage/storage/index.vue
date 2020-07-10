<template>
  <div class="app-container calendar-list-container" v-loading="pushing"  element-loading-text="正在推送...">
    <div class="nav-buttons-container">
      <router-link :to="{ path:`storage/create_storage`}" v-if="authBtns.filter(i => i.idName=='addbtn').length > 0">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0">
        {{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      </router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchSubmitOrderbtn') >= 0" @click="batchSubmitOrder">
        {{authBtns.filter(i => i.idName=='batchSubmitOrderbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchSubmitOrderbtn').length>0 && authBtns.filter(i => i.idName=='batchSubmitOrderbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchSubmitOrderbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchConfirmOrderbtn') >= 0" @click="batchConfirmOrder">
        {{authBtns.filter(i => i.idName=='batchConfirmOrderbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchConfirmOrderbtn').length>0 && authBtns.filter(i => i.idName=='batchConfirmOrderbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchConfirmOrderbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchConfirmOrderbtn') >= 0" @click="downLoadFile">
        {{authBtns.filter(i => i.idName=='downLoadFilebtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='downLoadFilebtn').length>0 && authBtns.filter(i => i.idName=='downLoadFilebtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('downLoadFilebtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchConfirmOrderbtn') >= 0" @click="handleImport">
        {{authBtns.filter(i => i.idName=='handleImportbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='handleImportbtn').length>0 && authBtns.filter(i => i.idName=='handleImportbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('handleImportbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchConfirmOrderbtn') >= 0" @click="batchpush">
        {{authBtns.filter(i => i.idName=='batchpushbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchpushbtn').length>0 && authBtns.filter(i => i.idName=='batchpushbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchpushbtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-form inline>
      <el-form-item label="入库单号">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.code" clearable placeholder="请输入入库单号"></el-input>
      </el-form-item>
      <el-form-item label="关联单号">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.relationCode" clearable placeholder="请输入关联单号"></el-input>
      </el-form-item>
      <el-form-item label="书代号">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.bookNo" clearable placeholder="请输入书代号"></el-input>
      </el-form-item>
      <el-form-item label="操作人">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.opName" clearable placeholder="请输入操作人"></el-input>
      </el-form-item>
      <el-form-item label="入库单状态">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.status" placeholder="请选择入库单状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in storageStatus' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库区">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.warehouseId" placeholder="请选择库区" @change="wareChange">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in ware' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库位" v-if="listQuery.warehouseId">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.storageBinId" placeholder="请选择库位">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.name" :value="item.id" v-for='item in warePlace' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入库类型">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.type" placeholder="请选择入库类型">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in storageType' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker
          v-model="timeLimit" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" v-show="!pushing">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="入库单号" min-width="130" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联单号" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.relationCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库数量" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
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
      <el-table-column label="平均折扣" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库区" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库位" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageBinName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库类型" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.typeZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.opName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库日期" width="155" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <!-- <router-link :to="{ path:`storage/details_storage`, query:{bookId:scope.row.id} }"><i class="el-icon-zoom-in" title="查看"></i></router-link> -->
          <router-link :to="{path:`storage/details_storage`, query:{bookId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='see').length > 0">
            <i :class="authBtns.filter(i => i.idName=='see')[0].icon" :title="authBtns.filter(i => i.idName=='see')[0].name"></i>
          </router-link>
          <!-- <router-link v-if="scope.row.status==='0'" :to="{ path:`storage/create_storage`, query:{id:scope.row.id}}"><i class="el-icon-edit" title="编辑"></i></router-link> -->
          <router-link :to="{path:`storage/create_storage`, query:{id:scope.row.id}}" v-if="(authBtns.filter(i => i.idName=='editbtn').length > 0)&&(scope.row.status==='0')">
            <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
          </router-link>
          <!-- <i class="el-icon-close" v-if="scope.row.status==='0' || scope.row.status==='1' || scope.row.status==='4'" title="取消" @click="cancel(scope.row.id)"></i> -->
          <i :class="authBtns.filter(i => i.idName=='cancelbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='cancelbtn').length > 0)&&(scope.row.status==='0'|| scope.row.status==='1' || scope.row.status==='4')" @click="cancel(scope.row.id)" :title="authBtns.filter(i => i.idName=='cancelbtn')[0].name"></i>
          <!-- <i class="el-icon-circle-close-outline" v-if="scope.row.status==='8'|| scope.row.status==='3'" title="取消推送" @click="cancelPush(scope.row.id)"></i> -->
          <i :class="authBtns.filter(i => i.idName=='cancelPushbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='cancelPushbtn').length > 0)&&(scope.row.status==='8'|| scope.row.status==='3')" @click="cancelPush(scope.row.id)" :title="authBtns.filter(i => i.idName=='cancelPushbtn')[0].name"></i>
          <!-- <i class="el-icon-check" v-if="scope.row.status==='0'" title="提交" @click="submitOrder(scope.row.id)"></i> -->
          <i :class="authBtns.filter(i => i.idName=='submitOrderbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='submitOrderbtn').length > 0)&&(scope.row.status==='0')" @click="submitOrder(scope.row.id)" :title="authBtns.filter(i => i.idName=='submitOrderbtn')[0].name"></i>
          <!-- <i class="el-icon-error" v-if="scope.row.status==='0'" title="删除" @click="deleteOrder(scope.row.id)"></i> -->
          <i :class="authBtns.filter(i => i.idName=='deleteOrderbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='deleteOrderbtn').length > 0)&&(scope.row.status==='0')" @click="deleteOrder(scope.row.id)" :title="authBtns.filter(i => i.idName=='deleteOrderbtn')[0].name"></i>
          <!-- <i class="el-icon-check" v-if="scope.row.status=='1' && scope.row.areaType =='0' && scope.row.type === '7'" title="确认" @click="confirmOrder(scope.row.id)"></i> -->
          <i :class="authBtns.filter(i => i.idName=='confirmOrderbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='confirmOrderbtn').length > 0)&&(scope.row.status=='1' && scope.row.areaType =='0' && scope.row.type === '7')" @click="confirmOrder(scope.row.id)" :title="authBtns.filter(i => i.idName=='confirmOrderbtn')[0].name"></i>
          <!-- <i class="el-icon-success" v-if="(scope.row.status=='1' && (scope.row.areaType =='1' || scope.row.type === '0' || scope.row.type === '4')) || scope.row.status=='4'" title="推送百世" @click="push(scope.row.id)"></i> -->
          <i :class="authBtns.filter(i => i.idName=='pushbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='pushbtn').length > 0)&&((scope.row.status=='1' && scope.row.areaType =='1') || scope.row.status=='4')" @click="push(scope.row.id)" :title="authBtns.filter(i => i.idName=='pushbtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;">
      <span>总码洋：{{sum.ministrial}}&nbsp;&nbsp;</span>
      <span>总实洋：{{sum.realOcean}}&nbsp;&nbsp;</span>
      <span>总册数：{{sum.num}}&nbsp;&nbsp;</span>
      <span>平均折扣：{{sum.discount}}&nbsp;&nbsp;</span>
    </div>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>


    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="40%">
      <el-form :model="fileTemp" ref="massForm" label-width="100px" style='margin-right:10px;'>
        <el-form-item label="选择文件：" :rules="{required: true, message: '未上传', trigger: 'change'}">
          <input type="file" @change="fileSelect" ref="file" accept=".xls">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ImportSubmit" :loading="uploading">执行导入</el-button>
        <el-button @click="dialogImportVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style scoped>
  .upload-demo{
    display: inline-block;
    margin-left: 10px;
  }
</style>

<script>
import { getListAPI, getStorageStatusAPI, getWareAPI, getWarePlace, storageTypeAPI, cancelAPI, submitOrderAPI, deleteAPI, confirmOrderAPI, pushAPI, batchSubmitAPI, batchPushAPI, batchConfirmtAPI, cancelPushAPI, batchImportAPI,getCountAPI} from '@/api/stock-management/storage'
import queryString from 'query-string'
import { requestPath } from '@/utils/global.js'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  data() {
    return{
      pushing:false,
      tableKey:0,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        storageBinId: null,
        warehouseId: null,
        type: null,
        status: null
      },
      listLoading: false,
      total:null,
      timeLimit:[],
      list:[],
      storageStatus:null,
      ware:null,
      warePlace:null,
      storageType:null,
      newList:[],
      dialogImportVisible: false,
      fileTemp: {},
      uploading: false,
      sum:{}
    }
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    if( ifUndefined(store.getters.storageSerKeys.pageNum) ){
      this.listQuery = store.getters.storageSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeLimit = []
        this.timeLimit[0] = this.listQuery.startTime
        this.timeLimit[1] = this.listQuery.endTime
      }
    }
    this.getList()
    this.getStorageStatus()
    this.getWare()
    this.getWarePlaceList()
    this.getStorageType()
  },
  methods: {
    getList(){
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else if(res.data.code === -2) {
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
    getStorageStatus() {//入库单状态列表
      getStorageStatusAPI().then(res => {
        if(res.data.code === 0){
          this.storageStatus = res.data.data
        } else {
          this.$message.error('获取数据失败');
        }
      })
    },
    getWare(){//库区列表
      getWareAPI().then(res => {
        if(res.data.code === 0){
          this.ware = res.data.data
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
      if (this.listQuery.warehouseId!==null) {
        getWarePlace(this.listQuery.warehouseId).then(res => {
          if(res.data.code === 0){
            this.warePlace = res.data.data
          } else {
            this.$message.error('获取数据失败')
          }
        })
      }
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
    cancel(id) {//取消按钮
      confirm.apply(this,['确定要取消吗？']).then(() => {
        cancelAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'取消'])
        })
      })
    },
    submitOrder(id) {//提交按钮
      confirm.apply(this,['确定要提交吗？']).then(() => {
        submitOrderAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'提交'])
        })
      })
    },
    deleteOrder(id) {//删除按钮
      confirm.apply(this,['确定要删除吗？']).then(() => {
        deleteAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
          this.getList()
        })
      })
    },
    confirmOrder(id) {//确认按钮
      confirmOrderAPI(id).then(res => {
        requestMsg.apply(this,[res.data,'确认'])
        this.getList()
      })
    },
    push(id) {//推送百世
      confirm.apply(this,['确认推送吗？']).then(() => {
        pushAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'推送'])
          this.getList()
        })
      })
    },
    cancelPush(id) {//取消推送百世
      confirm.apply(this,['确认取消推送吗？']).then(() => {
        cancelPushAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'取消'])
          this.getList()
        })
      })
    },
    batchSubmitOrder() {//批量提交
      if(this.newList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const status = this.newList.every(data => data.status == 0)
        if(status){
          const oids = getMultipleSelectionIDs(this.newList)
          batchSubmitAPI(oids).then(res => {
            requestMsg.apply(this,[res.data,'提交'])
          })
        } else{
          this.$message.error('只有未提交的数据才能提交')
        }
      }
    },
    batchpush() {//批量推送-百世
      if(this.newList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{

        this.pushing = true

        const status = this.newList.every(data => data.status == 4 || (data.status == 1 && data.areaType == 1))
        if(status){
          const ids = getMultipleSelectionIDs(this.newList)
          batchPushAPI(ids).then(res => {
            requestMsg.apply(this,[res.data,'推送'])
            this.getList()
            this.pushing = false
          })
        } else{
          this.$message.error('推送数据必须为推送失败或者未确认的百世库且不能重复提交')
        }
      }
    },
    batchConfirmOrder() {//批量确认
      if(this.newList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const status = this.newList.every(data => data.status == 1 && data.areaType == 0)
        if(status){
          const ids = getMultipleSelectionIDs(this.newList)
          batchConfirmtAPI(ids).then(res => {
            if(res.data.code === 0){
              this.$message.success('确认成功');
              this.getList()
            } else {
              this.$message.error('确认失败');
            }
          })
        } else{
          this.$message.error('推送数据状态必须为未确认的本地库')
        }
      }
    },
    handleImport(){//导入
      this.dialogImportVisible = true
      this.resetTemp()
    },
    resetTemp(){
      this.$refs.file ? this.$refs.file.value = null : true
    },
    fileSelect(){
      if (this.$refs.file.files[0]) {
        let file = this.$refs.file.files[0]
        if (file.type !== 'application/vnd.ms-excel') {
          this.$message.warning('元数据只能上传xls格式的excel！');
          this.$refs.file.value = null
        }
      }
    },
    ImportSubmit(){
      if (this.$refs.file.files[0]) {
        this.uploading = true
        this.$message.warning('导入中');
        let formData = new FormData()
        formData.append('file', this.$refs.file.files[0])
        this.invokeUpload(batchImportAPI, formData)
      } else {
        this.$message.warning('请选择文件后再执行导入！');
      }
    },
    invokeUpload(api, data){
      api(data).then(res => {
        this.uploading = false
        if(res.data.code === 0){
          this.$message.success(`导入成功`);
          this.dialogFormVisible = false
          this.getList()
        } else{
          this.$message.error(`导入失败`);
        }
      })
    },
    downLoadFile() { //导出
      let {pageNum, pageSize, ...params} = this.listQuery;
      let tempParams = {}
      for (const key in params) {
        if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
          tempParams[key] = params[key]
        }
      }
      let paramStr = queryString.stringify(tempParams)
      paramStr ? window.open(`${process.env.BASE_API}${requestPath.stock}/storage-note/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.stock}/storage-note/export`)
      // let paramStr = queryString.stringify(params);
      // window.open(`${process.env.BASE_API}${requestPath.stock}/storage-note/export?${paramStr}`);
    },
    chioceList(val) {
      this.newList = val;
    },
    handleFilter() {
      if(this.timeLimit){
        this.listQuery.startTime = this.timeLimit[0]
        this.listQuery.endTime = this.timeLimit[1];
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      store.dispatch('SetStorageSerKeys',this.listQuery).then(res => {
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
        type: null,
        status: null
      }
      this.timeLimit = null
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
}

</script>
