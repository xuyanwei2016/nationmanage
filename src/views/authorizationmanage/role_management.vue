<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleCreate">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="角色名" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.creater}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.modifIer}}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.modifDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色介绍" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.intro}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="handleUpdate(scope.row)"></i>
          <i :class="authBtns.filter(i => i.idName=='setbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='setbtn').length > 0" :title="authBtns.filter(i => i.idName=='setbtn')[0].name" @click="openRoleList(scope.row.roleId)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style='margin-right:10px;'>
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="temp.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍：" prop="intro">
          <el-input v-model="temp.intro"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" @click="createData">保存</el-button>
        <el-button v-else @click="updateData" >保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置权限" :visible.sync="dialogPvVisible" width="30%">
      <el-tree :data="modules" ref="tree" show-checkbox check-strictly node-key="id" :default-checked-keys="checkedIds" :props="defaultProps" @check="setChecked">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moduleSubmit">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import Upload from "@/components/Upload/singleImage3";
// import MDinput from "@/components/MDinput";
import { getListAPI, deleteAPI, updateAPI, addAPI, authorityAPI, getModuleAPI, getRoleBtnAPI, getBtnsAPI, isExistAPI } from '@/api/authorization-management/role'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMaxSort, getMultipleSelectionIDs, insertBtnRes } from '@/filters/getIds'
import store from '@/store'

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (value.replace(/\s+/g,"") == ''){
        callback(new Error('未填写'));
      } else {
        let params = { roleName: value }
        this.dialogStatus === 'update' ? params.id = this.temp.roleId : params
        isExistAPI(params).then(res => {
          if(res.data.code === 0){
            res.data.data === false ? callback() : callback(new Error(`角色${value}已存在！`));
          } else {
            callback(new Error(`错误Error：${res.data.msg}`));
          }
        })
      }
    };
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      type: '',
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100
      },
      checked: false,
      maxSort: 0,
      ids: [],
      temp: {
        roleName: '',
        intro: '',
        creater: 'admin'
      },
      modules:[],
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      },
      checkedIds:[],
      formData:{
        idList: [],
        roleId: 0
      },
      rules: {
        roleName: [{ type: 'string', required: true, trigger: 'change', validator: validateName }]
      },
      dialogVisible: false,
      textMap: {
        update: '修改角色',
        create: '添加角色'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogPvVisible: false,
      multipleSelection:[],
      roleListRow:{}
    }
  },
  created() {
    this.getModule().then(() => {
      this.getBtn()
    })
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList()
  },
  methods: {
    // 当选框被点击时修改已选id
    setChecked(){
      this.checkedIds = this.$refs.tree.getCheckedKeys()
    },
    openRoleList(id){
      // let roleId = row.roleId
      this.dialogPvVisible = true
      getRoleBtnAPI(id).then(res => {
        if (res.data.code === 0) {
          res.data.data.length>0 ? this.checkedIds = getMultipleSelectionIDs(res.data.data,'opId') : this.checkedIds = []
          this.$refs.tree.setCheckedKeys(this.checkedIds)
          this.formData.roleId = id
        } else {
          this.$message.error('获取已有按钮失败')
          console.log(res.data.data)
        }
      })
    },
    moduleSubmit(){
      this.formData.idList = this.$refs.tree.getCheckedKeys()
      authorityAPI(this.formData).then(res => {
        operationMsg.apply(this,[res.data.code,'修改角色权限'])
        res.data.status ? this.dialogPvVisible = false : true
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multipleSelection.length>0 ? this.ids = getMultipleSelectionIDs(this.multipleSelection,'roleId') : true
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(response => {
        // console.log(response)
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    massDelete(){
      if(this.multipleSelection.length!=0){
        confirm.apply(this,['确认删除选择的用户吗？']).then(() => {
          deleteAPI(this.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
          })
        });
      } else {
        this.$message.warning('请先选择需要删除的内容')
      }
    },
    resetTemp() {
      this.temp = {
        roleName: '',
        intro: '',
        creater: 'admin'
      };
    },
    handleCreate(){
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      // console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addAPI(this.temp).then(res => {
            operationMsg.apply(this,[res.data.code,'角色创建'])
            res.data.code === 0 ? this.dialogFormVisible = false : true
          })
        }
      })
    },
    handleUpdate(row) {
      let { roleName, intro, roleId } = row
      this.temp = { roleName, intro, roleId }
      this.temp.modifIer = 'admin'
      console.log( this.temp )
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
            operationMsg.apply(this,[res.data.code,'角色更新'])
            res.data.code === 0 ? this.dialogFormVisible = false : true
          })
        }
      })
    },
    getBtn(){
      getBtnsAPI().then(res => {
        if (res.data.code === 0) {
          // const originalStr = JSON.stringify(res.data.data)
          // const formatData = JSON.parse( originalStr.replace(/opId/ig, "id").replace(/buttonName/ig, "moduleName") )
          const formatData = res.data.data.map(el => {
            const { opId: id, name: moduleName, ...temp } = el
            return { id, moduleName, ...temp }
          })
          insertBtnRes(this.modules, formatData)
          console.log(this.modules);

        } else {
          this.$message.error('获取全部按钮失败')
          console.log(res.data.data)
        }
      })
    },
    getModule(){
      return getModuleAPI().then(res => {
        if (res.data.code === 0) {
          const originalData = JSON.stringify(res.data.data)
          this.modules = JSON.parse( originalData.replace(/mpId/ig, "id") )
        } else {
          this.$message.error('获取模块失败');
        }
      })
    }
  }
}
</script>
