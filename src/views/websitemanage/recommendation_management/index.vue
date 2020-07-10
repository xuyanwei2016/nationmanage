<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleCreate">
        {{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row>
      <el-table-column align="center" label="推荐位名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="推荐位代码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.descriptions}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" @click="handleUpdate(scope.row)" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
          <router-link :to="{ path: 'recommendation_management/recommendation', query: {id:scope.row.id} }" v-if="authBtns.filter(i => i.idName=='contentbtn').length>0">
            <i :class="authBtns.filter(i => i.idName=='contentbtn')[0].icon" :title="authBtns.filter(i => i.idName=='contentbtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='deletebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='deletebtn').length > 0" @click="singleDelete(scope.row.id)" :title="authBtns.filter(i => i.idName=='deletebtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px" style='margin-left:50px;'>
        <el-form-item label="推荐位名称：" prop="name">
          <el-input placeholder="输入推荐位名称" v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="推荐位代码：" prop="code">
          <el-input placeholder="输入推荐位代码" v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="输入备注" v-model="temp.descriptions">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" @click="createData" :loading="loading">保存</el-button>
        <el-button v-else @click="updateData" :loading="loading">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getRecommends, deleteAPI, addRecommend, updateRecommend } from '@/api/website-management/recommend'
import {operationMsg, confirm} from '@/utils/publicFunctions'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import store from '@/store'

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (value.replace(/\s+/g,"") == ''){
        // value = value.replace(/\s+/g,"")
        callback(new Error('推荐位名称必填'));
      } else {
        callback()
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.replace(/\s+/g,"") == ''){
        // value = value.replace(/\s+/g,"")
        callback(new Error('推荐位代码必填'));
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
      listQuery: {
        pageNum: 1,
        pageSize: 100
      },      
      temp: {
        code: '',
        descriptions: '',
        name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改推荐位',
        create: '添加推荐位'
      },
      rules: {
        code: [{ required: true, message: '推荐位代码必须填写', trigger: 'blur' , validator: validateCode }],
        name: [{ required: true, message: '推荐位名称必须填写', trigger: 'blur' , validator: validateName }]
      },
      loading: false
    }
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRecommends(this.listQuery).then(res => {
        if (res.data.status) {
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败')
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
    resetTemp() {
      this.temp = {
        code: '',
        descriptions: '',
        name: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          addRecommend(this.temp).then(res => {
            operationMsg.apply(this, [res.data.code, '添加推荐位'])
            res.data.status ? this.dialogFormVisible = false : true
            this.loading = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
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
          updateRecommend(tempData).then(res => {
            operationMsg.apply(this, [res.data.code, '修改推荐位'])
            res.data.status ? this.dialogFormVisible = false : true
            this.loading = false
          })
        }
      })
    },
    singleDelete(id) {
      confirm.apply(this,['确定删除选择的推荐位吗?']).then(() => {
        deleteAPI(id).then(res => {
          operationMsg.apply(this,[res.data.code,'删除推荐位'])
        })
      })
    }
  }
}
</script>
