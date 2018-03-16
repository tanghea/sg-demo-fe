// edit: zhangmyh 2017-3-13 3:18 PM
import { map } from 'lodash'
import urllist from './urllist'

function getURLItem (items) {
  return items.map(function (item, i) {
    let title, url
    if (typeof item == 'string') {
      let urlobj = urllist[item]
      title = urlobj.title
      url = `../${urlobj.url}/index.html`
    } else if (typeof item == 'object') {
      let urlobj = urllist[item.id]
      title = urlobj.title
      url = `../${urlobj.url}/index.html`
      if (item.params) {
        let l = []
        map(item.params, function (v, k) {
          l.push(k + '=' + v)
        })
        if (l.length) {
          let p = l.join('&')
          url += '?' + p
        }
      }
    }
    return {
      text: title,
      url: (i) ? url : '',
      level: i
    }
  })
}

function breadcrumb (params) {
  //供应商面包屑处理
  if(params.path.length>0&&params.path[1]==='supplierIndex'){
    params.path.splice(1,1)
    this.titleList = getURLItem(params.path).reverse()
    this.home = '../supplierIndex/index.html'
    this.homeText = '供应商首页'
    return
  }

    //供应商面包屑处理
  if(params.path.length>0&&params.path[1]==='gkzb'){
    params.path.splice(1,1)
    this.titleList = getURLItem(params.path).reverse()
    this.home = '../gkzbIndexUltimate/index.html'
    this.homeText = '物资'
    return
  }

  this.titleList = getURLItem(params.path).reverse()
  // /yuncai/workbench#/pages/home/home
  //this.home = '#/index/home/home'
  this.home = '../personalindex/index.html'
  this.homeText = '首页'

}

export default breadcrumb
