#项目实践规范

## 请随时添加条目以逐步形成规范。不确定的条目经讨论后方可确定。已经写到代码中的名称如果修改量小于等于二立即修改，大于二的可逐步修改也可以立即修改。

不要用var
不需要修改的用const 常量
需要修改的用let

###类型判断
typeof无法准确判断new 关键字创建变量的类型
用这种方式：
```js
Object.prototype.toString.call(to.meta.routerIds) !== '[object Undefined]'
```

## 命名
views目录外用文件命名用驼峰
views 里面 目录和普通文件用字母+ _命名

## 常用方法名
| name        | des  |
| -------------:| -----:|
|getList    |获取当前页数据|
|add        |添加一条记录|
|search     |搜索一条记录|
|reset      |重置搜索条件|
|edit       |编辑一条记录|
|delete     |删除一条记录|
|update     |更新一条记录|
|batchUpdate|更新一批记录|

## 常用API方法名
| name        | des  |
| -------------:| -----:|
|getListAPI    |获取当前页数据|
|addAPI        |添加一条记录|
|searchAPI     |搜索一条记录|
|resetAPI      |重置搜索条件|
|editAPI       |编辑一条记录|
|deleteAPI     |删除一条记录|
|updateAPI     |更新一条记录|
|batchUpdateAPI|更新一批记录|

## 常用数据名
| name        | type           | des  |
| ------------- |:-------------:| -----:|
| form      | object | 存储当前页编辑框内容 |
| search      | object      |   存储当前页搜索框内容 |multipleSelection | string |
dialogFormVisible | boolean |
rules | object |

**扩展名首字母大写加在主名的后面如：** editKeyword

## @util/
工具类代码
publicFunction 重复调用的代码

## @filter/
过滤器

————**注意！！**————
```js
//get 请求形參用params
export function searchAPI(params) {
  return request({
    url: 'bulletin-content/page',
    method: 'get',
    params
  })
}
// post 请求 形參用data 
export function stick(data) {
  return request({
    url: 'bulletin-content/batch/update/top-status',
    method: 'post',
    data
  })
}
```
 
#### 关于弹出的树状多选框已选项目再次弹出不能选中的问题：
由于default-checked-keys只在tree 组建初始化的时候使用此属性更改选择状态所以不能通过修改其赋值而改变选框状态，只能通过setCheckedKeys 来设置。但每次展开收起树状结构都会销毁多选框所以不能在获取树数据的时候设置选中状态，只能在展开收起时设置。
```js
    // 当选框被点击时修改已选id，以防用户手动选择的节点在扩展节点事件触发时背服务器节点选中状态替换
    setChecked(){
      this.checkedIds = this.$refs.tree.getCheckedKeys()
    },
    // 当节点扩展时设置选中状态
    nodeExpand(){
      if (typeof this.$refs.tree !== 'undefined') {
        this.$refs.tree.setCheckedKeys(this.checkedIds,true)
      }
    },

```

#### 树状table 的单条选中连带选中子项目
增加了手动判断当前条目是否被选中 ifCheck方法，从而便于通过设置背选项的选中状态


## API数据结构

### 请求返回的基本数据结构

```json
{
  "code": 0,
  "data": {},
  "msg": "string",
  "status": false,
  "timestamp": "2018-11-20T01:06:44.222Z"
}
```

### 基本数据结构解释

#### code 值含义
```java
/** 0,操作成功" */
OK(0,"操作成功"),

/** -1,操作失败" */
FAIL(-1,"操作失败"),

/** -2,验证不通过" */
VALIDATE(-2,"验证不通过"),

/** -3,服务器异常" */
EXCEPTION(-3,"服务器异常"),

/** -4 接口调用 参数类型转换异常*/
BIND_EXCEPTION(-4,"不合法的参数"),

/** -5 接口调用缺少必填参数 */
MISS_EXCEPTION(-5,"缺少必填参数"),

/** -6 登录过期或未登录 */
NO_LOGIN(-6,"请重新登录");

```
**data 是我们需要的内容**
**msg 辅助信息**
**status后台是否处理成功**
**时间戳，无实际意义但要有**





### List (get)

```json
{
  "code": 0,
  "data": {
    "endRow": 0,
    "hasNextPage": false,
    "hasPreviousPage": false,
    "isFirstPage": false,
    "isLastPage": false,
    "list": [
      {
        id:000,
        name:'example'
      }
    ],
    "nextPage": 0,
    "pageNum": 0,
    "pageSize": 0,
    "pages": 0,
    "prePage": 0,
    "size": 0,
    "startRow": 0,
    "total": 0
  },
  "msg": "string",
  "status": false,
  "timestamp": "2018-11-20T01:06:44.208Z"
}
```

