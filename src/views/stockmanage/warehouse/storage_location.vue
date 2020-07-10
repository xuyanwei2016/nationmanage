<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button icon="el-icon-circle-plus" @click="handleForm">添加库位</el-button>
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column label="库位代码" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库位名称" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="handleForm(scope.row)" title="修改"></i>
          <i class="el-icon-delete" @click="singleDelete(scope.row.id)" title="删除"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style='margin-right:10px;'>
        <el-form-item label="库位名称：" prop="name">
          <el-select clearable v-model="temp.name" :disabled="dialogStatus === 'update'">
            <el-option v-for="name in names" :key="name" :label="name" :value="name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="note">
          <el-input v-model="temp.note" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="最多500字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataSubmit" >确定</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getListAPI, updateAPI, addAPI, deleteAPI, getNameAPI } from '@/api/stock-management/storageLocation'
import { operationMsg, confirm } from '@/utils/publicFunctions'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100
      },
      names: [],
      wareid: 0,
      temp: {},
      rules: {
        name: [{ required: true, trigger: 'change', message: '库位名称必选' }],
        description: [{ type: 'string', trigger: 'change', max: 300, message: `最多300个字符` }]
      },
      textMap: {
        update: '修改库位',
        create: '添加库位'
      },
      dialogStatus: '',
      dialogFormVisible: false,
    }
  },
  mounted() {
    this.wareid = this.$route.query.wareid
    this.getList()
    this.getName()
  },
  methods: {
    singleDelete(id){
      confirm.apply(this,['确认删除此库位吗？']).then(() => {
        deleteAPI(id, this.wareid).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      });
    },
    getList() {
      this.listLoading = true
      return getListAPI(this.listQuery, this.wareid).then(res => {
        console.log(res)
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    getName(){
      getNameAPI().then(res => {
        res.data.code === 0 ? this.names = res.data.data : this.$message.error('获取库位数据失败');
      })
    },
    resetTemp() {
      this.temp = {
        name: '',
        note: ''
      };
    },
    handleForm(row){
      if (row.id) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
      } else {
        this.list.length>0 ? this.names = this.names.filter(name => this.list.map(item => item.name).indexOf(name)===-1) : true // 过滤已经添加的库位
        this.resetTemp()
        this.dialogStatus = 'create'
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    dataSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogStatus === 'create' ? this.invokeAPI(addAPI, this.temp, this.wareid) : this.invokeAPI(updateAPI, this.temp, this.wareid)
        }
      })
    },
    invokeAPI(api, data, id){
      api(data, id).then(res => {
        operationMsg.apply(this, [res.data.code, this.textMap[this.dialogStatus] ])
        res.data.code === 0 ? this.dialogFormVisible = false : true
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
</script>
