<template>
  <div class="app-container calendar-list-container xyw">

    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="addCode">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>
    <el-form inline class="form-inline">
      <el-form-item label="机构名称">
        <el-input placeholder="机构名称" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="机构码">
        <el-input placeholder="机构码" v-model="listQuery.code" clearable></el-input>
      </el-form-item>
      <el-form-item label="机构码状态">
        <el-select placeholder="全部" v-model="listQuery.status">
          <el-option label="全部" :value='null'></el-option>
          <el-option label="正式" :value='1'></el-option>
          <el-option label="试用" :value='2'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
<!--<<<<<<< HEAD
            <el-button @click="handleFilter">检索</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
=======-->
        <el-date-picker v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row stripe style="width: 100%" @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
<!--&gt;>>>>>> xyw-->
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="机构名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="机构码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="机构码状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=== 1">正式</span>
          <span v-else style="color: red;">试用</span>
          <!-- <span>{{scope.row.status}}</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="机构码版本">
        <template slot-scope="scope">
          <span v-if="scope.row.version=== 1">网络版</span>
          <span v-else style="color: red;">镜像版</span>
          <!--  <span>{{scope.row.version}}</span> -->
        </template>
      </el-table-column>
      <el-table-column width="280px" align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="280px" align="center" label="到期时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0"  :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="handleUpdate(scope.row)"></i>

          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0"  :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="padding:0;">
<!--<<<<<<< HEAD
      <el-form :rules="rules" inline ref="dataForm"  :model="temp" label-position="right" label-width="120px" style='margin-left:50px;'>
          <el-form-item label="机构名称：" prop="name">
            <el-col :span="12">
            <el-input v-model="temp.name" placeholder="请输入机构名称" style="width:200px"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="机构地址：" prop="address">
            <el-col :span="12">
            <el-input v-model="temp.address" placeholder="请输入机构地址" style="width:200px"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="创建人：" prop="creater">
            <el-col :span="12">
            <el-input v-model="temp.creater"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="修改人：" prop="updater">
            <el-col :span="12">
            <el-input v-model="temp.updater"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="机构码状态：" prop="status">
            <el-col :span="12">
            <el-select v-model="temp.status" placeholder="请选择">
              <el-option v-for="adType in adTypes" :key="adType.status" :label="adType.label" :value="adType.status"></el-option>
=======-->
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="temp" label-position="right" label-width="120px"
               style='margin-left:50px;'>
        <el-form-item label="机构名称：" prop="name">
          <el-col :span="12">
            <el-input v-model="temp.name" style="width:200px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="机构地址：" prop="address">
          <el-col :span="12">
            <el-input v-model="temp.address" style="width:200px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="创建人：" prop="creater">
          <el-col :span="12">
            <el-input v-model="temp.creater" :disabled="dialogStatus=='update'" readonly></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="修改人：" prop="updater">
          <el-col :span="12">
            <el-input v-model="temp.updater" :disabled="dialogStatus=='update'" readonly></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="机构码状态：" prop="status">
          <el-col :span="12">
            <el-select v-model="temp.status">
              <el-option v-for="adType in adTypes" :key="adType.status" :label="adType.label"
                         :value="adType.status"></el-option>
<!--&gt;>>>>>> xyw-->
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="机构码版本：" prop="version">
          <el-col :span="12">
            <el-select v-model="temp.version" style="width:200px">
              <el-option v-for="adVersion in adVersions" :key="adVersion.version" :label="adVersion.label" :value="adVersion.version"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间：" prop="beginTime">
          <el-col :span="12">
            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="temp.beginTime" :picker-options="pickerOptions0" style="width:200px"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="到期时间：" prop="endTime">
          <el-col :span="12">
            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="temp.endTime" :picker-options="pickerOptions1" style="width:200px"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="机构码：" prop="code">
          <el-col :span="12">
            <el-input v-model="temp.code" style="width:200px" :disabled="dialogStatus=='update'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="可使用次数：" prop="useNumber">
          <el-col :span="12">
            <el-input v-model="temp.useNumber" :value="1" style="width:200px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="IP地址范围：">
          <el-col>
            <div :class="IPinput">
              <vue-ip :ip="ip1" :on-change="ipChange" theme="material"></vue-ip>
            </div>
            <span>-</span>
            <div :class="IPinput">
              <vue-ip :ip="ip2" :on-change="ip2Change" theme="material"></vue-ip>
            </div>
            <el-button type="success" round @click="addIP" v-if="ipErr === false">添加</el-button>
            <br>
            <span class="el-form-item__error" v-if="ipErr">{{ipErr}}</span>
          </el-col>
          <!-- <el-col :span="1">&nbsp;</el-col> -->
        </el-form-item>
        <el-form-item label="已关联IP：" prop="IPs">

          <el-col>
            <el-table v-if="this.temp.ipGroup !== []" :data="this.temp.ipGroup" max-height="200" :show-header="false" style="width: 100%">
              <el-table-column label="IP地址" width="180">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" @click="deleteIPRow(scope.$index, temp.ipGroup)"></i>
                </template>
              </el-table-column>
            </el-table>
            <el-input v-model="temp.IPs" style="display:block"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="关联资源分类：" prop="relatedResourceTypes">
          <el-col>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp.relatedResourceTypes" style="width:400px;"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
