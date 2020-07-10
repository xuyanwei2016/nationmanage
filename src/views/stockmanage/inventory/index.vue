<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('download') >= 0" @click="handleImport">{{authBtns.filter(i => i.idName=='download')[0].name}}<i v-if="authBtns.filter(i => i.idName=='download').length>0 && authBtns.filter(i => i.idName=='download')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('download')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0"  @click="addIncentory">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('merge') >= 0"  @click="margeOrder">{{authBtns.filter(i => i.idName=='merge')[0].name}}<i v-if="authBtns.filter(i => i.idName=='merge').length>0 && authBtns.filter(i => i.idName=='merge')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('merge')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="书代号">
        <el-input v-model="listQuery.bookNo" placeholder="请输入书代号" clearable></el-input>
      </el-form-item>
      <el-form-item label="盘点单号">
        <el-input v-model="listQuery.code" placeholder="请输入盘点单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="盘点人">
        <el-input v-model="listQuery.createrName" placeholder="请输入盘点人" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.status" placeholder="请选择状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in statusList' :key="val"></el-option>
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
      <el-form-item label="选择时间">
        <el-date-picker v-model="timeLimit" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="listData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="盘点单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
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
      <el-table-column label="盘点开始时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.startTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="盘点结束时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="盘点人" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`inventory/details_inventory`, query:{detailsId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='viewbtn').length > 0"><i :class="authBtns.filter(i => i.idName=='viewbtn')[0].icon" :title="authBtns.filter(i => i.idName=='viewbtn')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='download')[0].icon" v-if="authBtns.filter(i => i.idName=='download').length > 0" :title="authBtns.filter(i => i.idName=='download')[0].name" @click="downLoad(scope.row.id)"></i>
          <i :class="authBtns.filter(i => i.idName=='error')[0].icon" v-if="scope.row.status==='0' && authBtns.filter(i => i.idName=='error').length > 0" :title="authBtns.filter(i => i.idName=='error')[0].name" @click="deleteOrder(scope.row.id)"></i>
          <router-link :to="{ path:`inventory/update_inventory`, query:{detailsId:scope.row.id}}" v-if="scope.row.status =='0' && authBtns.filter(i => i.idName=='check').length > 0"><i :class="authBtns.filter(i => i.idName=='check')[0].icon" :title="authBtns.filter(i => i.idName=='check')[0].name"></i></router-link>
          <router-link :to="{ path:`inventory/handle_exception`, query:{detailsId:scope.row.id}}" v-if="scope.row.status==='2' && authBtns.filter(i => i.idName=='warn').length > 0"><i :class="authBtns.filter(i => i.idName=='warn')[0].icon" :title="authBtns.filter(i => i.idName=='warn')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='normal')[0].icon" v-if="scope.row.status==='2' && authBtns.filter(i => i.idName=='normal').length > 0" :title="authBtns.filter(i => i.idName=='normal')[0].name" @click="editNormal(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="标记为正常盘点" :visible.sync="dialogVisible">
      <div class="nav-buttons-container">
        <div class="tip">备注</div>
        <el-form class="demo-ruleForm" :model="noteVal" :rules="rules" ref="dataForm">
          <el-form-item prop="textarea">
            <el-input type="textarea" v-model="noteVal.textarea" :autosize="{ minRows: 2}" maxlength="100"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editNormalBtn">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增盘点单" :visible.sync="addInventoryVisible">
      <el-form inline class="form-inline" :model="saveData" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="库区：" prop="wareId">
          <el-select v-model="saveData.wareId" placeholder="请选择库区" @change="addWareChange">
            <el-option :label="item.name" :value="item.id" v-for='item in addWareList' :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库位：" prop="warePlaceId">
          <el-select v-model="saveData.warePlaceId" placeholder="请选择库位" >
            <el-option :label="item.name" :value="item.id" v-for='item in addWarePlaceList' :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="saveBtn">确定</el-button>
        <el-button @click="addInventoryVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="40%">
      <el-form :model="fileTemp" ref="massForm" style='margin-right:10px;'>
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

</style>

<script>
import { getListAPI, getWareAPI, getWarePlace, getStatusAPI, deleteOrderAPI, editNormalAPI, saveAPI, margeAPI, batchImportAPI } from '@/api/stock-management/inventory'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { requestPath } from '@/utils/global.js'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import _ from 'lodash'
import store from '@/store'

