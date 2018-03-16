// 部门人员参照
/* global $ u */
import Collection from 'common/vo/collection'
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import 'collection/demo'
import {Post} from 'common'

function init (refer) {
  // 树形控件加载有误,所以需要每次都重新加载
  let demoList = Collection.create('sg.demo');
  demoList.load();
  let selectedItem = {};
  let vm = {
    config: {
    id: 'grid2',
    data: demoList,
    type: 'grid',
    multiSelect: true,
    editable: false,
    pagination: true,
    fields: [{
      'field': 'code',
      'dataType': 'String',
      'title': '编码',
      'width': '200'
    }, {
      'field': 'name',
      'dataType': 'String',
      'title': '名称',
      'width': '300'
    }
    ]
  }
}
  let app = u.createApp()
  app.init(vm, $('#demoRefer')[0])
  refer.registerSubmitFunc(() => {
    let selectData = demoList.datatable.getCurrentRow().data
    return {
      id: selectData.id.value,
      code: selectData.code.value,
      name: selectData.name.value
    }
  })
  // measureUnitList.datatable.on('select', function (obj) {
  //   refer.submit()
  // })
}
let template = require('./index.html')
export default {
  init,
  template
}
