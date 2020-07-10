<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <div class="nav-buttons-container">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0" @click="handleCreate">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDelBtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='batchDelBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchDelBtn').length>0 && authBtns.filter(i => i.idName=='batchDelBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDelBtn')].icon, 'el-icon--right']"></i></el-button>
      </div>
    </div>

    <tree-table :data="list" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border v-loading="listLoading" :par-selection="handleSelectionChange" :getFormatData="getFormatData" label-name="标签内容" first-column="labelContent">
      <el-table-column align="center" label="英文名称" min-width="70">
        <template slot-scope="scope">
          <span>{{scope.row.englishName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序号" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editBtn1')[0].icon" v-if="authBtns.filter(i => i.idName=='editBtn1').length > 0" :title="authBtns.filter(i => i.idName=='editBtn1')[0].name" @click="handleUpdate(scope.row)" ></i>
          <i :class="authBtns.filter(i => i.idName=='addContentBtn')[0].icon" v-if="authBtns.filter(i => i.idName=='addContentBtn').length > 0" :title="authBtns.filter(i => i.idName=='addContentBtn')[0].name" @click="handleCreateChild(scope.row)"></i>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" style="margin-right:10px;" :rules="rules">
        <el-form-item v-if="dialogStatus=='createChild' || dialogStatus=='updateChild'" label="上级标签：" prop="parentName">
          <el-input v-model="parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="标签内容：" prop="labelContent">
          <el-input v-model="temp.labelContent"></el-input>
        </el-form-item>
        <el-form-item label="英文名称：" prop="url">
          <el-input v-model="temp.englishName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button v-if="dialogStatus=='update' || dialogStatus=='updateChild'" @click="updateData" :loading="loading">保存</el-button>
        <el-button v-else @click="createData" :loading="loading">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from '@/views/example/table/treeTable/customEval'
import { resourceList, createContentAPI, updateContentAPI, batchDelAPI } from '@/api/database/label'
import getTreeId from '@/filters/getTreeid'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMaxSort } from '@/filters/getIds'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'basic_theory',
  components: { treeTable },
  data() {
    const validateName = (rule, value, callback) => {
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
      parentName:'',
      temp: {
        labelContent: '',
        englishName: '',
        id:'',
        sort:'',
        parentId:0,
        labelId:'',
      },
      formatList:[],
      maxSort: 0,
      ids: [],
      textMap: {
        update: '修改内容',
        create: '添加内容',
        createChild: '添加子内容',
        updateChild: '修改子内容'
      },
      rules: {
        labelContent: [
          { required: true, message: '请输入标签内容', trigger: 'change' },
          // {
          //   pattern:/^.{1,6}$/,message: '请输入不超过六个字的标签内容', trigger: 'change'
          // }
        ],
      },
      dialogStatus: '',
      loading: false,
      dialogFormVisible: false,
      multipleSelection: [],
      args: [null, null, 'timeLine'],
      nation: this.$store.getters.getNation
    }
  },
  computed: {
    ...mapGetters([
      'getNation'
    ])
  },
  watch: {
    getNation: function (val) {
      this.nation = val
      this.getList();
    },
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    this.getList();
  },
  methods: {
    getList() {
      this.temp.labelId  = this.$route.query.id
      this.listLoading = true
      resourceList(this.$route.query.id).then(res => {
        if(res.data.code === 0){
          const originalData = JSON.stringify(res.data.data.list)
          this.list = JSON.parse( originalData.replace(/list/ig, "children") )
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    getFormatData(data){
      this.formatList = data
    },
    massDelete(){//批量删除
      if(this.multipleSelection.length!=0){
        confirm.apply(this,['确认删除选择的标签内容吗？']).then(() => {
          batchDelAPI(this.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
            this.getList();
          })
        })
      } else {
        this.$message.warning('请先选择需要删除的内容')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.ids = getTreeId(this.multipleSelection,'children','id')
      console.log(this.multipleSelection);
    },
    resetTemp() {//清空
      this.temp = {
        labelContent: '',
        englishName: '',
        id:'',
        sort:'',
        parentId:0,
        labelId: this.$route.query.id
      }
    },
    handleCreateChild(row){//行内添加
      this.resetTemp()
      this.dialogStatus = 'createChild'
      this.parentName = row.labelContent
      this.temp.parentId = row.id
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {//添加按钮
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){//添加
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.dialogStatus == 'createChild') var {id, ...data} = this.temp
          else var {id, ...data} = this.temp;  
          createContentAPI(data).then(res => {
            if(res.data.code === 0){
              this.dialogFormVisible = false
              this.$message.success('添加成功');
              this.getList();
            }
            else{
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    handleUpdate(row) {//行内修改
      if (row.parentId != 0) {
        console.log(row);
        this.temp.parentId = row.parentId
        this.dialogStatus = 'updateChild'
        this.parentName = row.parent.labelContent
      } else{
        this.dialogStatus = 'update';
      }
      this.resetTemp()
      let {id, labelContent , englishName, sort, parentId, labelId} = row
      this.temp = {id, labelContent , englishName, sort, parentId, labelId:this.temp.labelId}
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {//行内保存
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateContentAPI(this.temp).then(res => {
            if(res.data.code === 0){
              this.dialogFormVisible = false
              this.$message.success('修改成功');
              this.getList();
            }
          })
        }
      })
    }
  }
}
</script>
