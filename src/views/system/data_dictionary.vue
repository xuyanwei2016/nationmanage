<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <div class="nav-buttons-container">
          <el-button v-waves v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleCreate">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
      </div>
      <el-form inline class="form-inline">
        <el-form-item label="标识">
          <el-input @keyup.enter.native="handleFilter" style="width: 180px;" clearable v-model="listQuery.code">
          </el-input>
        </el-form-item>
        <el-form-item label="中文键">
          <el-input @keyup.enter.native="handleFilter" style="width: 180px;" clearable v-model="listQuery.cnkey">
          </el-input>
        </el-form-item>
        <el-form-item label="英文键">
          <el-input @keyup.enter.native="handleFilter" style="width: 180px;" clearable v-model="listQuery.enkey">
          </el-input>
        </el-form-item>
        <el-form-item label="值">
          <el-input @keyup.enter.native="handleFilter" style="width: 180px;" clearable v-model="listQuery.value">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button style="margin-left: 10px;" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="标识">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="中文键">
        <template slot-scope="scope">
          <span>{{scope.row.cnkey}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="英文键">
        <template slot-scope="scope">
          <span>{{scope.row.enkey}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="值">
        <template slot-scope="scope">
          <span>{{scope.row.value}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="handleUpdate(scope.row)"></i>
          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-form-item label="标识：" prop="code">
          <el-col :span="11">
            <el-input v-model="temp.code"  :disabled="codeDisables"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="12">唯一，不可修改</el-col>
        </el-form-item>
        <el-form-item label="中文键：" prop="cnkey">
          <el-col :span="11">
            <el-input v-model="temp.cnkey"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="英文键：" prop="enkey">
          <el-col :span="11">
            <el-input v-model="temp.enkey"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="显示值：" prop="value">
          <el-col :span="11">
            <el-input v-model="temp.value"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="排序号：" prop="sort">
          <el-col :span="11">
            <el-input v-model="temp.sort"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="12">当前最大排序号为{{maxSort}}，修改排序号会将当前内容插入到对应排序位置</el-col>
        </el-form-item>
        <el-form-item label="简介：" prop="description">
          <el-col :span="11">
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="temp.description"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button v-if="dialogStatus=='update'" class="form-submit" @click="updateBtn">保存</el-button>
        <el-button v-else class="form-submit" @click="createBtn">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getData, deleteData, createData, updateData } from "@/api/system-management/dataDictionary";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";
import { operationMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs, getMaxSort } from '@/filters/getIds'
import store from '@/store'

export default {
  name: "complexTable",
  directives: {
    waves
  },
  data() {
    return {
      authBtns: [],
      tableKey: 0,
      codeDisables:false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        cnkey: '',
        enkey: '',
        value: '',
        code: ''
      },
      massQuery: {
        ids: [],
        status: null
      },
      temp: {
        id: null,
        cnkey: '',
        enkey: '',
        value: '',
        code: '',
        sort: '',
        description: ''
      },
      maxSort:0,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: '修改数据字典',
        create: '添加数据字典'
      },
      rules: {
        type: [{ required: true, message: "type is required", trigger: "change" }]
      },
      multipleSelection:[]
    };
  },
  mounted() {
    if( ifUndefined(store.getters.data_dictionarySerKeys.pageNum) ){
      this.listQuery = store.getters.data_dictionarySerKeys
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList();
  },
  methods: {
    resetTemp() {
      this.temp = {
        id: null,
        cnkey: '',
        enkey: '',
        value: '',
        code: '',
        sort: '',
        description: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.maxSort = getMaxSort(this.list)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createBtn(){
      // document.getElementsByClassName('form-submit').disabled = true
      const newTemp = Object.assign({}, this.temp)
      console.log(newTemp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData(newTemp).then(res => {
            console.log(res)
            operationMsg.apply(this,[res.data.code,'添加数据'])
            this.dialogFormVisible = false
            // document.getElementsByClassName('form-submit').disabled = false
          })
        }
      })
    },
    handleUpdate(row){
      this.codeDisables = true
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.maxSort = getMaxSort(this.list)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateBtn(){
      this.codeDisables = false
      // document.getElementsByClassName('form-submit').disabled = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateData(tempData).then(res => {
            console.log(res)
            operationMsg.apply(this,[res.data.code,'更新数据'])
            this.dialogFormVisible = false
            // document.getElementsByClassName('form-submit').disabled = false
          })
        }
      })
    },
    getList() {
      this.listLoading = true;
      getData(this.listQuery).then(response => {
        console.log(response)
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection)
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        cnkey: '',
        enkey: '',
        value: '',
        code: ''
      }
      this.getList()
    },
    handleFilter() {
      store.dispatch('SetDataDictionarySerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      console.log(this.listQuery)
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
    singleDelete(id) {
      this.$confirm('确定要删除选择的数据信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData([id]).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      });
    },
    cancel(){
      this.dialogFormVisible = false
      this.codeDisables = false
    }
  }
};
</script>
<style>

</style>
