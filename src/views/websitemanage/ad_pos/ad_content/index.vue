<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="nav-buttons-container">
        <router-link :to="{path:'../ad_pos'}">
          <el-button icon="el-icon-back">返回</el-button>
        </router-link>
        <router-link :to="{path:`ad_edit`,query:{adsignid:listQuery.adsignId}}">
          <el-button icon="el-icon-circle-plus">添加广告</el-button>
        </router-link>

      </div>
      <el-form inline class="form-inline">
        <el-form-item label="广告描述：">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.signValue" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索内容</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border
              highlight-current-row stripe @selection-change="handleSelectionChange">
      <el-table-column align="center" label="广告描述">
        <template slot-scope="scope">
          <span>{{scope.row.signValue}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="广告地址">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="到期时间">
        <template slot-scope="scope">
          <span v-if="scope.row.endTime==null || scope.row.endTime==''">-</span>
          <span v-else>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="排序号">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">启用</span>
          <span v-else style="color: red;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{path:`ad_edit`,query:{adsignid:listQuery.adsignId,id:scope.row.id}}">
            <i class="el-icon-edit"></i>
          </router-link>
          <i class="el-icon-delete" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {getAds, deleteAd, addAd, updateAd} from '@/api/website-management/adPos'
  import {operationMsg} from '@/utils/publicFunctions'
  import {getMaxSort} from '@/filters/getIds'

  export default {
    data() {
      var validateUrl = (rule, value, callback) => {
        let urlreg = /^(http(s)?:\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
        if (!urlreg.test(value)) {
          callback(new Error('请输入真实合法的url，以http://或https://开始'));
        } else {
          callback()
        }
      };
      var validateSort = (rule, value, callback) => {
        let reg = /^([1-9]\d{0,8}|0)$/;
        if (!reg.test(value)) {
          callback(new Error('请输入0-999999999之间的整数'));
        } else {
          callback()
        }
      };
      return {
        tableKey: 0,
        list: null,
        total: null,
        type: '',
        listLoading: true,
        listQuery: {
          adsignId: 0,
          pageNum: 1,
          pageSize: 100,
          signValue: '',
          orderBy: 'sort'
        },
        checked: false,
        fileList: [],
        maxSort: 0,
        temp: {
          id: undefined,
          adsignId: 0,
          endTime: null,
          signValue: '',
          linkType: '0',
          status: 1,
          url: 'http://',
          picture: '',
          sort: undefined
        },
        rules: {
          signValue: [{type: 'string', required: true, trigger: 'change', message: '标题必填'}],
          linkType: [{required: true, message: '链接类型必选', trigger: 'blur'}],
          url: [{required: true, trigger: 'change', validator: validateUrl}],
          sort: [{required: true, validator: validateSort}],
          status: [{required: true, message: '状态必选', trigger: 'blur'}],
          picture: [{type: 'string', required: true, trigger: 'change', message: '未添加连接图片！'}]
        },
        dialogVisible: false,
        textMap: {
          update: '修改广告',
          create: '添加广告内容'
        },
        uploading: false,
        dialogStatus: '',
        dialogFormVisible: false
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
          return isJPG
        }
        if (!isLt3M) {
          this.$message.error('上传图片大小不能超过 3MB!');
          return isLt3M
        }
        this.uploading = true
      },
      handleSuccess(response, file, fileList) {
        this.temp.picture = response
        this.uploading = false
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getList() {
        this.listLoading = true
        this.listQuery.adsignId = this.$route.query.adsignid
        this.type = this.$route.query.type
        // console.log(this.listQuery)
        getAds(this.listQuery).then(response => {
          console.log(response)
          if (response.data.code === 0) {
            this.list = response.data.data.list
            this.total = response.data.data.total
          } else {
            this.$message.error('获取数据失败');
          }
          this.listLoading = false
        })
      },
      handleFilter() {
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
        this.$confirm('确定要删除选择的广告吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAd([id]).then(res => {
            operationMsg.apply(this, [res.data.code, '删除'])
          })
        });
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          adsignId: this.$route.query.adsignid,
          endTime: null,
          signValue: '',
          linkType: '0',
          status: 1,
          url: 'http://',
          picture: null,
          sort: this.maxSort
        };
        this.checked = false;
        this.fileList = [];
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
      createData() {
        console.log(this.temp)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.temp.endTime) {
              !this.checked ? this.temp.endTime = null : this.temp.endTime
            }
            addAd(this.temp).then(res => {
              operationMsg.apply(this, [res.data.code, '广告创建'])
              this.dialogFormVisible = false
              this.fileList = []
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.endTime ? this.checked = true : this.checked = false
        this.maxSort = getMaxSort(this.list)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.temp.endTime) {
              !this.checked ? this.temp.endTime = null : this.temp.endTime
            }
            console.log(this.temp)
            const tempData = Object.assign({}, this.temp)
            updateAd(tempData).then(res => {
              operationMsg.apply(this, [res.data.code, '广告更新'])
              this.dialogFormVisible = false
              this.fileList = []
            })
          }
        })
      }
    }
  }
</script>
