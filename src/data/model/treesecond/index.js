import { Model } from 'common'
Model.define('demo.treesecond', {
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

export default Model.create('demo.treesecond')
