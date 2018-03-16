// latest: zhangmyh 2017-3-22 11:28 AM
/* global $ */

/**
* 消息显示组件
* uMessage([ type, msg, position, timeout, width ])
* uMessage([config])
** type 类型 可选值：success fail warning info 默认值：info
** msg 消息文字
** position 显示位置 默认值：center
** timeout 关闭延时 单位：秒 默认值：2
** width 消息框宽度 可接受数字和像素值字符串 默认值: 500
**/

import './index.less'

export default function (config) {
  
  if (typeof config == 'string') {
    var type = config
    var msg = arguments[1]
    var position = arguments[2]
    var timeout = arguments[3]
    var width = arguments[4]
  } else if (typeof config == 'object') {
    /* eslint-disable */
    var { type, position, msg, timeout, width } = config
    /* eslint-disable */
  } else {
    return false
  }
  let msgType, showMsg

  switch (type) {
    case 'success':
      showMsg = `<div class="u-message-title">成功</div><div class="u-message-content">${msg}</div>`
      msgType = 'success'
      break
    case 'fail':
      // showMsg = '<i class="uf uf-close-c margin-r-5"></i>' + msg
      showMsg = `<div class="u-message-title">失败</div><div class="u-message-content">${msg}</div>`
      msgType = 'error'
      break
    case 'warning':
      showMsg = `<div class="u-message-title">警告</div><div class="u-message-content">${msg}</div>`
      msgType = 'warning'
      break
    default:
      showMsg = `<div class="u-message-title">信息</div><div class="u-message-content">${msg}</div>`
      msgType = 'info'
      break
  }
  if (!position) {
    position = 'top'
  }
  if (width) {
    if (!isNaN(width)) {
      width = width + 'px'
    }
  } else {
    width = '300px'
  }

  if ($('.u-message:hidden')) {
    $('.u-message:hidden').unbind().remove()
  }
  window.u.showMessage({ msg: showMsg, position, msgType, width })
  if (timeout === 0) {}
  else if (msgType != 'info') {
    let _timer = null
    if (!timeout) {
      timeout = 2
    }
    let ele = $('.u-message')
    ele.on('mouseover', function () {
      debugger
      clearTimeout(_timer)
    })
    ele.on('mouseout', function () {
      _timer = setTimeout(function () {
        $('.u-message').hide()
      }, timeout * 1000)
    })
    _timer = setTimeout(function () {
      $('.u-message').hide();

    }, timeout * 1000)
  }

  return true
}
