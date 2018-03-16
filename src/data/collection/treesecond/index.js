import { Collection } from 'common'
import 'model/treesecond'
Collection.define('list.treesecond', {
  model: 'demo.treesecond',
  proxy: {
  }
})

export default Collection.create('list.treesecond')
