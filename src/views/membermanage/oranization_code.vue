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
        <el-select placeholder="全部" v-model="listQuery.type">
          <el-option label="全部" :value='null'></el-option>
          <el-option label="正式" :value='1'></el-option>
          <el-option label="试用" :value='2'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row stripe style="width: 100%" @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
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
          <span v-if="scope.row.type=== 1">正式</span>
          <span v-else style="color: red;">试用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="机构码版本">
        <template slot-scope="scope">
          <span v-if="scope.row.version=== 1">网络版</span>
          <span v-else style="color: red;">镜像版</span>
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
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="temp" label-position="right" label-width="120px"
               style='margin-left:50px;'>
        <el-form-item label="机构名称：" prop="name">
          <el-col :span="12">
            <el-input v-model="temp.name" style="width:200px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item style="margin-left: 168px;" label="机构地址：" prop="address">
          <el-col :span="12">
            <el-input v-model="temp.address" style="width:200px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="创建人：" prop="creater">
          <el-col :span="12">
            <el-input v-model="temp.creater" :disabled="dialogStatus=='update'" readonly></el-input>
          </el-col>
        </el-form-item>
        <el-form-item style="margin-left: 186px;" label="修改人：" prop="updater">
          <el-col :span="12">
            <el-input v-model="temp.updater" :disabled="dialogStatus=='update'" readonly></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="机构码状态：" prop="status">
          <el-col :span="12">
            <el-select v-model="temp.type">
              <el-option v-for="adType in adTypes" :key="adType.type" :label="adType.label"
                         :value="adType.type"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item style="margin-left: 172px;" label="机构码版本：" prop="version">
          <el-col :span="12">
            <el-select v-model="temp.version" style="width:200px">
              <el-option v-for="adVersion in adVersions" :key="adVersion.version" :label="adVersion.label" :value="adVersion.version"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选择时间：" prop="timeLimit">
          <el-date-picker v-model="temp.timeLimit" value-format="yyyy-MM-dd" type="daterange" :picker-options="dateRange"	range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 20px;" label="机构码：" prop="code">
          <el-col :span="12">
            <el-input v-model="temp.code" style="width:230px" :disabled="dialogStatus=='update'" @blur="isExist"></el-input>
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
            <span class="tip">规范 192.168.1.1-192.168.8.255</span>
            <br>
            <span class="el-form-item__error" v-if="ipErr">{{ipErr}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="已关联IP组：" prop="group">
          <el-col>
            <el-table v-if="group !== []" :data="group" max-height="200" :show-header="false" style="width: 100%">
              <el-table-column label="IP地址" width="180">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" @click="deleteIPRow(scope.$index, group)"></i>
                </template>
              </el-table-column>
            </el-table>
            <el-input v-model="group" style="display:block"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="关联资源分类："  prop="diyTypeCode" style="display: block">
          <el-popover popper-class="category-popover" placement="bottom-start" trigger="click">
            <el-tree :data="navTree" ref="tree" show-checkbox node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps"  @check="setSelect" ></el-tree>
            <el-select v-model="temp.diyTypeCode" value-key="diytypeid" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" style="width:400px;" placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item"></el-option>
            </el-select>
          </el-popover>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" class="form-submit" type="primary" @click="createData">保存</el-button>
        <el-button v-else class="form-submit" type="primary" @click="updateData">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getListAPI, addAPI, updateAPI, deleteAPI, getMessAPI, searchCodeAPI} from '@/api/organization/organizitionCode'
  import { getOptionAPI, getNavAPI } from '@/api/database/video'
  import {operationMsg} from '@/utils/publicFunctions'
  import {getMultipleSelectionIDs} from '@/filters/getIds'
  import VueIp from 'vue-ip';
  import Cookies from 'js-cookie';
  import store from '@/store'

  const adTypes = [
    {label: '正式', type: 1},
    {label: '试用', type: 2}
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
          callback(new Error('机构名称必填'));
        } else {
          callback()
        }
      };
      var validateNumber = (rule, value, callback) => {
        let priceReg = /^(\d|[1-9]\d+)(.\d)?$/;
        if (!priceReg.test(value)) {
          callback(new Error('请输入正整数'));
        } else {
          callback()
        }
      };
      var validateValue = (rule, value, callback) => {
        let reg = /^[a-zA-Z0-9]{6,12}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入6-10位的数字、字母或两者组合'));
        } else {
          callback()
        }
      };
      var validatecode= (rule, value, callback) => {
        console.log(value,222222)
        // if (value) {
          callback();
        // } else {
        //   callback(new Error('请关联资源'))
        // }
      };
      return {
        navTree: [],
        defaultProps: {
          children: 'list',
          label: 'showName'
        },
        diyTypeCode: [],
        authBtns: [],  
        options: [],      
        IPs: '',
        ip1: '127.0.0.1',
        ip2: '127.0.0.2',
        // ip1: '',
        // ip2: '',
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
          type: null,
          beginTime: '',
          endTime: ''
        },
        time: null,
        massQuery: {
          ids: [],
          type: null
        },
        adTypes,
        adVersions,
        temp: {
          IPs: '',
          name: '',
          address: '',
          creater: Cookies.get('userInfo'),
          updater: '',
          type: 1,
          version: 1,
          timeLimit: null,
          code: '',
          useNumber: null,
          ipGroup: '',
          relatedResourceTypes: '',
          diyTypeCode: [],//自定义多选的关联资源分类
        },
        dialogFormVisible: false,
        dialogTreeVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改机构码',
          create: '添加机构码'
        },
        dialogPvVisible: false,
        group: [],
        rules: {
          name: [{type: 'string', required: true, trigger: 'change', validator: validateTitle}],
          type: [{required: true, message: '状态必选', trigger: 'change'}],
          version: [{required: true, message: '版本必选', trigger: 'change'}],
          code: [{required: true, trigger: 'change', validator: validateValue}],
          timeLimit: [{required: true, trigger: 'change', message: '请选择时间'}],
          useNumber: [{required: true, validator: validateNumber, trigger: 'change'}],
          diyTypeCode: [{required: true, trigger: 'change', validator: validatecode}],
        },
        multipleSelection: [],
        isRepeat: 0,
        checkedKeys:[],
        dateRange: {
          disabledDate: (time) => {
            const datetime = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
            let date = Date.parse(datetime)
            return time.getTime() < date
          }
        },
      }
    },
    mounted() {
      this.getOption();
      this.getList()
      this.getNav()
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    },
    methods: {
      getOption(){
        getOptionAPI().then(res => {
          if (res.data.code === 0) {
            this.options = res.data.data.map(item => {
              let { id: diytypeid, ...temp } = item
              return {diytypeid, ...temp}
            })

          } else {
            this.$message.error(`获取分类选择器选项数据失败`)
          }
        })
      },
      setSelect(data, obj){// 改变Tree选中节点时修改select
        // console.log(obj);
        console.log(data, obj,"点击自定义点击自定义点击自定义")
        this.temp.diyTypeCode = obj.checkedNodes.map(node => {
          return {diytypeid: node.id, code: node.code}
        })
        this.$forceUpdate()
        //console.log(this.diyTypeCode);
      },
      setTree(tag){// 删除多选标签设置Tree的选中节点
        if (this.temp.diyTypeCode.length>0) {
          const checkedKeys = getMultipleSelectionIDs(this.temp.diyTypeCode,'diytypeid')
          this.$refs.tree.setCheckedKeys(checkedKeys)
        } else {
          this.$refs.tree.setCheckedKeys([])
        }
      },
      clearCheckedKeys(){//清除分类
        this.$refs.searchTree.setCheckedKeys([])
      },

      getNav(){
        getNavAPI().then(res => {
          res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
          
          console.log(this.navTree,111111111)
        })
      },
      // changeTreeData(list){
      //   // let list = data
      //   let reset=[];
      //   // console.log(list,1)
      //   function mainFun(array,data){
      //     for(let i=0,len=array.length;i<len;i++){
      //       // console.log(array[i],2)
      //       let obj = {}
      //       let item = array[i]
      //       // for(var item in array[i]){
      //         // const { code: id, showName: label, list:children,...temp } = item
      //         // reset.push({ id, label,children })
      //         data.push(item)
      //         if(item.list.length > 0){
      //           mainFun(item.list,data[i].list)
      //         }
      //       // }
      //     }
      //     // data.forEach((el,index) => {
      //     // const { code: id, showName: label, list:children,...temp } = el
      //     //   arr.push({ id, label,children })
      //     //   console.log(arr)
      //     //   if (el.list.length > 0) {
      //     //     formatFun(el.list)
      //     //   }
      //     // })
      //     // reset.push(array[i])
      //   }
      //   mainFun(list,reset);	
      //   console.log(reset,22)
      //   return reset
      // },
      addIP() {
        let ip1 = this.ip1
        let ip2 = this.ip2
        let ipBegan = ip1.substring(ip1.lastIndexOf('.'), 0)
        let ip1Last = ip1.substring(ip1.lastIndexOf('.') + 1, ip1.length)
        let ip2Last = ip2.substring(ip2.lastIndexOf('.') + 1, ip2.length)
        if (ip1 === ip2) {
          if (this.group.indexOf(ip1) < 0) {
            this.group.push(ip1)
            this.temp.IPs += ip1 + ','
          }
        } else {
          for (let index = ip1Last; index <= ip2Last; index++) {
            if (this.group.indexOf(ipBegan + '.' + index) < 0) {
              this.group.push(ipBegan + '.' + index)
              this.temp.IPs += ipBegan + '.' + index + ','
            }
          }
        }
      },
      deleteIPRow(index, rows) {
        rows.splice(index, 1);
        if (this.group.length <= 0) {
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
      },
      handleCurChange(val) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val)
      },

      /*重置*/
      resetFilter() {
        this.listQuery={
          pageNum: 1,
          status: null,
          pageSize: this.listQuery.pageSize,
        }
        this.time = null
        this.getList()
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
      // 检测机构码是否存在
      isExist() {
        return searchCodeAPI({ code: this.temp.code }).then(res => {
          if (res.data.data) {
            this.isRepeat = 1
            this.listQuery.account = ''
            this.$message.error('机构码已存在')
          } else{
            this.isRepeat = 0
          }
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
        // this.ip1 = ''
        // this.ip2 = ''
        this.ip1 = '127.0.0.1',
        this.ip2 = '127.0.0.2',
        this.temp = {
          IPs: '',
          name: '',
          address: '',
          creater: Cookies.get('userInfo'),
          updater: '',
          type: 1,
          version: 1,
          timeLimit: '',
          code: '',
          useNumber: null,
          ipGroup: '',
          relatedResourceTypes: '',
          diyTypeCode: [],//自定义多选的关联资源分类
        }
        this.group = []
      },

      addCode() {
        this.dialogStatus = 'create'
        this.resetTemp()
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },

      createData() {
        document.getElementsByClassName('form-submit').disabled = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isExist().then( res => {
              if(this.isRepeat != 1) {
                this.temp.beginTime = this.temp.timeLimit[0]
                this.temp.endTime = this.temp.timeLimit[1]
                const number = this.temp.IPs.lastIndexOf(',')
                const num = this.temp.IPs.slice(0,number)
                this.group = num.split(',')
                // console.log(String(this.group));
                this.temp.ipGroup = toString(this.group)
                // console.log(num.split(','))
                // this.temp.ipGroup = num.split(',')
                // console.log(this.temp.ipGroup);

                addAPI(this.temp).then(res => {
                  operationMsg.apply(this, [res.data.code, '添加机构码'])
                  this.dialogFormVisible = false
                  document.getElementsByClassName('form-submit').disabled = false
                })
              }
            })
          }
        })
      },


      handleUpdate(row) {
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timeLimit = [row.beginTime,row.endTime]
        // console.log(row.ipGroup.split(','));
        // this.temp.ipGroup = JSON.parse(this.temp.ipGroup)
        // this.temp.group = String(row.ipGroup)
        // console.log(this.temp.ipGroup);
        
        // console.log(this.temp.group);
        // console.log(row.ipGroup.join(','));
        console.log(row,1111);
        console.log(row.ipGroup);  // 127.0.0.1,127.0.0.
        this.temp.ipGroup = row.ipGroup.split(',')
        console.log(this.temp.ipGroup); // ["127.0.0.1", "127.0.0.2", ""]
        this.temp.IPs = String(this.temp.ipGroup)

        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },

      updateData() {
        document.getElementsByClassName('form-submit').disabled = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // tempData.updateTime = new Date()
            // tempData.updateTime = +new Date(tempData.updateTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            console.log(this.temp.timeLimit)
            this.temp.beginTime = this.temp.timeLimit[0]
            this.temp.endTime = this.temp.timeLimit[1]
            const tempData = Object.assign({}, this.temp)
            tempData.updateTime = new Date()
            tempData.updateTime = +new Date(tempData.updateTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            tempData.beginTime = this.temp.timeLimit[0]
            tempData.endTime = this.temp.timeLimit[1]
            console.log(tempData.diyTypeCode)
            tempData.relatedResourceTypes=tempData.diyTypeCode.join(',')//自定义多选的关联资源分类
            addAPI(tempData).then(res => {
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
    color: #000 !important;
  }

  

  .IPinput .active, .IPinput .vue-ip {
    border: 0 !important;
    padding: 0 !important;
  }



  .vue-ip.material-theme input[data-v-042676a4] {
    color: red !important;
  }

  .ipErr {
    border: 1px solid red;
  }

  .tip {
    color: #ccc;
  }

  .resource {
    border-radius: 10px;
  }

  .xyw .filter-container .el-form--inline .el-form-item--medium .el-form-item__content .el-button:not(:last-child) {
    margin-right: 10px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  }
</style>



