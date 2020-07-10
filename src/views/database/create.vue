<template>
  <div class="app-container inputCss" @click="authorStatus = 1">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <div class="title">基本信息</div>
      <el-form-item label="文章标题：" prop="title"  style="clear:both;width:800px">
        <el-input v-model="resourceForm.title" clearable placeholder="建议在14个字以内，最多不超过50个字"  :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="作者：" prop="author"  style="clear:both;width:800px">
        <div style="position:relative" class="authoryizhu">
          <el-input v-model="resourceForm.author" clearable placeholder="请输入作者" style="margin-right:10px;" @input="authorLibrary"  :disabled="pageStatus == 1"></el-input>
          <ul style="position:absolute;top:30px;left:0;width:250px;background:#f5f5f5;list-style:none;padding-left:0px;max-height:200px;z-index:20;overflow-y:scroll" v-if="authorList && authorList.length>0 && authorStatus == 0">
            <li style="cursor: pointer" v-for="item in authorList" :key='item.id' @click="choiceAuthor(item.name,item.id)">{{item.name}}</li>
          </ul>
        </div>

      </el-form-item>
      <el-form-item label="关键词：" prop="keywords"  style="clear:both;width:800px">
        <el-input v-model="resourceForm.keywords" clearable placeholder="多个关键词用逗号隔开" style="margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="来源：" prop="source"  style="clear:both;width:800px">
        <el-input v-model="resourceForm.source" clearable placeholder="请输入来源" style="margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="自定义分类："  style="clear:both;width:800px">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click"  :disabled="pageStatus == 1">
          <el-tree
            :data="navTree" ref="tree"
            show-checkbox
            node-key="dtId"
            :default-checked-keys="checkedKeys"
            :props="defaultProps"
            @check="setSelect"
          >
          </el-tree>
          <el-select v-model="diyTypeCode" value-key="dtId" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" style="width:100%;" placeholder="请选择" :disabled="pageStatus == 1">

            <el-option v-for="item in options" :key="item.dtId" :label="item.showName" :value="item"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item :label='item.name' v-for="(item,index) in labelList" :key="index" style="clear:both;width:800px">
        <el-select multiple placeholder="请选择" v-model="item.selectId" style="width:100%;" :disabled="pageStatus == 1">
          <el-option v-for="info in item.list" :key="info.id" :label="info.labelContent" :value="info.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="PDF文件：">
        <el-button v-if="resourceForm.pdf" @click="queryPDF">查看</el-button>
        <el-upload  :disabled="$route.query.detailsId?true:false" :action="`${uploadUrl}${uploadPath}/info`" :on-exceed="handlePdfExceed" :before-upload="beforePdfUpload" :on-success="handlePdfSuccess"  multiple :limit="1" :on-remove="handlePdfRemove" v-if="!$route.query.detailsId">
          <el-button v-if="pageStatus == 0" :loading="uploading">选择文件</el-button>
          <span>{{resourceForm.pdf_zh}}</span>
        </el-upload>
        <span class="t"  v-if="!$route.query.detailsId">上传PDF文件后不需要再填写正文内容和多媒体文件</span>
        <span v-if="$route.query.detailsId">{{resourceForm.pdf?resourceForm.pdf_zh:'未上传文件'}}</span>
      </el-form-item>
      <el-form-item label="文章封面：">
        <el-upload :disabled="$route.query.detailsId?true:false" class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.img}&isOnLine=true`" v-if="resourceForm.img" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <img src="../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon" style="width: 100%; height: 100%;">
        </el-upload>
        <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
      <el-form-item label="简介：">
        <tinymce :height=300 ref="editor1" v-model="resourceForm.synopsis" style="width:800px" :id="'editor1'"></tinymce>
      </el-form-item>
      <el-form-item label="正文：">
        <tinymce :height=300 ref="editor2" v-model="resourceForm.text" style="width:800px" :id="'editor2'"></tinymce>
      </el-form-item>
      <el-form-item label="预览文本：">
        <tinymce :height=300 ref="editor3" v-model="resourceForm.previewText" style="width:800px" :id="'editor3'"></tinymce>
      </el-form-item>
      <el-form-item label="音频文件：">
        <el-upload :disabled="$route.query.detailsId?true:false" class="audio-uploader clearfix" :action="`${uploadUrl}${uploadPath}/video`" :show-file-list="false" :on-success="handleAudioSuccess" :before-upload="beforeAudioUpload" v-if="!pageStatus||resourceForm.audio">
          <div class="el-upload__text my_change_upload" v-if="!$route.query.detailsId">点击上传</div>
          <audio  v-if="resourceForm.audio" :src="`${uploadUrl}?fileName=${resourceForm.audio}&isOnLine=true`" controls>
            抱歉，您的浏览器不支持内嵌视频，你可以<a :href="`${uploadUrl}?fileName=${resourceForm.audio}&isOnLine=true`" style="text-decoration:underline;">点击下载</a>查看
          </audio>
          <i v-else class="el-icon-plus audio-uploader-icon"></i>
        </el-upload>
        <span>{{pageStatus&&!resourceForm.audio?'未上传音频':resourceForm.audio_zh}}</span>
      </el-form-item>
      <el-form-item label="视频文件：">
        <!--<span v-if="pageStatus&&!resourceForm.video" style="color: #606266; font-size: 14px;font-weight: normal">未上传文件</span>-->
        <el-upload :disabled="$route.query.detailsId?true:false" class="video-uploader clearfix" :action="`${uploadUrl}${uploadPath}/video`" :show-file-list="false" :on-success="handleVideoSuccess" :before-upload="beforeVideoUpload" v-if="!pageStatus||resourceForm.video">
          <div class="el-upload__text my_change_upload" v-if="!$route.query.detailsId">点击上传</div>
          <video v-if="resourceForm.video" :src="`${uploadUrl}?fileName=${resourceForm.video}&isOnLine=true`" controls>
            抱歉，您的浏览器不支持内嵌视频，你可以<a :href="`${uploadUrl}?fileName=${resourceForm.video}&isOnLine=true`" style="text-decoration:underline;">点击下载</a>查看
          </video>
          <i v-else class="el-icon-plus video-uploader-icon"></i>
        </el-upload>
        <span>{{pageStatus&&!resourceForm.video?'未上传视频':resourceForm.video_zh}}</span>
      </el-form-item>
      <div class="title">商品信息</div>
      <el-form-item label="全文阅读权限：" prop="readTextPower">
        <el-radio v-model="resourceForm.readTextPower" :label=0 :disabled="pageStatus == 1">游客可见</el-radio>
        <el-radio v-model="resourceForm.readTextPower" :label=1 :disabled="pageStatus == 1">会员可见</el-radio>
        <span class="tip" v-if="pageStatus == 0">可设置游客是否有阅读全文权限</span>
      </el-form-item>
      <el-form-item label="定价：" prop="price">
        <el-input v-model="resourceForm.price" clearable placeholder="请输入定价" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
        <span>元</span>
        <span class="tip" v-if="pageStatus == 0">在前台展示为划线价格</span>
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
      <el-button @click="dataSubmit"  :loading="!isSubmit">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
  import queryString from 'query-string'
  import { getOptionAPI, getNavAPI, getLabelAPI } from '@/api/database/video'
  import { labelListAPI } from '@/api/database/yizhu'
  import { saveAPI, detailsAPI, editAPI, commonUploadAPI } from '@/api/database/theory' //接口
  import { authorLibraryAPI } from '@/api/database/article' //接口
  import { requestMsg, confirm } from '@/utils/publicFunctions'
  import { getMultipleSelectionIDs } from '@/filters/getIds'
  import { stitchData } from '@/utils/format'
  import { mapGetters } from 'vuex'

  export default {
    components:{ Tinymce },
    data() {
      return {
        isOK:false,
        isRealPrice:false,
        resourceForm: {
          video:null,
          audio:null,
          priceOption:0,
          readTextPower:1,
          realPrice:'',
          author:'',
          label:[],
          nationsType: this.$store.getters.getNation,
          keywords:null,
          source:null,
          previewText:'',
        },
        realPrice:'',
        isSubmit:true,
        uploading:false,
        pageStatus:0,
        diyTypeCode: [],
        defaultProps: {
          children: 'list',
          label: 'showName'
        },
        // 自定义标签
        labelList: [],
        labelQuery: {
          dataType: this.$route.query.articleName,
          nationsType: this.$store.getters.getNation,
        },
        options: [],
        navTree: [],
        rules:{
          title:[
            { required: true, message: '请输入文章标题', trigger: 'change' },
            { pattern:/^.{1,50}$/,message: '文章标题长度必须小于50位', trigger: 'change'}

          ],
          realPrice:[
            { required: true,pattern:/^(([1-9]\d{0,4})(\.\d{1,2})?|0\.([1-9][0]?|\d[1-9]))$/,message: '请输入价格,范围在0.1-99999之间', trigger: 'change' },
          ],
          price:[
            { required: false,pattern:/^(([1-9]\d{0,4})(\.\d{1,2})?|0\.([1-9][0]?|\d[1-9]))$/,message: '请输入价格,范围在0.1-99999之间', trigger: 'change' },
          ],
          author:[
            { required: false, pattern: /^[\w\u4e00-\u9fa5]{1,10}$/, message: '作者长度必须小于10位', trigger: 'change'}
          ],
          source:[
            { required: false, pattern: /^.{1,50}$/, message: '来源长度必须小于50位', trigger: 'change'}
          ],
          keywords:[
            { required: false, pattern: /^.{1,30}$/, message: '关键词长度必须小于30位', trigger: 'change'}
          ],
          readTextPower:[
            { required: true}
          ],
          priceOption: [{ required: true}],
        },
        checkedKeys:[],
        // name:[
        //   '理论','药物','方剂','临床','医案','文化','机构','其他','未分类','蒙文'
        // ],
        authorList:[],
        authorStatus:1,
        authorId:'',
        resourceList: [],
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
        // this.labelQuery.nationsType = val
        // this.getLabel()
      },
      'resourceForm.priceOption':function(n,o){

        if(n == 0){
          this.resourceForm.realPrice='';
        }else{
          this.resourceForm.realPrice=this.realPrice;
        }
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
      this.getLabel()
    },
    methods: {
      getOption(){
        getOptionAPI().then(res => {
          if (res.data.code === 0) {
            // this.options = res.data.data.map(item => {
            //   let { id: diytypeid, ...temp } = item
            //   return {diytypeid, ...temp}
            // })
            this.options = res.data.data.map(item => {
              let showName = stitchData(res.data.data,item);
              let obj = {
                dtId:item.id,
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
        getNavAPI(this.$route.query.articleName).then(res => {
          res.data.code === 0 ? this.navTree = res.data.data[0].list : this.$message.error('获取nav数据失败');
        })
      },
      authorLibrary() {//查询
        this.authorList = [];
        this.resourceForm.authorId = '';
        if(this.resourceForm.author.split(" ").join("").length != 0){
          this.authorStatus = 0
          authorLibraryAPI(this.resourceForm.author.split(" ").join("")).then(res => {

            if( res.data.code === 0){
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
      // 查看pdf
      queryPDF() {
        window.open(uploadUrl+"?fileName="+this.resourceForm.pdf+"&isOnLine=true")
      },
      choiceAuthor(name,id) {//选择模糊查询的作者
        this.resourceForm.author = name;
        this.resourceForm.authorId = id;
        this.resourceForm.authorNameAndId = `${name},${id}`;
        this.authorStatus = 1;
      },
      isEdit(){
        //文章类型 0全部,1医著 2医家 31理论 32药物 33方剂 34临床 35医案 36文化 37机构 38医论 48其他 49未分类 50蒙文
        this.resourceForm.resourceType = this.$route.query.articleType;
        this.$route.meta.title = '添加'+this.$route.query.articleName;
        console.log(112233,this.$route.query.articleName)
        const id = this.$route.query.id; //修改id
        const detailsId = this.$route.query.detailsId; //查看id
        if(id){//修改
          this.$route.meta.title = '修改'+this.$route.query.articleName
          this.pageDetails(id);
        }
        if(detailsId) {//查看
          this.pageStatus = 1;

          this.$route.meta.title = '查看'+this.$route.query.articleName;
          this.pageDetails(detailsId);
        }
      },
      pageDetails(id){//查看和修改的页面信息
        detailsAPI(id).then(res => {
          if (res.data.code === 0) {
            let diyArr = res.data.data.diyType.map(el => {//自定义分类
              let {code, dtId} = el
              return {code,dtId}
            })
            this.diyTypeCode = diyArr;//自定义分类
            this.checkedKeys = getMultipleSelectionIDs(res.data.data.diyType,'dtId')
            this.getLabel()
            if(res.data.data.priceOption == 0){//免费
              this.resourceForm = {...res.data.data,priceOption:0};
            } else{ //付费
              this.resourceForm = {...res.data.data,priceOption:1}
            }

            this.resourceForm.price=this.resourceForm.price!=null?Number(this.resourceForm.price).toFixed(2):null;
            this.realPrice=this.resourceForm.realPrice;
            this.resourceForm.realPrice=this.resourceForm.realPrice?Number(this.resourceForm.realPrice).toFixed(2):'';
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

        this.diyType = obj.checkedNodes.map(node => {
          return {dtId: node.id, code: node.code}

        })
        this.diyTypeCode = this.diyType.filter(item => item.code)
      },
      setTree(tag){// 删除多选标签设置Tree的选中节点
        if (this.diyTypeCode.length>0) {
          const checkedKeys = getMultipleSelectionIDs(this.diyTypeCode,'code')
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
        /*this.uploading = true*/
        this.$message.warning('上传中');
      },
      handlePicSuccess(response, file, fileList){
        /*this.uploading = false*/
        this.$set(this.resourceForm,'img',response);
        this.$message.success('上传成功');

        /*this.resourceForm.img = response*/
      },
      handlePicPreview(file){ // 图片预览
        this.dialogImage = file
        this.dialogPvVisible = true
      },
      handleRemove(){ // 图片删除
        this.resourceForm.img = ''
      },
      //pdf上传
      beforePdfUpload(file){
        const isPDF = file.type === 'application/pdf'
        if (!isPDF) {
          this.$message.error('附件文件只能是 PDF 格式!')
          return isPDF;
        }
        this.uploading = true
      },
      handlePdfSuccess(response, file, fileList){
        this.$set(this.resourceForm,'pdf_zh',response.originalFileName);
        this.$set(this.resourceForm,'pdf',response.fileName);
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
      handlePdfExceed(files, fileList) {
        this.$message.warning(`单次上传最多1个文件`);
      },
      handlePdfRemove() {//删除pdf
        this.resourceForm.pdf = null;
        this.$set(this.resourceForm,'pdf_zh',null);
      },
      //视频
      beforeVideoUpload(file){ //beforeVideoUpload、handleVideoSuccess上传视频相关
        let type = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase()
        const isVideo = type === 'mp4';
        if (!isVideo) {
          this.$message.error('上传视频只能是 mp4 格式!');
          return isVideo
        }
        this.$message.warning('上传中');
      },
      handleVideoSuccess(response, file, fileList){
        this.$message.success('上传成功');
        this.resourceForm.video = response.fileName
        this.resourceForm.video_zh = response.originalFileName
        // 转换时间
        var fileTime = response.time
        var hours = Math.floor(fileTime / 3600000)
        var fileTimeHours = fileTime % 3600000
        var minutes = Math.floor(fileTimeHours / 60000)
        var fileTimeMinutes = fileTimeHours % 60000
        var second = Math.floor(fileTimeMinutes / 1000)
        if(hours == '0' && minutes == '0') {
          var time =  second + '秒'
        } else if(hours == '0') {
          var time =  minutes + '分' + second + '秒'
        } else {
          var time = hours + '时'+ minutes + '分' + second + '秒'
        }

        // 转换大小
        var fileSize = response.size
        var convertFileSize = Math.round((fileSize / 1024 / 1024) * 100)/100.0
        var size =  convertFileSize + 'M'

        const video = {
          keywords: this.resourceForm.keywords,
          name: response.originalFileName,
          nationsType: this.resourceForm.nationsType,
          resourceCode: response.fileName,
          resourceType:  61,
          size: size,
          source: this.resourceForm.source,
          timeLength: time
        }

        this.resourceList.push(video);
        this.resourceForm.names.push(response.originalFileName)
        this.resourceForm.videos.push(response.fileName)


      },
      //音频
      beforeAudioUpload(file){ //
        let type = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase()
        const isAideo = type === 'mp3';
        if (!isAideo) {
          this.$message.error('上传视频只能是 mp3 格式!');
          return isAideo
        }
        this.$message.warning('上传中');
      },
      handleAudioSuccess(response, file, fileList){
        this.$message.success('上传成功');
        this.resourceForm.audio = response.fileName
        this.resourceForm.audio_zh = response.originalFileName
        // 转换时间
        var fileTime = response.time
        var hours = Math.floor(fileTime / 3600000)
        var fileTimeHours = fileTime % 3600000
        var minutes = Math.floor(fileTimeHours / 60000)
        var fileTimeMinutes = fileTimeHours % 60000
        var second = Math.floor(fileTimeMinutes / 1000)
        if(hours == '0' && minutes == '0') {
          var time =  second + '秒'
        } else if(hours == '0') {
          var time =  minutes + '分' + second + '秒'
        } else {
          var time = hours + '时'+ minutes + '分' + second + '秒'
        }

        // 转换大小
        var fileSize = response.size
        var convertFileSize = Math.round((fileSize / 1024 / 1024) * 100)/100.0
        var size =  convertFileSize + 'M'

        const audio = {
          keywords: this.resourceForm.keywords,
          name: response.originalFileName,
          nationsType: this.resourceForm.nationsType,
          resourceCode: response.fileName,
          resourceType:  62,
          size: size,
          source: this.resourceForm.source,
          timeLength: time
        }
        this.resourceList.push(audio);
      },
      // 自定义标签
      getLabel() {
        labelListAPI(this.labelQuery).then(res => {
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
      //保存
      dataSubmit() {
        if(!this.isSubmit)return
        this.isSubmit=false;
        this.resourceForm.label=[];
        this.labelList.map(el =>{//自定义标签
          if(el.selectId && el.selectId.length>0){//有选中label
            el.selectId.map((item,index) => {
              this.resourceForm.label.push({
                labelId : el.id, //父类Id
                labelContentDiyTypeId: item,  //子类Id
                labelContentDiyTypeCode: el.list[index].code
              });
            })
          }
        })
        this.$refs['resourceForm'].validate((valid) => {
          if (valid) {//必填名称--规则 （pdf和正文内容至少填一项）
            if(this.resourceForm.text != null || this.resourceForm.pdf != null) {
              if((this.resourceForm.priceOption == 1 && this.resourceForm.realPrice != '') || this.resourceForm.priceOption == 0){//售价---必填
                const data = this.diyTypeCode.map(el => {//自定义分类
                  let {dtId,code} = el
                  return {dtId,code}
                })
                this.resourceForm.diyType = data;
                if(this.resourceForm.priceOption != 1) this.resourceForm.realPrice = 0  // 售价
                const id = this.$route.query.id; //修改id

                this.resourceForm.price=this.resourceForm.price?Number(this.resourceForm.price).toFixed(2):null;
                this.resourceForm.realPrice=this.resourceForm.realPrice?Number(this.resourceForm.realPrice).toFixed(2):'0.00';
                delete this.resourceForm.author;
                delete this.resourceForm.authorId;
                if(id) {//修改
                  console.log('修改')
                  this.resourceForm.id = id;
                  editAPI(this.resourceForm).then(res => {
                    if (res.data.code === 0) {
                      this.$message.success('编辑成功')
                      this.$router.push({ path: '/database/theory' });
                      this.commonUpload()
                      this.$router.go(-1);
                    } else{
                      this.$message.error('编辑失败')
                    }
                    this.isSubmit=true;
                  })
                } else{
                  console.log('添加')
                  saveAPI(this.resourceForm).then(res => {
                    if (res.data.code === 0) {
                      this.$message.success('添加成功')
                      /*this.$router.push({ path: '/database/clinic' });*/
                      this.commonUpload()
                      this.$router.go(-1);
                    } else{
                      this.$message.error(res.data.msg)
                    }
                    this.isSubmit=true;
                  })
                }
              } else{
                this.$message.error('请填写售价哦');
                this.isSubmit=true;
              }
            } else{
              this.$message.error('正文和pdf至少填一项');
              this.isSubmit=true;
            }
          } else{
            this.$message.error('请将信息补全!');
            this.isSubmit=true;
          }
        })
      },
      cancel() {//取消
        this.$router.go(-1);
      },
    }
  }
</script>

<style scoped lang="less">
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
    margin-bottom: 20px;
    margin-top: 10px;
  }
  .el-button {
    margin-bottom: 10px;
  }

  .audio-uploader,.video-uploader {
    position: relative;
    .el-upload:hover {
      .my_change_upload {
        display: block;
      }
    }
    .my_change_upload {
      position: absolute;
      top: 10px;
      right: 20px;
      z-index: 10;
      background: #409eff;
      padding: 0 4px;
      display: none;
      border-radius: 6px;
      color: #fff;
    }
  }



</style>
