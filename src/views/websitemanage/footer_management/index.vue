<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <router-link :to="{path:`footer_management/edit_footer`}" v-if="authBtns.filter(i => i.idName=='addbtn').length > 0">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
      </router-link>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column min-width="100px" align="center" label="公告标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column width="280px" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="来源">
        <template slot-scope="scope">
          <span>{{scope.row.source}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="发布人">
        <template slot-scope="scope">
          <span>{{scope.row.creater}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{path:`footer_management/edit_footer`,query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="deleteItem([scope.row.id])"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getListAPI, updateAPI, addAPI, deletaAPI } from '@/api/website-management/footer'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import Tinymce from "@/components/Tinymce"
import store from '@/store'

export default {
  components: { Tinymce },
  data() {
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
      form: {},
      textMap: {
        update: '修改公告',
        create: '添加公告'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      loading: false
    }
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList()
  },
  methods: {
    // submitForm(){},
    // handleForm(row){
    //   if (row.id) {
    //     this.form = Object.assign({}, row)
    //     // this.dialogStatus = 'update'
    //     // console.log(this.$route.path+'/edit_footer')
    //   } else {
    //     this.resetForm()
    //     this.dialogStatus = 'create'
    //   }
    //   // this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     // this.$refs['dataForm'].clearValidate()
    //   })
    // },
    resetForm() {
      this.form = {
        hotSearchWord: '',
        sort: parseInt(this.maxSort)+1,
        auditStatus: 1,
        showState: 0
      }
    },
    deleteItem(idArr){
      confirm.apply(this,['确定删除选择的条目吗?']).then(() => {
        deletaAPI(idArr).then(res => {
          operationMsg.apply(this,[res.data.code,`删除${idArr.length}项`])
        })
      })
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if (res.data.code === 0) {
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(`获取数据失败：${res.data.msg}`)
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
    }
  }
}
</script>
