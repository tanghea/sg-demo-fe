//V1-3
//alert|随机数|下拉菜单|切屏|复选|弹窗|终端|
jyplugin={
	//确认
	alert:function(a,callback,b){
		if ( !(this instanceof jyplugin.alert) ){
			return new jyplugin.alert(a,callback,b);
		};
		var self=this;
		self.popnum='';
		self.hinttext='';
		self.suretext='确定';
		self.ccheck=true;
		self.callback=callback;
		self.close=function(){
			$('.jy_popupbox.alert[num='+self.popnum+']').fadeOut(100,function(){
				$('.jy_popupbox.alert[num='+self.popnum+']').remove();
			});
		};
		self.sure=function(){
			if(self.ccheck){
				self.ccheck=false;
				self.close();
				try{self.callback();}catch(e){};
			}
		};
		self.init=function(a,b){
			self.popnum=parseInt(Math.random()*1000000);
			$('.jy_popupbox.alert[num='+self.popnum+']').remove();
			if(typeof(a)!='undefined'){
				self.hinttext=a;
			};
			if(typeof(b)!='undefined'){
				self.suretext=b;
			};
			var boxcon='<div class="jy_popupbox alert" num="'+self.popnum+'"><div class="jy_popupbg"></div><div class="jy_popup"><div class="jy_popupcon">'+self.hinttext+'</div><div class="jy_popupbtn"><button class="jy_btn min import sure">'+self.suretext+'</button></div></div></div>';
			if($('.jy_popupbox.alert').length==0){
				$('body').append(boxcon);
			}else{
				$('.jy_popupbox.alert').eq(0).before(boxcon);
			};
			$('.jy_popupbox.alert[num='+self.popnum+']').fadeIn(100);
			$('.jy_popupbox.alert[num='+self.popnum+'] .sure').focus();
			$(document).on('click','.jy_popupbox.alert[num='+self.popnum+'] .sure',function(){
				self.sure();
			});
			$(document).on('keypress',function(e){
				if(e.which == 13){
					if(self.popnum==$('.jy_popupbox').eq(-1).attr('num')){
						self.sure();
					};
				};
			});
		};
		self.init(a,b);
	},
	//确认取消
	confirm:function(a,callback,b,c){
		if ( !(this instanceof jyplugin.confirm) ){
			return new jyplugin.confirm(a,callback,b,c);
		};
		var self=this;
		self.popnum='';
		self.hinttext='';
		self.suretext='确定';
		self.canceltext='取消';
		self.ccheck=true;
		self.callback=callback;
		self.close=function(){
			$('.jy_popupbox.confirm[num='+self.popnum+']').fadeOut(100,function(){
				$('.jy_popupbox.confirm[num='+self.popnum+']').remove();
			});
		};
		self.cancel=function(){
			if(self.ccheck){
				self.ccheck=false;
				self.close();
				try{self.callback(false);}catch(e){};
			}
		};
		self.sure=function(){
			if(self.ccheck){
				self.ccheck=false;
				self.close();
				try{self.callback(true);}catch(e){};
			}
		};
		self.init=function(a,b,c){
			self.popnum=parseInt(Math.random()*1000000);
			$('.jy_popupbox.confirm[num='+self.popnum+']').remove();
			if(typeof(a)!='undefined'){
				self.hinttext=a;
			};
			if(typeof(b)!='undefined'){
				self.suretext=b;
			};
			if(typeof(c)!='undefined'){
				self.canceltext=c;
			};
			var boxcon='<div class="jy_popupbox confirm" num="'+self.popnum+'"><div class="jy_popupbg"></div><div class="jy_popup"><div class="jy_popupcon">'+self.hinttext+'</div><div class="jy_popupbtn"><button class="jy_btn min import sure">'+self.suretext+'</button><button class="jy_btn min tran cancel">'+self.canceltext+'</button></div></div></div>';
			if($('.jy_popupbox.confirm').length==0){
				$('body').append(boxcon);
			}else{
				$('.jy_popupbox.confirm').eq(0).before(boxcon);
			};
			$('.jy_popupbox.confirm[num='+self.popnum+']').fadeIn(100);
			$('.jy_popupbox.confirm[num='+self.popnum+'] .sure').focus();
			$(document).on('click','.jy_popupbox.confirm[num='+self.popnum+'] .cancel',function(){
				self.cancel();
			});
			$(document).on('click','.jy_popupbox.confirm[num='+self.popnum+'] .sure',function(){
				self.sure();
			});
			$(document).on('keypress',function(e){
				if(e.which == 13){
					if(self.popnum==$('.jy_popupbox').eq(-1).attr('num')){
						self.sure();
					};
				};
			});
		};
		self.init(a,b,c);
	},
	//填写确认
	prompt:function(callback,a,b,c,d){
		if ( !(this instanceof jyplugin.prompt) ){
			return new jyplugin.prompt(callback,a,b,c,d);
		};
		var self=this;
		self.popnum='';
		self.hinttext='输入信息';
		self.texttext='';
		self.suretext='确定';
		self.canceltext='取消';
		self.ccheck=true;
		self.callback=callback;
		self.close=function(){
			$('.jy_popupbox.prompt[num='+self.popnum+']').fadeOut(100,function(){
				$('.jy_popupbox.prompt[num='+self.popnum+']').remove();
			});
		};
		self.cancel=function(){
			if(self.ccheck){
				self.ccheck=false;
				self.close();
				try{self.callback(false,self.texttext);}catch(e){};
			}
		};
		self.sure=function(){
			if(self.ccheck){
				self.ccheck=false;
				self.close();
				try{self.callback(true,$('.jy_popupbox.prompt[num='+self.popnum+'] textarea').val());}catch(e){};
			}
		};
		self.init=function(a,b,c,d){
			self.popnum=parseInt(Math.random()*1000000);
			$('.jy_popupbox.prompt[num='+self.popnum+']').remove();
			if(typeof(a)!='undefined'){
				self.hinttext=a;
			};
			if(typeof(b)!='undefined'){
				self.texttext=b;
			};
			if(typeof(c)!='undefined'){
				self.suretext=c;
			};
			if(typeof(d)!='undefined'){
				self.canceltext=d;
			};
			var boxcon='<div class="jy_popupbox prompt" num="'+self.popnum+'"><div class="jy_popupbg"></div><div class="jy_popup"><div class="jy_popuptitle">'+self.hinttext+'</div><div class="jy_popupcon"><textarea class="jy_text text">'+self.texttext+'</textarea></div><div class="jy_popupbtn"><button class="jy_btn min import sure">'+self.suretext+'</button><button class="jy_btn min tran cancel">'+self.canceltext+'</button></div></div></div>';
			if($('.jy_popupbox.prompt').length==0){
				$('body').append(boxcon);
			}else{
				$('.jy_popupbox.prompt').eq(0).before(boxcon);
			};
			$('.jy_popupbox.prompt[num='+self.popnum+']').fadeIn(100);
			$('.jy_popupbox.prompt[num='+self.popnum+'] textarea').focus();
			$(document).on('click','.jy_popupbox.prompt[num='+self.popnum+'] .cancel',function(){
				self.cancel();
			});
			$(document).on('click','.jy_popupbox.prompt[num='+self.popnum+'] .sure',function(){
				self.sure();
			});
			$(document).on('keypress','.jy_popupbox.prompt textarea',function(e){
				if(e.which == 13){
					if(self.popnum==$('.jy_popupbox').eq(-1).attr('num')){
						self.sure();
					};
				};
			});
		};
		self.init(a,b,c,d);
	},
	//密码
	cipher:function(callback,a,b,c){
		if ( !(this instanceof jyplugin.cipher) ){
			return new jyplugin.cipher(callback,a,b,c);
		};
		var self=this;
		self.popnum='';
		self.hinttext='输入密码';
		self.suretext='确定';
		self.canceltext='取消';
		self.ccheck=true;
		self.callback=callback;
		self.close=function(){
			$('.jy_popupbox.cipher[num='+self.popnum+']').fadeOut(100,function(){
				$('.jy_popupbox.cipher[num='+self.popnum+']').remove();
			});
		};
		self.cancel=function(){
			if(self.ccheck){
				self.ccheck=false;
				self.close();
				try{self.callback(false,'');}catch(e){};
			}
		};
		self.sure=function(){
			if(self.ccheck){
				self.ccheck=false;
				self.close();
				try{self.callback(true,$('.jy_popupbox.cipher[num='+self.popnum+'] input').val());}catch(e){};
			}
		};
		self.init=function(a,b,c){
			self.popnum=parseInt(Math.random()*1000000);
			$('.jy_popupbox.cipher[num='+self.popnum+']').remove();
			if(typeof(a)!='undefined'){
				self.hinttext=a;
			};
			if(typeof(b)!='undefined'){
				self.suretext=b;
			};
			if(typeof(c)!='undefined'){
				self.canceltext=c;
			};
			var boxcon='<div class="jy_popupbox cipher" num="'+self.popnum+'"><div class="jy_popupbg"></div><div class="jy_popup"><div class="jy_popuptitle">'+self.hinttext+'</div><div class="jy_popupcon"><input class="jy_text" type="password"></div><div class="jy_popupbtn"><button class="jy_btn min import sure">'+self.suretext+'</button><button class="jy_btn min tran cancel">'+self.canceltext+'</button></div></div></div>';
			if($('.jy_popupbox.cipher').length==0){
				$('body').append(boxcon);
			}else{
				$('.jy_popupbox.cipher').eq(0).before(boxcon);
			};
			$('.jy_popupbox.cipher[num='+self.popnum+']').fadeIn(100);
			$('.jy_popupbox.cipher[num='+self.popnum+'] input').focus();
			$(document).on('click','.jy_popupbox.cipher[num='+self.popnum+'] .cancel',function(){
				self.cancel();
			});
			$(document).on('click','.jy_popupbox.cipher[num='+self.popnum+'] .sure',function(){
				self.sure();
			});
			$(document).on('keypress','.jy_popupbox.cipher[num='+self.popnum+'] input',function(e){
				if(e.which == 13){
					if(self.popnum==$('.jy_popupbox').eq(-1).attr('num')){
						self.sure();
					};
				};
			});
		};
		self.init(a,b,c);
	},
	//加载中
	loading:function(ele){
		if ( !(this instanceof jyplugin.loading) ){
			return new jyplugin.loading(ele);
		};
		var self=this;
		self.ele=ele||'body';
		self.text='正在加载。。'
		self.close=function(){
			$('.jy_loadingbg.app').remove();
		};
		self.show=function(text){
			if(typeof(text)!='undefined'){
				self.text=text;
			};
			$(self.ele).append(self.con1+self.text+self.con2);
		};
		self.init=function(){
			self.con1='<div class="jy_loadingbg app"><div class="jy_loading"><div class="jy_loading1 sk-child"></div><div class="jy_loading2 sk-child"></div><div class="jy_loading3 sk-child"></div><div class="jy_loading4 sk-child"></div><div class="jy_loading5 sk-child"></div><div class="jy_loading6 sk-child"></div><div class="jy_loading7 sk-child"></div><div class="jy_loading8 sk-child"></div><div class="jy_loading9 sk-child"></div><div class="jy_loading10 sk-child"></div><div class="jy_loading11 sk-child"></div><div class="jy_loading12 sk-child"></div></div><div class="loadingtext">';
			self.con2='</div></div>';
		};
		self.init();
	},
	//随机数
	random:function(a){
		var num='';
		for(var i=1;i<=a;i++){
			var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			//var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
			var o = Math.floor(Math.random()*16);
			num+=chars[o];
		};
		return num;
	},
	//复选
	check:function(json){
		if ( !(this instanceof jyplugin.check) ){
			return new jyplugin.check(json);
		};
		var s=this;
		s.checkone='input[type=checkbox][name='+json.checkname+']';
		s.checkall='input[type=checkbox][name='+json.checkname+'all]';
		s.allon=function(){
			$(s.checkall).prop('checked',true);
		};
		s.alloff=function(){
			$(s.checkall).prop('checked',false);
		};
		s.oneon=function(){
			$(s.checkone).prop('checked',true);
		};
		s.oneoff=function(){
			$(s.checkone).prop('checked',false);
		};
		s.backsure=function(){
			if($(s.checkone+':checked').length==0){
				try{json.allofffn();}catch(e){};
			}else{
				try{json.oneonfn();}catch(e){};
			};
		};
		s.init=function(){
			s.eventfn();
		};
		s.eventfn=function(){
			$(document).on('click',s.checkone,function(){
				s.length=$(s.checkone).length;
				if($(s.checkone+':checked').length==s.length){
					s.allon();
				}else{
					s.alloff();
				};
				s.backsure();
			});
			$(document).on('click',s.checkall,function(){
				if($(this).prop('checked')){
					s.oneon();
				}else{
					s.oneoff();
				};
				s.backsure();
			});
		};
		s.init();
	},
	//下拉选择
	select:function(ele){
		if ( !(this instanceof jyplugin.select) ){
			return new jyplugin.select(ele);
		};
		var s=this;
		s.ele=ele;
		s.addtd=function(ele,i){
			ele.children('dt').remove();
			ele.prepend('<dt>'+ele.children('dd').eq(i).html()+'</dt>');
		};
		s.eventfn=function(){
			$(document).on('click',s.ele+'>dt',function(e){
				e=e||window.event;
            	e.stopPropagation();
				if($(this).closest('dl').attr('class').indexOf('show')>=0){
					$(this).closest('dl').removeClass('show');
				}else{
            		$('dl.jy_select').removeClass('show');
					$(this).closest('dl').addClass('show');
				};
			});
			$(document).on('click',s.ele+'>dd',function(){
				$(this).closest('dl').attr('num',$(this).closest('dl').children('dd').index(this));
				s.addtd($(this).closest('dl'),$(this).closest('dl').children('dd').index(this));
				$(this).closest('dl').removeClass('show');
			});
			$(document).on('click',function(){
				$(s.ele).removeClass('show');
			});
		};
		s.init=function(){
			$(s.ele).each(function(){
				s.addtd($(this),0);
			});
			s.eventfn();
		};
		s.init();
	},
	//弹窗
	popup:function(ele){
		if ( !(this instanceof jyplugin.popup) ){
			return new jyplugin.popup(ele);
		};
		var s=this;
		s.show=function(){
			$(s.ele).children('.jy_popupbg').remove();
			$(s.ele).prepend('<div class="jy_popupbg"></div>');
			$(s.ele).fadeIn(200);
		};
		s.hide=function(){
			$(s.ele).fadeOut(300);
		};
		s.close=function(){
			$(s.ele).fadeOut(300,function(){
				$(s.ele).remove();
			});
		};
		s.init=function(){
			s.ele=ele;
		};
		s.init();
	},
	//切屏
	screen: function(json){
		if ( !(this instanceof jyplugin.screen) ){
			return new jyplugin.screen(json);
		};
		var s=this;
		s.pagenum=1;
		s.winflag=null;
		s.count=-1;
		s.pagebox='.jy_screen';
		s.page=s.pagebox+' .jy_page';
		s.wheeltime=function(){
			if(s.count==0)
			{clearInterval(s.winflag);s.count=-1}
			else{s.count--};
		};
		s.wheelup=function(callback){
			if(s.pagenum>1){
				if(s.count==-1){
					s.pagenum--;
					var i=s.pagenum-1;
					$(s.pagebox).css({'top':'-'+i+'00%'});
					s.count=0;
					s.winflag=setInterval(function(){s.wheeltime()}, 500);
					try{callback();}catch(e){};
				};
			};
		};
		s.wheeldown=function(callback){
			if(s.pagenum<$(s.page).length){
				if(s.count==-1){
					s.pagenum++;
					var i=s.pagenum-1;
					$(s.pagebox).css({'top':'-'+i+'00%'});
					s.count=0;
					s.winflag=setInterval(function(){s.wheeltime()}, 500);
					try{callback();}catch(e){};
				};
			};
		};
		s.wheelto=function(i,callback){
			if(s.count==-1){
				s.pagenum=i+1;
				$(s.pagebox).css({'top':'-'+i+'00%'});
				s.count=0;
				s.winflag=setInterval(function(){s.wheeltime()}, 500);
				try{callback();}catch(e){};
				try{json.change(false,s.pagenum);}catch(e){};
			};
		};
		s.scrolldms=function(e,callback1,callback2){
			e = e || window.event;
			//Firefox滑轮事件  
			if (e.originalEvent.detail< 0) { //当滑轮向上滚动时  
				s.wheelup(function(){try{callback1();}catch(e){};});
			}  
			if (e.originalEvent.detail> 0) { //当滑轮向下滚动时  
				s.wheeldown(function(){try{callback2();}catch(e){};});
			}  
		};
		s.scrollmw=function(callback1,callback2){
			var e = window.event;
			//判断浏览器IE，谷歌滑轮事件
			if (e.wheelDelta > 0) { //当滑轮向上滚动时
				s.wheelup(function(){try{callback1();}catch(e){};});
			}  
			if (e.wheelDelta < 0) { //当滑轮向下滚动时  
				s.wheeldown(function(){try{callback2();}catch(e){};});
			}  
		};
		s.eventfn=function(){
			$(document).on({
				DOMMouseScroll : function(e){
					s.scrolldms(e,function(){try{json.change(true,s.pagenum);}catch(e){}},function(){try{json.change(false,s.pagenum);}catch(e){}});
				},
				mousewheel : function(){
					s.scrollmw(function(){try{json.change(true,s.pagenum);}catch(e){}},function(){try{json.change(false,s.pagenum);}catch(e){}});
				}
			},s.page,false);
		};
		s.init=function(){
			$(s.pagebox).css({'top':'0%'});
			var pagenum=s.pagenum;
			$(s.page).each(function(){
				$(this).attr('num',pagenum);
				pagenum++;
			});
			s.eventfn();
		};
		s.init();
	},
	//终端
	ispc:function(){
		var pelist=['Android','iPhone','SymbianOS','Windows Phone','iPad','iPod'];
		var flag=true;
		for(var i=0;i<pelist.length;i++){
			if(navigator.userAgent.indexOf(pelist[i])>=0){
				flag=false;
				break;
			};
		};
		return flag;
	},
	/*----------
	瀑布流
	初始化
	initialize({'failw':'内容宽度','addtype':'加载方式','addtag':'标签','addid':'加载对象'});
	加载
	append({'con':'对象内容','data':'对象data'});
	清空
	remove();
	窗口
	resize();
	----------*/
	waterfall: function(json){
		if ( !(this instanceof jyplugin.waterfall) ){
			return new jyplugin.waterfall(json);
		};
		var s=this;
		s.waterfailbox = '.jy_waterfailbox';
		s.waterfail = '.jy_waterfailbox .jy_waterfail';
		s.col = null;
		s.failw = 250;
		if(typeof(json)!='undefined'&&typeof(json.failw)!='undefined'){
			s.failw=json.failw;
		};
		s.addtype = 'append';
		if(typeof(json)!='undefined'&&typeof(json.addtype)!='undefined'){
			s.addtype=json.addtype;
		};
		s.addtag = 'div';
		if(typeof(json)!='undefined'&&typeof(json.addtag)!='undefined'){
			s.addtag=json.addtag;
		};
		s.addid = null;
		if(typeof(json)!='undefined'&&typeof(json.addid)!='undefined'){
			s.addid=json.addid;
		};
		s.dataname = null;
		s.waterfailcon = [];
		s.waterfaildata = [];
		s.waterfailnum=function(){
			var num=parseInt($(s.waterfailbox).width()/s.failw);
			if(num<1){num=1};
			return num;
		};
		s.remove=function(){
			s.waterfailcon=[];
			s.waterfaildata=[];
			s.addbox();
		};
		s.append=function(json,callback){
			var addnum=0;
			if(typeof(json)!='undefined'&&typeof(json.dataname)!='undefined'){
				s.dataname=json.dataname;
			};
			for(var i=0;i<s.col;i++){
				if($(s.waterfail).eq(addnum).height()>$(s.waterfail).eq(i).height()){
					addnum=i;
				};
			};
			$(s.waterfail).eq(addnum).append(json.con);
			$(s.waterfail).eq(addnum).children().eq(-1).data(s.dataname,json.data);
			s.waterfailcon.push(json.con);
			if(typeof(json)!='undefined'&&typeof(json.data)!='undefined'){
				s.waterfaildata.push(json.data);
			};
			try{callback();}catch(e){};
		};
		s.resize=function(callback){
			if(s.col!=s.waterfailnum()){
				s.col=s.waterfailnum();
				s.addbox();
				if(s.waterfailcon.length!=0){
					for(var i=0;i<s.waterfailcon.length;i++){
						var addnum=0;
						for(var o=0;o<s.col;o++){
							if($(s.waterfail).eq(addnum).height()>$(s.waterfail).eq(o).height()){
								addnum=o;
							};
						};
						$(s.waterfail).eq(addnum).append(s.waterfailcon[i]);
						$(s.waterfail).eq(addnum).children().eq(-1).data(s.dataname,s.waterfaildata[i]);
					};
				};
			};
			try{callback();}catch(e){};
		};
		s.addbox=function(){
			$(s.waterfail).remove();
			for(var i=0;i<s.col;i++){
				var waterfailcon='<'+s.addtag+' class="jy_waterfail" style=" width: '+(100/s.col)+'%"></'+s.addtag+'>';
				switch(s.addtype){
					case 'append' :
						$(s.waterfailbox).append(waterfailcon);
					break;
					case 'before' :
						$(s.addid).before(waterfailcon);
					break;
					default :
						$(s.waterfailbox).append(waterfailcon);
					break;
				}
			};
		};
		s.eventfn=function(){
		};
		s.init=function(){
			s.col=s.waterfailnum();
			s.addbox();
			s.eventfn();
		};
		s.init();
	}
};
$(function(){
	jyplugin.select('dl.jy_select');
});
