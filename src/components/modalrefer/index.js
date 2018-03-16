import demo from 'components/modalrefer/demo'

/* global u */
function demorefer (option) {
  u.refer({
    isPOPMode: true,
    module: demo,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    title: '参照',
    onOk: option.onOk,
    enterpriseId: '',
    onCancel: option.onCancel
  })
}

export {
  demorefer//例子  
}
