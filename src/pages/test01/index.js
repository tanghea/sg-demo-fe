import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'

import expert from 'model/expert'
import 'common/utils'
import EventBus from 'common/eventbus'
import _ from 'lodash'
// import {personrefer, supplydocrefer, singlesupplydocrefer, orgrefer} from 'components/modalrefer'

expert.load({})

/* global ko u */
var viewModel = {
  id: ko.observable('10'),
  title: '新增专家',
  model: expert.datatable,
  radiodata: [
    {value: '1', name: '男'}, {value: '2', name: '女'}
  ],
  comboAdult: [
    {value: '1', name: '是'}, {value: '2', name: '否'}
  ],
  comboArea: [
    {
      name: '北京',
      value: 1
    },
    {
      name: '重庆',
      value: 2
    },
    {
      name: '上海',
      value: 3
    }
  ],
  comboAge: [
    {
      name: '18',
      value: 18
    },
    {
      name: '19',
      value: 19
    },
    {
      name: '20',
      value: 20
    }
  ],
  save2: _.partial(window.global.btnClickMask, async function () {
    var data = await expert.save()
    if (data.status) {
      EventBus.emit('success', data.msg || '保存成功')
    } else {
      EventBus.emit('fail', data.msg || '保存失败')
    }
  })
}
window.app = u.createApp({
  el: 'body',
  model: viewModel
})
