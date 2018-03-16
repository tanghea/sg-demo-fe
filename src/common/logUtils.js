import {Post} from './Ajax'

const ExceptionType = {
    '越权':1,
    '账户锁定':2,
    'IP异常':3

}

const url = '/sg-system-log/funcoper/insertFuncOper'
const systemExceptionMessageUrl = '/sg-system-message/systemExceptionMessage/insertSysExpMsg'
const logger={

	businessLog:(eventType,operType,operMenu,operResult,detailInfo,userCode)=>{
		let funcData = {
            eventType : eventType,
            operType : operType,
            operMenu : operMenu,
            operResult : operResult,
            detailInfo : detailInfo,
            userCode : userCode
			}
 		Post(url,funcData)
	},

	initBusinessLog:(funcNodeCode,funcNodeFullName)=>{

		  $("body").on("click", "button",function(){
        debugger
    	      let self = $(this);
    	      let buttonCode = self.attr("id");
    	      let buttonName = funcNodeFullName+"-"+self.attr("buttonName");
    	      let funcData = {
                   funcNodeCode : funcNodeCode,
                   funcNodeFullName : funcNodeFullName,
                   buttonCode : buttonCode,
                   buttonName : buttonName
		         }
 		         
            Post(url,funcData)
  	 })
        
	}

}

export default logger
