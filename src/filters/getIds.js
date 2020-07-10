export function getMultipleSelectionIDs(selections, idName = 'id') {
    if ( Boolean(selections[0]) && selections.length > 0 ) {
        return [...new Set(selections.map(item => item[idName]))]
    } else {
        return []
    }
}

export function getMaxSort(arr, key = 'sort') {
  return arr.reduce((maxNum, item) => Math.max(maxNum, item[key]), 0)
}

export function insertBtnRes(modules, arr) {
    modules.forEach(item => {
        item.disabled = true
        if (item.children.length === 0) {
            const val = arr.filter(arg => arg.mpId === item.id)
            if (val.length > 0) {
                item.children = val
            }
        } else {
            insertBtnRes(item.children, arr)
        }
    })
}

export function deleteString(oArr, dArr) {
    return oArr.filter(obj => dArr.indexOf(obj) === -1)
}

export function deleteItems(oArr, dArr, key = 'id') {
    return oArr.filter(obj => dArr.map(item => item[key]).indexOf(obj[key]) === -1)
}

export function removeDuplicates(myArr, key = 'id') {
    return myArr.filter((obj, idx) => myArr.map(item => item[key]).indexOf(obj[key]) === idx)
}