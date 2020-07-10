<template>
    <el-main>
        <div id="update">
            <div class="addSearch" @click="getAddSearch">增量索引</div>
            <div class="updateSearch" @click="getUpdateSearch">更新索引</div>
        </div>
    </el-main>
</template>

<script>
import { getAddSearchAPI, getUpdateSearchAPI } from '@/api/system-management/updateSearch'

export default {
    data() {
        return {
            
        }
    },
    mounted() {
        
    },
    methods: {
        getAddSearch() {
            getAddSearchAPI().then(res => {
                if(res.data.code == 0) {
                    this.$message.success('增量索引成功')
                }
            })
        },
        getUpdateSearch() {
            getUpdateSearchAPI().then(res => {
                if(res.status == 200) {
                    this.$message.success('更新索引成功')
                }
            })
        }
    }
}
</script>

<style scoped>
    #update {
        max-width: 1400px;
        min-width: 1200px;
        margin: 150px 0 0 500px;
        overflow: hidden;
    }
    .addSearch {
        width: 300px;
        height: 150px;
        text-align: center;
        line-height: 150px;
        color: #fff;
        background: #409EFF;
        font-size: 24px;
        cursor: pointer;
        float: left;
    }
    .updateSearch {
        width: 300px;
        height: 150px;
        margin-left: 60px;
        text-align: center;
        line-height: 150px;
        color: #FFFFFF;
        background: #97AECB;
        float: left;
        cursor: pointer;
        font-size: 24px;
    }
</style>
