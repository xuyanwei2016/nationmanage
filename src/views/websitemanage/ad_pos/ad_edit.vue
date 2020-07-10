<template>
  <div class="app-container calendar-list-container adEdit">
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px">
      <el-form-item label="广告描述：" prop="signValue">
        <el-col :span="6">
          <el-input type="input" placeholder="请输入内容" v-model="temp.signValue" clearable></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="时间限制：" prop="endTime">
        <el-col :span="6" style="width: 25%">
          <el-date-picker v-model="temp.endTime" clearable type="date" placeholder="年/月/日" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="display: inline-block; width: 100%;"></el-date-picker>
        </el-col>
        <el-checkbox id="checkbox" style="margin-left:15px;" v-model="checked" :disabled="temp.endTime ===null">启用</el-checkbox>
        <span class="tip">不启用则无时间限制</span>
      </el-form-item>
      <el-form-item label="链接地址：" prop="linkType">
        <el-radio-group v-model="temp.linkType">
          <el-radio :label="0">外部链接</el-radio>
          <el-radio :label="1">内链到内容</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" :prop="temp.linkType == 0?'url':''" v-show="temp.linkType == 0">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="temp.url" clearable></el-input>
        </el-col>
        <el-col :span="18" style="color:#ccc; padding-left:15px;">默认以 http://，如果使用https://开头请手动输入</el-col>
      </el-form-item>

      <el-form-item label="" v-show="temp.linkType == 1" :prop="temp.linkType == 1?'bulletinContent':''">
        <el-col :span="6">
          <el-input placeholder="展示所选择的资讯标题,点击标题可以重选"   @focus="inner" v-model="temp.bulletinContent"></el-input>
        </el-col>
        <el-col :span="18" style="color:#ccc; padding-left:15px;">默认以 http://，如果使用https://开头请手动输入</el-col>
      </el-form-item>


      <el-form-item label="排序号：" prop="sort">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="temp.sort" clearable></el-input>
        </el-col>
        <el-col :span="18" style="color:#ccc; padding-left:15px;">当前最大排序号为{{maxSort}}，修改排序号会将当前内容插入到对应排序位置</el-col>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="temp.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接图片：" prop="picture">
        <el-col :span="6">
          <el-input v-model="temp.picture" disabled></el-input>
        </el-col>
        <el-col :span="8" style="padding-left:15px;">
          <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess">
            <el-button :loading="uploading">上传图片</el-button>
          </el-upload>
        </el-col>
      </el-form-item>
      <el-form-item label="">
        <div style="color:#ccc;">
          当前广告位模式为<span v-if="type==1">通栏广告</span><span v-else-if="type==2">区域广告</span><span v-else-if="type==3">飘窗广告</span>，建议图片尺寸 300*200，只支持 jpg,jpeg,png,gif格式图片
        </div>
        <img v-if="temp.picture" style="max-width:300px;max-height:200px;" :src="`${domain}${requestPath.file}?fileName=${temp.picture}&isOnLine=true`" :alt="`${temp.picture}`">
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!infoId" :loading="sending" @click="createData">保存</el-button>
      <el-button v-else :loading="sending" @click="updateData">保存</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>

    <!-- 内链到内容弹窗 -->
    <el-dialog title="选择内容" :visible.sync="dialogFormVisible">
      <div style="overflow: hidden;">
        <el-aside style="float:left;height: 600px; border: 1px solid #ddd;" width="200px" class="tree-aside">
          <el-tree :data="navTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-aside>

        <el-main style="float:left;width: 760px;">
          <el-form inline style="float: right;">
            <el-form-item label="">
              <el-input placeholder="请输入需要检索的标题" v-model="listQuery.title"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleFilter">检索内容</el-button>
            </el-form-item>
          </el-form>

          <template>
            <el-table :data="resourceForm" style="width: 100%" border>
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column label="资讯标题" prop="title" width="360" align="center"></el-table-column>
              <el-table-column label="发布时间" prop="releaseTime" width="180" align="center"></el-table-column>
              <el-table-column label="操作"  align="center">
                <template slot-scope="scope">
                  <a style="color: blue;" @click="check(scope.row)">选择</a>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-container">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
              </el-pagination>
            </div>
          </template>
        </el-main>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestPath, uploadPath } from '@/utils/global.js'
import { addAd, updateAd, getOnead, getAdSignAPI, getMaxSortAPI , getInnerListAPI , getListAPI} from '@/api/website-management/adPos'
import {errorMsg} from '@/utils/publicFunctions'
// import { getMaxSort } from '@/filters/getIds'

