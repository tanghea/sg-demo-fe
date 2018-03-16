// 查找多条数据行信息
let findRowsByIds = function(ids,testjsonData) {
  debugger;
  let idlen = ids.length
  let plen = testjsonData.length
  let id = 0
  let rows = []
  let crstep = 0;
  for(let i=0; i<idlen; i++){
    id = ids[i]
    for(let j=0; j<plen;j++){
      if(id == testjsonData[j].id){
        rows[crstep] = testjsonData[j]
        crstep++ 
      }
    }
  }
  return rows
}
// 查找指定类型字段数据行信息
let findRowsByFieldType = function(filedtype,filedcol,testjsonData) {
  if(filedtype == '-1.01'){
    return testjsonData;
  }
  let plen = testjsonData.length
  let rows = []
  let crstep = 0;
  for(let i=0; i<plen; i++){
    if(filedtype == testjsonData[i][filedcol]){
      rows[crstep] = testjsonData[i]
      crstep++ 
    }
  }
  return rows
}
// 查找数及节点IDs
let findTreeIds = function(id,testTreedata) {
  debugger;
  let cids = [id]
  let plen = testTreedata.length
  // pids[0] = id
  let cstep = 1
  let cid = 0
  let jid = 0
  for(let i=0;i<plen;i++){
    if(testTreedata[i].pid == id){
      cid = testTreedata[i].id
      cids[cstep] = cid
      cstep++
      for(let j=0;j<plen;j++){
        if(testTreedata[j].pid == cid){
          jid = testTreedata[j].id
          cids[cstep] = jid
          cstep++
          for(let ki=0;ki<plen;ki++){
            if(testTreedata[ki].pid == jid){
              cids[cstep] = testTreedata[ki].id
              cstep++
            }
          }
        }
      }
    }
  }
  return cids
}
export {
  findRowsByIds,
  findTreeIds,
  findRowsByFieldType
}