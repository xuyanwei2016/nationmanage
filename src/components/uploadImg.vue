<template>
  <div>
    <div class="upload-item" v-if="!formList.business">
        <div class="item-con">
            <img :src="addImg" alt="">
            <span class="upload-text">上传照片</span>
        </div>
        <input name="logo" @change="uploadLogo($event,'4')" ref="file" type="file" class="upLoad-img">
    </div>
    <div v-if="formList.business" class="showPic">
          <img class="showImg"  :src="imgUrl(formList.business)" alt="" @mouseenter="hoverIndex = '4'">
          <div class="hover-img" v-show="hoverIndex == '4'" @mouseenter="hoverIndex = '4'" @mouseleave="hoverIndex = ''">
              <div class="hover-img-text">
                 <!-- v-if="title != '查看学校'" -->
                  <div class="upload-again">
                      重新上传
                  </div>
                  <input name="business" @change="uploadLogo($event,'4')" ref="file" type="file" class="again-img">
              </div>
              <span class="hover-img-text" @click="lookImg(formList.business)">查看照片</span>
              <img class="hasimg" :src="hasSuccess" alt="">
          </div>
      </div>
  </div>
</template>
<script>

import mapList from '../../../static/gaode.json'
import Vue from 'vue'
export default {
 name: 'uploadImg',
    data() {
        return {

        }
    },
    created() {

    },
    watch: {

    },
    methods:{
      uploadSchoolAPI
    },
    computed: {
    },
    
}
</script>
<style lang="less">
.upload-item{
    position: relative;
    .upLoad-img{
        width: 168px;
        height: 98px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }
    .upLoad-img:hover{
        cursor: pointer;
    }
    .item-con{
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 168px;
        height: 98px;
        background: #fff;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        position: absolute;
        left: 0;
        top: 0;
        img{
            margin: 20px auto 16px;;
            height: 30px;
            width: 30px;
        }
        .upload-text{
            line-height: 14px;
            color: #A9AFBC;
            font-size: 14px;
        }
    }
    
  }
  .showPic{
    position: relative;
    display: flex;
    width: 165px;
    height: 98px;
    .showImg{
        margin: auto;
        text-align: center;
        max-width: 165px;
        max-height: 98px;
    }
    .hover-img{
        position: absolute;
        top: 0;
        left: 0;
        width: 165px;
        height: 98px; 
        background: rgba(152, 153, 152, 0.5);
        display: flex;
        flex-direction: column;
        text-align: center;
        padding: 20px 0 ;
        .hover-img-text{
            line-height: 17px;
            padding: 5px 0;
            font-size: 14px;
            color:#fff;
            position: relative;
            .upload-again{
                position: relative;
            }
            .again-img{
                width: 168px;
                height: 17px;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
            }
            .again-img:hover{
                cursor: pointer;
            }
        }
        .hover-img-text:hover{
            cursor: pointer;
        }
        .hasimg{
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .showImg:hover{
        cursor: pointer;
    }
  }
</style>