<template>
  <div>
    <div class="picture_container contain inputCss">
      <div v-if="cancel" @click="$router.go(-1)" style="cursor:pointer;margin-bottom:20px;padding-left:10px;font-size:18px;border-bottom:1px solid #ccc;padding-bottom:10px;">&lt;返回</div>
      <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
        <div class="title">基本信息</div>
        <el-form-item label="资源名称：" prop="name" label-width="96px"  class="searchInput">
          <el-input v-model="resourceForm.name" style="width:500px;" clearable placeholder="建议在14个字以内，最多不超过50个字" :disabled="pageStatus == 1"></el-input>
        </el-form-item>
        <el-form-item label="关键词：" prop="keywords" label-width="96px" class="searchInput">
          <el-input v-model="resourceForm.keywords" clearable placeholder="多个关键词用逗号隔开" :disabled="pageStatus == 1"></el-input>
        </el-form-item>
        <el-form-item label="所属图书：" prop="bookName" label-width="96px"  class="searchInput">
          <el-input v-model="resourceForm.bookName" clearable  :disabled="pageStatus == 1"></el-input>
        </el-form-item>
        <el-form-item label="来源：" prop="source" label-width="96px"  class="searchInput">
          <el-input v-model="resourceForm.source" clearable placeholder="请输入来源" :disabled="pageStatus == 1"></el-input>
        </el-form-item>
        <el-form-item label="自定义分类：" label-width="96px"  class="searchInput">
          <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" :disabled="pageStatus == 1">
            <el-tree  :data="navTree" ref="tree"  show-checkbox node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps" @check="setSelect"></el-tree>
            <el-select v-model="diyTypeCode" value-key="diytypeid" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" placeholder="请选择" :disabled="pageStatus == 1">
              <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item"></el-option>
            </el-select>
          </el-popover>
        </el-form-item>
        <el-form-item :label='item.name' v-for="(item,index) in labelList" :key="index" style="clear:both;width:800px">
          <el-select multiple placeholder="请选择" v-model="item.selectId" style="width:100%;" :disabled="pageStatus == 1">
            <el-option v-for="info in item.list" :key="info.id" :label="info.labelContent" :value="info.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介：" label-width="96px"  class="searchInput">
          <tinymce :height=300 ref="editor" v-model="resourceForm.synopsis" style="width:900px"></tinymce>
        </el-form-item>
        <el-form-item label="图片文件：" prop="image" label-width="96px"  class="searchInput" ref="image">
          <img :src="`${uploadUrl}?fileName=${resourceForm.image}&isOnLine=true`" v-if="resourceForm.image&&canuse==true" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <el-upload v-else class="avatar-uploader"
          :action="`${uploadUrl}${uploadPath}/info`"
          :show-file-list="false"
          :on-remove="handleRemove"
          :on-preview="handlePicPreview"
          :on-success="handlePicSuccess"
          :before-upload="beforePicUpload"
          accept=".jpg,.jpeg,.bmp,.png,.gif">
            <img :src="`${uploadUrl}?fileName=${resourceForm.image}&isOnLine=true`" v-if="resourceForm.image" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
            <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon" style="width: 100%; height: 100%;">
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer shadow bottom_footer" id="footer" v-if="pageStatus == 0">
      <el-button type="primary" @click="dataSubmit" :loading="sending">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { getOptionAPI } from '@/api/database/video'
import { commonUploadAPI, getNavAPI } from '@/api/database/theory' //接口
import { saveAPI, detailsAPI, editAPI } from '@/api/database/picture' //接口
import { authorListAPI } from '@/api/database/article' //接口
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { mapGetters } from 'vuex'
import { labelListAPI } from '@/api/database/yizhu'
import { stitchData,deleteSame } from "@/utils/format"

