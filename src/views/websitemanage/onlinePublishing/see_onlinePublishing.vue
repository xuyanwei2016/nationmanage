<template>
    <div class=" inputCss">

        <div class="return">
            <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
            <span>查看选题内容</span>
        </div>
            <!-- <span @click='$router.go(-1)' class='returngo el-icon-arrow-left'>返回</span>  -->

        <el-form label-width='100px' :model='list'>
            <el-form-item label='选题名称：' prop='title'>
                <el-input style='width:500px' v-model='list.title' disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='姓名：' prop='name'>
                <el-input style='width:500px' v-model='list.name' disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='手机号：' prop='phone'>
                <el-input style='width:500px' v-model='list.phone' disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='提交时间：' prop='createTime'>
                <el-input style='width:500px' v-model='list.createTime' disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='审核状态：' prop='status'>
                <el-input v-if='list.status==0'  value='待审核' style='width:500px' disabled="true"></el-input>
                <el-input v-else-if='list.status==1' value='审核通过' style='width:500px'></el-input>
                <el-input v-else-if='list.status==2' value='审核未通过' style='width:500px'></el-input>
                <el-input v-else-if='list.status==3' value='完成沟通' style='width:500px'></el-input>
            </el-form-item>
            <el-form-item label='选题内容：' prop='content'>
                <el-input style='width:500px' type='textarea' v-model='list.content' :rows="4" disabled="true"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {getDetailsListAPI} from '@/api/onlinePublishing/index'
export default {
    data(){
        return{
            list:{

            }
        }
    },
    created(){
        this.getDetailsList()
    },
    methods:{
        getDetailsList(){
            let data = this.$route.query.id
            getDetailsListAPI(data).then(res=>{
                if( res.data.code == 0 ){
                    this.list = res.data.data
                }
            })
        }
    }
}
</script>
<style scope>
    .returngo{
        cursor: pointer;
        margin:0 30px;
        font-size:16px;
    }
    .return{
        margin: 20px 30px;
        font-size:16px;
    }
</style>