<!--<<<<<<< HEAD
        <el-button v-if="dialogStatus=='create'" class="form-submit" @click="createData">新建</el-button>
        <el-button v-else class="form-submit" @click="updateData">保存</el-button>
=======-->
        <el-button v-if="dialogStatus=='create'" class="form-submit" type="primary" @click="createData">保存</el-button>
        <el-button v-else class="form-submit" type="primary" @click="updateData">保存</el-button>
<!--&gt;>>>>>> xyw-->
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getListAPI, addAPI, updateAPI, deleteAPI, getMessAPI} from '@/api/organization/organizitionCode'
  import {operationMsg} from '@/utils/publicFunctions'
  import {getMultipleSelectionIDs} from '@/filters/getIds'
  import VueIp from 'vue-ip';
  import Cookies from 'js-cookie';
  import store from '@/store'

  const adTypes = [
    {label: '正式', status: 1},
    {label: '试用', status: 2}
  ]
  const adVersions = [
    {label: '网络版', version: 1},
    {label: '镜像版', version: 2}
  ]

  export default {
    components: {
      VueIp
    },
    data() {
      var validateTitle = (rule, value, callback) => {
        if (value.replace(/\s+/g, "") == '') {
          // value = value.replace(/\s+/g,"")
          callback(new Error('机构名称必填'));
        } else {
          callback()
        }
      };
      var validateNumber = (rule, value, callback) => {
        let priceReg = /^(\d|[1-9]\d+)(.\d)?$/;
        if (!priceReg.test(value)) {
          callback(new Error('请输入使用次数'));
        } else {
          callback()
        }
      };
      var validateValue = (rule, value, callback) => {
        let reg = /^[a-zA-Z0-9]{6,12}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入英文或数字开头6-12位代码'));
        } else {
          callback()
        }
      };
/*<<<<<<< HEAD
    return {
      IPs:'',
      ip1: '127.0.0.1',
      ip2:'127.0.0.2',
      IPinput:'IPinput',
      ipErr:false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        id:0,
        pageNum: 1,
        pageSize: 100,
        name:'',
        status:'',
        beginTime:'',
        endTime:''
      },
      time:'',
      massQuery: {
        ids: [],
        status:null
      },
      adTypes,
      adVersions,
      temp: {
        IPs:'',
        name:'',
        address:'',
        creater:'',
        updater:'',
        status:1,
        version:1,
        beginTime:'',
        endTime:'',
        code:'',
        useNumber:0,
        ipGroup:[],
        relatedResourceTypes:'',
        id:0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改机构码',
        create: '添加机构码'
      },
      dialogPvVisible: false,
      rules: {
        name: [{ type: 'string', required: true, trigger: 'blur', validator: validateTitle }],
        status: [{ required: true, message: '状态必选', trigger: 'blur' }],
        version: [{ required: true, message: '版本必选', trigger: 'change' }],
        code:[{ required: true,  trigger: 'blur', validator: validateValue}],
        beginTime:[{required: true,  trigger: 'blur',message:'时间为必填项'}],
        endTime:[{required: true,  trigger: 'blur',message:'时间为必填项'}],
        useNumber: [{ required: true, validator: validateNumber }],
        relatedResourceTypes:[{required: true, message: '关联资源分类必填', trigger: 'blur'}],
        IPs: [{required: true, trigger:'change', message: '请关联ip'}]
      },
      multipleSelection:[]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    addIP(){
      let ip1 = this.ip1
      let ip2 = this.ip2
      let ipBegan = ip1.substring(ip1.lastIndexOf('.'),0)
      let ip1Last = ip1.substring(ip1.lastIndexOf('.')+1,ip1.length)
      let ip2Last = ip2.substring(ip2.lastIndexOf('.')+1,ip2.length)
=======*/
      return {
        authBtns: [],        
        IPs: '',
        ip1: '127.0.0.1',
        ip2: '127.0.0.2',
        IPinput: 'IPinput',
        ipErr: false,
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          name: '',
          status: null,
          beginTime: '',
          endTime: ''
        },
        time: null,
        massQuery: {
          ids: [],
          status: null
        },
        adTypes,
        adVersions,
        temp: {
          IPs: '',
          name: '',
          address: '',
          creater: Cookies.get('userInfo'),
          updater: Cookies.get('userInfo'),
          status: 1,
          version: 1,
          beginTime: new Date(),
          endTime: '',
          code: '',
          useNumber: 0,
          ipGroup: [],
          relatedResourceTypes: '',
          id: 0
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改机构码',
          create: '添加机构码'
        },
        dialogPvVisible: false,
        rules: {
          name: [{type: 'string', required: true, trigger: 'blur', validator: validateTitle}],
          status: [{required: true, message: '状态必选', trigger: 'blur'}],
          version: [{required: true, message: '版本必选', trigger: 'change'}],
          code: [{required: true, trigger: 'blur', validator: validateValue}],
          beginTime: [{required: true, trigger: 'blur', message: '时间为必填项'}],
          endTime: [{required: true, trigger: 'blur', message: '时间为必填项'}],
          useNumber: [{required: true, validator: validateNumber}],
          relatedResourceTypes: [{required: true, message: '关联资源分类必填', trigger: 'blur'}],
          IPs: [{required: true, trigger: 'change', message: '请关联ip'}]
        },
        multipleSelection: [],
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.temp.endTime != "") {
              return time.getTime() < Date.now() || time.getTime() <  Date.parse(this.temp.endTime);
            } else {
              return time.getTime() < Date.now();
            }
