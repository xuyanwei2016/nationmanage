// 因此命名空间不带this 所以引入的时候要用  functionName.apply(this,[arg1,arg2])调用

/*
 ** 用法示例
 ** operationMsg.apply(this,[res.data.code,'修改'])
 */
export function operationMsg(code, msgName) {
    if (code === 0) {
        this.$message.success(`${msgName}成功`)
        this.getList()
    } else {
        this.$message.error(`${msgName}失败`)
    }
}

export function errorMsg(data, msg) {
    data.code === -2 ? this.$message.error(`${msg}失败：${data.msg}`) : this.$message.error(`${msg}失败`)
}

export function requestMsg(data, msgName) {
    if (data.code === 0) {
        this.$message.success(`${msgName}成功`)
        this.getList()
    } else if (data.code == -2) {
        this.$message.error(`${msgName}失败：${data.msg}`)
    } else {
        this.$message.error(`${msgName}失败`)
    }
}

/*
 ** 用法示例
 ** confirm.apply(this,['确认xxx吗？','批量操作'])
 */
export function confirm(msg, title = '提示') {
    return this.$confirm(msg, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
            // center: true
    })
}


/* 防抖函数 */
export function deBonce(fn,delay){
    let timer = null
    return function(...args){
        if(timer){
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn(...args)
        },delay)
    }
}