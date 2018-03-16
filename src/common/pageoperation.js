let getPageParam = function(conditions,pageInfo){
  let params = {
    name: conditions,
    pageNo: 0,
    PageSize: pageInfo.pageSize,
    pageIndex: pageInfo.pageIndex
  }
  return params;
}

let getSelectedRows = function(srows,alldatas){
  let rlen = srows.length
  let alllen = alldatas.length
  let datas = [];
  let idt = 1
  let datainc = 0
  for (let i = 0 ; i < rlen; i++) {
    idt = srows[i].data.id.value;
    for(let j=0 ;j < alllen; j++){
      if(idt == alldatas[j].id){
        datas[datainc] = alldatas[j]
        datainc++
      }
    }
  }
  return datas;
}

export {
  getPageParam,
  getSelectedRows
}