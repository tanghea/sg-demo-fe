import { Model } from 'common'
Model.define('demo.treethird', {
  proxy: {
  },
  meta: {
    id: '',
    name: '',
    pid: '',
    innercode: '',
    innername: ''
  }
})

export default Model.create('demo.treethird')