/*>>>>>>> xyw*/

          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            return time.getTime() <  Date.parse(this.temp.beginTime) || time.getTime() < Date.now();
          }
        },
      }
    },
    mounted() {
      if( ifUndefined(store.getters.orgCodeSerKeys.pageNum) ){
        this.listQuery = store.getters.orgCodeSerKeys
        console.log(this.listQuery,'读取搜索条件成功')
        if(ifUndefined(this.listQuery.beginTime) || ifUndefined(this.listQuery.endTime)){
          this.time = []
          this.time[0] = this.listQuery.beginTime
          this.time[1] = this.listQuery.endTime
        }
      }
      this.getList()
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    },
    methods: {
      addIP() {
        let ip1 = this.ip1
        let ip2 = this.ip2
        let ipBegan = ip1.substring(ip1.lastIndexOf('.'), 0)
        let ip1Last = ip1.substring(ip1.lastIndexOf('.') + 1, ip1.length)
        let ip2Last = ip2.substring(ip2.lastIndexOf('.') + 1, ip2.length)

        if (ip1 === ip2) {
          if (this.temp.ipGroup.indexOf(ip1) < 0) {
            this.temp.ipGroup.push(ip1)
            this.temp.IPs += ip1 + ','
          }
        } else {
          for (let index = ip1Last; index <= ip2Last; index++) {
            if (this.temp.ipGroup.indexOf(ipBegan + '.' + index) < 0) {
              this.temp.ipGroup.push(ipBegan + '.' + index)
              this.temp.IPs += ipBegan + '.' + index + ','
            }
          }
        }
      },
      deleteIPRow(index, rows) {
        rows.splice(index, 1);
        if (this.temp.ipGroup.length <= 0) {
          this.temp.IPs = ''
        }
      },
      ipChange(ip, port, valid) {
        this.testGetway('ip1', ip, valid)
      },
      ip2Change(ip, port, valid) {
        this.testGetway('ip2', ip, valid)
      },
      testGetway(ipName, ip, valid) {
        // 判断ip范围是否正确
        if (!valid) {
          this.ipErr = 'IP范围不正确'
          this.IPinput = 'IPinput ipErr'
        } else {
          this[ipName] = ip
          let ip1 = this.ip1
          let ip2 = this.ip2
          ip1 = ip1.substring(ip1.lastIndexOf('.') + 1, ip1.length)
          ip2 = ip2.substring(ip2.lastIndexOf('.') + 1, ip2.length)
          if (this.ip1.substring(this.ip1.lastIndexOf('.'), 0) !== this.ip2.substring(this.ip2.lastIndexOf('.'), 0) || ip1 > ip2) {
            this.ipErr = '网关不一致或范围有误'
            this.IPinput = 'IPinput ipErr'
          } else {
            this[ipName] = ip
            this.IPinput = 'IPinput'
            this.ipErr = false
          }
        }
/*<<<<<<< HEAD
      }
    },
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    resetFilter(){
      this.listQuery={
        pageNum: 1,
        pageSize: this.listQuery.pageSize
      }
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection)
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(response=>{
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败');
=======*/
      },
      handleCurChange(val) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val)
      },
      /*重置*/
      resetFilter() {
        console.log(this.listQuery.status)
        /*this.time[0]='';
        this.time[1]='';*/
        this.listQuery={
          pageNum: 1,
          status: null,
          pageSize: this.listQuery.pageSize,
        }
        this.time = null
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection)
      },
      getList() {
        this.listLoading = true
        getListAPI(this.listQuery).then(res => {
          if (res.data.code === 0) {
            this.list = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error('获取数据失败');
          }
          this.listLoading = false
        })
      },
      /*检索*/
      handleFilter() {
        store.dispatch('SetOrgCodeSerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        if (this.time) {
          this.listQuery.beginTime = this.time[0]
          this.listQuery.endTime = this.time[1]
        } else {
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }
        this.listQuery.pageNum = 1
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
      singleDelete(id) {
        this.$confirm('确定要删除选择的机构码吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAPI(id).then(res => {
            operationMsg.apply(this, [res.data.code, '删除'])
          })
        });
      },
      resetTemp() {
        this.temp = {
          IPs: '',
          name: '',
          address: '',
          creater: Cookies.get('userInfo'),
          updater: Cookies.get('userInfo'),
          status: 1,
          version: 1,
          beginTime: new Date(),
          endTime: '',
          code: '',
          useNumber: 0,
          ipGroup: [],
          relatedResourceTypes: '',
          id: 0
/*>>>>>>> xyw*/
        }
      },
      addCode() {
        this.dialogStatus = 'create'
        this.resetTemp()
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
/*<<<<<<< HEAD
      });
    },
    resetTemp(){
      this.temp={
        IPs:'',
        name:'',
        address:'',
        creater:'',
        updater:'',
        status:1,
        version:1,
        beginTime:'',
        endTime:'',
        code:'',
        useNumber:0,
        ipGroup:[],
        relatedResourceTypes:'',
        id:0
      }
    },
    addCode() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(()=>{
        this.$refs['dataForm'].clearValidate()
      })
=======*/

      },
      createData() {
        document.getElementsByClassName('form-submit').disabled = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addAPI(this.temp).then(res => {
              operationMsg.apply(this, [res.data.code, '添加机构码'])
              this.dialogFormVisible = false
              document.getElementsByClassName('form-submit').disabled = false
            })
          }
        })
      },
      handleUpdate(row) {
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.temp = Object.assign({}, row) // copy obj
        this.temp.ipGroup = JSON.parse(this.temp.ipGroup)
        this.temp.IPs = String(this.temp.ipGroup)
/*>>>>>>> xyw*/

        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        document.getElementsByClassName('form-submit').disabled = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.updateTime = new Date()
            tempData.updateTime = +new Date(tempData.updateTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateAPI(tempData).then(res => {
              if (res.data.code === 0) {
                this.getList()
                this.$message.success('机构码更新成功')
              } else {
                this.$message.error('机构码更新失败')
              }
              this.dialogFormVisible = false
              document.getElementsByClassName('form-submit').disabled = false
            })
          }
        })
      }
    }
  }
</script>
<style lang="css" scoped>
  .IPinput {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    display: inline-block;
  }

  .IPinput .active, .IPinput .vue-ip {
    border: 0 !important;
    padding: 0 !important;
  }

  .ipErr {
    border: 1px solid red;
  }
  .xyw .filter-container .el-form--inline .el-form-item--medium .el-form-item__content .el-button:not(:last-child) {
    margin-right: 10px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  }
</style>
