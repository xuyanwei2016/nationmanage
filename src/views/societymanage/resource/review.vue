<template>
  <div class="app-container">
    <div class="content">
      <div class="left">
        <div class="header">
          <img :src="`${uploadUrl}?fileName=${data.userImg}&isOnLine=true`" v-if="data.userImg" class="avatar" >
          <img src="../../../assets/img/default.png" v-else>
        </div>
        <div class="name">{{data.userName}}</div>
        <div class="realName">
          <span class="title">真实姓名：</span>
          {{data.name}}
        </div>
        <div class="num">
          <span class="title">评&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分：</span>
          <el-rate v-model="data.score" disabled text-color="#ff9900" style="display:inline"></el-rate>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" class="bth" v-if="data.essence == 0" @click="setBook(1)">设为精彩评论</el-button>
        <el-button type="primary" class="bth" v-else @click="setBook(0)">已推荐书评</el-button>
        <el-button type="primary" class="bth" v-if="data.unauditedNum != 0" @click="batchExamine">批量审核</el-button>
        <span class="tips" v-if="data.unauditedNum != 0"><span style="color:red">{{data.unauditedNum}}</span>条信息未审核，审核通过以后向前台用户公开显示</span>
        <div class="list"><span class="list-left">资源名称：</span>{{data.resourceName}}</div>
        <!--<div class="list"><span class="list-left">资源类型：</span>{{name[data.resourceClass]}}</div>-->
        <div class="list"><span class="replay-num">资源类型：{{name[data.resourceClass]}}&nbsp;</span><span class="support">资源来源：{{data.accessMedium}}</span></div>
        <div class="list"><span class="replay-num">回复&nbsp;&nbsp;<span style="color:red">{{data.replyNum}}</span>&nbsp;条</span><span class="support">点赞&nbsp;&nbsp;<span style="color:red">{{data.fabulousNum}}</span>&nbsp;个</span></div>
        <div class="list"><span class="list-left">评论时间：</span>{{data.releaseTime}}</div>
        <div class="list"><span class="list-left">评论内容：</span>{{data.content}}</div>
      </div>
    </div>

    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="140px" class="ib">
      <el-form-item label="用户名：">
        <el-input v-model="resourceForm.userName" clearable style="width:250px;margin-right:10px" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="回复内容：" prop="content">
        <el-input type="textarea" v-model="resourceForm.content" :rows="10" style="width:500px"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-left:140px" @click="replay">回复</el-button>
    <span class="tips">管理员回复内容会在前台显示</span>

    <div class="replay">
      <div class="list" v-for="(item,index) in replayList" :key="index">
        <div class="left">
          <div v-if="item.fatherId != item.mainId">{{item.userName}}：<span>回复</span> {{item.fatherName}}</div>
          <div v-else>{{item.userName}}：</div>
          <div class="replay-content">{{item.content}} </div>
        </div>
        <div class="right">
          <div class="date">{{item.releaseTime}}</div>
          <div class="button">
            <span class="hide" v-if="item.status == 1" @click="checkout(item.id,2)">隐藏</span>
            <span class="hide" v-if="item.status == 2" @click="checkout(item.id,1)">显示</span>
            <span @click="deleteData(item.id)">删除</span>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dataSubmit" >刷新</el-button>
      <el-button @click="$router.go(-1)">关闭</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="450px" title="审核操作">
      <el-form>
        <el-form-item label="审核：" >
          <el-radio v-model="reviewStatus" label="1">审核通过</el-radio>
          <el-radio v-model="reviewStatus" label="2">审核不通过</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataReview">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { detailsAPI, setStatusAPI, deleteAPI, replayAPI, replayCheck } from '@/api/society-manage/resource'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'

