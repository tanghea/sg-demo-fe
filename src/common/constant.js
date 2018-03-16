export const context = {
	sgSystemEnterprise:'/sg-system-enterprise',
	sgSystemUser:'/sg-system-user',
	sgSystemFile:'/sg-system-file',
	sgSystemFileencrypt:'/sg-system-fileencrypt',
	sgSystemBpm:'/sg-system-bpm',
	sgSystemPrint:'/sg-system-print',
	sgBasedocOrgrights:'/sg-basedoc-orgrights',
	sgGkzbPrivilege:'/sg-gkzb-privilege',
	sgBasedocMaterial:'/sg-basedoc-material',
	sgBasedocSupplier:'/sg-basedoc-supplier',
	sgBasedocBasedata:'/sg-basedoc-basedata',
	sgBusinessGkzbBid:'/sg-business-gkzb-bid',
	sgBusinessGkzbSupplybid:'/sg-business-gkzb-supplybid',
	sgBusinessGkzbMaterialdemand:'/sg-business-gkzb-materialdemand',
	sgSystemUrl:'http://172.20.12.15:90'
}

//云打印 menuid
export const menu = {
			annualBatchPlan	:10,
			materialDemandPlan	:11,
			materTechSpec	:12,
			sgtenderedit	:13,
			sgpackage	:14,
			tenderFileUpload	:15,
			noticerelease	:16,
			projectaddendum	:17,
			clarify	:18,
			bidsignuplist	:19,
			tenderpurchase	:20,
			downloadtenderdoc	:21,
			uploadbiddoc	:22,
			nobidsetting	:23,
			decryptionbidopen	:24,
			bidopenrecord	:25,
			expertschememanage	:26,
			expertnoticemanage	:27,
			scorerulekeep	:28,
			tenderEvaluation	:29,
			techDetailEval	:30,
			busDetailEval	:31,
			priDetailEval	:32,
			preWinBidManage	:33,
			winBidResultPublic	:34,
			winBidNotice	:35,
			winBidLetter	:36,
			rejectNotice	:37
}

let windowWidth = window.screen.width 
let innerWidth = window.innerWidth
export const  ratioWidth= (width)=>{
	return width*windowWidth/1280
}

export const  customWidth= (char)=>{
	return (parseInt(char)+2)*12/800*(windowWidth-488)
}
