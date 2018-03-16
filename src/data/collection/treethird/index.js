import { Collection } from 'common'
import 'model/treethird'
Collection.define('list.treethird', {
  model: 'demo.treethird',
  proxy: {
  }
})

export default Collection.create('list.treethird')
