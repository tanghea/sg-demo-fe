import { Collection } from 'common'
import 'model/tree'
Collection.define('list.tree', {
  model: 'demo.tree',
  proxy: {
  }
})

export default Collection.create('list.tree')
