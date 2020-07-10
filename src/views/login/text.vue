<!--上传进度条测试-->
<template>
  <div class="tetx">
    <img src="" alt="">
{{pross}}
    <input type="file" name="file" @change="submit($event)" ref="inputer">
    <!--<input type="button" value="提交" @click="submit"/>-->
  </div>

</template>

<script>
  import axios from 'axios';
  export default {
    name: "cameras-and-albums",
    data() {
      return {
        formData:new FormData(),
        imgs: {},
        imgLen:0,
        pross:0,
      }
    },
    created() {

    },

    watch:{

    },
    methods: {
      addImg(event){
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.fil = inputDOM.files;
        let oldLen=this.imgLen;
        let len=this.fil.length+oldLen;
        if(len>4){
          alert('最多可上传4张，您还可以上传'+(4-oldLen)+'张');
          return false;
        }
        for (let i=0; i < this.fil.length; i++) {
          let size = Math.floor(this.fil[i].size / 1024);
          if (size > 5*1024*1024) {
            alert('请选择5M以内的图片！');
            return false
          }
          this.imgLen++;
          this.$set(this.imgs,this.fil[i].name+'?'+new Date().getTime()+i,this.fil[i]);
        }
      },

      /*http://test16.zhongdianyun.com/file/file/upload/info*/
      submit(el) {
        let self=this;
        this.formData.append('file', this.$refs.inputer.files[0]);
        axios({
          url: 'http://test16.zhongdianyun.com:2018/file/file/upload/info',
          method: 'post',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
          data:this.formData,
          onUploadProgress: function (progressEvent) { //原生获取上传进度的事件
            /*console.log(Math.round(progressEvent.loaded / progressEvent.total * 100) + '%');
            this.pross=Math.round(progressEvent.loaded / progressEvent.total * 100) + '%';*/
            let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
            self.pross = '上传 ' + complete

          },
        }).then(res => {
          console.log(5555,res)
        })

        /*if(el.target.files[0].type.indexOf('image'>=0)){

          /!*let len='data:image/jpeg;base64,'.length;*!/
          /!*lrz(el.target.files[0],{width: 400})
            .then(function (rst) {
              /!*self.img=rst.base64;*!/
              let suffixName=rst.origin.name.slice(rst.origin.name.indexOf('.'));
              let imgStr=rst.base64.substring(len);
              // 处理成功会执行
              /!*self.imgList.push(rst.base64);*!/

              /!*let data={
                code: imgStr,
                contentType: rst.origin.type,
                originalFileName:rst.origin.name,
                size:rst.fileLen,
                suffixName: suffixName};*!/
              /!*axios({
                url: 'http://192.168.2.8:8080/api/file/file/upload/avatar',
                method: 'post',
                headers: {
                  'content-type': 'application/json;charset=UTF-8',
                },
                data:data,
                onUploadProgress: function (progressEvent) { //原生获取上传进度的事件
                  console.log(Math.round(progressEvent.loaded / progressEvent.total * 100) + '%');
                  if (progressEvent.lengthComputable) {
                    //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                    //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                    //console.log(Math.round(progress.loaded / progress.total * 100) + '%');
                    /!*callback1(progressEvent);*!/
                  }
                },
              }).then(res => {
                /!*callback2(res.data);*!/
              })*!/


            })
            .catch(function (err){
              // 处理失败会执行
            })
            .always(function () {
              // 不管是成功失败，都会执行
            });*!/

        }else{
          this.$valert.show('请选择图片');
        }*/

        /*console.log('TUPIAN',self.imgList)*/
        /*console.log(5)
        this.files=$("#upload_file").get(0).files;
        console.log(this.files.length);
        for(let i=0;i<this.files.length;i++){
          this.datas.append("file",this.files[i]);
        }
        this.show1=false;
        console.log(typeof this.files);
        console.log(this.files);
        if (!el.target.files[0].size) return;
        this.fileList(el.target);
        el.target.value = ''*/
      },

    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .tetx{

  }

</style>


