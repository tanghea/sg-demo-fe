import {Collection} from 'common'
import 'model/projectdef'
Collection.define('ycctrl.projectdef', {
  model: 'ycctrl.projectdef',
  proxy: {
    get: '/sg-demo/demo/query/page'
    // get: '/cpu-bidtrade/bidtrade/list'
  }
})

export default Collection.create('ycctrl.projectdef')
