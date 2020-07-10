<template>
  <el-container>
    <el-aside width="200px" class="tree-aside">
      <el-tree :data="modules" ref="tree" :props="defaultProps" show-checkbox  @check="handleCurrentChange" node-key="mpId" :default-checked-keys="[treeData.mpId]" :default-expanded-keys="[treeData.pid]" :expand-on-click-node="false" accordion check-on-click-node highlight-current></el-tree>
    </el-aside>

    <el-main>
      <div class="nav-buttons-container">
        <el-button  @click="handleForm">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
        <el-button  @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
      </div>
      <el-table :key='tableKey' :data="list" @selection-change="handleSelectionChange" border highlight-current-row v-loading="listLoading" stripe element-loading-text="给我一点时间">
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="按钮名称" min-width="90" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="按钮ID" min-width="90" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.idName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="按钮图标" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.icon}}</span>
          </template>
        </el-table-column>
        <el-table-column label="按钮位置" width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.inLine===0">普通按钮</span>
            <span v-else-if="scope.row.inLine===1">行内按钮</span>
          </template>
        </el-table-column>
        <el-table-column label="按钮事件" min-width="190" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.buttonText}}</span>
          </template>
        </el-table-column>
        <el-table-column label="href" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.href}}</span>
          </template>
        </el-table-column>
        <el-table-column label="按钮排序" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="small-padding fixed-width" label="操作" width="70" align="center">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleForm(scope.row)" title="修改"></i>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
        <el-form ref="dataForm" :model="temp" :rules="rules" label-position="right" label-width="100px" style='margin-right:10px;'>
          <el-form-item label="按钮ID：" prop="idName">
            <el-input v-model="temp.idName"></el-input>
          </el-form-item>
          <el-form-item label="按钮名称：" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item label="按钮位置：" prop="inLine">
            <el-radio-group v-model="temp.inLine">
              <el-radio :label="1">行内按钮</el-radio>
              <el-radio :label="0">普通按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="按钮事件：" prop="buttonText">
            <el-input v-model="temp.buttonText"></el-input>
          </el-form-item>
          <el-form-item label="href：" prop="href">
            <el-input v-model="temp.href"></el-input>
          </el-form-item>
          <el-form-item label="按钮图标：" prop="icon">
            <el-input v-model="temp.icon"></el-input>
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input v-model="temp.sort"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formSubmit">保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </el-main>

  </el-container>
</template>

<script>
import { getListAPI, addAPI, updateAPI, deleteAPI, getModuleAPI } from '@/api/authorization-management/button'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { formatTree } from '@/utils/format'
import store from '@/store'
export default {
  data() {
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      listLoading: true,
      treeData: {
        mpId: 10,
        pid: 1
      },
      ids: [],
      temp: {},
      dialogVisible: false,
      textMap: {
        update: '修改按钮',
        create: '添加按钮'
      },
      modules:[],
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      },
      rules: {
        idName: [{ type: 'string', required: true, trigger: 'change', message: '未填写', whitespace: true }],
        name: [{ type: 'string', required: true, trigger: 'change', message: '未填写', whitespace: true }],
        inLine: [{ type: 'number', required: true, trigger: 'change', message: '未选择' }],
        sort: [{ trigger: 'change', pattern: /^([1-9]\d*|0)$/, message: '请输入0及正整数表示的排序号' }]
      },
      dialogStatus: '',
      dialogFormVisible: false,
      multipleSelection: []
    }
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getModule().then(() => {
      this.getList()
    })
  },
  methods: {
    formSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.sort = Number(this.temp.sort)
          this.dialogStatus === 'create' ? this.invokeApi(addAPI) : this.invokeApi(updateAPI)
        }
      })
    },
    invokeApi(api){
      api(this.temp).then(res => {
        operationMsg.apply(this, [res.data.code, this.textMap[this.dialogStatus] ])
        res.data.status ? this.dialogFormVisible = false : true
      })
    },
    handleForm(row){
      if (row.opId) {
        this.temp = Object.assign({}, row)
        this.temp.mpId = this.treeData.mpId
        this.temp.mpcode = this.treeData.code
        this.dialogStatus = 'update'
      } else {
        this.resetTemp()
        this.dialogStatus = 'create'
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        idName: '',
        name: '',
        buttonText: '',
        icon: '',
        href: '',
        sort: 0,
        inLine: 0,
        mpId: this.treeData.mpId,
        mpcode: this.treeData.code
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.ids = getMultipleSelectionIDs(this.multipleSelection,'opId') : true
    },
    massDelete(){
      if(this.multipleSelection.length!=0){
        confirm.apply(this,['确认删除选择的按钮吗？']).then(() => {
          deleteAPI(this.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
          })
        });
      } else {
        this.$message.warning('请先选择需要删除的内容')
      }
    },
    handleCurrentChange(data, checked){ //点击树获取table数据
      // console.log(data, checked)
      this.treeData = data
      this.$refs.tree.setCheckedKeys([this.treeData.mpId])
      this.getList()
    },
    getList() {
      this.listLoading = true
      getListAPI(this.treeData.mpId).then(res => {
        res.data.code === 0 ? this.list = res.data.data : this.$message.error('获取数据失败')
        this.listLoading = false
      })
    },
    getModule(){
      return getModuleAPI().then(res => {
        if (res.data.code === 0) {
          this.modules = res.data.data
          formatTree(this.modules)
          this.treeData = this.modules[0].children[0]
        } else {
          this.$message.error('获取模块失败')
        }
      })
    }
  }
}
</script>
