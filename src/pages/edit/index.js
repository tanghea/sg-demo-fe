// 编辑演示页面
// 基础引用
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'

// 引用库
import { debounce } from 'lodash'

// 模型
import projectdef from 'model/projectdef'

// 消息显示
import uMessage from 'components/message'
import '../../common/sg_common.less'

// 模态弹出框
import {materialsRefer,proManageRefer, personrefer, supplydocrefer, orgrefer,deptRefer,materialRefer } from 'components/modalrefer'
import multirefer from 'components/modalrefer/multiselect'
/* global ko u */

var id = window.global.query('id')
// 演示数据
id = 535
if (id) {
  projectdef.load({id: id})
}

function chooseperson () {
  personrefer({
    onOk: function (msg) {
      projectdef.associations.detailList.datatable.getCurrentRow().setValue('enterpriseName', msg.personname)
      projectdef.associations.detailList.datatable.getCurrentRow().setValue('enterpriseId', msg.id)
    },
    onCancel: function () {}
  })
}
function chooseSupplyDoc () {
  supplydocrefer({
    defaultData: function () {
      return viewModel.model.getValue('statusName')
    },
    onOk: function (msg) {
      console.log(msg)
      // 这里返回的msg包含{id: 供应商档案id,name:供应商名称,code:供应商编码,supplyId: 供应商租户id}
      viewModel.model.getCurrentRow().setValue('statusName', msg)
    },
    onCancel: function () {}
  })
}

const multiSelectData = [{
  value: 1,
  name: '测试1'
}, {
  value: 2,
  name: '测试2',
  checked: true
}, {
  value: 3,
  name: '测试3'
}, {
  value: 4,
  name: '测试4'
}, {
  value: 5,
  name: '测试5',
  checked: true
}, {
  value: 6,
  name: '测试6'
}]

var viewModel = {
  id: ko.observable(''),
  title: ko.observable('编辑示例'),
  comboData: [
    {
      name: '公开招标',
      value: 1
    }, {
      name: '邀请招标',
      value: 2
    }, {
      name: '单一来源',
      value: 3
    }
  ],
  checkboxData: [
    {
      value: '1',
      name: '产品一'
    }, {
      value: '2',
      name: '产品二'
    }
  ],
  radiodata: [
    {
      value: '1',
      name: '男'
    }, {
      value: '2',
      name: '女'
    }
  ],
  model: projectdef.datatable,
  // 参照配置
  chooseSupplyDoc,
  selectMulti: function () {
    multirefer({
      list: multiSelectData,
      valueField: 'value',
      textField: 'name',
      onOk: function (infos) {
        console.log('多选返回值: ', infos)
      }
    })
  },
  showOrgRefer: function () {
    materialsRefer({
      onOk: function onOk (msg) {
        debugger
        let name = msg.name;
        let code = msg.code;
        // projectdef.datatable.getCurrentRow().setValue('enterpriseName', msg.name)
        // projectdef.datatable.getCurrentRow().setValue('enterpriseId', msg.id)
      },
      onCancel: function onCancel () {},
    })
  },
  showPsnRefer: function () {
    personrefer({
      onOk: function onOk (msg) {
        projectdef.datatable.getCurrentRow().setValue('userName', msg.personname)
        projectdef.datatable.getCurrentRow().setValue('userId', msg.id)
      },
      onCancel: function onCancel () {}
    })
  },
  modalclick: function (...args) {
    u.confirmDialog({
      msg: '是否保存单据？', // modal内容
      title: '测试确认', // modal title
      onOk: function () { // 确认后的回调
        window.alert('ok')
      },
      onCancel: function () { // 取消后的回调
        window.alert('cancel')
      }
    })
  },
  msgsuccess: function () {
    uMessage('success', '操作成功')
  },
  msgfail: function () {
    uMessage('fail', '操作成功')
  },
  msgwarning: function () {
    uMessage('warning', '操作成功')
  },
  select: function (msg) {
    console.log('select:' + msg)
  },
  save: debounce(async function () {
    var data = await projectdef.save()
    if (data.status == '1') {
      uMessage('success', '保存成功')
    } else {
      uMessage('fail', '保存失败')
    }
  }, 300, { maxWait: 2000 }),
  // 表格配置
  gridconfig: {
    id: 'detail_grid',
    data: projectdef.associations.detailList,
    type: 'grid',
    multiSelect: false,
    editable: false,
    canDrag: false,
    canSwap: false,
    columnMenu: false,
    autoWidth: true,
    fields: [
      {
        'field': 'materialClassName',
        'dataType': 'String',
        'title': '物料分类',
        'width': '125'
      }, {
        'field': 'materialName',
        'dataType': 'String',
        'title': '物料信息',
        'renderType': 'timeRender',
        'sortable': true,
        'width': '125'
      }, {
        'field': 'num',
        'dataType': 'String',
        'title': '数量',
        'sumCol': true,
        'width': '125'
      }, {
        'field': 'unit',
        'dataType': 'String',
        'title': '单位',
        'width': '125'
      }, {
        'field': 'reqDesc',
        'dataType': 'String',
        'title': '需求描述',
        'sumCol': true,
        'width': '125'
      }
    ]
  },
  editgridconfig: {
    id: 'edit_grid',
    data: projectdef.associations.detailList,
    type: 'grid',
    multiSelect: false,
    editable: true,
    canDrag: false,
    canSwap: false,
    columnMenu: false,
    autoWidth: true,
    fields: [
      {
        'field': 'materialClassName',
        'dataType': 'String',
        'title': '物料分类',
        'editType': chooseSupplyDoc,
        'width': '125'
      }, {
        'field': 'materialName',
        'dataType': 'String',
        'title': '物料信息',
        'editType': 'string',
        'renderType': 'timeRender',
        'sortable': true,
        'width': '125'
      }, {
        'field': 'num',
        'dataType': 'String',
        'title': '数量',
        'editType': 'float',
        'editOptions': {
          'validType': 'float',
          'precision': '8'
        },
        'sumCol': true,
        'width': '125'
      }, {
        'field': 'unit',
        'dataType': 'String',
        'title': '单位',
        'editType': 'string',
        'width': '125'
      }, {
        'field': 'enterpriseName',
        'dataType': 'String',
        'title': '人员',
        'editType': chooseperson,
        'width': '125'
      }, {
        'field': 'sex',
        'dataType': 'string',
        'title': '性别',
        'editOptions': {
          'id': 'combobox1',
          'type': 'combo',
          'datasource': 'sex'
        },
        'editType': 'combo',
        'renderType': 'comboRender'
      },
      {
        'field': 'reqDesc',
        'dataType': 'String',
        'title': '需求描述',
        'editType': 'string',
        'sumCol': true,
        'width': '125'
      }
    ]
  },
  addRow () {
    projectdef.associations.detailList.datatable.createEmptyRow()
  }
}

window.app = u.createApp({el: 'body', model: viewModel})
