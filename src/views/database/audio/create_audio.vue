<template>
  <div class="app-container inputCss">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)" style="margin-bottom: 20px;">返回</el-button>
      <el-form-item label="资源名称：" prop="name">
        <el-input v-model="resourceForm.name" clearable placeholder="请输入资源名称" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="来源：">
        <el-input v-model="resourceForm.source" clearable placeholder="请输入售价" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="关键词：">
        <el-input v-model="resourceForm.keywords" clearable placeholder="多个关键词用逗号隔开" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
       <el-form-item label="自定义分类：">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" :disabled="pageStatus == 1">
          <el-tree :data="navTree" ref="tree" show-checkbox node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps"  @check="setSelect" ></el-tree>
          <el-select v-model="diyTypeCode" @clear="clearCheckedKeys" value-key="diytypeid" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" style="width:100%;" placeholder="请选择" :disabled="pageStatus == 1">
            <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="简介：">
        <tinymce :height=300 ref="editor" v-model="resourceForm.synopsis" style="width:800px"></tinymce>
      </el-form-item>
      <el-form-item label="音频文件：" prop="audio">
        <el-upload :disabled="$route.query.id?false:true" class="audio-uploader clearfix" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-success="handleAudioSuccess" :before-upload="beforeAudioUpload">
          <div class="el-upload__text my_change_upload" v-if="$route.query.id">点击上传</div>
          <audio  v-if="resourceForm.audio" :src="`${uploadUrl}?fileName=${resourceForm.audio}&isOnLine=true`" controls>
            抱歉，您的浏览器不支持内嵌音频，你可以<a :href="`${uploadUrl}?fileName=${resourceForm.audio}&isOnLine=true`" style="text-decoration:underline;">点击下载</a>查看
          </audio>
          <i v-else class="el-icon-plus audio-uploader-icon"></i>
        </el-upload>

      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button @click="dataSubmit" >保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

  </div>
</template>

<style scoped lang="less">
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

  .audio-uploader {
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

<script>
import Tinymce from '@/components/Tinymce'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { getOptionAPI, getNavAPI, detailsAPI, saveAPI, editAPI } from '@/api/database/audio'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs} from '@/filters/getIds'
import { stitchData } from '@/utils/format'
import { mapGetters } from 'vuex'

export default {
  components:{ Tinymce },
  data() {
    return {
      resourceForm: {
        nationsType: this.$store.getters.getNation
      },
      dialogVisible:false,
      refresh: 0,
      editId: '',
      pageStatus:0,
      popoverVisible: false,
      divTypeCode: '',
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      options: [],
      navTree: [],
      rules:{
        name:[ { required: true,pattern:/^.{1,50}$/,message: '请输入正确的资源名称', trigger: 'change' }],
        audio: [ { required: true}]
        // price:[
        //   { required:true,pattern:/^(\d|[1-9]\d+)([.][0-9]{1,2})?$/,trigger: 'change',message:'请输入价格数字，小数点最多2位' }
        // ],
      },
      checkedKeys: [],
      diyTypeCode: {}
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
    this.dialogStatus = this.$route.query.type
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
  },
  mounted() {
    this.getNav();
    this.getOption();
    this.isEdit();
  },
  methods: {
    isEdit(){
      this.$route.meta.title = '添加音频素材'
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      if(id){//修改
        this.$route.meta.title = '修改音频素材'
        this.pageDetails(id);
      }
      if(detailsId) {//查看
        this.pageStatus = 1
        this.$route.meta.title = '查看音频素材'
        this.pageDetails(detailsId);
      }
    },
    pageDetails(id){//查看和修改的页面信息
      detailsAPI(id).then(res => {
        if(res.data.code === 0) {
          this.resourceForm = res.data.data;
          let diyArr = res.data.data.diyType.map(el => {
            let {code, dtId: diytypeid} = el
            return {code,diytypeid}
          })
          this.diyTypeCode = diyArr
          this.checkedKeys = getMultipleSelectionIDs(res.data.data.divTypeId,'dtId')
        } else {
          this.$message.error('加载失败')
        }
      })
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
   setSelect(data, obj){// 改变Tree选中节点时修改select
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
      this.$refs.tree.setCheckedKeys([])
    },
    //音频
    beforeAudioUpload(file) {
      let type = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase();
      const isAudio = type == 'mp3';
      if(!isAudio) {
        this.$message.error('上传音频只能是mp3格式!');
        return isAudio
      }
      this.$message.warning('上传中')
    },

    handleAudioSuccess(response, file, fileList) {
      this.$message.success('上传成功');
      this.resourceForm.audio = response;
    },
    dataSubmit() {//保存
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {//必填名称--规则
          if(this.resourceForm.audio){
            const data = this.diyTypeCode.map(el => {
              let {diytypeid: dtId, code} = el
              return {dtId, code}
            })
            this.resourceForm.diyType = data;
            const id = this.$route.query.id
            if(id) {//修改
              this.resourceForm.id = id;
              editAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('编辑成功')
                  this.$router.push({path: '/database/theory'})
                  this.$router.go(-1);
                } else{
                  this.$message.error('编辑失败')
                }
              })
            } else{
              saveAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('添加成功')
                  this.dialogVisible = false
                  this.$router.go(-1);
                } else{
                  this.$message.error('添加失败')
                }
              })
            }

          } else{
            this.$message.error('请上传音频!');
          }
        } else{
          this.$message.error('请将基础信息补全!');
        }
    })
    },

    cancel() {//取消
      this.$router.go(-1);
    },
  }
}
</script>
