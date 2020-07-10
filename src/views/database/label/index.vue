<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0" @click="addBtn">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="标签名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文名称" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.englishName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属数据类型" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.dataType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0" @click="editBtn(scope.row.id)"></i>

          <router-link :to="{ path:`label/basics_theory`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='detailsBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='detailsBtn')[0].icon" :title="authBtns.filter(i => i.idName=='detailsBtn')[0].name"></i></router-link>

          <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0" @click="deleteBtn(scope.row.id)"></i>

        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" width="555px" :title="textMap[dialogStatus]">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="right" label-width="100px" style='margin-right:10px;'>
        <el-form-item label="标签名称：" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称：">
          <el-input v-model="temp.englishName"></el-input>
        </el-form-item>
        <div v-for="(domain,index) in temp.LabelDataTypeForm" :key="index" style="overflow:hidden">
          <el-form-item
            :label="index < 1 ? '数据类型：' : ''"
            :prop="'LabelDataTypeForm.' + index + '.dataType'"
            :rules="{ required: true, message: '请选择数据类型' }"
            style="float:left"
          >
            <el-select v-model="domain.dataType" placeholder="请选择数据类型" >
              <el-option :label="typeItem" :value="typeItem" v-for="(typeItem , typeId) in typeList"   :key="typeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :prop="'LabelDataTypeForm.' + index + '.dataTypeSort'"
            :rules="sortRules"
            style="float:left;margin-left: -90px;"
          >
            <el-input v-model="domain.dataTypeSort" placeholder="排序号" style="width:108px;"></el-input>
          </el-form-item>
          <el-button @click.prevent="removeBtn(domain)" style="margin-left: 10px;" v-if="temp.LabelDataTypeForm.length>1">删除</el-button>
        </div>
        <p class="addStyle" @click="addType"><span>+</span>添加标签</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formSubmit" >保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { getListAPI, deleteAPI, saveAPI, getEditList, updateAPI } from '@/api/database/label'
