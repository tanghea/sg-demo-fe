// latest: zhangmyh 2017-2-27 2:23 PM
import { Model, Post, Get, EventBus } from 'common'
import { each, extend } from 'lodash'

let EventEmit = require('eventemitter2').EventEmitter2
let _config = {}

export default function Collection (config) {
  EventEmit.apply(this)
  var { model, proxy } = config
  this._config = config
  this.proxy = proxy
  this._model = Model.create(model, false)
  this.datatable = this._model.datatable
  this.associations = this._model.associations
}

Collection.prototype = Object.create(EventEmit.prototype)
Collection.define = function (name, config) {
  if (!name) {
    console.error('需要知道Collection模型名称')
    return
  }
  if (_config[name]) {
    console.error('当前Collection模型已存在:' + name)
    return
  }
  _config[name] = config
}

Collection.create = function (name) {
  var config = _config[name]
  if (!config) {
    console.error('不存在Collection模型:' + name)
    return
  }
  config.name = name
  return new Collection(config)
}

Collection.prototype.load = async function (params, config = {}) {
/*  if(config.url){
      this.proxy.get=config.url
      this.proxy.loadmethod=config.method
  }*/
  let data
  params = extend(this.params || {}, {
    pageIndex: 0
  }, params)
  this.params = params
  if (config.localData) {
    data = config.localData
  } else {
    let url = (config.url) ? config.url : this.proxy.get
    let method = (config.method) ? config.method : this.proxy.loadmethod
    let ajax = (method === 'post') ? Post : Get
    data = await ajax(url, params)

  }
  if (data.data) {
    this.data = data.data
  } else {
    this.data = data
  }
  // 修改datatable，暂时兼容后台无result情况
  // 如后台全部保证存在result，可去掉判断
  if (this.data.result) {
      this.data.result.map((item,idx)=>{
         item.rowIndex = this.data.pageIndex*this.data.pageSize+(idx+1)
      })
 
    this.datatable.setSimpleData(this.data.result, {
      'unSelect': 'true'
    })
  } else if (this.data.data) {
    this.data.data.map((item,idx)=>{
         item.rowIndex = this.data.pageIndex*this.data.pageSize+(idx+1)
      })
    this.datatable.setSimpleData(this.data.data, {
      'unSelect': 'true'
    })
  } else{
    // debugger
    // this.data.map((item,idx)=>{
    //      item.rowIndex = this.data.pageIndex*this.data.pageSize+(idx+1)
    //   })
    this.datatable.setSimpleData(this.data, {
      'unSelect': 'true'
    })
  }
  //设置datatable页按pageSize补齐
  //分页时也可用
  //add by ck 20170606
  if(params.filledTenRow == true||config.filledTenRow)
  {
   let pageIndex = this.data.pageIndex;
   let pageSize = this.data.pageSize;
   //获取当前页行数据
   let rowsLength = this.data.result?this.data.result.length:1;
   //不够页补足
   if(rowsLength < pageSize)
   {
   for(let i=rowsLength;i<pageSize;i++)
   {
    this.datatable.createEmptyRow();
   }
   }
   //取消行选中
    this.datatable.setAllRowsUnSelect();
    //设置第一行焦点
    this.datatable.setRowFocus(0)
    // this.datatable.setRowUnSelect(rowsLength-1)
  }

  if(config.callback){
      config.callback(data)
  }
  this.emit('data', data, this)
  // 设置分页
  // console.log(this._config.name)
  EventBus.emit('pagination.' + this._config.name, this.data)
  return data;
}

Collection.prototype.setData = function (data) {
  this.datatable.setSimpleData(data, {
    'unSelect': 'true'
  })
}

Collection.prototype.getSelected = function () {
  let viewModel = this.datatable
  let indexs = viewModel.getSelectedIndexs()
  let data = viewModel.getSimpleData()
  let rs = []
  each(indexs, function (val) {
    rs.push(data[val])
  })
  return rs
}

Collection.prototype.count = async function (params = {}) {
  let url = this.proxy.count
  let errorFlag = false
  if (!url) {
    errorFlag = true
  }
  if (!errorFlag) {
    let data = await Get(url, params)
    if (data.status) {
      return data.data
    }
  }
  return { status: 0, msg: '查询失败' }
}
//Collection数据必输项校验 
//Add by ck 20170719
Collection.prototype.checkCollectionData = function (data, config) {
  var rs = []
  for(let i=0; i<data.length;i++){
  let rsrow = [];
  let prefix = "第"+(data[i]["index"]+1)+"行"  
  rs.push(prefix);
  each(config.meta, function (val, key) {
    // 需要存在
    if (val.required) {
      // 却不存在
      if (data[i][key]==null || data[i][key].length==0) {
        rs.push(val.nullMsg)
        rsrow.push(val.nullMsg)
      }
    }
    if (val.maxLength) {
      // 最大长度
      if (!data[i][key]) {
        rs.push(val.maxLengthMsg)
        rsrow.push(val.maxLengthMsg)
      } else if (data[i][key].length > val.maxLength) {
        rs.push(val.maxLengthMsg)
        rsrow.push(val.maxLengthMsg)
      }
    }
    // 使用设置的check方法验证
    if (val.check) {
      let checkResult = val.check(data[i][key])
      if (!checkResult.status) {
        rs.push(checkResult.msg)
        rsrow.push(checkResult.msg)
      }
    }
  })
  if(rsrow.length == 0){
    //删除最后一个元素( let prefix = "第"+(data[i]["index"]+1)+"行"  )
    rs.pop();
  }
}
  return rs
}
