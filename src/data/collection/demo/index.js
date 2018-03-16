import {Collection} from 'common'
import 'model/demo'
Collection.define('sg.demo', {
  model: 'sg.demo',
  proxy: {
    get: '/sg-demo/demo/query/page'
  }
})

export default Collection.create('sg.demo')
