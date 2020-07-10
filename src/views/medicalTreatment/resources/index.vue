<template>
    <el-container>
        <el-main>
            <div class="nav-buttons-container">
                <router-link :to="{ path:`editResources`}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0">
                    <el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button>
                </router-link>
                <el-button v-if="authBtns.map(i => i.idName).indexOf('batchExamineBtn') >= 0" @click="batchExamine"> {{authBtns.filter(i => i.idName=='batchExamineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchExamineBtn').length>0 && authBtns.filter(i => i.idName=='batchExamineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchExamineBtn')].icon, 'el-icon--right']"></i></el-button>
                <el-button v-if="authBtns.map(i => i.idName).indexOf('showonBtn') >= 0" @click="editStatus('4')"> {{authBtns.filter(i => i.idName=='showonBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='showonBtn').length>0 && authBtns.filter(i => i.idName=='showonBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('showonBtn')].icon, 'el-icon--right']"></i></el-button>
                <el-button v-if="authBtns.map(i => i.idName).indexOf('setoutBtn') >= 0" @click="editStatus('5')"> {{authBtns.filter(i => i.idName=='setoutBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='setoutBtn').length>0 && authBtns.filter(i => i.idName=='setoutBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('setoutBtn')].icon, 'el-icon--right']"></i></el-button>
                <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDeleteBtn') >= 0" @click="batchDelete"> {{authBtns.filter(i => i.idName=='batchDeleteBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchDeleteBtn').length>0 && authBtns.filter(i => i.idName=='batchDeleteBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDeleteBtn')].icon, 'el-icon--right']"></i></el-button>
            </div>
            <el-form inline class='demo-form-inline'>
                <el-form-item label='标题：' >
                    <el-input v-model='name' style='width:180px'></el-input>
                </el-form-item>
                <el-form-item label='所属类型：' style='margin-left:30px'>
                    <el-select v-model='cnkey' @change='selectChang(cnkey)'>
                        <el-option value='' label='全部'></el-option>
                        <el-option v-for='(item,index) in statusList' :key='index' :value='item.enkey' :label='item.cnkey'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='创建时间：'  style='margin-left:30px'>
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
            <!-- <template>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="所有资源" name="first"></el-tab-pane>
                    <el-tab-pane label="待审核" name="second"></el-tab-pane>
                    <el-tab-pane label="审核通过" name="third"></el-tab-pane>
                    <el-tab-pane label="审核未通过" name="fourth"></el-tab-pane>
                    <el-tab-pane label="已上架" name="up"></el-tab-pane>
                    <el-tab-pane label="已下架" name="down"></el-tab-pane>
                </el-tabs>
            </template> -->
            <template>
                <el-tabs v-model="activeName" type="card" @tab-click="listSatus">
                    <el-tab-pane label="所有资源" name="books"></el-tab-pane>
                    <el-tab-pane v-for="(item) in statusLabel" :key="item.index" :label="item.name" :name="item.name"></el-tab-pane>
                </el-tabs>
            </template>
            <el-table :key='tableKey' :data="list" @sort-change="handleSort" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList">
                <el-table-column type='selection' align='center'></el-table-column>
                <el-table-column type='index' align='center' label="序号"></el-table-column>
                <el-table-column label='缩略图' min-width='140' align='center'>
                    <template slot-scope='scope'>
                        <img v-if='scope.row.cover != null || scope.row.cover == ""' class="showImg" :src="imgUrl(scope.row.cover)" alt="" style="max-width: 100px;max-height:150px" onerror="javascript:this.src='../../../static/bookDefault.png';">
                        <img v-else src='../../../assets/img/bookDefault.png' style="width: 100px;height: 113px">
                    </template>
                </el-table-column>
                <el-table-column label='资源标题' min-width='230' align='center' :show-overflow-tooltip="true">
                    <template slot-scope='scope'>
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='作者' min-width='140' align='center' :show-overflow-tooltip="true">
                    <template slot-scope='scope'>
                        <span>{{scope.row.author}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='所属类型' min-width='140' align='center'>
                    <template slot-scope='scope'>
                        <span>{{scope.row.type_cn}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='上传时间' min-width='160' align='center' sortable="custom" prop='uploadTime'>
                    <template slot-scope='scope'>
                        <span>{{scope.row.uploadTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='状态' width='120' align='center'>
                    <template slot-scope='scope'>
                        <span v-if='scope.row.status == 1' style='color:#ff9933'>待审核</span>
                        <span v-if='scope.row.status == 2' style='color:#66ff99'>审核通过</span>
                        <span v-if='scope.row.status == 3' style='color:#66ff99'>审核不通过</span>
                        <span v-if='scope.row.status == 4' style='color:#66ff99'>已上架</span>
                        <span v-if='scope.row.status == 5' >已下架</span>
                    </template>
                </el-table-column>
                <el-table-column label='操作' width='140' align='center'  class-name="small-padding fixed-width">
                    <template slot-scope='scope'>
                        <router-link :to='{path:`editResources`,query:{id:scope.row.id}}'>
                            <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
                        </router-link>
                        <router-link :to='{path:`editResources`,query:{detailsId:scope.row.id,type:"view"}}'>
                            <i :class="authBtns.filter(i => i.idName=='detailsbtn')[0].icon" :title="authBtns.filter(i => i.idName=='detailsbtn')[0].name"></i>
                        </router-link>
                        <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0 && scope.row.status != 4" @click="deleteBtn(scope.row.id)"></i>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
                </el-pagination>
            </div>
            <el-dialog :visible.sync='dialogVisible' width='470px' title='批量审核'>
                <el-form>
                    <el-form-item>
                        <span v-if='this.statusDia == 2' class='checkRes'>确定审核通过已选资源吗？</span>
                        <span v-if='this.statusDia == 4' class='checkRes'>确定审核通过并上架吗？</span>
                        <span v-if='this.statusDia == 3' class='checkRes'>确定审核不通过吗？</span>
                        <el-radio-group v-model='statusDia'>
                            <el-radio :label='2'>审核通过</el-radio>
                            <el-radio :label='4'>审核通过并上架</el-radio>
                            <el-radio :label='3'>审核不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <span  slot="footer" class="dialog-footer">
                    <el-button @click='settingSubmit'>确定</el-button>
                    <el-button @click='dialogVisible=false'>取消</el-button>
                </span>
            </el-dialog>
        </el-main>
    </el-container>
</template>
<script>
import { getResourceListAPI,getDictionaryResoursAPI,updataStatusAPI,bachDeleteResourAPI } from '@/api/onlinePublishing/index'
import {operationMsg, confirm} from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'
export default {
    data(){
        return{
            authBtns:[],
            listQuery:{
                pageSize:100,
                pageNum:1,
                title:null,
                type:null,
                beginTime:null,
                endTime:null,
                status:null,
                orderBy:null
            },
            name:"",
            statusList:[

            ],
            cnkey:'',
            value1:[],
            activeName:'books',
            tableKey: 0,
            list:[],
            selectType:'',
            multipleSelection:[],
            massQuery: {
                ids: []
            },
            dialogVisible:false,
            statusDia:2,
            total: null,
            statusLabel:[
                {
                name:"待审核",
                index:'1'
                },
                {
                name:"审核通过",
                index:'2'
                },
                {
                name:"审核不通过",
                index:'3'
                },
                {
                name:"已上架",
                index:'4'
                },
                {
                name:"已下架",
                index:'5'
                },
            ],// 状态：1：待审核 2：审核通过 3：审核不通过 4：已上架 5：已下架
        }
    },
    created(){
        this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
        this.getResourceList()
        this.getDictionaryResours()
    },
    methods:{
        deleteBtn(ids){
            confirm.apply(this,['确定要删除此条资源吗？']).then(() => {
                bachDeleteResourAPI([ids=ids]).then(res=>{
                    if( res.data.code == 0 ){
                        this.$message.success('操作成功')
                        this.getResourceList()
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getResourceList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getResourceList();
        },
        batchExamine(){
            if( this.multipleSelection.length > 0 ){
              let dataUp = this.multipleSelection.every(data=>data.status==1)
              if(dataUp){
                this.dialogVisible = true
              }else{
                this.$message.warning('只有待审核的数据才能操作')
              }

            }else{
                this.$message.warning('请先选择要审核的条目')
            }
        },
        editStatus(status){
            if( this.multipleSelection.length > 0 ){
                if( status == 4 ){ //上架
                    let dataUp = this.multipleSelection.every(data=>data.status==5||data.status==2)
                    if( dataUp ){
                        confirm.apply(this,['确定上架已选内容吗?']).then(() => {
                            let ids = getMultipleSelectionIDs(this.multipleSelection);
                            let data = {
                                ids:ids,
                                status:4
                            }
                            updataStatusAPI(data).then(res=>{
                                if( res.data.code == 0 ){
                                    this.$message.success('操作成功')
                                    this.getResourceList()
                                }else{
                                    this.$message.error(res.data.msg)
                                }
                            })
                        });
                    }else{
                        this.$message.error('只能操作审核通过和已下架的数据')
                    }
                }else if( status == 5 ){ //下架
                    let dataDown = this.multipleSelection.every(data=>data.status==4)
                    if( dataDown ){
                        confirm.apply(this,['确定下架已选内容吗?']).then(() => {
                            let ids = getMultipleSelectionIDs(this.multipleSelection);
                            let data = {
                                ids:ids,
                                status:5
                            }
                            updataStatusAPI(data).then(res=>{
                                if( res.data.code == 0 ){
                                    this.$message.success('操作成功')
                                    this.getResourceList()
                                }else{
                                    this.$message.error(res.data.msg)
                                }
                            })
                        });
                    }else{
                        this.$message.error('只能操作已上架的数据')
                    }
                }
            }else{
                this.$message.warning('请选择要操作的条目')
            }
        },
        batchDelete(){
            if( this.multipleSelection.length > 0 ){
                let dataDelet = this.multipleSelection.every(data => data.status != 4)
                if( dataDelet ){
                    confirm.apply(this,['确定要删除已选资源吗？']).then(() => {
                        let ids = getMultipleSelectionIDs(this.multipleSelection);
                        bachDeleteResourAPI(ids).then(res=>{
                            if( res.data.code == 0 ){
                                this.$message.success('操作成功')
                                this.getResourceList()
                            }else{
                                this.$message.error(res.data.msg)
                            }
                        })
                    });
                }else{
                    this.$message.error('请先下架，再删除数据')
                }
            }else{
                this.$message.warning('请选择要操作的条目')
            }
        },
        search(){
            if( this.value1 ){
                this.listQuery.beginTime = this.value1[0]
                this.listQuery.endTime = this.value1[1]
            }else{
                this.listQuery.beginTime = null
                this.listQuery.endTime = null
            }
            if( this.selectType ){
                this.listQuery.type = this.selectType
            }else{
                this.listQuery.type = null
            }
            if( this.name ){
                this.listQuery.title = this.name
            }else{
                this.listQuery.title = null
            }
            this.getResourceList()
        },
        reset(){
            this.name = null
            this.cnkey = null
            this.value1 = null
            this.listQuery.title = null
            this.listQuery.type = null
            this.listQuery.beginTime = null
            this.listQuery.endTime = null
            this.getResourceList()
        },
        listSatus(tab,event) { // 状态：1：待审核 2：审核通过 3：审核不通过 4：已上架 5：已下架
            if (tab.index == 0) {
                delete this.listQuery.status;
            } else{
                this.listQuery.status = tab.index
            }
            this.getResourceList();
        },
        handleSort({column, prop, order}) {
            if (order) {
                this.listQuery.orderBy = `${prop} ${order.substring(0,order.length-6)}`
            } else {
                this.listQuery.orderBy = null
            }
            this.getResourceList()
        },
        chioceList(val){
            this.multipleSelection = val;
            this.multipleSelection.length>0 ? this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection) : true
        },
        getResourceList(){
            getResourceListAPI(this.listQuery).then(res=>{
                if( res.data.code == 0 ){
                    this.list = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        getDictionaryResours(){
            let data = {
                code:'YDCCRESOURCETYPE',
                pageSize:100,
                pageNum:1,
            }
            getDictionaryResoursAPI(data).then(res=>{
                if( res.data.code == 0 ){
                    this.statusList = res.data.data.list
                }
            })
        },
        selectChang(val){
            this.selectType = val
        },
        settingSubmit(){
            let ids = getMultipleSelectionIDs(this.multipleSelection);
            let data = {
                ids:ids,
                status:this.statusDia
            }
            updataStatusAPI(data).then(res=>{
                this.dialogVisible = false
                if( res.data.code == 0 ){
                    this.$message.success('操作成功')
                    this.getResourceList()
                }
            })
        },

    }
}
</script>
<style lang="less" scoped>
    .checkRes{
        display:block;
        text-align: center;
    }
</style>
