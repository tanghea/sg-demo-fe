import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'

import { debounce } from 'lodash'
import uMessage from 'components/message'

import mainTree from 'collection/tree'
import treenode from 'model/tree'
import './index.less'

// test
import { testdata, savedata, removedata } from './testdata'

/* global ko u */

var viewModel
const findRow = function (id) {
  let rows = mainTree.datatable.getAllRows()
  let curr
  rows.forEach(function (row, idx) {
    if (row.data.id.value == id) {
      curr = mainTree.datatable.getRow(idx)
    }
  })
  return curr
}

function init () {
  // 默认查询待发布
  mainTree.load({}, { localData: { data: { result: testdata } } })

  viewModel = {
    title: ko.observable('树形控件'),
    treeOption: {
      callback: {
        beforeClick: async function (id, obj) {
          let curr = findRow(obj.id)
          let tmp = {
            id: curr.data.id.value,
            name: curr.data.name.value,
            pid: curr.data.pid.value,
            innercode: curr.data.innercode.value,
            innername: curr.data.innername.value,
          }
          treenode.load({}, { localData: tmp })
        }
      }
    },
    treeModel: mainTree.datatable,
    model: treenode.datatable,
    save: debounce(async function () {
      // let data = await model.save()
      let data = savedata(treenode.datatable.getSimpleData()[0])
      if (data.status == '1') {
        uMessage('success', '保存成功')
        let curr = findRow(data.data.id)
        if (curr) {
          curr.setSimpleData(data.data)
        } else {
          mainTree.datatable.addSimpleData(data.data)
        }
      } else {
        uMessage('fail', '保存失败')
      }
    }, 300, { maxWait: 2000 }),
    addchild: debounce(async function () {
      let id = treenode.datatable.getSimpleData()[0].id
      let pid = 0
      if (id) {
        pid = id
      }
      treenode.datatable.setSimpleData({ pid })
    }, 300, { maxWait: 2000 }),
    remove: debounce(async function () {
      let id = treenode.datatable.getSimpleData()[0].id
      if (!id) {
        return
      }
      u.confirmDialog({
        msg: '是否确认删除？',
        title: '删除确认',
        onOk: async function () {
          let data = removedata(treenode.datatable.getSimpleData()[0].id)
          if (data.status == '1') {
            uMessage('success', '删除成功')
            let curr = findRow(id)
            mainTree.datatable.removeRowByRowId(curr.rowId)
          } else {
            uMessage('fail', '删除失败')
          }
        }
      })
    }, 300, { maxWait: 2000 })
  }

  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

(async function () {
  init()
})()
