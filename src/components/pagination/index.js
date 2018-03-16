import {  EventBus } from 'common'
import './index.less'
function pagination(params){

	var that = this;
	this.totalCount =ko.observable(0)
	this.currentPage =ko.observable(0)
	this.totalPage =ko.observable(1)
	this.pageSize=ko.observable(10)
	this.jumpPageIndex =ko.observable()
	this.leftUnavailable = ko.observable(true)
	this.rightUnavailable = ko.observable(true)
	this.goUnavailable = ko.observable(true)
	params.datatable.currentPageSize = 10

	// this.pageSize.subscribe(function (val) {
	// 	let pageSize = parseInt(val)
	// 	 params.datatable.load({
	// 		pageIndex:that.currentPage(),
	// 		pageSize:pageSize
	// 	 })

	// });

	

	EventBus.on('pagination.'+params.datatable._config.name,function({
		pageIndex,pageSize,totalCount,totalPage
	}={}){
		that.totalCount(totalCount)
		that.totalPage(totalPage?totalPage:1)
		that.currentPage(pageIndex)
		if(pageIndex+1>=totalPage){
			that.rightUnavailable(true)
		}else{
			that.rightUnavailable(false)
		}
		if(pageIndex==0){
			that.leftUnavailable(true)
		}else{
			that.leftUnavailable(false)
		}

		if(that.pageSize()>1){
			that.goUnavailable(false)
		}else{
			that.goUnavailable(true)
		}
		
		// $(".sg_pagination_right button")[0].css("background");
	})

	this.pre = function(){
		let pageSize = parseInt(that.pageSize())
		params.datatable.load({
			pageIndex:that.currentPage()-1,
			pageSize:pageSize
		})
		 
	}.bind(this)

	this.next = function(){
		let pageSize = parseInt(that.pageSize())
		if(that.currentPage()+1<that.totalPage()){
				params.datatable.load({
						pageIndex:that.currentPage()+1,
						pageSize:pageSize
				})
		}
		
	}.bind(this)

	this.first = function(){
		let pageSize = parseInt(that.pageSize())
		params.datatable.load({
			pageIndex:0,pageSize:pageSize
		})
		 
	}.bind(this)

	this.last = function(){
		let pageSize = parseInt(that.pageSize())
		params.datatable.load({
			pageIndex:that.totalPage()-1,
			pageSize:pageSize
		})
		 
	}.bind(this)



	this.jumpToPage = function(){
		let page = parseInt(that.jumpPageIndex());
		let pageSize = parseInt(that.pageSize())
		
		if(isInteger(page)){
			 page>0&&page<=that.totalPage()&&params.datatable.load({pageIndex:page-1,pageSize:pageSize})
		}
		 
	}.bind(this)

	var isInteger = function(obj) {
 		return Math.floor(obj) === obj
	}


	// $('.sg_pagination_select_div').change(function(){
	// 		if(params.datatable.data.pageIndex||params.datatable.data.pageSize){
	// 				console.log('---------')
	// 				let size = $(this).children('option:selected').val();
	// 	 			that.pageSize(parseInt(size));
	// 	 			let index = parseInt(that.currentPage());
	// 	 			params.datatable.load({pageIndex:index,pageSize:parseInt(size)})
	// 		}
	// }) 

	this.pageSizeChange = async function(data){
			// console.log(data);
			let pageSize= parseInt(that.pageSize());
		  let pageIndex = parseInt(that.currentPage());
			await params.datatable.load({pageIndex:pageIndex,pageSize:parseInt(pageSize)})
			params.datatable.currentPageSize = pageSize;
			EventBus.emit('onPageSizeChange')
	}
   
}

pagination.prototype.update = function() {
	
};

// $(document).ready(function(){   
// 	$('.sg_pagination_select_div').change(function(){   
// 		 let size = $(this).children('option:selected').val();
// 		 that.pageSize(parseInt(size));
// 		 let index = parseInt(that.pageIndex());
// 		 params.datatable.load({pageIndex:index,pageSize:parseInt(size)})
// 	})   
// })   



export default pagination