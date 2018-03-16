import {Post} from './Ajax'

const ExceptionType = {
    '越权':1,
    '账户锁定':2,
    'IP异常':3
}

const systemExceptionMessageUrl = '/sg-system-message/systemExceptionMessage/insertSysExpMsg'

const msg ={
  // 1.越权 2.账户锁定 3.IP异常
  sysExceptionMsg:(exceptionType,operatingResult,messageContent)=>{
    let params = {
            exceptionType : ExceptionType[exceptionType],
            operatingResult : operatingResult,
            messageContent : messageContent
      }
    Post(systemExceptionMessageUrl,params)
  },


}

export default msg
