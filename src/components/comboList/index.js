const sex = [
  {
    name: '男',
    value: 1
  },
  {
    name: '女',
    value: 2
  }
]
const commonStatus = [
  {
    name: '开启',
    value: 0
  },
  {
    name: '关闭',
    value: 1
  }
]
const isSubmit= [
  {
    name: '是',
    value: 0
  },
  {
    name: '否',
    value: 1
  }
]

const createStyeComb = [
  {
    name: '随机',
    value: 0
  },{
    name: '随机+指定',
    value: 1
  }
]

const yesOrNo = [
  {
    name: '是',
    value: 1
  },{
    name: '否',
    value: 0
  }
]

const AttendComb = [
  {
    name: '出席',
    value: 0
  },{
    name: '未出席',
    value: 1
  }
]

const isSubmitState = [
     {
        name: '已提交',
        value: 0
      },{
        name: '未提交',
        value: 1
      }
 ]

 const checkState = [
      {
        name: '未审核',
        value: 0
      },{
        name: '已审核',
        value: 1
      }
 ]

const expertGroupStyle = [
      {
        name: '技术组',
        value: 1
      },{
        name: '商务组',
        value: 2
      },{
        name: '价格组',
        value: 3
      }
]
const oppdimen = [
      {
        name: '重量',
        value: 1
      },{
        name: '长度',
        value: 2
      },{
        name: '面积',
        value: 3
      },
      {
        name: '体积',
        value: 4
      },{
        name: '件数',
        value: 5
      },{
        name: '时间',
        value: 6
      },{
        name: '其他',
        value: 7
      }
]
const trueOrFalse = [
  {
    name: '是',
    value: 1
  },{
    name: '否',
    value: 2
  }
]


const identityTypeComb = [

      {
        name: '请选择',
        value: null
      },{
        name: '专家',
        value: 1
      },{
        name: '供应商',
        value: 2
      },{
        name: '集体企业',
        value: 3
      },{
        name: '招标代理机构',
        value: 4
      },{
        name: '物资部',
        value: 5
      }
]


const userTypeComb2 = [
      {
        name: '请选择',
        value: null
      },{
        name: '系统管理',
        value:'sys'
      },{
        name: '审计管理',
        value: 'aud'
      },{
        name: '审核管理',
        value: 'exa'
      },{
        name: '基础设置',
        value: 'bas'
      },{
        name: '业务操作',
        value: 'pub'
      }
]

const authTypeComb = [
      {
        name: '请选择',
        value: null
      },{
        name: '密码认证',
        value: 1
      },{
        name: 'CA认证+密码认证',
        value: 2
      },{
        name: '身份证认证+密码认证',
        value: 3
      }
]


const passwordTypeComb = [
      {
        name: '请选择',
        value: null
      },{
        name: '数字',
        value: 1
      },{
        name: '数字+字母',
        value: 2
      },{
        name: '数字+大小写字母',
        value: 3
      }
] 

const enableStatusComb = [
      {
        name: '已启用',
        value: 1
      },{
        name: '未启用',
        value: 2
      },{
        name: '已停用',
        value: 3
      }
] 

const enablecomItems = [
    {
        "value": "1",
        "name": "启用"
    }, 
    {
        "value": "2",
        "name": "停用"
    }
]

const batchenablecomItems = [
    {
        "value": "1",
        "name": "启用"
    }, 
    {
        "value": "0",
        "name": "停用"
    }
]


function getCombo (key) {
  switch (key) {
    case 'sex': return sex
    case 'commonStatus': return commonStatus
    case 'isSubmit': return isSubmit
    case 'createStyeComb': return createStyeComb
    case 'yesOrNo': return yesOrNo
    case 'AttendComb': return AttendComb
    case 'isSubmitState': return isSubmitState
    case 'checkState': return checkState
    case 'expertGroupStyle': return expertGroupStyle
    case 'oppdimen': return oppdimen
    case 'trueOrFalse': return trueOrFalse
    case 'identityTypeComb': return identityTypeComb
    case 'authTypeComb': return authTypeComb
    case 'passwordTypeComb': return passwordTypeComb
    case 'enableStatusComb': return enableStatusComb
    case 'enablecomItems' : return enablecomItems
    case 'batchenablecomItems' : return batchenablecomItems
    case 'userTypeComb2' : return userTypeComb2
    default: return []
  }
}
export default getCombo