import { resourceListAPI } from '@/api/database/article'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs, removeDuplicates } from '@/filters/getIds'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  data() {
    const validateSort = (rule, value, callback) => {
      let reg = /^[0-9]*[1-9][0-9]*$/
      if( (value+'').replace(/\s+/g,"") == '' ){
        callback(new Error('请填写排序号'));
      } else if(!reg.test(value)){
        callback(new Error('排序号只能为正整数'));
      }else{
        callback()
      }
    };
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      nation:'', //民族
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        nationsType:this.$store.getters.getNation
      },
      timeLimit: null,
      batchList: [],
      dialogFormVisible: false,
      dialogStatus:'',

      editId:'',
      typeList:[],
      temp: {
        name:"",
        dataType:0,
        dataTypeSort:0,
        data:[
          {
            dataType:'11',
            dataTypeSort:'22',
          },
        ],
        LabelDataTypeForm:[
          {
            dataType:'',
            dataTypeSort:'',
          },
        ]
      },
      rules:{
        name:[
          { required: true, message: '请输入标签名称', trigger: 'change' },
          { pattern:/^.{1,6}$/,message: '标签名称长度必须小于6位', trigger: 'change' }
        ],
        // dataType:[
        //   { required: true,message: '请选择数据类型', trigger: 'change' },
        // ],
      },
      sortRules:[{required: true,validator:validateSort}],
      textMap: {
        update: '修改标签',
        create: '添加标签'
      },

    }
  },
  computed: {
    ...mapGetters([
      'getNation'
    ])
  },
  watch: {
    getNation: function (val) {
      this.listQuery.nationsType = val
      this.getList()
    },
    dialogFormVisible(n,o){
      if(!n){
        this.$nextTick(()=>{
          this.$refs['dataForm'].clearValidate();
        })

      }
    },
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList();
    this.getResource();
  },
  methods: {
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    getResource() {
      resourceListAPI({isMedia:0}).then(res => {
        if(res.data.code === 0){
          this.typeList = res.data.data
        } else {
          this.$message.error('获取数据失败');
        }
      })
    },
    deleteBtn(id) {//删除功能
      confirm.apply(this,['确定要删除吗？']).then(() => {
        deleteAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
        })
      })
    },
    addType() {//添加标签
      this.temp.LabelDataTypeForm.push({
        dataType:'',
        dataTypeSort:'',
      })
    },
    addBtn() {
      this.data = [
        {
          dataType:'',
          dataTypeSort:'',
        },
      ];
      this.dialogStatus = 'create'
      this.dialogFormVisible = true;
      this.resetTemp();
      this.editId = '';
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

    },
    resetTemp() {
      this.temp = {
        name: '',
        englishName: '',
        LabelDataTypeForm:[
          {
            dataType:'',
            dataTypeSort:'',
          },
        ]
      }
    },
    removeBtn(item) {//移除
      var index = this.temp.LabelDataTypeForm.indexOf(item);
      if (index !== -1) {
        this.temp.LabelDataTypeForm.splice(index, 1);
      }
    },
    editBtn(id) {// 修改标签
      this.dialogTit='修改标签'
      getEditList(id).then(res => {
        if(res.data.code == 0){
          this.temp.name = res.data.data.name;
          this.temp.englishName = res.data.data.englishName;
          this.temp.LabelDataTypeForm = res.data.data.dataType;
          this.data = res.data.data.dataType;
          this.editId = res.data.data.id;
          this.dialogStatus = 'update'
          this.dialogFormVisible = true;
        }
      })
    },
    formSubmit() {//提交标签
      this.$refs['dataForm'].validate((valid) => { //必填项--name
        if (valid) {
          if(this.temp.LabelDataTypeForm.length>0){ //判断是否填写了数据类型和number
            const reg=/^([1-9]\d*|[0]{1,1})$/; //含0正整数
            const newData = this.temp.LabelDataTypeForm.filter(el => el.dataType != '' && reg.test(el.dataTypeSort));

            if(newData.length == this.temp.LabelDataTypeForm.length){
              const obj={
                dataType: this.temp.LabelDataTypeForm,
                englishName: this.temp.englishName,
                name: this.temp.name, //标签名 (string, optional)
                nationsType: this.$store.getters.getNation
              }
              if(this.editId){//修改

                obj.id = this.editId;
                updateAPI(obj).then(res => {
                  this.dialogFormVisible = false;
                  if(res.data.code === 0){
                    this.$message.success('修改成功');
                    this.getList();
                  } else if(res.data.code === -2) {
                    this.$message.error('修改失败：'+res.data.msg);
                  }else{
                    this.$message.error('修改失败'+res.data.msg);
                  }
                })
              } else{//添加

                saveAPI(obj).then(res => {
                  this.dialogFormVisible = false;
                  if(res.data.code === 0){
                    /*this.$refs['dataForm'].clearValidate();*/
                    this.$message.success('添加成功');
                    this.temp.name = '';
                    this.temp.englishName = '';
                    this.temp.LabelDataTypeForm.dataType = null;
                    this.temp.LabelDataTypeForm.dataTypeSort = null;
                    this.getList();

                  } else if(res.data.code === -2) {
                    this.$message.error('添加失败：'+res.data.msg);
                  }else{
                    this.$message.error('添加失败');
                  }
                })
              }
            } else{
              this.$message.error('请填写正确的数据类型和排序号');
            }
          } else{
            this.$message.error('请至少添加一项数据类型');
          }
        }
      })
     },
    chioceList(val) {
      this.batchList = val;
    },
    handleFilter(){
      if(this.timeLimit){
          this.listQuery.beginTime = this.timeLimit[0]
          this.listQuery.endTime = this.timeLimit[1]
        } else {
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }
      store.dispatch('SetSupplierSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
</script>


<style>
.addStyle{
  margin-left: 100px;
  cursor: pointer;
}
.addStyle span{
  font-size: 20px;
  display: inline-block;
  vertical-align: middle;
}
</style>