export default {
  data() {
    const validateUrl = (rule, value, callback) => {
      let urlreg = /^(http(s)?:\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
      if ( !urlreg.test(value) ){
        callback(new Error('请输入真实合法的url，以http://或https://开始'));
      } else {
        callback()
      }
    };
    const validateSort = (rule, value, callback) => {
      let reg = /^([1-9]\d{0,8}|0)$/;
      if ( !reg.test(value) ){
        callback(new Error('请输入0-999999999之间的整数'));
      } else {
        callback()
      }
    };
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      infoId:null,
      total: null,
      type: null,
      checked: false,
      fileList:[],
      maxSort: null,
      temp: {
        adsignId : 0,
        endTime: null,
        signValue: '',
        linkType: 0,
        status: 1,
        url: 'http://',
        picture: '',
        sort: null,
        bulletinContent: null,
      },
      linkType:0,
      linkUrl:'',
      linkContent:null,
      rules: {
        signValue: [{  required: true, trigger: 'change', message: '请输入广告描述'},{ pattern: /^.{1,50}$/, message: '广告描述长度必须小于50位', trigger: 'change'}],
        linkType: [{ required: true, message: '链接类型必选', trigger: 'blur' }],
        url: [{ required: true, trigger: 'change', validator: validateUrl }],
        bulletinContent: [{ required: true, trigger: 'change',message: '请选择内链的内容'}],
        sort: [{ required: true, message: '请输入排序号',trigger: 'change'},{pattern: /^\d+$/, message: '请输入整数排序号', trigger: 'change'}],
        status: [{ required: true, message: '状态必选', trigger: 'blur' }],
        picture: [{ type: 'string', required: true, trigger: 'change', message: '未添加连接图片！' }]
      },
      sending: false,
      uploading: false,
      dialogFormVisible: false,
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        columnId:''
      },
      resourceForm: null
    }
  },
  created(){
    //修改广告内容
    this.$route.meta.title = this.$route.query.id ? '修改广告内容' : this.$route.query.detailsId ? '查看广告内容' : '添加广告内容';
  },
  mounted() {
    this.getOnedata()
    this.getAdSign()
    this.getMaxSort()
  },
  watch:{
    'temp.linkType'(n,o){
      if(n!=this.linkType){
        this.temp.url='';
        this.temp.bulletinContent=null;
        this.$nextTick(()=>{
          this.$refs['dataForm'].clearValidate(['url']);
        })
      }else{
        if(this.linkType==1){
          this.temp.bulletinContent=this.linkContent;
        }
        this.temp.url=this.linkUrl;
      }

    },
  },
  methods: {
    // 内链到内容弹窗右侧分页查询
    getList() {
      getListAPI(this.listQuery).then(res => {
        this.resourceForm = res.data.data.list;
        res.data.data.list.map(el => {
          el.releaseTime = el.releaseTime.slice(0,el.releaseTime.length-2);
        })
        this.total = res.data.data.total;
      })
    },
    getMaxSort() {
      return getMaxSortAPI({adsignId: this.$route.query.adsignid}).then(res => {
        this.maxSort = res.data.data
      })
    },
    getAdSign () {
      getAdSignAPI(this.$route.query.adsignid).then(res => {
        res.data.status ? this.type = res.data.data.type : errorMsg.apply(this, [ res.data, `获取广告位详情` ])
      })
    },
    getOnedata(){
      this.infoId = this.$route.query.id
      if(this.infoId){
        getOnead(this.infoId).then(res=>{
          res.data.status ? this.temp = res.data.data : errorMsg.apply(this, [ res.data, `获取广告详情` ]);
          this.linkType=this.temp.linkType;
          this.linkContent=this.temp.bulletinContent;
          this.linkUrl=this.temp.url;
          res.data.data.endTime!=null?this.checked=true:this.checked=false
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
      }else{
        this.resetTemp()
        this.getMaxSort().then(res => {
          this.temp.sort = this.maxSort + 1
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    beforeUpload(file){
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
    handleSuccess(response, file, fileList){
      this.temp.picture = response
      this.uploading = false
    },
    resetTemp() {
      this.temp = {
        adsignId : this.$route.query.adsignid,
        endTime: null,
        signValue: '',
        linkType: 0,
        status: 1,
        url: 'http://',
        picture: null,
        sort: this.maxSort,
      };
      this.checked = false;
      this.fileList = [];
    },
    createData() {
      this.temp.adsignId = this.$route.query.adsignid
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.sending = true
          if (this.temp.endTime) {
            !this.checked ? this.temp.endTime = null : this.temp.endTime
          }
          if(this.temp.linkType==1&&this.listQuery.url){
            this.temp.url=this.listQuery.url;
            this.temp.bulletinContentId=this.listQuery.id;
          }
          console.log('添加数据',this.temp)
          addAd(this.temp).then(res => {
            this.sending = false
            if (res.data.status) {
              this.$message.success('广告创建成功')
              this.$router.back()
            } else {
              errorMsg.apply(this, [ res.data, `广告创建` ])
            }
          })
        }
      })
    },
    updateData() {
      this.temp.adsignId = this.$route.query.adsignid;
      this.temp.id = this.$route.query.id;
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.sending = true
          if (this.temp.endTime) {
            !this.checked ? this.temp.endTime = null : this.temp.endTime
          }
          const tempData = Object.assign({}, this.temp);
          if(this.temp.linkType==1&&this.listQuery.url){
            tempData.url=this.listQuery.url;
            tempData.bulletinContentId=this.listQuery.id;
          }
          updateAd(tempData).then(res => {
            this.sending = false
            if (res.data.status) {
              this.$message.success('广告更新成功')
              this.$router.back()
            } else {
              errorMsg.apply(this, [ res.data, `广告更新` ])
            }
          })
        }
      })
    },

    // 内链到内容
    inner() {
      this.dialogFormVisible = true
      // 左侧列表
      this.getInnerList()
      // 右侧
      this.getList()
    },
    // 检索
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList()
    },
    // 左侧列表
    getInnerList() {
      getInnerListAPI().then(res => {
        res.data.data = [{name: '全部'}].concat(res.data.data);
        res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取数据失败')
      })
    },
    // 选择
    check(item) {
      if(item.id != null) {
        this.temp.bulletinContent = item.title;
        this.listQuery.id = item.id;
        this.listQuery.url = `http://test16.zhongdianyun.com:2018/index.html#/medicalDetails?id=${item.id}&pageType=${item.name=='医药资讯'?1:item.name=='考试专栏'?2:null}`;

      }
      this.dialogFormVisible = false

    },
    handleNodeClick(data){ //点击树节点获取table数据
      console.log("eeee",data);
      this.listQuery.columnId = data.id
      this.getList()
    },

    // 翻页
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

<style scoped>
  .tip {
    color: #ccc;
    margin-left: 20px;
  }
  .adEdit .el-dialog__body {
     padding:0 !important;
  }
</style>
