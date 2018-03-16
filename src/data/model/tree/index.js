import { Model } from 'common'
Model.define('demo.tree', {
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

export default Model.create('demo.tree')
