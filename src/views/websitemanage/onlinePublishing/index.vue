<template>
    <div class="app-container calendar-list-container">
        <div class='nav-buttons-container'>
            <!-- 批量审核 -->
            <el-button v-if="authBtns.map(i => i.idName).indexOf('examine') >= 0" @click="examineClick">{{authBtns.filter(i => i.idName=='examine')[0].name}}<i v-if="authBtns.filter(i => i.idName=='examine').length>0 && authBtns.filter(i => i.idName=='examine')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('examine')].icon, 'el-icon--right']"></i></el-button>
            <!-- 完成沟通 -->
            <el-button v-if="authBtns.map(i => i.idName).indexOf('communicate') >= 0" @click="communicateClick">{{authBtns.filter(i => i.idName=='communicate')[0].name}}<i v-if="authBtns.filter(i => i.idName=='communicate').length>0 && authBtns.filter(i => i.idName=='communicate')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('communicate')].icon, 'el-icon--right']"></i></el-button>
        </div>
        <el-form inline class='demo-form-inline'>
            <el-form-item label='选题名称：'>
                <el-input v-model='name' class="filter-item" style='width:200px;'></el-input>
            </el-form-item>
            <el-form-item label='状态：' style='margin-left:30px'>
                <el-select v-model='value' @change='changeStatus($event)'>
                    <el-option  v-for='(item,index) in selectList' :key='index' :value='item.value' :label='item.label'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提交时间：" style='margin-left:30px;'>
                <el-date-picker
                    v-model="value1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" icon="el-icon-search" @click='search'>检索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" icon="el-icon-edit" @click='reset'>重置</el-button>
            </el-form-item>
        </el-form>
        <el-table element-loading-text="给我一点时间" border :data='listData' @selection-change="handleSelectionChange" v-loading='listLoading'>
            <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
            <el-table-column align="center" type="selection" width="50"></el-table-column>
            <el-table-column align='center' label='选题名称' min-width='200px' :show-overflow-tooltip="true">
                <template slot-scope='scope'>
                    <span>{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column align='center' label='姓名' min-width='200px' :show-overflow-tooltip="true">
                <template slot-scope='scope'>
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align='center' label='手机号' min-width='200px'>
                <template slot-scope='scope'>
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column align='center' label='提交时间' min-width='200px'>
                <template slot-scope='scope'>
                    <span>{{scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align='center' label='审核状态' min-width='200px'>
                <template slot-scope='scope'>
                    <span>{{scope.row.status == 0 ? '待审核':''}}</span>
                    <span>{{scope.row.status == 1 ? '审核通过':''}}</span>
                    <span>{{scope.row.status == 2 ? '审核未通过':''}}</span>
                    <span>{{scope.row.status == 3 ? '完成沟通':''}}</span>
                </template>
            </el-table-column>
            <el-table-column align='center' label='操作' min-width='200px'  class-name="small-padding fixed-width">
                <template slot-scope='scope'>
                    <router-link :to="{path:`onlinePublishing/see_onlinePublishing`,query:{id:scope.row.id}}" >
                        <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
                    </router-link>
                    <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)"></i>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
            </el-pagination>
        </div>
        <el-dialog :visible.sync='dialogVisible' width='30%' title='批量审核'>
            <el-form>
                <el-form-item style='text-align:center;padding:0 20px;'>
                    <el-radio-group v-model='statusDia' >
                        <el-radio :label='1'>审核通过</el-radio>
                        <el-radio :label='2'>审核未通过</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="settingSubmit">确定</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getPublisherListAPI,updateStatusAPI,bachDeleteAPI } from '@/api/onlinePublishing/index'
import {operationMsg, confirm} from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'
export default {
    data(){
        return{
            total: null,
            authBtns:[],
            listQuery:{
                pageNum:1,
                pageSize:100,
                title:null,
                status:null,
                beginTime:null,
                endTime:null
            },
            name:'',
            value1:[],
            selectList:[
                {
                    value:'',
                    label:'全部'
                },
                {
                    value:'0',
                    label:'待审核'
                },
                {
                    value:'1',
                    label:'审核通过'
                },
                {
                    value:'2',
                    label:'审核失败'
                },
                {
                    value:'3',
                    label:'完成沟通'
                },
            ],
            value:'',
            listData:[],
            statusSeach:'',
            multipleSelection:[],
            massQuery: {
                ids: []
            },
            statusDia:1,
            dialogVisible:false,
            listLoading:true,
        }
    },
    mounted(){
        if( ifUndefined(store.getters.friendlink_managementSerKeys.pageNum) ){
            this.listQuery = store.getters.friendlink_managementSerKeys
        }
        this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    },
    created(){
        this.getPublisherList()
    },
    methods:{
        settingSubmit(){
            let ids = getMultipleSelectionIDs(this.multipleSelection);
            let data = {
                ids:ids,
                status:this.statusDia
            }
            updateStatusAPI(data).then(res=>{
                this.dialogVisible = false
                if( res.data.code == 0 ){
                    this.$message.success('操作成功')
                    this.getPublisherList()
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.multipleSelection.length>0 ? this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection) : true
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getPublisherList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getPublisherList();
        },
        examineClick(){
            if( this.multipleSelection.length > 0 ){
                this.dialogVisible = true
            }else{
                this.$message.warning('请先选择要审核的条目')
            }
        },
        communicateClick(){
            if( this.multipleSelection.length > 0 ){
                console.log(this.multipleSelection,'aaa')
                const unreviewed = this.multipleSelection.every(arg => arg.status == 1 )
                if( unreviewed ){
                    confirm.apply(this,['确定标记为已完成沟通状态?', '沟通状态']).then(() => {
                        let ids = getMultipleSelectionIDs(this.multipleSelection);
                        let data = {
                            ids:ids,
                            status:3
                        }
                        updateStatusAPI(data).then(res=>{
                            if( res.data.code == 0 ){
                                this.$message.success('操作成功')
                                this.getPublisherList()
                            }
                        })
                    });
                }else{
                    this.$message.warning('只能选择审核通过的条目')
                }
            }else{
                this.$message.warning('请先选择要完成沟通的条目')
            }
        },
        changeStatus(val){
            this.statusSeach = val
        },
        search(){
            if( this.value1 ){
                this.listQuery.beginTime = this.value1[0]
                this.listQuery.endTime = this.value1[1]
            }else{
                this.listQuery.beginTime = null
                this.listQuery.endTime = null
            }
            if( this.statusSeach ){
                this.listQuery.status = this.statusSeach
            }else{
                this.listQuery.status = null
            }
            if( this.name ){
                this.listQuery.title = this.name
            }else{
                this.listQuery.title = null
            }
            this.getPublisherList()
        },
        reset(){
            this.name = null
            this.value1 = null
            this.value = null
            this.listQuery.beginTime = null
            this.listQuery.endTime = null
            this.listQuery.status = null
            this.listQuery.title = null
            this.getPublisherList()
        },
        singleDelete(ids){
            confirm.apply(this,['确定要删除吗?', '删除']).then(() => {
                bachDeleteAPI([ids=ids]).then(res=>{
                    if( res.data.code == 0 ){
                        this.$message.success('操作成功')
                        this.getPublisherList()
                    }
                })
            });
        },
        getPublisherList(){
            this.listLoading = true
            getPublisherListAPI(this.listQuery).then(res=>{
                if( res.data.code == 0 ){
                    this.listData = res.data.data.list
                    this.total = res.data.data.total
                }
                this.listLoading = false
            })
        }
    },

}
</script>
<style scope>
    .el-dialog__body{
        padding:40px 20px 0 20px;
    }
</style>
