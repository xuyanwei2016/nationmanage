<template>
  <div class="app-container calendar-list-container adPos">
    <div class="nav-buttons-container">
      <el-button @click="handleCreate" v-if="authBtns.filter(i => i.idName=='addbtn').length>0">
        {{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button @click="massSetting" v-if="authBtns.filter(i => i.idName=='batchset').length>0">
        {{authBtns.filter(i => i.idName=='batchset')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchset').length>0 && authBtns.filter(i => i.idName=='batchset')[0].icon" :class="[authBtns.filter(i => i.idName=='batchset')[0].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button @click="massDelete" v-if="authBtns.filter(i => i.idName=='batchdelete').length>0">
        {{authBtns.filter(i => i.idName=='batchdelete')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchdelete').length>0 && authBtns.filter(i => i.idName=='batchdelete')[0].icon" :class="[authBtns.filter(i => i.idName=='batchdelete')[0].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="广告位标题">
        <el-input @keyup.enter.native="handleFilter" placeholder="广告位标题" v-model="listQuery.signTitle" clearable></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select clearable placeholder="类型" v-model="listQuery.type">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="通栏广告" :value="1"></el-option>
          <el-option label="区域广告" :value="2"></el-option>
          <el-option label="飘窗广告" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="广告位标题" >
        <template slot-scope="scope">
          <span>{{scope.row.signTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="广告位代码">
        <template slot-scope="scope">
          <span>{{scope.row.signvalue}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type===1">通栏广告</span>
          <span v-else-if="scope.row.type===2">区域广告</span>
          <span v-else-if="scope.row.type===3">飘窗广告</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="价格/月">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">启用</span>
          <span v-else style="color: red;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" @click="handleCreate(scope.row)" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
          <router-link :to="{path:`ad_pos/ad_content?adsignid=${scope.row.id}&type=${scope.row.type}`}" v-if="authBtns.filter(i => i.idName=='contentbtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='contentbtn')[0].icon" :title="authBtns.filter(i => i.idName=='contentbtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='deletebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='deletebtn').length > 0" @click="singleDelete(scope.row.id)" :title="authBtns.filter(i => i.idName=='deletebtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="padding:0;margin: 0">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px" style='margin-left:50px;'>
        <el-form-item label="广告位类型" prop="type">
          <el-col :span="11">
            <el-select class="filter-item" v-model="temp.type" placeholder="请选择广告位类型" style="width:100%;">
              <el-option v-for="adType in adTypes" :key="adType.type" :label="adType.name" :value="adType.type"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="广告位名称" prop="signTitle">
          <el-col :span="11">
            <el-input v-model="temp.signTitle" placeholder="请输入广告位名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="广告位代码" prop="signvalue">
          <el-col :span="11">
            <el-input v-model="temp.signvalue"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="12" style='color:gray;'>建议使用英文、数字、_组成，唯一</el-col>
        </el-form-item>
        <el-form-item label="广告位价值" prop="price">
          <el-col :span="11">
            <el-input v-model="temp.price"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="12" style='color:gray;'>每月</el-col>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-col :span="11">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" @click="createData" :loading="createDataLoading">保存</el-button>
        <el-button v-else @click="updateData" >保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量设置状态" :visible.sync="dialogPvVisible" width="30%">
      请选择要批量设置的状态<br><br>
        <el-form>
          <el-form-item label="状态:">
            <el-radio-group v-model="massQuery.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- 状态：
        <el-radio-group v-model="massQuery.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="massSettingSubmit">确定</el-button>
        <el-button @click="dialogPvVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getData, changeStatus, massDeleteAPI, updateAdPos, createAdPos, getAdSignAPI } from '@/api/website-management/adPos'
import {operationMsg} from '@/utils/publicFunctions'
import store from '@/store'

const adTypes = [
  { type: '1', name: '通栏广告' },
  { type: '2', name: '区域广告' },
  { type: '3', name: '飘窗广告' }
]

export default {
  name: 'complexTable',
  data() {
    const validateTitle = (rule, value, callback) => {
      if (value.replace(/\s+/g,"") == ''){
        // value = value.replace(/\s+/g,"")
        callback(new Error('请输入广告位名称'));
      } else if(value.length>20) {
        callback(new Error('名称最长20个字符'))
      } else {
        callback()
      }
    };
    const validatePrice = (rule, value, callback) => {
      let priceReg = /^(^[1-9](\d{1,4})?(\.\d{1})?$)|(^\d{0,4}\.\d{1}$)$/
      if ( !priceReg.test(value) ){
        callback(new Error('限制正数，保留小数点后一位'));
      } else {
        callback()
      }
    };
    const validateValue = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9]\w{0,19}$/;
      if ( !reg.test(value) ){
        callback(new Error('请输入英文或数字开头，英文、数字、_组成的最多20个字符的广告位代码'))
      } else {
        callback()
      }
    };
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      createDataLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        signTitle: '',
        type: null
      },
      massQuery: {
        ids: [],
        status: 1
      },
      adTypes,
      temp: {
        id: undefined,
        price: '',
        signTitle: '',
        signvalue: '',
        description: '',
        status: 1,
        type: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改广告位',
        create: '添加广告位'
      },
      dialogPvVisible: false,
      rules: {
        type: [{ required: true, message: '类型必选', trigger: 'change' }],
        signTitle: [{ type: 'string', required: true, trigger: 'change', message: '请输入广告位名称'},{pattern: /^.{1,20}$/, trigger: 'change', message: '广告位名称长度必须小于20位'} ],
        signvalue: [{ type: 'string', required: true, trigger: 'change', message: '请输入广告位代码'},{ pattern: /^[a-zA-Z0-9]\w{0,19}$/, trigger: 'change', message: '广告位代码长度必须小于20位'}],
        price: [{ required: true,trigger: 'change', message: '请输入广告位价值'},{ trigger: 'change', validator: validatePrice }],
        status: [{ required: true, message: '状态必选', trigger: 'change' }],
        description: [{ required: false, message: '备注长度必须小于50位',pattern: /^.{1,50}$/, trigger: 'change' }]
      },
      multipleSelection:[]
    }
  },
  mounted() {
    if( ifUndefined(store.getters.ad_posSerKeys.pageNum) ){
      this.listQuery = store.getters.ad_posSerKeys
    }
    this.getList()
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  methods: {
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    resetFilter(){
      this.listQuery.pageNum = 1
      this.listQuery.signTitle = ''
      this.listQuery.type = ''
      this.getList()
    },
    massSettingSubmit(){
      if (this.massQuery.status!==null) {
        changeStatus(this.massQuery).then(response => {
          if(response.data.code === 0){
            this.getList()
            this.$message({
              type: 'success',
              message: '批量设置'+this.multipleSelection.length+'项成功'
            });
          } else {
            this.$message.error('批量设置失败');
          }
        })
        this.dialogPvVisible = false
      } else {
        this.$message.error('请选择批量设置状态后提交！');
      }
    },
    massSetting(){
      if(this.multipleSelection.length!=0){
        this.dialogPvVisible = true
        this.massQuery.status = 1
      } else {
        this.$message({
          message: '请先选择需要设置的内容',
          type: 'warning'
        });
      }
    },
    massDelete(){
      if(this.multipleSelection.length!=0){
        this.$confirm('确定要删除选择的广告位吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(this.massQuery.ids)
          massDeleteAPI(this.massQuery.ids).then(response => {
            // console.log(response)
            if(response.data.code === 0){
              this.getList()
              this.$message({
                type: 'success',
                message: '批量删除'+this.multipleSelection.length+'项成功'
              });
            } else {
              this.$message.error('批量删除失败');
              // console.log(response.data.data)
            }
          })
        });
      } else {
        this.$message({
          message: '请先选择需要删除的内容',
          type: 'warning'
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.massQuery.ids = this.multipleSelection.map(item => item.id) : true
    },
    getList() {
      this.listLoading = true
      getData(this.listQuery).then(response=>{
        // console.log(response)
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败');
          // console.log(response.data.data)
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      store.dispatch('SetAdPosSerKeys',this.listQuery).then(res => {
        // console.log(res,'保存查询成功')
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
    },
    singleDelete(Id) {
      this.$confirm('确定要删除选择的广告位吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        massDeleteAPI([Id]).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        price: '',
        signTitle: '',
        signvalue: '',
        description: '',
        status: 1,
        type: '1'
      }
    },
    handleCreate(row) {
      this.temp.type == 1 ? this.temp.type= "通栏广告":this.temp.type
      this.temp.type == 2 ? this.temp.type= "区域广告":this.temp.type
      this.temp.type == 3 ? this.temp.type= "飘窗广告":this.temp.type
      if(row.id) {
        this.dialogStatus = 'update'
        getAdSignAPI(row.id).then(res => {
          console.log(res);
          this.temp = res.data.data
          this.temp.type == 1 ? this.temp.type= "通栏广告":this.temp.type
          this.temp.type == 2 ? this.temp.type= "区域广告":this.temp.type
          this.temp.type == 3 ? this.temp.type= "飘窗广告":this.temp.type
        })
      } else {
        this.resetTemp()
        this.dialogStatus = 'create'
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      let { ...newTemp} = this.temp
      console.log(newTemp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.createDataLoading=true;
          createAdPos(newTemp).then(res => {
            // console.log(res)
            operationMsg.apply(this,[res.data.code,'添加广告位'])
            this.dialogFormVisible = false;
            this.createDataLoading=false;
          })
        }
      })
    },

    updateData() {
      delete this.temp.createTime
      delete this.temp.updateTime
      this.temp.type == "通栏广告"?this.temp.type=1 :this.temp.type
      this.temp.type == "区域广告"?this.temp.type=2 :this.temp.type
      this.temp.type == "飘窗广告"?this.temp.type=3 :this.temp.type
      this.$refs['dataForm'].validate((valid) => {
      // console.log(valid);
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // console.log(tempData);
          updateAdPos(tempData).then(res => {
            // console.log(res);
            operationMsg.apply(this,[res.data.code,'广告位更新'])
            this.dialogFormVisible = false
          })
        }
      })
    }
  }
}
</script>
<style>
 .adPos .el-dialog__body {
   padding: 30px 84px;
 }
</style>