export default {
  components:{ Tinymce },
  data() {
    return {
      resourceForm:{
        userName:'管理员',
        content:null
      },
      data:{},
      replayList:[],
      isReplay:true,
      uploading:false,
      dialogVisible:false,
      reviewStatus:'1',
      mainId: null,
      name:[
        '理论','药物','方剂','临床','医案','文化','机构','其他','未分类','蒙文'
      ],
      rules: {
        content: [
          { required: true,pattern:/^.{1,100}$/ ,message: '请填写1-100字以内的回复内容', trigger: 'change' }
        ]
      },
    }
  },
  created(){
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(){//查看和修改的页面信息
      const id = this.$route.query.id; //查看id
      detailsAPI(id).then(res => {
        if (res.data.code === 0) {
          this.data = res.data.data
          this.replayList = res.data.data.replyVoList
        } else{
          this.$message.error('加载失败')
        }
      })
    },
    setBook(index) {//设置精彩书评
      const data = {
        essence: index,//精彩书评：0 不是，1 是 ,
        id:this.data.id
      }
      setStatusAPI(data).then(res => {
        if (res.data.code === 0) {
          this.$message.success('设置成功')
          this.getList()
        } else{
          this.$message.error('设置失败')
        }
      })
    },
    checkout(id,index) {//显示隐藏
      const data = {
        status: index, //status (integer, optional): 状态：0未审核，1已通过，2未通过 ,
        id:id
      }
      setStatusAPI(data).then(res => {
        if (res.data.code === 0) {
          this.$message.success('操作成功')
          this.getList()
        } else{
          this.$message.error('操作失败')
        }
      })

    },
    deleteData(id) {//删除
      confirm.apply(this,['确定要删除吗？']).then(() => {
        deleteAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
        })
      })
    },
    replay() {//回复
      if(!this.isReplay){return}
      this.isReplay=false;
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {
          this.resourceForm.fatherId = this.data.id
          this.resourceForm.mainId = this.data.id
          this.resourceForm.status = 1
          this.resourceForm.resourceId = this.data.resourceId
          replayAPI(this.resourceForm).then(res => {
            if (res.data.code === 0) {
              this.$message.success('回复成功')
              this.resourceForm.content = null;
              this.getList()
              this.$nextTick(() => {
                this.$refs['resourceForm'].clearValidate()
              })
            } else{
              this.$message.error('回复失败')
            }
            this.isReplay=true;
          })
        } else{
          this.$message.error('请填写1-100字的回复内容');
          this.isReplay=true;
        }
      })
    },
    batchExamine(){//批量审核 ---待审核状态
      this.dialogVisible = true
    },
    updataReview() {//审核
        const data ={
          mainId:this.data.id,
          status:this.reviewStatus
        }
        this.dialogVisible = false
        replayCheck(data).then(res => {
          if(res.data.code === 0){
            this.$message.success('审核成功');
            this.getList();
          } else {
            this.$message.error('审核失败');
          }
        })
    },
    //保存
    dataSubmit() {
      this.getList();
    },
    cancel() {//取消
      this.$router.go(-1);
    },
  }
}
</script>

<style lang="less">
.content{
  width: 90%;
  margin-left: 5%;
  display: flex;
  flex-direction: row;
  margin-bottom: 50px;
  border: solid 1px #ccc;
  .left{
    border-right: solid 1px #ccc;
    width: 350px;
    text-align: center;
    padding: 30px 0;
    .header{
      height: 80px;
      width: 80px;
      margin: 0 auto;
      text-align: center;
      img{
        height: 80px;
        width: 80px;
        border-radius: 50%;
        object-fit: fill;
      }
    }
    .name{
      margin-top: 10px;
    }
    .realName,.num{
      margin-top: 40px;
      margin-bottom: 20px;
      width: 80%;
      text-align: left;
    }
    .num{
      margin: 0;
    }
    .title{
      width: 80px;
      display: inline-block;
      text-align: right;
      margin-left: 60px;
    }
  }
  .right{
    flex:1;
    padding: 30px 20px;
    .replay-num{
      margin-right: 40px;
      color: #222;
    }
    .support{
      color: #222;
    }
    .el-button{
      height: 40px;
    }
    .list{
      clear: both;
      margin-top: 20px;
      color: #888;
    }
    .list-left{
      color:#222;
    }
  }

}
.tips{
  color: #999;
  line-height: 40px;
  font-size: 14px;
}
.replay{
  margin-top: 60px;
  width: 90%;
  margin-left: 5%;
  border-top: 1px dotted #ccc;
  .list{
    width: 80%;
    margin-left: 10%;
    overflow: hidden;
    padding: 40px;
    border-bottom: 1px dotted #ccc;
  }
  .left{ //溢出隐藏
    float: left;
    width: 70%;
    .replay-content{
      margin-top: 20px;
      color: #888;
      width: 100%;
      // overflow: hidden;
      // text-overflow:ellipsis;
      // white-space: nowrap;
    }
    span{
      color:cyan;
    }
  }
  .right{
    float: left;
    width: 30%;
    text-align: right;
    .button{
      margin-top: 20px;
      color: #00f;
      cursor: pointer;
    }
    .hide{
      margin-right: 20px;
    }
  }
}
.dialog-footer{
  margin-top: 40px;
}
</style>
