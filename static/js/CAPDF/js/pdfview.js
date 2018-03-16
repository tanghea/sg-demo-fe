/*-----
版本 V1~1
pdfjs
参数
fileurl/文件路径(必选)
filemain/创建元素(必选)
addtop/距离顶部加载(可选)
complete/加载完成回调(可选)
change/改变页数回调(可选)
方法
prev()/上一页
next()/下一页
pageto(num)/指定页
-----*/
function pdfview(json){
	if ( !(this instanceof pdfview) ){
		return new pdfview(json);
	};
	var self=this;
	self.pdfid=parseInt(Math.random()*1000);
	self.fileurl = json.fileurl;
	self.sealimg=json.sealimg;
	self.filemain=json.filemain;
	if(typeof(json.nailmain)!='undefined'){
		self.nailmain=json.nailmain;
	}else{
		self.nailmain=null;
	};
	self.pagen=0;
	self.pagelist=[];
	if(typeof(json.addtop)!='undefined'){
		self.addtop=json.addtop;
	}else{
		self.addtop=20;
	};
	if(typeof(json.complete)!='undefined'){
		self.complete=json.complete;
	}else{
		self.complete=function(){};
	};
	if(typeof(json.change)!='undefined'){
		self.change=json.change;
	}else{
		self.change=function(){};
	};
	self.filesize=900;
	self.sealsize=150;
	
	self.HOSTED_VIEWER_ORIGINS = ['null','http://mozilla.github.io', 'https://mozilla.github.io'];
	
	self.flagfile=null;
	self.pagecachearray=[];
	self.nailcachearray=[];
	self.maxpagecache=5;
	self.nailscrollsure=true;
	
	self.initialize=function(){
		//pdf.js
		//PDFJS.workerSrc = 'js/pdfjs/pdf.worker.js';
		PDFJS.cMapUrl = 'cmaps/';
		PDFJS.cMapPacked = true;
		self.validateFileURL();
		self.pdffile=PDFJS.getDocument(self.fileurl);
		self.loadingbarshow();
		self.pdffile.onProgress = function getDocumentProgress(progressData) {
			self.loadingbar(progressData.loaded / progressData.total);
		};
		if(self.ispc()){
			self.fileloadpc();
		}else{
			self.fileloadpe();
		};
	};
	
	self.pdfjsload=function(ele,page){
		if(ele.find('canvas.pdfcav').length==0){
			self.pdfgetpage(ele,page);
		};
		var i=page.pageIndex
		var repeat=false;
		for(var o=0;o<=self.pagecachearray.length;o++){
			if(i==self.pagecachearray[o]){
				repeat=true;
				break;
			};
		};
		if(!repeat){
			self.pagecachearray.push(i);
			self.pagecachearray.sort(function(a, b){
				return a - b;
			});
			if(self.pagecachearray.length>self.maxpagecache){
				if(Math.abs(self.pagecachearray[0]-i)<Math.abs(self.pagecachearray[self.pagecachearray.length-1]-i)){
					var deli=self.pagecachearray.pop()
				}else{
					var deli=self.pagecachearray.shift();
				};
				$(self.fileimg).eq(deli).find('canvas.pdfcav').remove();
			};
		};
	};

	self.pdfjsloadnail=function(ele,page){
		if(ele.find('canvas.pdfcav').length==0){
			self.pdfgetpage(ele,page);
		};
		var i=page.pageIndex
		var repeat=false;
		for(var o=0;o<=self.nailcachearray.length;o++){
			if(i==self.nailcachearray[o]){
				repeat=true;
				break;
			};
		};
		if(!repeat){
			self.nailcachearray.push(i);
			self.nailcachearray.sort(function(a, b){
				return a - b;
			});
			if(self.nailcachearray.length>self.maxpagecache){
				if(Math.abs(self.nailcachearray[0]-i)<Math.abs(self.nailcachearray[self.nailcachearray.length-1]-i)){
					var deli=self.nailcachearray.pop()
				}else{
					var deli=self.nailcachearray.shift();
				};
				$(self.nailimg).eq(deli).find('canvas.pdfcav').remove();
			};
		};
	};

	self.pdfgetpage=function(ele,page){
	    var viewport = page.getViewport(1);
	    self.filerw=viewport.width;
	    self.filerh=viewport.height;
	    var scale=self.filesize/viewport.width;
	    viewport = page.getViewport(scale);
	    ele.find('canvas.pdfcav').remove();
		var canvas='<canvas class="pdfcav"></canvas>';
		ele.append(canvas);
	    var canvas = ele.find('canvas')[0];
	    var context = canvas.getContext('2d');
	    canvas.width = viewport.width;
	    canvas.height = viewport.height;
	    var renderContext = {
	      canvasContext: context,
	      viewport: viewport
	    };
	    page.render(renderContext);
	};
	
	self.validateFileURL=function() {
	  try {
	    var viewerOrigin = new URL(window.location.href).origin || 'null';
	    if (self.HOSTED_VIEWER_ORIGINS.indexOf(viewerOrigin) >= 0) {
	      // Hosted or local viewer, allow for any file locations
	      return;
	    }
	    var fileOrigin = new URL(self.fileurl, window.location.href).origin;
	    // Removing of the following line will not guarantee that the viewer will
	    // start accepting URLs from foreign origin -- CORS headers on the remote
	    // server must be properly configured.
	    if (fileOrigin !== viewerOrigin) {
	      throw new Error('file origin does not match viewer\'s');
	    }
	  } catch (e) {
	    var message = e && e.message;
	    var loadingErrorMessage = mozL10n.get('loading_error', null,
	      'An error occurred while loading the PDF.');
	
	    var moreInfo = {
	      message: message
	    };
	    PDFViewerApplication.error(loadingErrorMessage, moreInfo);
	    throw e;
	  }
	};
	
	self.fileloadpc=function(){
		$(self.filemain).find('.pdf_viewbox').remove();
		var boxcon='<div class="pdf_viewbox pc viewer'+self.pdfid+'"></div>';
		$(self.filemain).append(boxcon);
		self.filecon='.pdf_viewbox.viewer'+self.pdfid;
		if(self.nailmain){
			var boxcon='<div class="pdf_nailbox pc viewer'+self.pdfid+'"></div>';
			$(self.nailmain).append(boxcon);
			self.nailcon='.pdf_nailbox.viewer'+self.pdfid;
		};
	    self.pdffile.then(function(pdf) {
	    	self.pdf=pdf;
	    	var failnum=1;
	    	function pagearraycall(){
				if(self.nailmain){
					self.nailimg=self.nailcon+'>a';
					jy_scrollpos({
						box:self.nailcon,
						con:self.nailimg,
						addtop:self.addtop+$(self.filemain).offset().top
					},function(num){
						if(num>1){
							self.pdfjsloadnail($(self.nailimg).eq(num-2),self.pagelist[num-2]);
						};
						self.pdfjsloadnail($(self.nailimg).eq(num-1),self.pagelist[num-1]);
						self.pdfjsloadnail($(self.nailimg).eq(num),self.pagelist[num]);
					});
					self.pcevent();
				};
	    		self.fileimg=self.filecon+'>a';
				jy_scrollpos({
					box:self.filecon,
					con:self.fileimg,
					addtop:self.addtop+$(self.filemain).offset().top
				},function(num){
					self.pagen=num;
					self.pdfjsload($(self.fileimg).eq(self.pagen-1),self.pagelist[self.pagen-1]);
					self.change(num);
					if(self.nailmain){
						if(self.nailscrollsure){
							var h=$(self.nailcon).scrollTop();
							if(num>1){
								$(self.nailcon).stop(false,false).animate({scrollTop:$(self.nailimg).eq(num-2).offset().top+h},300);
							}else{
								$(self.nailcon).stop(false,false).animate({scrollTop:0},300);
							};
						};
					};
				});
				self.complete(self);
	    	};
	    	pagearrayfun(function(){pagearraycall();});
	    	function pagearrayfun(callback){
		    	self.pdf.getPage(failnum).then(function(page) {
				    var viewport = page.getViewport(1);
				    var scale=self.filesize/viewport.width;
				    viewport = page.getViewport(scale);
					var filecon='<a class="new" num="'+failnum+'"><span></span></a>';
					$(self.filecon).append(filecon);
					var wh=viewport.width/viewport.height;
					$(self.filecon+'>a.new').css({'width':$(self.filecon+' a.new').width(),'height':$(self.filecon+' a.new').width()/wh+'px'});
					$(self.filecon+'>a.new').removeClass('new');
					if(self.nailmain){
						$(self.nailcon).append(filecon);
						var wh=viewport.width/viewport.height;
						$(self.nailcon+'>a.new').css({'width':$(self.nailcon+' a.new').width(),'height':$(self.nailcon+' a.new').width()/wh+'px'});
						$(self.nailcon+'>a.new').removeClass('new');
					};
				    self.pagelist.push(page);
				    if(failnum<self.pdf.numPages){
				    	failnum++;
				    	pagearrayfun(function(){pagearraycall();});
				    }else{
				    	callback();
				    };
		    	});
	    	};
	    });
	};
	
	self.fileloadpe=function(){
		$(self.filemain).find('.pdf_viewbox').remove();
		var boxcon='<div class="pdf_viewbox pe viewer'+self.pdfid+'"></div>';
		$(self.filemain).append(boxcon);
		self.filecon='.pdf_viewbox.viewer'+self.pdfid;
	    self.pdffile.then(function(pdf) {
	    	self.pdf=pdf;
	    	var failnum=1;
	    	function pagearraycall(){
	    		self.fileimg=self.filecon+'>.pdf_part';
	    		self.pagen=self.pdf.numPages;
				self.peevent();
				self.pdfjsload($(self.fileimg).eq(self.pagen-1).find('a'),self.pagelist[self.pagen-1]);
				setTimeout(function(){
					self.pdfjsload($(self.fileimg).eq(self.pagen-2).find('a'),self.pagelist[self.pagen-2]);
				},200);
				self.complete(self);
				self.change(self.pdf.numPages-self.pagen+1);
	    	};
	    	pagearrayfun(function(){pagearraycall();});
	    	function pagearrayfun(callback){
		    	self.pdf.getPage(failnum).then(function(page) {
				    var viewport = page.getViewport(1);
				    var scale=self.filesize/viewport.width;
				    viewport = page.getViewport(scale);
				    var filecon='<div class="pdf_part cube"><a class="new" num="'+failnum+'"></a></div>';
					$(self.filecon).prepend(filecon);
					var wh=viewport.width/viewport.height;
					$(self.filecon+'>a.new').css({'width':$(self.filecon+' a.new').width(),'height':$(self.filecon+' a.new').width()/wh+'px'});
					$(self.filecon+'>a.new').removeClass('new');
		    		self.pagelist.push(page);
				    if(failnum<self.pdf.numPages){
				    	failnum++;
				    	pagearrayfun(function(){pagearraycall();});
				    }else{
				    	callback();
				    };
		    	});
	    	};
	    });
	};
	
	self.pcevent=function(){
		$(document).on('click',self.nailcon+'>a',function(){
			self.pageto($(this).attr('num'));
			var h=$(self.nailcon).scrollTop();
			if($(this).attr('num')>1){
				$(self.nailcon).stop(false,false).animate({scrollTop:$(this).prev().offset().top+h},300);
			};
		});
	};
	
	self.peevent=function(){
		$(document).on('touchstart',self.filecon+'>.pdf_part',function(e){
			self.scrollsure=false;
			self.pagemy=self.drawmt(e).y;
			self.pagery=0;
			self.paget=new Date().getTime();
			$(self.filecon+'>.pdf_part').eq(self.pagen-1).addClass('none');
			$(self.filecon+'>.pdf_part').eq(self.pagen).addClass('none');
		});
		$(document).on('touchmove',self.filecon+'>.pdf_part',function(e){
				self.pagery=self.drawmt(e).y-self.pagemy;
				if($(this).scrollTop()+$(this).height()==$(this)[0].scrollHeight&&self.pagery<0){
					e.preventDefault();
					//上划
					if($(self.filecon+'>.pdf_part').eq(self.pagen-1).position().top<=0&&self.pagery<0&&self.pagen>1){
						$(self.filecon+'>.pdf_part').eq(self.pagen-1).css({'top':0+self.pagery+'px'});
						self.scrollsure=true;
					};
				};
				if($(this).scrollTop()==0&&self.pagery>0){
					e.preventDefault();
					//下划
					if($(self.filecon+'>.pdf_part').eq(self.pagen-1).position().top>=0&&self.pagery>0&&self.pagen<self.pdf.numPages){
						$(self.filecon+'>.pdf_part').eq(self.pagen).css({'top':-$(self.filecon).height()+self.pagery+'px'});
						self.scrollsure=true;
					};
				};
		});
		$(document).on('touchend',function(){
			$(self.filecon+'>.pdf_part').removeClass('none');
			$(self.filecon+'>.pdf_part').addClass('tran');
			setTimeout(function(){
				$(self.filecon+'>.pdf_part').removeClass('tran');
			},200);
			if(self.scrollsure){
				if(self.pagery<0){
					//上划
					if(new Date().getTime()-self.paget<500&&self.pagery<-20){
						if(self.pagen>1){
							$(self.filecon+'>.pdf_part').eq(self.pagen-1).css({'top':-$('.we_pdf').height()+'px'});
							self.pagen--;
							self.pdfjsload($(self.fileimg).eq(self.pagen-1).find('a'),self.pagelist[self.pagen-1]);
							setTimeout(function(){
								if(self.pagen>1){
									self.pdfjsload($(self.fileimg).eq(self.pagen-2).find('a'),self.pagelist[self.pagen-2]);
								};
							},200);
							self.change(self.pdf.numPages-self.pagen+1);
						};
					}else{
						if(-$(self.filecon+'>.pdf_part').eq(self.pagen-1).position().top<$(self.filecon).height()/2){
							$(self.filecon+'>.pdf_part').eq(self.pagen-1).css({'top':0+'px'});
						}else{
							$(self.filecon+'>.pdf_part').eq(self.pagen-1).css({'top':-$(self.filecon).height()+'px'});
							self.pagen--;
							self.pdfjsload($(self.fileimg).eq(self.pagen-1).find('a'),self.pagelist[self.pagen-1]);
							setTimeout(function(){
								if(self.pagen>1){
									self.pdfjsload($(self.fileimg).eq(self.pagen-2).find('a'),self.pagelist[self.pagen-2]);
								};
							},200);
							self.change(self.pdf.numPages-self.pagen+1);
						};
					};
				}else{
					//下划
					if(new Date().getTime()-self.paget<500&&self.pagery>20){
						if(self.pagen<self.pdf.numPages){
							$(self.filecon+'>.pdf_part').eq(self.pagen).css({'top':0+'px'});
							self.pagen++;
							self.pdfjsload($(self.fileimg).eq(self.pagen-1).find('a'),self.pagelist[self.pagen-1]);
							setTimeout(function(){
								if(self.pagen<self.pdf.numPages){
									self.pdfjsload($(self.fileimg).eq(self.pagen).find('a'),self.pagelist[self.pagen]);
								};
							},200);
							self.change(self.pdf.numPages-self.pagen+1);
						};
					}else{
						if(-$(self.filecon+'>.pdf_part').eq(self.pagen).position().top<$(self.filecon).height()/2){
							$(self.filecon+'>.pdf_part').eq(self.pagen).css({'top':0+'px'});
							self.pagen++;
							self.pdfjsload($(self.fileimg).eq(self.pagen-1).find('a'),self.pagelist[self.pagen-1]);
							setTimeout(function(){
								if(self.pagen<self.pdf.numPages){
									self.pdfjsload($(self.fileimg).eq(self.pagen).find('a'),self.pagelist[self.pagen]);
								};
							},200);
							self.change(self.pdf.numPages-self.pagen+1);
						}else{
							$(self.filecon+'>.pdf_part').eq(self.pagen).css({'top':-$(self.filecon).height()+'px'});
						};
					};
				};
			};
		});
	};
	
	self.prev=function(){
		if(self.ispc()){
			if(self.pagen>1){
				var h=$(self.filecon).scrollTop();
				$(self.filecon).stop(false,false).animate({scrollTop:$(self.fileimg).eq(self.pagen-2).offset().top+h},300);
			};
		}else{
			if(self.pagen<self.pdf.numPages){
				$(self.filecon+'>.pdf_part').eq(self.pagen).css({'top':0+'px'});
				self.pagen++;
				self.pdfjsload($(self.fileimg).eq(self.pagen-1).find('a'),self.pagelist[self.pagen-1]);
				setTimeout(function(){
					if(self.pagen<self.pdf.numPages){
						self.pdfjsload($(self.fileimg).eq(self.pagen).find('a'),self.pagelist[self.pagen]);
					};
				},200);
			};
		};
	};
	
	self.next=function(){
		if(self.ispc()){
			if(self.pagen<self.pdf.numPages){
				var h=$(self.filecon).scrollTop();
				$(self.filecon).stop(false,false).animate({scrollTop:$(self.fileimg).eq(self.pagen).offset().top+h},300);
			};
		}else{
			if(self.pagen>1){
				$(self.filecon+'>.pdf_part').eq(self.pagen-1).css({'top':-$(self.filecon).height()+'px'});
				self.pagen--;
				self.pdfjsload($(self.fileimg).eq(self.pagen-1).find('a'),self.pagelist[self.pagen-1]);
				setTimeout(function(){
					if(self.pagen>1){
						self.pdfjsload($(self.fileimg).eq(self.pagen-2).find('a'),self.pagelist[self.pagen-2]);
					};
				},200);
			};
		};
	};
	
	self.pageto=function(num){
		if(parseInt(num)){
			num=parseInt(num);
			if(num<1){
				num=1;
			};
			if(num>self.pdf.numPages){
				num=self.pdf.numPages
			};
			if(self.ispc()){
					self.nailscrollsure=false;
					var h=$(self.filecon).scrollTop();
					$(self.filecon).stop(false,false).animate({scrollTop:$(self.fileimg).eq(num-1).offset().top+h},300,function(){
						self.nailscrollsure=true;
					});
			}else{
				$(self.filecon+'>.pdf_part').removeClass('none');
				$(self.filecon+'>.pdf_part').addClass('tran');
				setTimeout(function(){
					$(self.filecon+'>.pdf_part').removeClass('tran');
				},200);
				var stop=self.pdf.numPages-num;
				var sum=self.pagen-1;
				if(stop<sum){
					for(var i=stop;i<sum;i++){
						$(self.filecon+'>.pdf_part').eq(i+1).css({'top':-$(self.filecon).height()+'px'});
						self.pagen--;
					};
					self.pdfjsload($(self.fileimg).eq(self.pagen-1).find('a'),self.pagelist[self.pagen-1]);
				};
				if(stop>sum){
					for(var i=stop;i>sum;i--){
						$(self.filecon+'>.pdf_part').eq(i).css({'top':0+'px'});
						self.pagen++;
					};
					self.pdfjsload($(self.fileimg).eq(self.pagen-1).find('a'),self.pagelist[self.pagen-1]);
				};
			};
		};
	};
	
	self.loadingbarshow=function(){
		var loadcon='<div class="pdf_loadingbar"><span>正在加载文件，请稍等......</span><i></i></div>';
		$(self.filemain).append(loadcon);
	};
	
	self.loadingbarhide=function(){
		$(self.filemain+' .pdf_loadingbar').remove();
	};
	
	self.loadingbar=function(level){
		var percent = Math.round(level * 100);
		$(self.filemain+' .pdf_loadingbar i').css({'left':percent+'%'});
		$(self.filemain+' .pdf_loadingbar span').text('正在加载文件：'+percent+'%');
		if(percent>=100){
			self.loadingbarhide();
		};
	};
	
	self.drawmt=function(event){
		var mouse = event || window.event;
		if(event.clientX!=undefined){
			var mouse = event || window.event;
			return{
				x:event.clientX,
				y:event.clientY
			};
		}else{
			var touch = event.originalEvent.targetTouches[0];
			return{
				x:touch.pageX,
				y:touch.pageY
			};
		};
	};
	
	self.ispc=function(){
		var pelist=['Android','iPhone','SymbianOS','Windows Phone','iPad','iPod'];
		var flag=true;
		for(var i=0;i<pelist.length;i++){
			if(navigator.userAgent.indexOf(pelist[i])>=0){
				flag=false;
				break;
			};
		};
		return flag;
	};
	
	self.selectsealpos=function(json){
		var s=self.selectsealpos.prototype;
		s.json=json;
		self.clearseal();
		s.sealsize=self.sealsize*$(self.filecon+'>a').width()/self.filesize;
		var sealcon=$('<img>');
		sealcon.attr('class','pdf_sealpos');
		sealcon.attr('src',self.sealimg);
		sealcon.css({'width':s.sealsize+'px','height':s.sealsize+'px'});
		//sealcon.css({'top':self.drawmt(json.ele).y-s.sealsize/2+'px','left':self.drawmt(json.ele).x-s.sealsize/2+'px'});
		$(self.filemain).append(sealcon);
		$(document).on('mousemove',self.filemain,s.pos);
		$(document).on('click',self.filemain,s.over);
	};
	self.selectsealpos.prototype.pos=function(e){
		var s=self.selectsealpos.prototype;
		s.x=self.drawmt(e).x;
		s.y=self.drawmt(e).y;
		$(self.filemain+' .pdf_sealpos').css({'top':s.y-s.sealsize/2+'px','left':s.x-s.sealsize/2+'px'});
	};
	self.selectsealpos.prototype.over=function(){
		var s=self.selectsealpos.prototype;
		var p=self.pagen;
		//最外框距离
		var mx=$(self.filemain)[0].getBoundingClientRect().left;
		var my=$(self.filemain)[0].getBoundingClientRect().top;
		//鼠标位置
		var x=s.x-mx+$(self.filecon).scrollLeft();
		var y=s.y-my+$(self.filecon).scrollTop();
		//当前页上下距离
		var yt=$(self.filecon+'>a').eq(p-1).offset().top-$(self.filemain).offset().top+$(self.filecon).scrollTop();
		var yb=yt+$(self.filecon+'>a').eq(p-1).height();
		//当前页宽高
		var pagew=$(self.filecon+'>a').eq(p-1).width();
		var pageh=$(self.filecon+'>a').eq(p-1).height();
		//真实位置
		var rp=p;
		var rx=x;
		var ry=y-yt;
		if(y<yt){//点到了上一页
			rp=p-1;
			ry=y-($(self.filecon+'>a').eq(p-2).offset().top-$(self.filemain).offset().top+$(self.filecon).scrollTop());
		};
		if(y>yb){//点到了下一页
			rp=p+1;
			ry=y-($(self.filecon+'>a').eq(p).offset().top-$(self.filemain).offset().top+$(self.filecon).scrollTop());
		};
		rx=rx-($(self.filemain).width()-pagew)/2;
		
		$(document).off('mousemove',self.filemain,s.pos);
		$(document).off('click',self.filemain,s.over);
		$(self.filemain+' .pdf_sealpos').insertAfter($(self.filecon+'>a').eq(rp-1).children().eq(-1));
		$(self.filemain+' .pdf_sealpos').addClass('active');
		$(self.filemain+' .pdf_sealpos').css({'top':ry-s.sealsize/2+'px','left':rx-s.sealsize/2+'px'});
		if(s.json.percent==false){
			s.json.over(rp,rx/pagew*self.filerw,ry/pageh*self.filerh);
		}else{
			s.json.over(rp,rx/pagew,ry/pageh);
		};
	};
	self.clearseal=function(){
		var s=self.selectsealpos.prototype;
		$(self.filemain+' .pdf_sealpos').remove();
		$(document).off('mousemove',self.filemain,s.pos);
		$(document).off('click',self.filemain,s.over);
	};
	
	self.initialize();
};
/*-----pdfjs函数结束-----*/
/*-----
滚动位置
jy_scrollpos({
	box:'',
	con:'',
	addtop:200
},function(num){
	//
});
-----*/
function jy_scrollpos(json,callback){
	if ( !(this instanceof jy_scrollpos) ){
		return new jy_scrollpos(json,callback);
	};
	var self=this;
	self.otop=0;
	self.num=1;
	self.num2=1;
	self.addtop=0;
	self.addtop2=null;
	self.oldnum=0;
	self.initialize=function(){
		self.box=json.box;
		self.con=json.con;
		if($(self.box)[0].scrollHeight==undefined){
			self.bodybox='body';
		}else{
			self.bodybox=self.box;
		};
		if(typeof(json.addtop)!='undefined'){
			self.addtop=json.addtop;
		};
		if(typeof(json.addtop)!='undefined'){
			self.addtop2=$(self.box).height()-json.addbottom;
		};
		self.toparray=[];
		self.toparray2=[];
		self.creatcon();
		self.otop=$(self.box).scrollTop();
		self.scrollmove();
		$(self.box).scroll(function(){
			self.scrollmove();
		});
	};
	self.resize=function(){
		self.toparray=[];
		self.toparray2=[];
		self.creatcon();
		self.scrollmove();
	};
	self.creatcon=function(){
		$(self.con).each(function(){
			self.toparray.push($(this)[0].getBoundingClientRect().top-$(self.bodybox)[0].offsetTop+$(self.box).scrollTop()-self.addtop);
			self.toparray2.push($(this)[0].getBoundingClientRect().top-$(self.bodybox)[0].offsetTop+$(self.box).scrollTop()-self.addtop2);
		});
		self.realh=$(self.bodybox)[0].scrollHeight;
	};
	self.scrollmove=function(){
		if($(self.bodybox)[0].scrollHeight==self.realh){
			if($(self.box).scrollTop()>=self.otop){
				for(var i=self.num;i<self.toparray.length;i++){
					if($(self.box).scrollTop()<=self.toparray[i]){
						break;
					}else{
						self.num++;
					};
				};
				for(var i=self.num2;i<self.toparray2.length;i++){
					if($(self.box).scrollTop()<=self.toparray2[i]){
						break;
					}else{
						self.num2++;
					};
				};
			}else{
				for(var i=self.num;i>0;i--){
					if($(self.box).scrollTop()>=self.toparray[i-1]){
						break;
					}else{
						self.num--;
					};
				};
				for(var i=self.num2;i>0;i--){
					if($(self.box).scrollTop()>=self.toparray2[i-1]){
						break;
					}else{
						self.num2--;
					};
				};
			};
			self.otop=$(self.box).scrollTop();
			if(self.num<1){
				self.num=1;
			};
			if(self.num2<1){
				self.num2=1;
			};
			if(self.addtop2){
				if(self.num!=self.oldnum||self.num2!=self.oldnum2){
					callback(self.num,self.num2);
					self.oldnum2=self.num2;
				};
			}else{
				if(self.num!=self.oldnum){
					callback(self.num);
					self.oldnum=self.num;
				};
			};
		}else{
			self.resize();
		};
	};
	self.initialize();
};
/*-----滚动位置结束-----*/
