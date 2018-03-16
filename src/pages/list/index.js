// 编辑演示页面
// 基础引用
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'

// 引用库
import { find, map } from 'lodash'
import { Get, Post  } from 'common'
import uMessage from 'components/message'


// 模型
import demoList from 'collection/demo'
import demo from 'model/demo'

// 模态弹出框
import {demorefer} from 'components/modalrefer'
// 列表操作
import operation from './opt'
/* global ko */

let collection = demoList

var stateItemsTab = [{
      title: '全部',
      state: 1,
      num: 0
    },
    {
      title: '已启用',
      state: 2,
      num: 0
    },
    {
      title: '未启用',
      state: 3,
      num: 0
    }]   
var viewIdS = new Array("main", "add");

//界面显示控制
function showViewCtr(id)
{  
  for(let i=0;i<viewIdS.length;i++)
  {
    if(viewIdS[i] == id)
    {
      $("#"+id).show()
    }
    else
    {
      $("#"+viewIdS[i]).hide()
    }
  }
}    
var viewModel = {
  id: ko.observable(10),
  model: demo.datatable,
  title: '列表示例',
  comboData: [
    {
      name: '启用',
      value: 1
    }, {
      name: '未启用',
      value: 2
    }
  ],
  q: ko.observable(''),
  addFun: function(){
    showViewCtr('add');
  },
  editFun: function(){
    debugger
    let checkedData = collection.datatable.getSelectedRows();
    if(checkedData.length != 1){
      uMessage("warning", "请选择一条数据");
      return
    }
    showViewCtr('add');
    viewModel.model.setSimpleData(checkedData[0].getSimpleData());
  },
  saveFun: async function(){
    debugger
    let params = viewModel.model.getSimpleData()[0];
    if(!params.code){
      uMessage("warning", "请输入编号");
      return;
    }
    let saveDatas = {datas: JSON.stringify(params)};
    let url = "/sg-demo/demo/save"
    let resData = await Post(url, saveDatas);
    debugger
    let status = resData.status;
    if(status == 1){
      //保存成功给ID赋值
      let id = resData.data.id;
      viewModel.model.setValue("id", id);
      uMessage("success", "保存成功!");
      return;
    }
    else{
      let msg = resData.msg;
      uMessage("fail", "保存失败！");
      return;
    }
  },
  deleteFun: async function(){
     debugger
    let checkedData = collection.datatable.getSelectedRows();
    if(checkedData.length == 0){
      uMessage("warning", "请选择需要删除的数据!");
      return
    }
    let params = checkedData.map(function(item,index){
      return item.getSimpleData();
    })
    let url = "/sg-demo/demo/delete"
    let deleteDatas = {datas: JSON.stringify(params)};
    let resData = await Post(url, deleteDatas);
    debugger
    let status = resData.status;
    if(status == 1){
      //刷新界面
      init();
      uMessage("success", "删除成功!");
      return;
    }
    else{
      let msg = resData.msg;
      uMessage("fail", "删除失败！");
      return;
    }
  },
  returnFun: function(){
    showViewCtr('main');
    init();
  },
  clickme: function (msg) {
    console.log('click')
  },
  query: function (msg) {
    console.log('query' + this.q())
  },
  showRefer: function () {
    demorefer({
      onOk: function onOk (msg) {
       viewModel.model.setValue("referId", msg.id);
       viewModel.model.setValue("referCode", msg.code);
       viewModel.model.setValue("referName", msg.name);
      },
      onCancel: function onCancel () {},
      filter:'yes'
    })
  },
  stateclick: async function (msg) {
    debugger
    let state = msg.state;
    let businessStatus = "";
    //全部
    if(state == 1){
      businessStatus = "";
    }
    //已启用
    if(state == 2){
     businessStatus = 1;
    }
    //未启用
    else if(state == 3){
     businessStatus = 2;
    }
    let param = {businessStatus: businessStatus};
    let data = await collection.load(param);
    debugger
    viewModel.setStateItems(data.data.stateItems);
  },
  // 设置物料需求计划切换页数据数量
 setStateItems: (countData)=>{
  debugger
  let temp = [
    {"value":0},
    {"value":0},
    {"value":0}
    ]
  for(let i=0; i <countData.length ;i++){
    if(countData[i].businessStatus){
      temp[0].value = temp[0].value +countData[i].businessStatusCount;
      let state = countData[i].businessStatus;
      if(state == 1){
        temp[1].value = countData[i].businessStatusCount;
      }else if(state == 2){
        temp[2].value = countData[i].businessStatusCount;
      }
    }
  }
  for(let i=0;i<stateItemsTab.length;i++){
    stateItemsTab[i].num = temp[i].value;
  }
  viewModel.statuItems([])
  viewModel.statuItems(stateItemsTab);
 },
  stateindex: ko.observable(0),
  statuItems: ko.observableArray([
    {
      title: '全部',
      state: 1,
      num: 0
    },
    {
      title: '已启用',
      state: 2,
      num: 0
    },
    {
      title: '未启用',
      state: 3,
      num: 0
    }
  ]),
  config: {
    id: 'grid1',
    data: collection,
    type: 'grid',
    multiSelect: true,
    editable: false,
    pagination: true,
    fields: [{
      'field': 'code',
      'dataType': 'String',
      'title': '编码',
      'width': '200'
    }, {
      'field': 'name',
      'dataType': 'String',
      'title': '编码名称',
      'width': '300'
    }, {
      'field': 'businessStatus',
      'dataType': 'String',
      'title': '业务状态',
      'width': '180',
      renderType (obj) {
        // 主体数据
        let id = obj.row.value.id
        let businessStatus = obj.row.value.businessStatus;
        let text = '';
        if(id){
          if(businessStatus == 1){
            text = "已启用";
          }
          else{
            text = "未启用";
          }
        }
        obj.element.innerHTML = '<span title="' + text + '">' + text + '</span>'
      }
    }
    ]
  }
}

window.app = window.u.createApp({
  el: 'body',
  model: viewModel
})

viewModel.stateindex(0)
init();
async function init(){
  let data = await collection.load();
  viewModel.setStateItems(data.data.stateItems);
}