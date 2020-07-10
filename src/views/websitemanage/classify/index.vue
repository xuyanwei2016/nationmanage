<template>
  <div class="app-container calendar-list-container">

    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('btnadd') >= 0" @click="handleCreate">
        {{authBtns.filter(i => i.idName=='btnadd')[0].name}}<i v-if="authBtns.filter(i => i.idName=='btnadd').length>0 && authBtns.filter(i => i.idName=='btnadd')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('btnadd')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchdelete') >= 0" @click="massDelete">
        {{authBtns.filter(i => i.idName=='batchdelete')[0].name}}
        <i v-if="authBtns.filter(i => i.idName=='batchdelete').length>0 && authBtns.filter(i => i.idName=='batchdelete')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchdelete')].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button @click="expandAll = true">全部展开</el-button>
      <el-button @click="expandAll = false">全部收起</el-button>
    </div>

    <tree-table :data="list" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border v-loading="listLoading"
    :getFormatData="getFormatData" label-name="分类名称" stripe first-column='typeName' :par-selection="handleSelectionChange">
      <el-table-column align="center" label="排序号" min-width="70">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="旧编码" min-width="70">
        <template slot-scope="scope">
          <span>{{scope.row.oldCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类编号" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{path:`classify/recommended_goods`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='recommend').length > 0">
            <i :class="authBtns.filter(i => i.idName=='recommend')[0].icon" :title="authBtns.filter(i => i.idName=='recommend')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='btnedit')[0].icon" v-if="authBtns.filter(i => i.idName=='btnedit').length > 0" @click="handleUpdate(scope.row)" :title="authBtns.filter(i => i.idName=='btnedit')[0].name"></i>
          <i :class="authBtns.filter(i => i.idName=='addchild')[0].icon" v-if="authBtns.filter(i => i.idName=='addchild').length > 0" @click="handleCreateChild(scope.row)" :title="authBtns.filter(i => i.idName=='addchild')[0].name"></i>
          <i :class="authBtns.filter(i => i.idName=='btnremove')[0].icon" v-if="authBtns.filter(i => i.idName=='btnremove').length > 0" @click="singleDelete(scope.row)" :title="authBtns.filter(i => i.idName=='btnremove')[0].name"></i>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px" style="margin-right:10px;">
        <el-form-item v-if="dialogStatus=='createChild' || dialogStatus=='updateChild'" label="上级分类：" prop="parentName">
          <el-input v-model="parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称：" prop="typeName">
          <el-input v-model="temp.typeName" @input="handleShowname"></el-input>
        </el-form-item>
        <el-form-item label="显示名称：" prop="showName">
          <el-input v-model="temp.showName"></el-input>
        </el-form-item>
        <el-form-item label="分类编号：" prop="code">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="旧编码：" prop="oldCode">
          <el-input v-model="temp.oldCode"></el-input>
        </el-form-item>
        <el-form-item label="排序号：" prop="sort">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
      </el-form>
      <div style='margin-left:10px;color:#E59728;'>
        1.前台分类使用”显示名称“<br>
        2.当前最大排序号为{{maxSort}}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='update' || dialogStatus=='updateChild'" @click="updateData" :loading="loading">保存</el-button>
        <el-button v-else @click="createData" :loading="loading">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import treeTable from '@/components/TreeTable'
import treeToArray from '@/views/example/table/treeTable/customEval'
import { getClassify, updateClassify, addClassify, deleteClassify, isExist, codeExist } from '@/api/website-management/classify'
import getTreeId from '@/filters/getTreeid'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMaxSort } from '@/filters/getIds'
import store from '@/store'

export default {
  name: 'customTreeTableDemo',
  components: { treeTable },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.length>30) {
        callback(new Error(`名称最多30字！`));
      } else if (value.replace(/\s+/g,"") == '') {
        callback(new Error(`请输入分类名称`))
      } else {
        let params = { typeName: value, parentId: this.temp.parentId }
        this.dialogStatus === 'update'|| this.dialogStatus === 'updateChild' ? params.id = this.temp.id : params
        isExist(params).then(res => {
          res.data.code === 0 ? res.data.data === false ? callback() : callback(new Error(`分类名称"${value}"已存在！`)) : callback(new Error(`错误Error：${res.data.msg}`))
        })
      }
    };
    const validateCode = (rule, value, callback) => {
      if (/^\d+$/.test(value)) {
        let params = { oldCode: value }
        this.dialogStatus === 'update' || this.dialogStatus === 'updateChild' ? params.id = this.temp.id : params
        codeExist(params).then(res => {
          res.data.code === 0 ? res.data.data === false ? callback() : callback(new Error(`${value}已存在！`)) : callback(new Error(`错误Error：${res.data.msg}`))
        })
      } else {
        callback('只能为数字')
      }
    };
    return {
      authBtns: [],
      func: treeToArray,
      expandAll: true,
      list: [],
      listLoading: true,
      temp: {
        typeName : '',
        showName: null,
        parentId: 0,
        sort: null
      },
      parentName:'',
      formatList:[],
      maxSort:0,
      ids: [],
      textMap: {
        update: '修改分类',
        updateChild: '修改子分类',
        create: '添加分类',
        createChild: '添加子分类'
      },
      rules: {
        typeName: [{ type: 'string', required: true, trigger: 'change', validator: validateName }],
        showName: [{ type: 'string', required: true, trigger: 'change', message: '未填写' }],
        // oldCode: [{ type: 'string', required: true, trigger: 'change', validator: validateCode }],
        sort: [{ required: true, pattern: /^([1-9]\d{0,8}|0)$/ , message: '请输入0-999999999之间的整数' }]
      },
      dialogStatus: '',
      dialogFormVisible: false,
      multipleSelection:[],
      loading: false,
      args: [null, null, 'timeLine']
    }
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    console.log(this.authBtns);
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleShowname(){
      this.temp.showName = this.temp.typeName
    },
    getFormatData(data){
      this.formatList = data
    },
    getList() {
      this.listLoading = true
      getClassify().then(response => {
        if(response.data.code === 0){
          const originalData = JSON.stringify(response.data.data)
          this.list = JSON.parse( originalData.replace(/list/ig, "children") )
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      })
    },
    massDelete(){
      if(this.multipleSelection.length>0){
        confirm.apply(this,['确定要删除选择的分类吗?']).then(() => {
          deleteClassify(this.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
          })
        });
      } else {
        this.$message.warning('请先选择需要删除的内容')
      }
    },
    singleDelete(row) {
      let ids = getTreeId([row],'children')
      confirm.apply(this,['确定要删除选择的分类吗?']).then(() => {
        deleteClassify(ids).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.ids = getTreeId(this.multipleSelection,'children') : true
    },
    resetTemp() {
      this.temp = {
        typeName : '',
        showName: null,
        parentId: 0,
        oldCode: '',
        sort: parseInt(this.maxSort)+1
      }
    },
    handleCreate() {
      this.maxSort = getMaxSort(this.list)
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateChild(row){
      this.resetTemp()
      this.temp.parentId = row.id
      this.parentName = row.showName
      this.maxSort = getMaxSort(row.children)
      this.temp.sort = parseInt(this.maxSort)+1
      this.dialogStatus = 'createChild'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          addClassify(this.temp).then(res => {
            operationMsg.apply(this, [res.data.code, this.textMap[this.dialogStatus] ])
            res.data.status ? this.dialogFormVisible = false : true
            this.loading = false
            this.expandAll = true
          })
        }
      })
    },
    handleUpdate(row) {
      let {createTime, parent, children, ...temp} =row
      this.temp = temp
      if (this.temp.parentId === 0) {
        this.dialogStatus = 'update'
      } else {
        this.dialogStatus = 'updateChild'
        this.parentName = row.parent.showName
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.temp)
          updateClassify(tempData).then(res => {
            operationMsg.apply(this, [res.data.code, this.textMap[this.dialogStatus] ])
            res.data.code === 0 ? this.dialogFormVisible = false : true
            this.loading = false
            this.expandAll = true
          })
        }
      })      
    }
  }
}
</script>
