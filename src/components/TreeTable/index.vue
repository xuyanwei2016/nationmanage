<template>
  <el-table @select="selectionChangeNative" :data="formatData" :row-style="showRow" v-bind="$attrs" @current-change="handleCurChange" ref="multipleTable">
    <el-table-column align="center" type="selection" ref="selectionCheckbox"></el-table-column>
    <el-table-column v-if="columns.length===0" min-width="200" :label="labelName" header-align="center">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        <!-- {{scope.$index}} -->
        {{scope.row[firstColumn]}}
      </template>
    </el-table-column>
    <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">
        <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.row[column.value]}}
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './eval'
import getTreeId from '@/filters/getTreeid'
export default {
  name: 'treeTable',
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    getFormatData: Function,
    labelName:String,
    parSelection: Function,
    firstColumn:String
  },
  data(){
    return {
      checkedIds:[]
    }    
  },
  watch: {
    // expandAll: function() {
    //   if(this.$props.expandAll === true){
    //     for(let i = 0;i < this.formatData.length;i++){
    //       this.toggleExpanded(i,'expandAll')
    //     }
    //   }else{
    //     for(let i = 0;i < this.formatData.length;i++){
    //       this.toggleExpanded(i,'collapseAll')
    //     }
    //   }
    // }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      let data = func.apply(null, args)
      this.getFormatData(data)
      return data
    }
  },
  methods: {
    // 手动判断当前条目是否被选中
    ifCheck(row,clear = false){
      clear ? this.checkedIds = []:false
      let ifCheck = false
      if(this.checkedIds.length === 0){
        this.checkedIds.push(row.id)
        ifCheck = true
      }else{
        let ifdelete = false
        this.checkedIds.map((cId,cIndex) =>{
          if (cId === row.id) {
            this.checkedIds.splice(cIndex,1)
            // checked = true
            ifdelete = true
            return
          }
        })
        if(ifdelete) {
          ifCheck = false
        }else{
          ifCheck = true
          this.checkedIds.push(row.id)
        }
      }
      return ifCheck
    },
    getMultipleSelections(row) {
      let multipleSelections = []
      let setSelection = (data) => {
        data.map((item)=>{
          multipleSelections.push(item)
          if(item.children.length > 0){
            setSelection(item.children)
          }
        })
      }
      if(row.children.length>0){
        setSelection(row.children)
      }
      return multipleSelections
    },
    selectionChangeNative(selection,row){
      let ifCheck = this.ifCheck(row)
      if (!ifCheck) {
        /**
         *特别注意这里！！
         *getTreeI 的第三个参数是需要根据第一个参数里面存放着ID的键值对名称变化而变化的
         *如果参数不对则无法返回正确的id值
         */
        let ids = getTreeId([row],'children','departmentId')
        let ifID = Object.prototype.toString.call(ids[0]) === '[object Undefined]'
        if (ifID) {
          ids = getTreeId([row],'children','id')
        }

        ids.map((idItem)=>{
          console.log(ids,'ids');
          // this.$refs.multipleTable.selection.splice(idItem,1)
          this.$refs.multipleTable.selection.map((gItem,gIndex)=>{

            if (ifID) {
              if(gItem.id == idItem){
                this.$refs.multipleTable.selection.splice(gIndex,1)
              }
            }else{
              if(gItem.departmentId == idItem){
                this.$refs.multipleTable.selection.splice(gIndex,1)
              }
            }

          })
        })
        console.log(this.$refs.multipleTable.selection,'uncheck');
      }else{
        this.getMultipleSelections(row).map(
          (item,index)=>{
            this.$refs.multipleTable.selection.push(item)
          }
        )
        console.log(this.$refs.multipleTable.selection,'check');
      }
      console.log(this.$props)      
      this.$props.parSelection(this.$refs.multipleTable.selection)
    },
    handleCurChange(val){
        console.log(val,'lineCheck');
        this.$refs.multipleTable.clearSelection()
        let ifCheck = this.ifCheck(val,true)
        this.$refs.multipleTable.toggleRowSelection(val)
        if (ifCheck) {
          this.getMultipleSelections(val).map(
            (item,index)=>{
              this.$refs.multipleTable.selection.push(item)
            }
          )
        }
        console.log(this.$refs.multipleTable.selection,'lineCheck');
        this.$props.parSelection(this.$refs.multipleTable.selection)
      },
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex,type) {
      const record = this.formatData[trIndex]
      switch(type){
        case 'expandAll':
          record._expanded = true
          break
        case 'collapseAll':
          record._expanded = false
          break
        default:
          record._expanded = !record._expanded
      }

    },
    // 全部展开收起
    expandAllFun(expandAll) {
      if(expandAll === true) {
        for(let i = 0;i <  this.formatData.length;i++) {
          this.toggleExpanded(i, 'expandAll')
        }
      }else{
        for(let i = 0;i < this.formatData.length;i++) {
          this.toggleExpanded(i, 'collapseAll')
        }
      }
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }
  .el-table th.is-leaf>.cell{text-align: center;}

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>
