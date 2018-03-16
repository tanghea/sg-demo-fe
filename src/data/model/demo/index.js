import {Model} from 'common'
Model.define('sg.demo', {
  meta: {
    id: '',
    code: '',
    name: '',
    businessStatus: '',
    referId: '',
    referCode: '',
    referName: ''
  }
})
export default Model.create('sg.demo')