export default {
  components:{ Tinymce },
  data() {
    return {
      resourceForm: {
        priceOption:0,
        readTextPower:1,
        realPrice:null,
        authorNameAndId:[],
        keywords:null,
        source:null,
        image:null,
        size: "",
        formats: ""
      },
      sending: false,
      uploading:false,
      pageStatus:0,
      diyTypeCode: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      cancel: false,
      options: [],
      navTree: [],
      rules:{
        name:[
          { required: true, message: '请输入图片标题', trigger: 'change' },
          { pattern:/^.{1,50}$/,message: '图片标题长度必须小于50位', trigger: 'change'}

        ],
        realPrice:[
          { required: true,pattern:/^(^[1-9](\d{1,4})?(\.[1-9]{1,2})?$)|(^\d{1,4}\.\d{1,2}$)$/,message: '请输入价格,范围在0.1-99999之间', trigger: 'change' },
        ],
        price:[
          { required: false,pattern:/^\d{1,5}(\.\d{1,2})?$/,message: '请输入价格,范围在0-99999之间,保留两位小数', trigger: 'change' },
        ],
        source:[
          { required: false, pattern: /^.{1,50}$/, message: '来源长度必须小于50位', trigger: 'change'}
        ],
        bookName: [
          { required: false, max: 50, message: '所属图书50字以内', trigger: 'change'}
        ],
        keywords:[
          { required: false, pattern: /^.{1,30}$/, message: '关键词长度必须小于30位', trigger: 'change'}
        ],
        readTextPower:[ { required: true, message: '请选择销售方式'}],
        priceOption: [{ required: true, message:'请选择售价'}],
        image:[{ required: true ,message: '请上传图片文件'}]
      },
      checkedKeys:[],
      authorList:[],
      authorStatus:0,
      authorId:'',
      resourceList: [],
      canuse:true,
      labelList: [],
    }
  },
  created(){
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
  },
  mounted() {
    this.getNav();
    this.getOption();
    this.isEdit();
    // this.getAuthorLibrary()
    this.getLabel()
  },
  methods: {
    getOption(){
      getOptionAPI().then(res => {
        if (res.data.code == 0) {
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
    getNav() {
      getNavAPI('图片').then(res => {
        res.data.code == 0 ? this.navTree = res.data.data : this.$message.error('获取数据失败')
      });
    },
    // getAuthorLibrary() {//作者列表
    //   authorListAPI().then(res => {
    //     res.data.code == 0 ? this.authorList = res.data.data : this.$message.error('获取数据失败');
    //   })
    // },
    // 自定义标签
    getLabel() {
      labelListAPI({dataType:'图片'}).then(res => {
        if(res.data.code == 0) {
          if(this.resourceForm.labelContentDiyTypeIds && this.resourceForm.labelContentDiyTypeIds.length>0){//查看或者修改
            res.data.data.list.map(el =>{
              el.list.map(item =>{
                this.resourceForm.labelContentDiyTypeIds.map(info => {
                  if(item.id == info){
                    if(el.selectId && el.selectId.length>0){
                      el.selectId.push(info)
                    } else{
                      el.selectId = []
                      el.selectId.push(info)
                    }
                  } else{
                    if(!el.selectId){
                      el.selectId = []
                    }
                  }
                })
              })
            })
            if(this.$route.query.detailsId){//查看
              res.data.data.list = res.data.data.list.filter(item => (item.selectId && item.selectId.length>0))
            }
          } else{
            res.data.data.list.map(el =>{
              if(!el.selectId){
                el.selectId = []
              }
            })
          }
          this.labelList = res.data.data.list
        }
      })
    },
    // 查看pdf
    queryPDF() {
      window.open(uploadUrl+"?fileName="+this.resourceForm.pdf+"&isOnLine=true")
    },
    isEdit(){
      //文章类型 31 研究集成  32 学术活动 33 其他
      this.$route.meta.title = '添加图片'
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      if(id){//修改
        this.$route.meta.title = '修改图片'
        this.canuse = false
        this.pageDetails(id);
      }
      if(detailsId) {//查看
        this.pageStatus = 1
        this.$route.meta.title = '查看图片'
        this.cancel = true
        this.pageDetails(detailsId);
      }
    },
    pageDetails(id){//查看和修改的页面信息
      detailsAPI(id).then(res => {
        if (res.data.code == 0) {
          let diyArr = res.data.data.diyType.map(el => {//自定义分类
            let {code, dtId:diytypeid} = el
            return {code,diytypeid}
          })
          this.diyTypeCode = diyArr;//自定义分类
          this.checkedKeys = getMultipleSelectionIDs(res.data.data.diyType,'dtId')
          if(res.data.data.realPrice == 0){//免费
            this.resourceForm = {...res.data.data,priceOption:0}
          } else{ //付费
            this.resourceForm = {...res.data.data,priceOption:1}
          }
          this.getLabel()
        } else{
          this.$message.error('加载失败')
        }
      })
    },
    // 提交公共资源
    commonUpload() {
      if(this.resourceList.length != 0) {
        commonUploadAPI(this.resourceList).then(res => {})
      }
    },
    setSelect(data, obj){// 改变Tree选中节点时修改select
      // this.diyTypeCode = obj.checkedNodes.map(node => {
      //   return {diytypeid: node.id, code: node.code}
      // })
      this.diyTypeCode = obj.checkedNodes.map(node => {
          return {diytypeid: node.id, code: node.code}
      })
    },
    setTree(tag){// 删除多选标签设置Tree的选中节点
      // if (this.diyTypeCode.length>0) {
      //   const checkedKeys = getMultipleSelectionIDs(this.diyTypeCode,'diytypeid')
      //   this.$refs.tree.setCheckedKeys(checkedKeys)
      // } else {
      //   this.$refs.tree.setCheckedKeys([])
      // }
      this.diyTypeCode = deleteSame(this.diyTypeCode,tag.code)
        if (this.diyTypeCode && this.diyTypeCode.length>0) {
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
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/bmp' || file.type == 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/JPEG/PNG/GIF/BMP 格式!');
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
      this.$refs.image.clearValidate()
      var fileSize = response.size;
      var convertFileSize = Math.round((fileSize / 1024 / 1024) * 100)/100.0;
      var size =  convertFileSize + 'M';
      this.resourceForm.image = response.fileName;
      this.resourceForm.size = size;
      this.resourceForm.formats = response.suffixName;
    },
    handlePicPreview(file){ // 图片预览
      this.dialogImage = file
      this.dialogPvVisible = true
    },
    handleRemove(){ // 图片删除
      this.resourceForm.image = ''
    },
    //保存
    dataSubmit() {
      this.resourceForm.label = []
      this.labelList.map(el =>{
        if(el.selectId && el.selectId.length>0){//有选中label
          el.selectId.map((item,index) => {
            this.resourceForm.label.push({
              labelId : el.id, //父类Id
              labelContentDiyTypeId: item,  //子类Id
              labelContentDiyTypeCode: el.list[index].code
            })
          })
        }
      })
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {//必填名称--规则
          this.sending = true
          if((this.resourceForm.priceOption == 1 && this.resourceForm.price != '') || this.resourceForm.priceOption == 0){//售价---必填
            const data = this.diyTypeCode.map(el => {//自定义分类
              let {diytypeid:dtId,code} = el
              return {dtId,code}
            })
            this.resourceForm.diyType = data;
            const id = this.$route.query.id; //修改id
            if(id) {//修改
              this.resourceForm.id = id
              editAPI(this.resourceForm).then(res => {
                if (res.data.code == 0) {
                  this.$message.success('编辑成功')
                  this.$router.push({ path: '/database/picture' });
                  this.$router.go(-1);
                } else{
                  this.$message.error('编辑失败')
                }
                this.sending = false
              })
            } else{
              saveAPI(this.resourceForm).then(res => {
                if (res.data.code == 0) {
                  this.$message.success('添加成功')
                  this.$router.push({ path: '/database/picture' });
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
    // 售价切换为付费，将付费清空
    radioChange() {
      this.resourceForm.realPrice = ''
    }
  }
}
</script>

<style lang="less">
.picture_container {
  max-width: 1400px;
  min-width: 1200px;
  padding: 20px 0 90px 72px;
  .el-form,.el-select{
    width: 100%;
  }
  .searchInput {
    padding-left: 25px;
    box-sizing: border-box;
    .el-input{
      width: 50% !important;
      display: inline-block;
    }
  }
  .selectInput {
    width: 55%;
    padding-left: 25px;
    box-sizing: border-box;
  }
}
.avatar-uploader .el-upload {
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
    color: #c2cad8;
    font-size: 14px;
    font-family: "Microsoft YaHei";
    margin-left: 30px;
  }
  .t {
    color: #ccc;
    display: inline-block;
    margin-top: 10px;
  }
  .aa{
    display: block !important;
    width: 100%;
  }
  .title {
    font-weight: bold;
    margin: 20px 0;
  }
  .el-button {
    margin-bottom: 10px;
  }
</style>
