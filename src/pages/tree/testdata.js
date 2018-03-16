let testdata = [{
  id: 1,
  name: '用友网络科技股份有限公司',
  pid: 0,
  innercode: '1A'
}, {
  id: 2,
  name: '云应用孵化中心1',
  pid: 1,
  innercode: '1A2A',
  innername: 'aab'
}, {
  id: 3,
  name: '云应用孵化中心2',
  pid: 1,
  innercode: '1A3A',
  innername: 'aab'
}, {
  id: 4,
  name: '云应用孵化中心3',
  pid: 2,
  innercode: '1A4A',
  innername: 'aab'
}, {
  id: 5,
  name: '云应用孵化中心4',
  pid: 4,
  innercode: '1A5A',
  innername: 'aab'
}, {
  id: 6,
  name: '云应用孵化中心6',
  pid: 3,
  innercode: '1A5A6',
  innername: 'aab'
}, {
  id: 7,
  name: '阿里巴巴国内事业部',
  pid: 0,
  innercode: '1A6A',
  innername: 'aab'
}]

let curId = 100
let savedata = function (v) {
  if (!v.id) {
    v.id = curId
    curId++
  }
  return {
    status: 1,
    msg: '成功',
    data: v
  }
}
let removedata = function (v) {
  return {
    status: 1,
    msg: '成功',
    data: v
  }
}

export {
  testdata,
  savedata,
  removedata
}
