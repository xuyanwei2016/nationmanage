<template>
  <div class="app-container inputCss" @click="authorStatus = 1">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)" style="margin-bottom: 20px;">返回</el-button>
      <el-form-item label="文章标题：" prop="title">
        <el-input v-model="resourceForm.title" clearable placeholder="请输入文章标题" :disabled="pageStatus == 1"></el-input>
      </el-form-item>

      <el-form-item label="作者：" prop="author">
        <!-- <el-input v-model="resourceForm.author" clearable placeholder="请输入作者" style="width:250px;margin-right:10px"></el-input> -->
        <el-input v-model="resourceForm.author" clearable placeholder="请输入作者" style="width:250px;margin-right:10px" @input="authorLibrary" :disabled="pageStatus == 1"></el-input>
        <ul style="width:250px;background:#f5f5f5;list-style:none;padding-left:20px;max-height:200px;overflow-y:scroll;position:absolute;z-index:20;" v-if="authorList && authorList.length>0 && authorStatus == 0">
          <li style="cursor: pointer" v-for="item in authorList" :key='item.id' @click.stop="choiceAuthor(item.name,item.id)">{{item.name}}</li>
        </ul>
      </el-form-item>

      <el-form-item label="关键词：">
        <el-input v-model="resourceForm.keywords" clearable placeholder="请输入关键词" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="来源：">
        <el-input v-model="resourceForm.source" clearable placeholder="请输入来源" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="自定义分类：">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" :disabled="pageStatus == 1">
          <el-tree :data="navTree" ref="tree" show-checkbox node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps"  @check="setSelect" ></el-tree>
          <el-select v-model="diyTypeCode" value-key="diytypeid" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" style="width:100%;" placeholder="请选择" :disabled="pageStatus == 1">
            <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="文章封面：">
        <el-upload class="avatar-uploader" :disabled="$route.query.detailsId?true:false" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.img}&isOnLine=true`" v-if="resourceForm.img" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon">
          <!--<i class="el-icon-plus avatar-uploader-icon"></i>-->
        </el-upload>
        <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
      <el-form-item label="简介：">
        <tinymce :height=300 ref="editor" v-model="resourceForm.synopsis" style="width:800px"></tinymce>
      </el-form-item>
      <el-form-item label="正文：">
        <tinymce :height=300 ref="editor" v-model="resourceForm.text" style="width:800px"></tinymce>
      </el-form-item>
      <el-form-item label="全文阅读权限：">
        <el-radio-group v-model="resourceForm.readTextPower">
          <el-radio :label="0" :disabled="pageStatus == 1">游客可见</el-radio>
          <el-radio :label="1" :disabled="pageStatus == 1">会员可见</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="定价：" prop="price">
        <el-input v-model="resourceForm.price" clearable placeholder="请输入作者" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="售价：" prop="priceOption">
        <el-radio v-model="resourceForm.priceOption" :label=1 :disabled="pageStatus == 1">付费</el-radio>
        <el-radio v-model="resourceForm.priceOption" :label=0 :disabled="pageStatus == 1">免费</el-radio>
      </el-form-item>
      <el-form-item :prop="resourceForm.priceOption==1?'realPrice':''" v-if="resourceForm.priceOption == 1">
        <el-input v-model="resourceForm.realPrice" clearable placeholder="请输入售价"  style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
        <span v-if="resourceForm.priceOption == 1">元</span>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button @click="dataSubmit">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { getOptionAPI, getNavAPI, getLabelAPI } from '@/api/database/video'
import { saveAPI, detailsAPI, editAPI } from '@/api/database/theory' //接口
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { mapGetters } from 'vuex'
import { authorLibraryAPI } from '@/api/database/article' //接口
import { stitchData } from '@/utils/format'
export default {
  components:{ Tinymce },
  data() {
    return {
      resourceForm:{
        nationsType: this.$store.getters.getNation
      },
      authorList:[],
      articleType :'', //文章类型-理论
      uploading:false,
      refresh: 0,
      pageStatus:0,
      diyTypeCode: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      options: [],
      navTree: [],
      rules:{
        title:[
          { required: true,pattern:/^.{1,50}$/,message: '请输入正确的文章标题', trigger: 'change' },
        ],
        realPrice:[
          { required: false,pattern:/^\d+(\.\d{0,2})?$/,message: '请输入正确的价格', trigger: 'change' },
        ],
        price:[
          { required: false,pattern:/^\d+(\.\d{0,2})?$/,message: '请输入正确的价格', trigger: 'change' },
        ],
      },
      checkedKeys:[],
      authorStatus:null,
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
    this.isEdit();
  },
  methods: {
    authorLibrary() {//查询
      this.authorList = [];
      this.resourceForm.authorId = '';
      if(this.resourceForm.author.split(" ").join("").length != 0){
        this.authorStatus = 0
        authorLibraryAPI(this.resourceForm.author.split(" ").join("")).then(res => {
          if(res.data.code==0){
            this.authorList = res.data.data;
            this.resourceForm.authorNameAndId=this.resourceForm.author.trim();
          }else{
            this.$message.error('获取数据失败');
          }
        })
      }
    },
    loseFocus(){
      this.authorStatus = 1;
    },
    choiceAuthor(name,id) {//选择模糊查询的作者
      this.resourceForm.author = name;
      this.resourceForm.authorId = id;
      this.resourceForm.authorNameAndId = `${name},${id}`;
      this.authorStatus = 1
    },
    getOption(){
      getOptionAPI().then(res => {
        if (res.data.code === 0) {
          // this.options = res.data.data.map(item => {
          //   let { id: diytypeid, ...temp } = item
          //   return {diytypeid, ...temp}
          // })
          this.options = res.data.data.map(item => {
              let showName = stitchData(res.data.data,item)
              let obj = {
                diytypeid:item.id,
                showName:showName,
                code:item.code,
                typeName:item.typeName,
                oldCode:item.oldCode,
                parentId:item.parentId,
                sort:item.sort
              }
              return obj
          })
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
    isEdit(){
      this.resourceForm.resourceType = this.$route.query.articleType; //文章类型 1理论 2药物 3方剂 4临床 5医案 6文化 7机构 8其他 9未分类 10蒙文
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      if(id){//修改
        this.$route.meta.title = '修改文章'
        this.pageDetails(id);
      }
      if(detailsId) {//查看
        this.pageStatus = 1
        this.$route.meta.title = '查看文章'
        this.pageDetails(detailsId);
      }
    },
    pageDetails(id){//查看和修改的页面信息
      detailsAPI(id).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          let diyArr = res.data.data.diyType.map(el => {//自定义分类
            let {code, dtId:diytypeid} = el
            return {code,diytypeid}
          })
          this.diyTypeCode = diyArr;//自定义分类
          this.checkedKeys = getMultipleSelectionIDs(res.data.data.diyType,'dtId')
          if(res.data.data.realPrice == 0){//免费
            this.resourceForm = {...res.data.data, realPriceType: 1};
          } else{ //付费
            this.resourceForm = {...res.data.data, realPriceType: 0};
          }
        } else{
          this.$message.error('加载失败')
        }
      })
    },
    setSelect(data, obj){// 改变Tree选中节点时修改select
      // const aa =obj.checkedNodes.concat(this.diyTypeCode);
      // this.diyTypeCode = aa.map(node => {
      //   return {diytypeid: node.id, code: node.code}
      // })
      this.diyType = obj.checkedNodes.map(node => {
        return {diytypeid: node.id, code: node.code}
      })
      this.diyTypeCode = this.diyType.filter(item => item.code.length >4)

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
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
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
      this.resourceForm.img = response
    },
    handlePicPreview(file){ // 图片预览
      this.dialogImage = file
      this.dialogPvVisible = true
    },
    handleRemove(){ // 图片删除
      this.resourceForm.img = ''
    },
    //保存
    dataSubmit() {
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {//必填名称--规则 （pdf和正文内容至少填一项）
          if(this.resourceForm.realPriceType == 0 && this.resourceForm.realPrice != '' || this.resourceForm.realPriceType == 1){//售价---必填
            this.sending = true
            const data = this.diyTypeCode.map(el => {//自定义分类
              let {diytypeid:dtId,code} = el
              return {dtId,code}
            })
            this.resourceForm.diyType = data;
            if(this.resourceForm.realPriceType != 0) this.resourceForm.realPrice = 0  // 售价
            const id = this.$route.query.id; //修改id
            delete this.resourceForm.author;
            delete this.resourceForm.authorId;
            if(id) {//修改
              this.resourceForm.id = id
              //let {diyType,label, ...rest} = this.resourceForm
              editAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('编辑成功')
                  this.$router.push({ path: '/database/theory' });
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
                  this.$router.go(-1);
                } else{
                  this.$message.error('添加失败');
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
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .ib{
    display:inline-block;
  }
  .tip{
    color: #ccc;
  }
  .aa{
    display: block !important;
    width: 100%;
  }
</style>
