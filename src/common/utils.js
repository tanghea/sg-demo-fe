import './global'
// fn 通常是ajax请求
window.global.btnClickMask = function (fn) {
  var e = arguments[arguments.length - 1]
  var el = e.target.parentElement
  el.setAttribute('disabled', 'disabled')
  fn().then(() => {
    el.removeAttribute('disabled')
  }).catch(() => {
    el.removeAttribute('disabled')
  })
}
