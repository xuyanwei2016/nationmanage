<template>
  <div class="app-container inputCss">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)" style="margin-bottom: 20px;">返回</el-button>
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="resourceForm.name" clearable placeholder="请输入姓名" style="width:500px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="作者照片：" prop="faceImg">
        <el-upload :disabled="$route.query.detailsId?true:false" class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.faceImg}&isOnLine=true`" v-if="resourceForm.faceImg" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <!-- <i class="el-icon-plus avatar-uploader-icon" v-else></i> -->
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon" style="width: 100%; height: 100%;">
        </el-upload>
        <span class="tip">建议尺寸286*390px，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-radio v-model="resourceForm.sex" :label="1" :disabled="pageStatus == 1">男</el-radio>
        <el-radio v-model="resourceForm.sex" :label="0" :disabled="pageStatus == 1">女</el-radio>
      </el-form-item>
      <el-form-item label="机构名称：" prop="institutionName">
        <el-input v-model="resourceForm.institutionName" clearable placeholder="请输入机构名称" style="width:500px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="学历：">
        <el-select v-model="resourceForm.education" placeholder="请选择学历" :disabled="pageStatus == 1" style="width:500px;">
          <el-option v-for="(typeItem,index) in educationList" :key="index" :label="typeItem" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室：">
        <el-select v-model="resourceForm.department" placeholder="请选择科室" :disabled="pageStatus == 1"  style="width:500px;">
          <el-option v-for="(typeItem,index) in departmentList" :key="index" :label="typeItem" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职称：" prop="title">
          <el-input v-model="resourceForm.title" clearable placeholder="请输入职称" style="width:500px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="职务：" prop="post">
        <el-input v-model="resourceForm.post" clearable placeholder="请输入职务" style="width:500px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="自定义分类：" style="clear:both;">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" :disabled="pageStatus == 1">
          <el-tree :data="navTree" ref="tree" show-checkbox  node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps"  @check="setSelect" ></el-tree>
          <el-select v-model="diyTypeCode" value-key="diytypeid" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" style="width:500px;" placeholder="请选择" :disabled="pageStatus == 1">
            <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item :label='item.name' v-for="(item,index) in labelList" :key="index" style="clear:both;width:500px">
        <el-select multiple placeholder="请选择" v-model="item.selectId" style="width:500px;">
          <el-option v-for="info in item.list" :key="info.id" :label="info.labelContent" :value="info.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作者简介：" prop="description">
        <tinymce :height=300 ref="editor" v-model="resourceForm.description" style="width:800px"></tinymce>
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
import { labelListAPI } from '@/api/database/yizhu'
import { getOptionAPI, getNavAPI } from '@/api/database/video'
import { detailsAPI, saveAPI, editAPI, educationAPI, departmentAPI, titleAPI } from '@/api/database/doctor'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { stitchData } from '@/utils/format'
import { mapGetters } from 'vuex'

export default {
  components:{ Tinymce },
  data() {
    return {
      uploading:false,
      resourceForm: {
        sex:1,
        label:[],
        faceImg:'',
        nationsType: this.$store.getters.getNation
      },
      pageStatus:0,
      diyTypeCode: [],
      // 自定义标签
      labelList: [],
      labelQuery: {
        dataType:'医家',
        nationsType: this.$store.getters.getNation
      },
      labelProps: {
        children: 'list',
        label: 'labelContent'
      },
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      options: [],
      navTree: [],
      rules:{
        name:[
          { required: true,message: '请输入姓名', trigger: 'change' },
          { pattern:/^.{1,10}$/,message: '姓名长度必须小于10个字', trigger: 'change' }
        ],
        title:[
          { required: true, message: '请输入职称', trigger: 'change' },
          { pattern:/^.{1,50}$/,message: '请输入50字以内的职称', trigger: 'change' }
        ],
        sex:[
          {required: true,message: '请选择性别', trigger: 'change'}
        ],
        description:[
          {required: true,message: '请输入简介', trigger: 'change'},
          {pattern:/^(.|\n){1,1000}$/,message: '请输入1000字以内的简介', trigger: 'change'}
        ],
        institutionName:[
          { required: false,pattern:/^.{1,20}$/,message: '机构名称限制20个字'}
        ],
        post:[
          { required: false, pattern:/^.{1,10}$/ , message: '限制10个字'}
        ],
        faceImg:[
          {required: true, message: '请选择作者照片',trigger: 'change'}
        ]
      },
      checkedKeys:[],
      educationList: [],
      departmentList: [],
      titleList:[],
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
    'resourceForm.description'(n,o){
      console.log(2121,n)
      this.$refs.resourceForm.validateField('description');
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
    this.geteducation();
    this.getdepartment();
    this.getTitle();
    this.getLabel()
  },
  methods: {
    getOption(){
      getOptionAPI().then(res => {
        if (res.data.code === 0) {
          // this.classData = res.data.data
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
      getNavAPI('医家').then(res => {
        res.data.code === 0 ? this.navTree = res.data.data[0].list : this.$message.error('获取nav数据失败');
      })
    },
    geteducation() {//学历
      educationAPI().then(res => {
        res.data.code === 0 ? this.educationList = res.data.data : this.$message.error('获取数据失败');
      })
    },
    getdepartment() {//科室
      departmentAPI().then(res => {
        res.data.code === 0 ? this.departmentList = res.data.data : this.$message.error('获取数据失败');
      })
    },
    getTitle() {//职称
      titleAPI().then(res => {
        res.data.code === 0 ? this.titleList = res.data.data : this.$message.error('获取数据失败');
      })
    },
    isEdit(){
      this.$route.meta.title = '添加作者'
      const id = this.$route.query.id;
      const detailsId = this.$route.query.detailsId;
      if(id){//修改
        this.$route.meta.title = '修改作者'
        this.pageDetails(id);
      }
      if(detailsId) {//查看
        this.pageStatus = 1
        this.$route.meta.title = '查看作者'
        this.pageDetails(detailsId);
      }
    },
    pageDetails(id){//查看和修改的页面信息
      detailsAPI(id).then(res => {
        this.resourceForm = {...res.data.data,education:String(res.data.data.education),department:String(res.data.data.department),title:String(res.data.data.title)};
        let diyArr = res.data.data.diyType.map(el => {//自定义分类
          let {diytypeCode:code, diytypeId:diytypeid} = el
          return {code,diytypeid}
        })
        this.diyTypeCode = diyArr;//自定义分类
        this.checkedKeys = getMultipleSelectionIDs(res.data.data.diyType,'diytypeId')
        this.getLabel()
      })
    },
    setSelect(data, obj){// 改变Tree选中节点时修改select
      this.diyType = obj.checkedNodes.map(node => {
        console.log(node)
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
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/bmp' || file.type == 'image/gif';
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
      /*this.resourceForm.faceImg = response;*/
      this.$set(this.resourceForm,'faceImg',response);
      this.$refs.resourceForm.clearValidate('faceImg');

    },
    handlePicPreview(file){ // 图片预览
      this.dialogImage = file
      this.dialogPvVisible = true
    },
    handleRemove(){ // 图片删除
      document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
      this.resourceForm.faceImg  = '';
      this.$refs.resourceForm.validateField('faceImg');
      /*this.rules.faceImg= [{ required: true, message: '请上传图片' }]*/
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
    dataSubmit() {//保存
      this.resourceForm.label = []
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
        if (valid) {//必填名称

            this.sending = true
            const data = this.diyTypeCode.map(el => {//自定义分类
              let {diytypeid:diytypeId,code:diytypeCode} = el
              return {diytypeId,diytypeCode}
            })
            this.resourceForm.diyType = data;
            const id = this.$route.query.id; //修改id
            if(id) {//修改
              this.resourceForm.id = id // id (integer, optional): 作者ID ,
              editAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('编辑成功')
                  this.$router.push({ path: '/database/doctor' });
                } else{
                  this.$message.error('编辑失败')
                }
                this.sending = false
              })
            } else{
              saveAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('添加成功')
                  this.$router.push({ path: '/database/doctor' });
                } else{
                  this.$message.error('添加失败')
                }
                this.sending = false
              })
            }

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
