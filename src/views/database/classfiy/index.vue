<template>
  <div>
    <el-main>
      <div class="nav-buttons-container">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('btnadd') >= 0"  @click="handleCreate" > {{authBtns.filter(i => i.idName=='btnadd')[0].name}}
          <i v-if="authBtns.filter(i => i.idName=='btnadd').length>0 && authBtns.filter(i => i.idName=='btnadd')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('btnadd')].icon, 'el-icon--right']"></i>
        </el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchdelete') >= 0" @click="massDelete" > {{authBtns.filter(i => i.idName=='batchdelete')[0].name}}
          <i v-if="authBtns.filter(i => i.idName=='batchdelete').length>0 && authBtns.filter(i => i.idName=='batchdelete')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchdelete')].icon, 'el-icon--right']"></i>
        </el-button>
        <el-button @click="expantFun(true)">全部展开</el-button>
        <el-button @click="expantFun(false)">全部收起</el-button>
      </div>

      <tree-table ref="treeTable" :data="list" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border v-loading="listLoading" :getFormatData="getFormatData" label-name="分类名称" stripe first-column="typeName" :par-selection="handleSelectionChange">
        <el-table-column align="center" label="排序号" min-width="70">
          <template slot-scope="scope">
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="旧编码" min-width="70">
          <template slot-scope="scope">
            <span>{{scope.row.oldCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分类编号" min-width="80">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160" class-name="small-padding fixed-width" >
          <template slot-scope="scope">
            <!-- <router-link :to="{path:`classify/recommended_goods`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='recommend').length > 0" >
                <i :class="authBtns.filter(i => i.idName=='recommend')[0].icon" :title="authBtns.filter(i => i.idName=='recommend')[0].name" ></i>
            </router-link> -->
            <i :class="authBtns.filter(i => i.idName=='btnedit')[0].icon" v-if="authBtns.filter(i => i.idName=='btnedit').length > 0 && scope.row.parentId!='0' || scope.row.parentId == '0'"  @click="handleUpdate(scope.row)" :title="authBtns.filter(i => i.idName=='btnedit')[0].name"></i>
            <i :class="authBtns.filter(i => i.idName=='addchild')[0].icon" v-if="authBtns.filter(i => i.idName=='addchild').length > 0" @click="handleCreateChild(scope.row)" :title="authBtns.filter(i => i.idName=='addchild')[0].name"></i>
            <i :class="authBtns.filter(i => i.idName=='btnremove')[0].icon" v-if="authBtns.filter(i => i.idName=='btnremove').length > 0 && scope.row.parentId!='0' || scope.row.parentId == '0'" @click="singleDelete(scope.row)" :title="authBtns.filter(i => i.idName=='btnremove')[0].name"></i>
          </template>
        </el-table-column>
      </tree-table>
    </el-main>

    <el-dialog @close="closedialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form :rules="rules"  ref="dataForm" :model="temp" label-position="right" label-width="100px" style="margin-right:10px;" >
        <el-form-item v-if="dialogStatus=='createChild'" label="上级分类：" prop="parentName">
          <el-input v-model="parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称：" prop="typeName">
          <el-input v-model="temp.typeName"></el-input>
        </el-form-item>
        <el-form-item label="显示名称：" prop="showName">
          <el-input v-model="temp.showName" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="分类编号：" prop="code">
        <el-input v-model="temp.code"></el-input>
        </el-form-item>-->
        <el-form-item label="旧编码：" prop="oldCode">
          <el-input v-model="temp.oldCode"></el-input>
        </el-form-item>
        <el-form-item label="排序号：" prop="sort">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-left:10px;color:#E59728;">
        1.前台分类使用”显示名称“
        <br>
        2.当前最大排序号为{{maxSort}}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='update' || dialogStatus=='updateChild'" @click="updateData" :loading="loading" >保存</el-button>
        <el-button v-else @click="createData" :loading="loading">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加/修改分类体系对话框 -->
    <!-- <el-dialog :title="editOradd" :visible.sync="dialogClassifyVisible" @close="closedialogClassifyVisible" width="43%">
      <el-form :rules="rules" :model="classtemp" label-position="right" label-width="100px" style="margin-right:10px;" >
          <el-form-item v-if="dialogStatus=='createChild'" label="上级分类：" prop="parentName">
            <el-input v-model="parentName" disabled></el-input>
          </el-form-item>
          <el-form-item label="分类标准:" prop="typeName">
              <el-input v-model="classtemp.typeName"></el-input>
          </el-form-item>
          <el-form-item label="英文名称:" prop="englishName">
              <el-input v-model="classtemp.englishName"></el-input>
          </el-form-item>
          <el-form-item label="适用数据:">
          <div v-for="(item,index) in classtemp.tsf" :key="index" style="margin-bottom:10px">
              <el-select style="float:left" v-model="item.resourceType" prop="applyData" >
                  <el-option label="全部" :value="allType"></el-option>
                  <el-option v-for="(value,key) in typeList" :key="key" :label="value" :value="key" >{{value}}</el-option>
              </el-select>
              <el-input v-model="item.resourceTypeSort" prop="sort" style="float:left;width:auto" placeholder="排序号" ></el-input>&nbsp;&nbsp;
              <i class="el-icon-delete" @click="deleteTypeClass(index)"></i>
          </div>
          </el-form-item>
      </el-form>
      <div style='margin-left:10px;color:#E59728;'>
          1.前台分类使用”显示名称“<br>
          2.当前最大排序号为{{maxSort}}
      </div>
      <div class="addData" @click="addType">
          <span>
          <i class="el-icon-plus"></i>选择数据
          </span>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button v-if="dialogclassStatus=='update'" @click="updateclassData" :loading="loading">保存</el-button>
          <el-button v-else @click="createclassData" :loading="loading">保存</el-button>
          <el-button @click="dialogClassifyVisible = false">取消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  /**
   Auth: Lei.j1ang
   Created: 2018/1/19-14:54
   */
  import treeTable from "@/components/TreeTable";
  import treeToArray from "@/views/example/table/treeTable/customEval";
  // import {
  //   getClassify,
  //   getStair,
  //   updateClassify,
  //   addClassify,
  //   deleteClassify,
  //   isExist,
  //   codeExist,
  //   getNameDiyAPI
  // } from "@/api/website-management/classify";
  import getTreeId from "@/filters/getTreeid";
  import { operationMsg, confirm } from "@/utils/publicFunctions";
  import { getMaxSort } from "@/filters/getIds";
  import store from "@/store";
  import { getListAPI , deleteClassify, isExist , addClassify , updateClassify } from "@/api/database/classfiy";
  export default {
    name: "customTreeTableDemo",
    components: { treeTable },
    data() {
      const validateName = (rule, value, callback) => {
        console.log('55555',value)
        let classOrstant = "";
        if (this.dialogFormVisible) {
          classOrstant = "分类名称";
        } else {
          classOrstant = "分类标准";
        }
        if (value.length > 20) {
          callback(new Error(`${classOrstant}必须小于20位！`));
        } else if (value.replace(/\s+/g, "") == "") {
          callback(new Error(`请输入${classOrstant}`));
        } else {
          let params = { typeName: value, parentId: this.temp.parentId };
          this.dialogStatus === "update" || this.dialogStatus === "updateChild"
            ? (params.id = this.temp.id)
            : params;
          isExist(params).then(res => {
            res.data.code === 0
              ? res.data.data === false
              ? callback()
              : callback(new Error(`${classOrstant}"${value}"已存在！`))
              : callback(new Error(`错误Error：${res.data.msg}`));
          });
        }
      };
      const validateCode = (rule, value, callback) => {
        if(value){
          if (/^\w+$/.test(value)) {
            let params = { oldCode: value };
            this.dialogStatus === "update" || this.dialogStatus === "updateChild"
              ? (params.id = this.temp.id)
              : params;
            codeExist(params).then(res => {
              res.data.code === 0
                ? res.data.data === false
                ? callback()
                : callback(new Error(`旧编码已存在！`))
                : callback(new Error(`网络错误：${res.data.msg}`));
            });
          } else {
            callback("只能为数字字母下划线");
          }
        }
      };
      const validateShowName = (rule, value, callback) => {
        if(value){
          if (value.length > 20) {
            callback(new Error(`显示名称必须小于20位！`));
          }
        }

      };
      return {
        dialogclassStatus: "creat",
        authBtns: [],
        func: treeToArray,
        expandAll: true,
        typeList: [],
        allType: "",
        list: [],
        listLoading: true,
        editOradd: "", //添加或修改分类体系
        moveShow: "",
        temp: {
          typeName: "",
          showName: "",
          parentId: 0,
          sort: null,
          // applyData: ""s
        },
        classtemp: {
          tsf: [
            {
              resourceTypeSort: "",
              resourceType: ""
            }
          ],
          englishName: "",
          typeName: "",
          parentId: "0"
        },
        parentName: "",
        formatList: [],
        maxSort: 0,
        id: [],
        textMap: {
          update: "修改分类",
          updateChild: "修改子分类",
          create: "添加分类",
          createChild: "添加子分类"
        },
        rules: {
          typeName: [
            {
              type: "string",
              required: true,
              validator: validateName
            }
          ],
          showName: [
            {
              type: "string",
              required: true,
              validator: validateShowName
            }
          ],
          oldCode: [
            {
              type: "string",
              required: false,
              validator: validateCode
            }
          ],
          sort: [
            {
              required: true,
              pattern: /^([1-9]\d{0,8}|0)$/,
              message: "请输入0-999999999之间的整数"
            }
          ],
          englishName: []
        },
        dialogStatus: "",
        dialogFormVisible: false,
        dialogClassifyVisible: false,
        multipleSelection: [],
        loading: false,
        args: [null, null, "timeLine"],
        navTree: [],
        defaultProps: {
          children: "list",
          label: "showName"
        },
        treeName: ""
      };
    },
    created() {
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
      this.resetTemp()
    },
    mounted() {
      this.getList()
    },
    watch:{
      dialogFormVisible(n,o){
        if(n){
          /*this.$set(this.temp,'typeName','');*/
          /*this.temp.typeName='';*/

          this.$refs["dataForm"].resetFields();
          /*this.$nextTick(()=>{
            this.$refs["dataForm.typeName"].resetFields();
          })*/
        }
      },
    },

    methods: {
      //展开和收起
      expantFun(data) {
        this.$refs.treeTable.expandAllFun(data);
      },
      handleShowname() {
        this.getisExist()
      },
      // handleclassShowname() {
      //   this.classtemp.englishName = this.classtemp.typeName;
      // },
      getFormatData(data) {
        this.formatList = data;
      },
      // 验证同级名称是否存在
      getisExist() {
        isExist(this.temp).then(res => {
          console.log(res,'zzzzzz');
        })
      },
      // 获取列表
      getList() {
        this.listLoading = true;
        // this.showName=this.navTree[0].showName
        getListAPI().then(response => {
          if (response.data.code === 0) {
            const originalArr = [];
            response.data.data.map(res => {
              originalArr.push(res);
            });
            const originalData = JSON.stringify(originalArr);
            this.list = JSON.parse(originalData.replace(/list/gi, "children"));
            this.multipleSelection = []; //清空
          } else {
            this.$message.error("获取数据失败");
          }
          this.listLoading = false;
        });
      },
      getAlllist(){
        this.listLoading = true;
        getClassify().then(response => {
          if (response.data.code === 0) {
            const originalArr = [];
            response.data.data.map(res => {
              if (res.list.length > 0) {
                originalArr.push(res);
              }
            });
            const originalData = JSON.stringify(originalArr);

            this.list = JSON.parse(originalData.replace(/list/gi, "children"));

            this.multipleSelection = []; //清空
          } else {
            this.$message.error("获取数据失败");
          }
          this.listLoading = false;
        });
      },
      //关闭
      closedialog() {
        this.resetTemp(); //清空
      },
      //关闭添加分类标准
      closedialogClassifyVisible(){
        this.resetclassTemp()
      },
      //批量删除
      massDelete() {
        if (this.multipleSelection.length > 0) {
          confirm.apply(this, ["确定要删除选择的分类吗?"]).then(() => {
            deleteClassify(this.id).then(res => {
              if(res.data.code == 0) {
                this.$message.success('批量删除成功');
                this.getList()
              } else {
                this.$message.error('批量删除失败');
              }
            });
          });
        } else {
          this.$message.warning("请先选择需要删除的内容");
        }
      },
      //单条删除
      singleDelete(row) {
        this.id = getTreeId([row], "children");
        confirm.apply(this, ["确定要删除选择的分类吗?"]).then(() => {
          deleteClassify(this.id).then(res => {
            if(res.data.code == 0) {
              this.$message.success('删除成功')
              this.getList()
            } else {
              this.$message.error('删除失败');
            }
            // operationMsg.apply(this, [res.data, "删除"]);
          });
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.multipleSelection.length > 0 ? (this.id = getTreeId(this.multipleSelection, "children")) : true;
      },
      resetTemp() {
        this.temp = {
          typeName: "",
          showName: null,
          parentId: "",
          sort: parseInt(this.maxSort) + 1
        };
      },
      resetclassTemp(){
        this.classtemp={
          tsf: [
            {
              resourceTypeSort: "",
              resourceType: ""
            }
          ],
          englishName: "",
          typeName: "",
          parentId: "0"
        }
      },
      handleCreate() {
        //   if (this.treeName) {
        this.maxSort = getMaxSort(this.list);
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
        // } else {
        //   this.$message.warning("请选择分类体系");
        // }
      },
      handleCreateChild(row) {
        this.temp.parentId = row.id;
        this.parentName = row.showName;
        this.maxSort = getMaxSort(row.children);
        this.temp.sort = parseInt(this.maxSort) + 1;
        this.dialogStatus = "createChild";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      createData() {
        // debugger
        // this.$refs["dataForm"].validate(valid => {
        //  console.log(valid,"99999999")
        // if (valid) {
        this.loading = true;
        addClassify(this.temp).then(res => {
          console.log(res,'1212121212121');
          if(res.data.data) {
            this.$message.success('添加成功');
            this.dialogFormVisible = false;
            this.getList()
          } else {
            this.loading = false;
            this.$message.error('添加失败')
          }
          // operationMsg.apply(this, [res.data, this.textMap[this.dialogStatus]]);
          // res.data.status ? (this.dialogFormVisible = false) : true;
          // this.loading = false;
          // this.expandAll = true;
        });
        //  }
        // });
      },
      handleUpdate(row) {

        this.dialogFormVisible = true;
        this.temp={
          typeName: "",
          showName: "",
          parentId: 0,
          sort: null,
          // applyData: ""s
        };
        let { createTime, parent, children, ...temp } = row;
        this.temp = temp;
        if (this.temp.parentId == 0) {
          this.dialogStatus = "update";
        } else {
          this.dialogStatus = "updateChild";
          // this.parentName = row.parent.showName
        }

        /*if (this.$refs[dataForm]!==undefined) {
          this.$refs["dataForm"].resetFields();
        }*/

        /*this.$nextTick(() => {
          console.log(111111,this.temp.typeName)
          this.$refs["dataForm"].resetFields();
        });*/
      },
      updateData() {
        this.loading = true;
        updateClassify(this.temp).then(res => {
          if(res.data.data) {
            this.$message.success('修改成功');
            this.dialogFormVisible = false
            this.loading = false
            this.getList();
          } else {
            this.$message.error('修改失败')
          }
        });
      },
      // 获取左侧一级分类
      // getStairClassify() {
      //   getStair().then(res => {
      //     if(res.data.code === 0){
      //       this.navTree = res.data.data;
      //       this.showName=res.data.data[0].showName
      //       this.getList()
      //     }else{
      //       this.$message.error("获取数据失败");
      //     }
      //   });
      // },
      //获取当前树节点
      // getCurrentNodes(data) {
      //   this.treeName = data.showName;
      //   this.temp.parentId = data.id;
      //   getNameDiyAPI(this.treeName).then(response => {
      //     if (response.data.code == 0) {
      //       const originalData1 = JSON.stringify(response.data.data);
      //       this.list = JSON.parse(originalData1.replace(/list/gi, "children"));
      //     }
      //   });
      // },

      //划过图标
      showIcon(name) {
        this.moveShow = name;
      },
      // //删除分类体系
      // deleteNewCalss(val) {
      //   confirm.apply(this, ["确定要删除选择的分类吗?"]).then(() => {
      //     getNameDiyAPI(val.typeName).then(response => {
      //       if (response.data.code == 0) {
      //         let id = getTreeId(response.data.data, "list");
      //         deleteClassify(id).then(res => {
      //           if (res.data.code == 0) {
      //             this.getList()
      //             // this.getStairClassify();
      //           } else {
      //             this.$message.error("重新获取失败");
      //           }
      //         });
      //       }
      //     });
      //   });
      // },
      //编辑分类体系
      // editNewCalss(val) {
      //   this.dialogclassStatus = "update";
      //   this.dialogClassifyVisible = true;
      //   this.editOradd = "修改分类体系";

      //   if (val.res.length > 0) {
      //     let arr2 = [];
      //     val.res.map((item, index) => {
      //      let obj = {
      //         resourceType:item.resourceType,
      //         resourceTypeSort:item.resourceTypeSort
      //       }
      //       arr2.push(obj)
      //     });
      //     this.classtemp.tsf = arr2;
      //   }
      //   this.classtemp.englishName = val.englishName;
      //   this.classtemp.typeName = val.typeName;
      //   this.classtemp.id = val.id;
      // },
      //添加分类体系
      // addNewClass() {
      //   this.editOradd = "添加分类体系";
      //   this.dialogclassStatus = "creat";
      //   this.dialogClassifyVisible = true;
      //   delete this.classtemp.id;
      // },
      //添加一个分类需求
      // addType() {
      //   this.classtemp.tsf.push({
      //     resourceTypeSort:"" ,
      //     resourceType: this.allType
      //   });
      // },
      //删除一个分类需求
      // deleteTypeClass(val) {
      //   if (this.classtemp.tsf.length > 1) {
      //     this.classtemp.tsf.splice(val, 1);
      //   } else {
      //     this.$message.warning("至少保留一种分类体系");
      //   }
      // },
      //获取资源类型列表
      // 资源类型列表
      // getType() {
      //   getTypeAPI().then(res => {
      //     this.typeList = res.data.data;
      //     for (let ind in res.data.data) {
      //       this.allType += ind + ",";
      //     }
      //     this.allType = this.allType.slice(0, this.allType.length - 1);
      //     this.classtemp.tsf[0].resourceType=this.allType
      //   });
      // },
      //保存一级分类的添加和修改
      updateclassData() {
        if (this.classtemp.typeName) {
          updateClassify(this.classtemp).then(res => {
            if (res.data.code == 0) {
              this.dialogClassifyVisible = false;
              this.getList()
              // this.getStairClassify();
            } else {
              this.$message.error(`添加失败,${res.data.msg}`);
            }
          });
        } else {
          this.$message.warning("请填写分类标准");
        }
      },
      createclassData() {
        if (this.classtemp.typeName) {
          addClassify(this.classtemp).then(res => {
            if (res.data.code == 0) {
              this.dialogClassifyVisible = false;
              this.getList()
              // this.getStairClassify();
            } else {
              this.$message.error(`添加失败,${res.data.msg}`);
            }
          });
        } else {
          this.$message.warning("请填写分类标准");
        }
      },
      //获取全部分类
      getAllTree() {
        // this.treeName=this.showName = "";
        this.getAlllist()
      }
    }
  };
</script>

<style lang="less" scoped>
  .dialogFormVisibleClass{
    background:white;
    border:1px solid #ccc;
    color:#ccc;
  }
  .dialogFormVisibleClass:hover{
    background:#606266;
    color:white;
    border:1px solid #606266;
  }
  .planLeft {
    width: 300px;
  }
  .all {
    margin-left: 24px;
    color: #606266;
    cursor: pointer;
    width: 100%;
    display: inline-block;
    font-size: 14px;
  }
  .all:hover {
    background: #f5f7fa;
  }
  .addData {
    margin: 20px 100px;
    display: inline-block;
    color: #666;
    i {
      color: #2196f3;
    }
    cursor: pointer;
  }
  .addClass{
    display: inline-block;
    color: #666;
    i {
      color: #2196f3;
    }
    cursor: pointer;
    margin: 20px 24px;
  }
  .el-icon-delete {
    cursor: pointer;
  }
</style>

<style>
  .custom-tree-node {
    font-size: 14px;
  }
</style>


