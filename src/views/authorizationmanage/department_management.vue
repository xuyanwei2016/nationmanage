<template>
  <div class="app-container calendar-list-container">

    <div class="nav-buttons-container">
      <el-button v-waves v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleCreate">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-waves v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <tree-table :data="list" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border v-loading="listLoading" :par-selection="handleSelectionChange" :getFormatData="getFormatData" label-name="部门名称" first-column="departmentName">
      <el-table-column align="center" label="部门代号" min-width="70">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="介绍" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.intro}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="handleUpdate(scope.row)"></i><!--
          --><i :class="authBtns.filter(i => i.idName=='addbtn2')[0].icon" v-if="authBtns.filter(i => i.idName=='addbtn2').length > 0" :title="authBtns.filter(i => i.idName=='addbtn2')[0].name" @click="handleCreateChild(scope.row)"></i><!--
          --><i :class="authBtns.filter(i => i.idName=='setbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='setbtn').length > 0" :title="authBtns.filter(i => i.idName=='setbtn')[0].name" @click="handleAuthorization(scope.row)"></i>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px" style="margin-right:10px;">
        <el-form-item v-if="dialogStatus=='createChild'" label="父级部门：" prop="parentName">
          <el-input v-model="parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门名称：" prop="departmentName">
          <el-input v-model="temp.departmentName"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="intro">
          <el-input v-model="temp.intro"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button v-if="dialogStatus=='update'" @click="updateData" >保存</el-button>
        <el-button v-else @click="createData" >保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改模块权限" :visible.sync="dialogPvVisible" width="30%">
      <el-tree :data="modules" ref="tree" node-key="mpId" :default-checked-keys="checkedIds" :props="defaultProps" show-checkbox>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moduleSubmit">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import waves from '@/directive/waves' // 水波纹指令
import treeTable from '@/components/TreeTable'
import treeToArray from '@/views/example/table/treeTable/customEval'
import { getListAPI, deleteAPI, updateAPI, addAPI, getModuleAPI, updateModuleAPI } from '@/api/authorization-management/department'
import getTreeId from '@/filters/getTreeid'
import { operationMsg, confirm } from '@/utils/publicFunctions'
// import { getMaxSort } from '@/filters/getIds'
import store from '@/store'

export default {
  name: 'customTreeTableDemo',
  directives: { waves },
  components: { treeTable },
  data() {
    var validateParam = (rule, value, callback) => {
      if( value.replace(/\s+/g,"") == '' ){
        callback(new Error('未填写'));
      } else {
        callback()
      }
    };
    return {
      authBtns: [],
      func: treeToArray,
      expandAll: false,
      list: [],
      listLoading: true,
      temp: {
        departmentId: null,
        departmentName : null,
        intro: '',
        parentId: 0
      },
      parentName:'',
      modules:[],
      authParams:{
        pId: 0,
        deptId: null
      },
      form:{
        departmentId: 0,
        mpIdList: []
      },
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      },
      formatList:[],
      ids: [],
      checkedIds:[],
      textMap: {
        update: '修改部门',
        create: '添加部门',
        createChild: '添加子部门'
      },
      rules: {
        departmentName: [{ type: 'string', required: true, trigger: 'change', validator: validateParam }]
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogPvVisible: false,
      multipleSelection:[],
      args: [null, null, 'timeLine']
    }
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList()
  },
  methods: {
    handleAuthorization(row){
      // console.log(row)
      this.authParams.pId = row.parentId
      this.authParams.deptId = row.departmentId
      // console.log(this.authParams)
      getModuleAPI(this.authParams).then(res => {
        if (res.data.code === 0) {
          // console.log(res.data.data)
          this.modules = res.data.data.mpList
          this.form.departmentId = row.departmentId
          this.checkedIds = res.data.data.mpidList
          console.log(this.checkedIds)
          this.dialogPvVisible = true
        } else {
          this.$message.error('获取模块权限失败');
          console.log(res.data.data)
        }
      })
    },
    moduleSubmit() {
      this.form.mpIdList = this.$refs.tree.getCheckedKeys()
      console.log(this.form)
      updateModuleAPI(this.form).then(res => {
        operationMsg.apply(this,[res.data.code,'修改模块权限'])
        res.data.code === 0 ? this.dialogPvVisible = false : true
      })
    },
    getFormatData(data){
      this.formatList = data
      // console.log(this.formatList)
    },
    getList() {
      this.listLoading = true
      getListAPI().then(response => {

        if(response.data.code === 0){
          const originalData = JSON.stringify(response.data.data)
          this.list = JSON.parse( originalData.replace(/list/ig, "children") )
          console.log(this.list)
        } else {
          this.$message.error('获取数据失败');
          console.log(response.data.data)
        }
        this.listLoading = false
      })
    },
    massDelete(){
      if(this.multipleSelection.length!=0){
        confirm.apply(this,['确认删除选择的部门吗？']).then(() => {
          deleteAPI(this.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
          })
        });
      } else {
        this.$message.warning('请先选择需要操作的条目')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = getTreeId(this.multipleSelection,'children','departmentId')

      console.log(this.ids)
    },
    resetTemp() {
      this.temp = {
        departmentId: null,
        departmentName : null,
        intro: '',
        parentId: 0
      }
    },
    handleCreate() {
      // this.maxSort = getMaxSort(this.list)
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateChild(row){
      this.resetTemp()
      this.temp.parentId = row.departmentId
      this.parentName = row.departmentName
      this.dialogStatus = 'createChild'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addAPI(this.temp).then(res => {
            console.log(res)
            operationMsg.apply(this, [res.data.code, this.textMap[this.dialogStatus] ])
            res.data.code === 0 ? this.dialogFormVisible = false : true
          })
        }
      })
    },
    handleUpdate(row) {
      let {departmentId,parentId,departmentName,intro} = row
      this.temp = {departmentId,parentId,departmentName,intro}
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateAPI(tempData).then(res => {
            operationMsg.apply(this,[res.data.code,'部门更新'])
            res.data.code === 0 ? this.dialogFormVisible = false : true
          })
        }
      })
    }
  }
}
</script>
