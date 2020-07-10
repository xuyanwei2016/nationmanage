export default function(data, sublistName, idName = 'id') {
  let ids = []
  const getTreeid = (innerData) => {
    innerData.map((k, v) => {
      ids.push(k[idName])
      if (k[sublistName].length > 0) {
        innerData = k[sublistName]
        getTreeid(innerData)
      }
    })
  }
  getTreeid(data)
  ids = [...new Set(ids)]

  return ids
}