export default {
  data() {
    return {
      authBtns: [],
      listLoading: false,
      statusList: [],
      wareList: [],
      warePlaceList: [],
      timeLimit: [],
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        warehouseId: null,
        storageBinId: null,
        status: null
      },
      listData: [],
      tableKey: 0,
      total:null,
      dialogVisible: false,
      rules:{
        textarea: [
          { required: true, message: '请输入备注', max: 100, trigger: 'change' }
        ],
        wareId: [
          { required: true, message: '请选择库区', trigger: 'change' }
        ],
        warePlaceId: [
          { required: true, message: '请选择库位', trigger: 'change' }
        ],
      },
      noteVal:{
        textarea: null,
      },
      editId: null,
      addInventoryVisible: false,
      saveData:{
        wareId:null,
        warePlaceId:null
      },
      addWareList: [],
      addWarePlaceList: [],
      multipleSelection: [],
      dialogImportVisible: false,
      fileTemp: {},
      uploading: false,
    }
  },
  mounted() {
    if( ifUndefined(store.getters.inventorySerKeys.pageNum) ){
      this.listQuery = store.getters.inventorySerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeLimit = []
        this.timeLimit[0] = this.listQuery.startTime
        this.timeLimit[1] = this.listQuery.endTime
      }
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getWare()
    this.getWarePlaceList()
    this.getStatus()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.listData = res.data.data.list
          this.total = res.data.data.total
        } else if(res.data.code === -2) {
          this.$message.error(res.data.data);
        } else {
        this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    getWare(){//库区列表
      getWareAPI().then(res => {
        if(res.data.code === 0){
          this.wareList = res.data.data
          this.addWareList = res.data.data
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
    addWareChange() {//库位列表
      this.saveData.warePlaceId = ''
      getWarePlace(this.saveData.wareId).then(res => {
        if(res.data.code === 0){
          this.addWarePlaceList = res.data.data
        } else {
          this.$message.error('获取数据失败');
        }
      })
    },
    getStatus() {//状态列表
      getStatusAPI().then(res => {
        if(res.data.code === 0){
          this.statusList = res.data.data
        } else {
          this.$message.error('获取数据失败');
        }
      })
    },
    addIncentory() {//新增盘点
      this.saveData.wareId = ''
      this.saveData.warePlaceId = ''
      this.addInventoryVisible = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    saveBtn() {//新增
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addInventoryVisible = false
          this.$nextTick(() => {
            this.$refs['addForm'].clearValidate()
          })
          const data = {
            warehouseId: this.saveData.wareId,
            storageBinId: this.saveData.warePlaceId
          }
          saveAPI(data).then(res => {
            if(res.data.code === 0){
              this.$message.success('新增成功')
              this.saveData.wareId = null
              this.saveData.warePlaceId = null
              this.getList()
            } else if(res.data.code === -2) {
              this.$message.error(res.data.data);
            } else {
              this.$message.error('新增失败')
            }
          })
        }
      })
    },
    downLoad(id) {//盘点单的单条导出
      window.open(`${process.env.BASE_API}${requestPath.stock}/inventory/export/${id}/book`);
    },
    deleteOrder(id) {//删除按钮
      confirm.apply(this,['确定要删除吗？']).then(() => {
        deleteOrderAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
        })
      })
    },
    editNormal(id) {
      this.dialogVisible = true;
      this.editId = id
    },
    editNormalBtn() {//确认标记为正常
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          const data = {
            oid: this.editId,
            note: this.noteVal.textarea
          }
          editNormalAPI(data).then(res => {
            requestMsg.apply(this,[res.data,'标记'])
          })
        }
      })
    },
    margeOrder() {//合并盘点单
      if(this.multipleSelection.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const firstWarehouseId = this.multipleSelection[0].warehouseId
        const firstStorageBinId = this.multipleSelection[0].storageBinId
        const status = this.multipleSelection.every(data => data.status == "0")
        const ware = this.multipleSelection.every(data => data.warehouseId == firstWarehouseId)
        const storage = this.multipleSelection.every(data => data.storageBinId == firstStorageBinId)
        if(status == true && ware == true && storage ==true){
          const oids = getMultipleSelectionIDs(this.multipleSelection)
          margeAPI(oids).then(res => {
            requestMsg.apply(this,[res.data,'合并'])
          })
        }
        else{
          this.$message.error('合并数据的必须为正在盘点的且库区库位必须相同')
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleFilter() {
      if(this.timeLimit){
        this.listQuery.startTime = this.timeLimit[0]
        this.listQuery.endTime = this.timeLimit[1];
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      store.dispatch('SetInventorySerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listLoading.pageSize,
        warehouseId: null,
        storageBinId: null,
        status: null
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
