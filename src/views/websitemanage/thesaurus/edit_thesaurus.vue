<template>
  <div class="app-container editThesa">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <div class="title">基本信息</div>
      <el-form-item label="中文根词：" prop="name" >
        <el-input v-model="resourceForm.name"  clearable placeholder="请填写中文根词" style="width:450px !important"></el-input>
      </el-form-item>
      <el-form-item label="英文根词：">
        <el-input v-model="resourceForm.author" clearable  style="width:450px !important"></el-input>

      </el-form-item>
      <el-form-item label="英文缩写：" style="clear:both">
        <el-input v-model="resourceForm.translator" clearable  style="width:450px !important"></el-input>
      </el-form-item>
      <el-form-item label="中文同义词：">
        <el-input v-model="resourceForm.isbn" clearable style="width:450px !important" placeholder="多个词用逗号隔开"></el-input>
      </el-form-item>
      <el-form-item label="英文同义词：" style="clear:both">
        <el-input v-model="resourceForm.executiveEditor" clearable style="width:450px !important" placeholder="多个词用逗号隔开"></el-input>
      </el-form-item>
      <el-form-item label="中文释义：">
        <el-input v-model="resourceForm.bookSeries" clearable style="width:450px !important" type="textarea" :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="中文别字：" style="clear:both">
        <el-input v-model="resourceForm.publisher" clearable  placeholder="多个词用逗号隔开" style="width:450px !important"></el-input>
      </el-form-item>
      <el-form-item label="词条属性：">
        <!--<el-input v-model="resourceForm.fontCount" clearable style="width:450px !important"></el-input>-->
        <el-select v-model="resourceForm.fontCount" placeholder="请选择">
          <el-option
            v-for="item in attribute"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="中文说明：" style="width:800px">
        <tinymce :height=300 ref="editor" v-model="resourceForm.summary" style="width:800px"></tinymce>
      </el-form-item>
      <el-form-item label="英文说明：" style="width:800px">
        <tinymce :height=300 ref="bookCatalog" v-model="resourceForm.bookCatalog" style="width:800px"></tinymce>
      </el-form-item>

      <el-form-item label="上位词：">
        <el-radio v-model="resourceForm.type" :label=1>本版书</el-radio>
        <el-radio v-model="resourceForm.type" :label=0>外版书</el-radio>
      </el-form-item>
      <el-form-item label="下位词：">
        <el-radio v-model="resourceForm.status" :label=1>可售</el-radio>
        <el-radio v-model="resourceForm.status" :label=0>不可售</el-radio>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button @click="dataSubmit" >保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

    <el-dialog title="选择资源" :visible.sync="dialogVisible" >
      <el-form inline class="form-inline">
        <el-form-item label="资源名称">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable ></el-input>
        </el-form-item>
        <el-form-item label="上传时间">
          <el-date-picker v-model="timeLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :key='1' stripe :data="pdfList" element-loading-text="给我一点时间" border highlight-current-row ref="goodsTable"      @selection-change="goodsSelectionChange">
        <el-table-column align="center" type="selection" ></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column label="资源名称" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="作者" min-width="55" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.author}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" min-width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.uploadTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNum" :page-size="listQuery.pageSize" layout="total, prev, pager, next" :total="total" align="center"></el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="selectSubmit" >确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
  import queryString from 'query-string'
  import { getOptionAPI, getNavAPI } from '@/api/database/video'
  import { commonUploadAPI } from '@/api/database/theory' //接口
  import { authorLibraryAPI } from '@/api/database/article' //接口
  import { saveAPI, detailsAPI, pdfListAPI } from '@/api/database/yizhu'
  import { requestMsg, confirm } from '@/utils/publicFunctions'
  import { getMultipleSelectionIDs } from '@/filters/getIds'
  import { mapGetters } from 'vuex'

  export default {
    components:{ Tinymce },
    data() {
      return {
        resourceForm: {
          priceOption:0,
          status:1,
          type:1,
          pdfType:0,
          price: null,
          bookSeries:null,
          nationsType: this.$store.getters.getNation
        },
        attribute:[{
          value: '选项1',
          label: '丛书名称一'
        },{
          value: '选项2',
          label: '丛书名称二'
        },],
        dialogVisible:false,
        uploading:false,
        pageStatus:0,
        diyTypeCode: [],
        defaultProps: {
          children: 'list',
          label: 'showName'
        },
        options: [],
        navTree: [],
        timeLimit: null,
        rules:{
          name:[
            { required: true,message: '请输入中文根词', trigger: 'change' }
          ],
          author:[
            { required: true,pattern:/^.{1,10}$/,message: '作者长度必须小于10位', trigger: 'change' },
          ],
          isbn:[
            { required: true,message: '请输入纯数字或数字和连字符-', trigger: 'change' }
          ],
          translator:[
            { required: false,pattern:/^.{1,10}$/,message: '请输入10字以内的译者', trigger: 'change' },
          ],
          executiveEditor:[
            { required: false,pattern:/^.{1,10}$/,message: '请输入10字以内的责任编辑', trigger: 'change' },
          ],
          publisher:[
            { required: false,pattern:/^.{1,20}$/,message: '请输入20字以内的出版单位', trigger: 'change' },
          ],
          revision:[
            { required: true,pattern:/^.{1,20}$/,message: '请输入10字以内的版次', trigger: 'change' },
          ],
          keywords:[
            { required: false,pattern:/^.{1,30}$/,message: '请输入30字以内的关键词', trigger: 'change' },
          ],
          publishTime: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          type:[
            { required:true, message: '请选择书刊类型', trigger: 'change' }
          ],
          status:[
            { required:true, message: '请选择销售状态', trigger: 'change' }
          ],
          priceOption:[
            { required:true, message: '请选择售价类型', trigger: 'change' }
          ],
          pricing:[
            { required: false,pattern:/^(^[1-9](\d{1,4})?(\.\d{1,2})?$)|(^\d{0,4}\.\d{0,2})?$/,message: '请输入价格,范围在0-99999之间的定价', trigger: 'change' },
          ],
          price:[
            { required: false,pattern:/^(^[1-9](\d{1,4})?(\.\d{0,2})?$)|(^\d{0,4}\.\d{1,2}$)$/,message: '请输入价格,范围在0.1-99999之间', trigger: 'change' },
          ],
          fontCount: [
            { required: false, pattern: /^\d$/, message: '请输入正整数', trigger: 'change'}
          ]
        },
        checkedKeys:[],
        pdfList: [],
        listQuery:{
          pageNum: 1,
          pageSize: 10
        },
        multiSelection:null,
        total: null,
        code: null,
        resourceList: [],
        authorList:[],
      }
    },
    computed: {
      ...mapGetters([
        'getNation'
      ])
    },
    watch: {
      getNation: function (val) {
        this.resourceForm.nationsType = val
      },
    },
    created(){
      this.uploadUrl = uploadUrl
      this.uploadPath = uploadPath
    },
    mounted() {
      this.getNav();
      this.getOption();
      this.resourceForm.pdfType = 0
    },
    methods: {
      getOption(){
        getOptionAPI().then(res => {
          if (res.data.code === 0) {
            this.options = res.data.data.map(item => {
              let { id: diytypeid, ...temp } = item
              return {diytypeid, ...temp}
            })
            this.isEdit();
          } else {
            this.$message.error(`获取分类选择器选项数据失败`)
          }
        })
      },
      getNav(){
        getNavAPI().then(res => {
          res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败');
        })
      },
      queryPDF() {// 查看pdf
        window.open(uploadUrl+"?fileName="+this.resourceForm.pdfFile+"&isOnLine=true")
      },
      authorLibrary() {//查询
        this.authorList = [];
        this.resourceForm.authorId = '';
        if(this.resourceForm.author.split(" ").join("").length != 0){
          this.authorStatus = 0
          authorLibraryAPI(this.resourceForm.author.split(" ").join("")).then(res => {
            res.data.code === 0 ? this.authorList = res.data.data : this.$message.error('获取数据失败');
          })
        }
      },
      choiceAuthor(name,id) {//选择模糊查询的作者
        this.resourceForm.author = name;
        this.resourceForm.authorId = id;
        this.authorStatus = 1
      },
      isEdit(){
        this.$route.meta.title = '添加主题词库'
        const id = this.$route.query.id; //修改id
        const detailsId = this.$route.query.detailsId; //查看id
        console.log('asddadds');

        //this.resourceForm.bookStatus = 0; //0：录入中 1：待审核 2：审核中 3：审核不通过 4：已上架 5：已下架 ,
        if(id){//修改
          this.$route.meta.title = '修改主题词库'
          this.pageDetails(id);
        }
        if(detailsId) {//查看
          this.pageStatus = 1
          this.$route.meta.title = '查看主题词库'
          this.pageDetails(detailsId);
        }
      },
      // 提交公共资源
      commonUpload() {
        if(this.resourceList.length != 0) {
          commonUploadAPI(this.resourceList).then(res => {})
        }
      },
      pageDetails(id){//查看和修改的页面信息
        detailsAPI(id).then(res => {
          console.log(res);

          if (res.data.code === 0) {
            console.log(res.data.data,"修改修改")
            this.resourceForm = res.data.data;
            let diyArr = res.data.data.diyType.map(el => {//自定义分类
              let {diyTypeCode:code, diyTypeId:diytypeid} = el
              return {code,diytypeid}
            })
            this.diyTypeCode = diyArr;//自定义分类
            this.checkedKeys = getMultipleSelectionIDs(res.data.data.diyType,'diyTypeId')
          } else{
            this.$message.error('加载失败')
          }
        })
      },
      setSelect(data, obj){// 改变Tree选中节点时修改select
        this.diyTypeCode = obj.checkedNodes.map(node => {
          return {diytypeid: node.id, code: node.code}
        })
      },

      setTree(tag){// 删除多选标签设置Tree的选中节点
        if (this.diyTypeCode.length>0) {
          const checkedKeys = getMultipleSelectionIDs(this.diyTypeCode,'diytypeid')
          this.$refs.tree.setCheckedKeys(checkedKeys)
        } else {
          this.$refs.tree.setCheckedKeys([])
        }
      },
      clearCheckedKeys(){//清除分类
        this.$refs.searchTree.setCheckedKeys([])
      },
      //图片
      beforePicUpload(file){
        const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG/JPEG/BMP/GIF 格式!');
          return isJPG
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return isLt2M
        }
        this.uploading = true
        this.$message.warning('上传中');
      },
      handlePicSuccess(response, file, fileList){
        this.uploading = false
        this.$message.success('上传成功');
        this.resourceForm.bookCover  = response
      },
      handlePicPreview(file){ // 图片预览
        this.dialogImage = file
        this.dialogPvVisible = true
      },

      handleRemove(){ // 图片删除
        this.resourceForm.bookCover  = ''
      },
      changePdf() {
        if(this.resourceForm.pdfType == 1) {
          //弹窗
          this.getList();
          this.dialogVisible = true;
        }
      },
      goodsSelectionChange(val){
        this.multiSelection = val
      },
      getList() { //pdf列表
        pdfListAPI(this.listQuery).then(res =>{
          if(res.data.code === 0){
            this.pdfList = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      selectSubmit() {//勾选pdf
        if(this.multiSelection){
          this.dialogVisible = false;
          this.resourceForm.pdfFile = this.multiSelection.pdf
        } else{
          this.$message.error('请选择一个pdf资源哦');
        }
      },
      //pdf上传
      beforeUpload(file){
        const isPDF = file.type === 'application/pdf'
        if (!isPDF) {
          this.$message.error('附件文件只能是 PDF 格式!')
          return isPDF;
        }
        this.uploading = true
      },
      handleSuccess(response, file, fileList){
        this.resourceForm.pdfFile = response.fileName
        this.resourceForm.pdf_zh = response.originalFileName
        const pdf = {
          keywords: this.resourceForm.keywords,
          name: response.originalFileName,
          nationsType: this.resourceForm.nationsType,
          resourceCode: response.fileName,
          resourceType:  66,
          author: this.resourceForm.author,
          source: this.resourceForm.source,
        }
        this.resourceList.push(pdf);
        this.uploading = false
      },
      handleExceed(files, fileList) {
        this.$message.warning(`单次上传最多1个文件`);
      },
      handleRemovePdf() {//删除pdf
        this.resourceForm.pdfFile = null;
      },
      //保存
      dataSubmit() {
        this.$refs['resourceForm'].validate((valid) => {
          if (valid) {//必填字段验证
            if((this.resourceForm.priceOption == 1 && this.resourceForm.price != null && this.resourceForm.price != '') || this.resourceForm.priceOption == 0){//售价---必填
              this.sending = true
              const data = this.diyTypeCode.map(el => {//自定义分类
                let {diytypeid:diyTypeId,code:diyTypeCode} = el
                return {diyTypeId,diyTypeCode}
              })
              this.resourceForm.diyType = data;
              const id = this.$route.query.id; //修改id
              if(id) {//修改
                this.resourceForm.id = id
                saveAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('编辑成功')
                    this.$router.push({ path: '/database/theory' });
                    this.commonUpload()
                    this.$router.go(-1);
                  } else{
                    this.$message.error('编辑失败')
                  }
                  this.sending = false
                })
              } else{
                saveAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('添加成功')
                    this.$router.push({ path: '/database/theory' });
                    this.commonUpload()
                    this.$router.go(-1);
                  } else{
                    this.$message.error('添加失败')
                  }
                  this.sending = false
                })
              }
            } else{
              this.$message.error('请填写售价哦');
            }
          } else{
            this.$message.error('请将信息补全!');
          }
        })
      },
      cancel() {//取消
        this.$router.go(-1);
      },
      handleFilter(){
        if(this.timeLimit){
          this.listQuery.beginTime = this.timeLimit[0]
          this.listQuery.endTime = this.timeLimit[1]
        } else {
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }
        this.listQuery.pageNum = 1
        this.getList()
      },
      resetFilter(){
        this.timeLimit = []
        this.listQuery = {
          pageNum: 1,
          pageSize: this.listQuery.pageSize
        }
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
  .ib{
    display:inline-block;
  }
  .float{
    float: left;
  }
  .el-input{
    width:250px !important;
    margin-right:10px;
  }
  .tip{
    color: #ccc;
  }
  .aa{
    display: block !important;
    width: 100%;
  }
  .title {
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: 10px;
  }
  .el-input[data-v-454fbfb6] {
    width: 400px !important;
  }
  .el-button {
    margin-bottom: 10px;
  }
  .el-upload--picture-card {
    margin-bottom: 20px !important;
  }

</style>
