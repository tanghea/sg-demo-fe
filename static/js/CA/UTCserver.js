/*
	版本号V4~10
	该接口库负责中间件主体功能和通用接口功能
	可调用接口：
		初始化
		获取钥匙信息
		获取证书信息
		获取文件路径
		删除文件
		检测钥匙Pin码
		数字签名
		数据加密
		电子签章
		读取身份证
	示例：
		UTCserver.Initialize({
			path:'file/优泰签章.exe',
			evaluate:'js/UTCserve_evaluate.js',
			success:function(version){},
			fail:function(message){}
		});
	版本命名规范：V版本-版本分支~版本号
	用户选择界面
	self.notdn('',function(state,dn){
		if(state=='success'){};
		self.errorcallback(json,state,dn);
	});
	self.notpath('',function(state,path){
		if(state=='success'){};
		self.errorcallback(json,state,path);
	});
*/
function UTCserver_Function(){
	var self=this;
	self.versionnum='1.1.0.0';
	self.loadingflag=null;
	self.usekey=false;
	self.vnum=null;
	self.initsure=true;
	self.errorstate={
		//通用
		x000000:'中间件运行异常，请运行桌面上的中间件恢复进行',
		x000001:'中间件不是最新版本，请安装最新版本的中间件',
		x000003:'参数错误',
		x000004:'处理请求超时',
		x000005:'服务器连接失败',
		x000006:'身份证组件加载失败，请重新安装'
	};
	self.init=function(){
		var browser=navigator.userAgent;
		var version=browser.split(' ');
		function typearray(ele){
			var type=false;
			var num;
			for(var i=0;i<version.length;i++){
				var str=version[i];
				if(RegExp(ele).test(str)){
					type=true;
					num=i;
				};
			};
			return{
				type:type,
				num:num
			};
		};
		if(typearray('MSIE').type){
			var num=typearray('MSIE').num;
			var onum = /^\d+\.\d+/;
			var vnum=onum.exec(version[num+1].replace(/[^0-9.]/ig,""));
			self.vnum = vnum; 
			if(self.vnum<8){
				alert('请使用IE8及以上内核的浏览器或非IE内核浏览器');
			};
		};
		self.Plugin=new UTCserver_Plugin();
		self.UIfilelist=new UTCserver_Filelist();
		self.UIcertlist=new UTCserver_Certlist();
		self.UIseallist=new UTCserver_Seallist();
		self.UIloading=new UTCserver_Loading();
		if (!("classList" in document.documentElement)&&typeof(HTMLElement)!='undefined') {
		    Object.defineProperty(HTMLElement.prototype, 'classList', {
		        get: function() {
		            var self = this;
		            function update(fn) {
		                return function(value) {
		                    var classes = self.className.split(/\s+/g),
		                        index = classes.indexOf(value);
		                    
		                    fn(classes, index, value);
		                    self.className = classes.join(" ");
		                }
		            }
		            
		            return {                    
		                add: update(function(classes, index, value) {
		                    if (!~index) classes.push(value);
		                }),
		                
		                remove: update(function(classes, index) {
		                    if (~index) classes.splice(index, 1);
		                }),
		                
		                toggle: update(function(classes, index, value) {
		                    if (~index)
		                        classes.splice(index, 1);
		                    else
		                        classes.push(value);
		                }),
		                
		                contains: function(value) {
		                    return !!~self.className.split(/\s+/g).indexOf(value);
		                },
		                
		                item: function(i) {
		                    return self.className.split(/\s+/g)[i] || null;
		                }
		            };
		        }
		    });
		};
		if (!Array.prototype.indexOf){
		  Array.prototype.indexOf = function(elt /*, from*/){
		    var len = this.length >>> 0;
		
		    var from = Number(arguments[1]) || 0;
		    from = (from < 0)
		         ? Math.ceil(from)
		         : Math.floor(from);
		    if (from < 0)
		      from += len;
		
		    for (; from < len; from++){
		      if (from in this && this[from] === elt)
		        return from;
		    }
		    return -1;
		  };
		}
		var csscon=document.createElement("style");
		csscon.type='text/css'; 
		var stylecon='.utc_popupbox{ position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.4); opacity: 0; z-index: 100;transition: none;-moz-transition: none;-webkit-transition: none;-o-transition: none;}.utc_popupbox *{ margin: 0; padding: 0; color: #333333;}.utc_popupbox ol,.utc_popupbox ul{list-style:none; overflow: hidden;}.utc_popupbox li{ float: left;}.utc_popupbox img{ border: none;}.utc_popupbox input,.utc_popupbox button,.utc_popupbox textarea{ border: none; background-color: transparent; vertical-align:middle; outline: none; overflow: visible;}.utc_popupbox .utc_popupbg{ width: 100%; height: 100%; background-color: #000000; background-color: rgba(0,0,0,0); filter:alpha(opacity=40);}.utc_popupbox .utc_popup{ position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; background-color: #FFFFFF; overflow: auto;}.utc_popupbox .utc_title{ height: 40px; line-height: 40px; padding: 0 20px; font-size: 16px;}.utc_popupbox .utc_con{ margin: 0 20px; overflow: auto;}.utc_popupbox .utc_btn{ height: 50px;}.utc_popupbox .utc_btn button{ float: right; height: 30px; margin: 10px; padding: 0 20px; font-size: 14px; background-color: transparent; border-radius: 2px; cursor: pointer;}.utc_popupbox .utc_btn button.close:hover{ background-color: #F2F2F2;}.utc_popupbox .utc_btn button.sure{ color: #FFFFFF; background-color: #00C0A5;}.utc_popupbox .utc_btn button.sure.none{ color: #FFFFFF; background-color: #CCCCCC; cursor: default;}object{ display: none;}';
		stylecon+='.utc_popupbox.filelist{-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}.utc_popupbox.filelist .utc_popup{ width: 650px; height: 500px;}.utc_popupbox.filelist .utc_con{ height: 410px; height: calc(100% - 90px);}.utc_popupbox.filelist .total{ height: 30px; line-height: 30px; font-size: 14px; color: #999999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}.utc_popupbox.filelist .oper{ height: 30px; border-bottom: 2px solid #00C0A5;}.utc_popupbox.filelist .oper li{ width: 30px; height: 30px; cursor: pointer;}.utc_popupbox.filelist .oper li:hover{ background-color: #e5f9f6;}.utc_popupbox.filelist .oper li img{ display: block; margin: 5px;}.utc_popupbox.filelist dl{ height: calc(100% - 62px); overflow: auto;}.utc_popupbox.filelist dl.linelist dd{ height: 40px; line-height: 40px; overflow: hidden; cursor: pointer;display: flex;flex-flow: row wrap;}.utc_popupbox.filelist dl.linelist dd>span{ float: left; width: 25%; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;flex: 1;}.utc_popupbox.filelist dl.linelist dd>span:nth-child(1){ flex: 0 40px;}.utc_popupbox.filelist dl.linelist dd>span:nth-child(1) img{ display: block; width: 20px; height: 20px; margin: 10px;}.utc_popupbox.filelist dl.linelist dd>span:nth-child(2){ flex: 1; text-align: left;}.utc_popupbox.filelist dl.linelist dd>span:nth-child(3){ flex: 0 150px;}.utc_popupbox.filelist dl.linelist dd>span:nth-child(4){ flex: 0 150px;}.utc_popupbox.filelist dl.linelist dd:hover{ background-color: #e5f9f6;}.utc_popupbox.filelist dl.linelist dd.active{ background-color: #ccf2ed;}.utc_popupbox.filelist dl.blocklist dd{ float: left; width: 20%; height: 120px; overflow: hidden; cursor: pointer;}.utc_popupbox.filelist dl.blocklist dd>span{ font-size: 14px;}.utc_popupbox.filelist dl.blocklist dd>span:nth-child(1){ display: block; text-align: center;}.utc_popupbox.filelist dl.blocklist dd>span:nth-child(1) img{ width: 40px; height: 40px; margin: 20px 0 10px 0;}.utc_popupbox.filelist dl.blocklist dd>span:nth-child(2){ display: block; margin: 0 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center;}.utc_popupbox.filelist dl.blocklist dd>span:nth-child(3){ display: none;}.utc_popupbox.filelist dl.blocklist dd>span:nth-child(4){ display: none;}.utc_popupbox.filelist dl.blocklist dd:hover{ background-color: #e5f9f6;}.utc_popupbox.filelist dl.blocklist dd.active{ background-color: #ccf2ed;}';
	    stylecon+='.utc_popupbox.certlist .utc_popup{ width: 500px; height: 400px;}.utc_popupbox.certlist .utc_con{ height: 310px; height: calc(100% - 90px);}.utc_popupbox.certlist .utc_popup .oper{ height: 40px;}.utc_popupbox.certlist .utc_popup .oper li{ position: relative; width: 50%; line-height: 40px; font-size: 14px; text-align: center; cursor: pointer;}.utc_popupbox.certlist .utc_popup .oper li.active::after{ content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background-color: #00C0A5;}.utc_popupbox.certlist .utc_popup dt{ margin-top: 10px; padding: 10px; color: #999999; text-align: center;}.utc_popupbox.certlist .utc_popup dd{ margin-top: 10px; padding: 10px; border: 2px solid transparent; border-radius: 10px; cursor: pointer;}.utc_popupbox.certlist .utc_popup dd:hover{ background-color: #e5f9f6;}.utc_popupbox.certlist .utc_popup dd.active{ border-color: #00C0A5;}.utc_popupbox.certlist .utc_popup dd span{ display: block; font-size: 14px; color: #999999; word-break: break-all;}.utc_popupbox.certlist .utc_popup dd span.name{ font-size: 16px; color: #333333;}';
	    stylecon+='.utc_popupbox.seallist .utc_popup{ width: 550px; height: 450px;}.utc_popupbox.seallist .utc_con{ height: 400px; height: calc(100% - 50px);}.utc_popupbox.seallist .utc_con dl{ overflow: hidden;}.utc_popupbox.seallist .utc_con dl dt{ line-height: 40px;}.utc_popupbox.seallist .utc_con dl.sign{ float: left; width: 50%;}.utc_popupbox.seallist .utc_con dl.water{ float: left; width: 50%;}.utc_popupbox.seallist .utc_con .img{ float: left; width: 146px; height: 146px; border: 2px solid transparent; margin-left: 5px; margin-bottom: 5px; background-position: center; background-repeat: no-repeat; cursor: pointer; border-radius: 10px;}.utc_popupbox.seallist .utc_con .img:hover{ background-color: #e5f9f6;}.utc_popupbox.seallist .utc_con .img.active{ border-color: #00C0A5;}.utc_popupbox.seallist .utc_con .hint{ height: 150px; line-height: 150px; font-size: 14px; color: #999999; text-align: center;}';
	    stylecon+='.utc_popupbox.password .utc_popup{ width: 350px; height: 220px;}.utc_popupbox.password .utc_con{ height: 130px; height: calc(100% - 90px);}.utc_popupbox.password input{ display: block; width: 250px; height: 40px; margin: 0 auto; margin-top: 30px; padding: 0 5px; line-height: 40px; font-size: 30px; border: 2px solid #CCCCCC; border-radius: 2px;}.utc_popupbox.password .hint{ display: block; margin-top: 10px; font-size: 14px; color: #EE5555; text-align: center;}';
	    stylecon+='.utc_popupbox.loading .utc_popup{ width: 200px; height: 130px;}.utc_popupbox.loading .utc_popup img{ display: block; margin: 0 auto; margin-top: 30px;}.utc_popupbox.loading .utc_popup .hint{ height: 30px; line-height: 30px; text-align: center;}';
	    if(csscon.styleSheet){         //ie下
	    	csscon.styleSheet.cssText = stylecon;  
	    } else {  
	    	csscon.innerHTML = stylecon;       //或者写成 nod.appendChild(document.createTextNode(str))  
	    }  
		document.getElementsByTagName('head')[0].appendChild(csscon);
	};
	//初始化
	self.Initialize=function(json){
		self.openloading();
		if(self.initsure){
			self.init();
			//加载外挂接口库
			if(json.inside){
				self.loadjs(json.inside,function(){
					self.Inside=new UTCserver_Inside();
				});
			};
			if(json.evaluate){
				self.loadjs(json.evaluate,function(){
					self.Evaluate=new UTCserver_Evaluate();
				});
			};
			if(json.idcard){
				self.loadjs(json.idcard,function(){
					self.Idcard=new UTCserver_Idcard();
				});
			};
		};
		self.initsure=false;
		self.Plugin.PluginVersion(function(state,tmp){
			if(state=='success'){
				if(tmp==self.versionnum){
					self.closeloading();
					json.success(tmp);
				}else{
					state='fail';
					tmp='x000001';
				};
			};
			self.errorcallback(json,state,tmp);
		});
	};
	
	//获取钥匙信息
	self.GetKeyInfo=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				if(json.envelope==true){
					self.GetKeyInfo.prototype.EnvelopedId(json);
				}else{
					self.GetKeyInfo.prototype.Id(json);
				};
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	self.GetKeyInfo.prototype.Id=function(json){//序列号
		self.Plugin.GetAEKeyID(function(state,id){
			if(state=='success'&&id==''){
				state='fail';
				id='没有检测到钥匙';
			}
			if(state=='success'){
				self.closeloading();
				switch(json.content){
					case 'id' :
					json.success(id);
					break;
					default:
					json.success({id:id});
				};
			};
			self.errorcallback(json,state,id);
		});
	};
	self.GetKeyInfo.prototype.EnvelopedId=function(json){//加密序列号
		self.Plugin.GetAEKeyEnvelopedID(function(state,id){
			if(state=='success'&&id==''){
				state='fail';
				id='没有检测到钥匙';
			}
			if(state=='success'){
				self.closeloading();
				switch(json.content){
					case 'id' :
					json.success(id);
					break;
					default:
					json.success({id:id});
				};
			};
			self.errorcallback(json,state,id);
		});
	};
	self.GetKeyInfo.prototype.IdCert=function(json){
		self.Plugin.GetAEKeyID(function(state,id){
			if(state=='success'&&id==''){
				state='fail';
				id='没有检测到钥匙';
			}
			if(state=='success'){
				self.Plugin.GetAEKeyCertListDetail(function(state,dn){
					var array=dn[0].split(", ");
					for(var j=0;j<array.length;j++){
						var newlocaljsonkey;

						if(array[j].substring(0,3)=="CN="){
							newlocaljsonkey=array[j];
							newlocaljsonkey=newlocaljsonkey.substring(3);
							//console.log(newlocaljsonkey);
							self.Plugin.UTCEncryptStringtoString(id+'<!--!>'+newlocaljsonkey,'',function(state,data){
								if(state=='success'){
									json.success(data);
								};
								self.errorcallback(json,state,data);
							});
							break;
						}
					}	
				});
			};
			self.errorcallback(json,state,id);
		});
	};
	
	//获取证书信息
	self.GetCertInfo=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				self.UIcertlist.get(json,function(state,data){
					if(state=='success'){
						self.closeloading();
						json.success(data);
					};
					self.errorcallback(json,state,data);
				});
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	
	//获取文件路径
	self.GetFilePath=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				if(typeof(json.suf)=='undefined'){
					json.suf='*';
				};
				self.Plugin.GetLocalFilePath(json.suf,function(state,path){
					if(state=='success'){
						self.closeloading();
						json.success(path);
					};
					self.errorcallback(json,state,path);
				});
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	
	//删除文件
	self.DeleteFile=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				self.notpath(json.data,function(state,path){
					if(state=='success'){
						self.Plugin.DeleteTmpFile(path,function(state,data){
							if(state=='success'){
								self.closeloading();
								json.success(data);
							};
							self.errorcallback(json,state,data);
						});
					};
					self.errorcallback(json,state,path);
				});
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	
	//检测钥匙Pin码
	self.OpenKey=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				self.Plugin.OpenEKey(json.pin,function(state,pin){
					if(state=='success'){
						self.closeloading();
						json.success(pin);
					};
					self.errorcallback(json,state,pin);
				});
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	
	//获取印章信息
	self.GetSealInfo=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				self.Plugin.OpenEKey(json.pin,function(state,pin){
					if(state=='success'){
						self.UIseallist.get(json,function(state,data){
							if(state=='success'){
								self.closeloading();
								json.success(data);
							};
							self.errorcallback(json,state,data);
						});
					};
					self.errorcallback(json,state,pin);
				});
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	
	//base64编码
	self.Base64Encode=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				if(json.type=='file'){
					self.Base64Encode.prototype.File(json);
				}else{
					self.Base64Encode.prototype.Msg(json);
				};
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	self.Base64Encode.prototype.Msg=function(json){//消息编码
		var data=self.Base64Encode.prototype.encode(json.data);
		self.closeloading();
		json.success(data);
	};
	self.Base64Encode.prototype.encode=function(input){//消息编码
		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 
		  var output = ""; 
		  var chr1, chr2, chr3, enc1, enc2, enc3, enc4; 
		  var i = 0; 
		  input = self.Base64Encode.prototype._utf8_encode(input); 
		  while (i < input.length) { 
		   chr1 = input.charCodeAt(i++); 
		   chr2 = input.charCodeAt(i++); 
		   chr3 = input.charCodeAt(i++); 
		   enc1 = chr1 >> 2; 
		   enc2 = ((chr1 & 3) << 4) | (chr2 >> 4); 
		   enc3 = ((chr2 & 15) << 2) | (chr3 >> 6); 
		   enc4 = chr3 & 63; 
		   if (isNaN(chr2)) { 
		    enc3 = enc4 = 64; 
		   } else if (isNaN(chr3)) { 
		    enc4 = 64; 
		   } 
		   output = output + 
		   _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + 
		   _keyStr.charAt(enc3) + _keyStr.charAt(enc4); 
		  } 
		  return output; 
	};
	self.Base64Encode.prototype._utf8_encode=function(string){//消息编码
		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 
		  string = string.replace(/\r\n/g,"\n"); 
		  var utftext = ""; 
		  for (var n = 0; n < string.length; n++) { 
		   var c = string.charCodeAt(n); 
		   if (c < 128) { 
		    utftext += String.fromCharCode(c); 
		   } else if((c > 127) && (c < 2048)) { 
		    utftext += String.fromCharCode((c >> 6) | 192); 
		    utftext += String.fromCharCode((c & 63) | 128); 
		   } else { 
		    utftext += String.fromCharCode((c >> 12) | 224); 
		    utftext += String.fromCharCode(((c >> 6) & 63) | 128); 
		    utftext += String.fromCharCode((c & 63) | 128); 
		   } 
		  
		  } 
		  return utftext; 
	};
	self.Base64Encode.prototype.File=function(json){//文件编码
		self.notpath(json.data,function(state,path){
			if(state=='success'){
				self.Plugin.GetSealBase64(path,function(state,data){
					if(state=='success'){
						self.closeloading();
						json.success(data);
					};
					self.errorcallback(json,state,data);
				});
			};
			self.errorcallback(json,state,path);
		});
	};
	
	//数字签名
	self.Sign=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				if(json.intype=='file'){
					if(json.detach){
						self.Sign.prototype.FileDetach(json);
					}else{
						self.Sign.prototype.File(json);
					};
				}else{
					self.Sign.prototype.Msg(json);
				};
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	self.Sign.prototype.Msg=function(json){//消息签名
		self.notdn(json.dn,function(state,dn){
			if(state=='success'){
				if(typeof(json.hash)=='undefined'){
					json.hash='SHA-1';
				};
				self.Plugin.SignString(dn,'',json.indata,json.hash,json.detach,function(state,data){
					if(state=='success'){
						self.closeloading();
						json.success(data);
					};
					self.errorcallback(json,state,data);
				});
			};
			self.errorcallback(json,state,dn);
		});
	};
	self.Sign.prototype.FileDetach=function(json){//分离式文件签名
		self.notdn(json.dn,function(state,dn){
			if(state=='success'){
				self.notpath(json.indata,function(state,path){
					if(state=='success'){
						if(typeof(json.hash)=='undefined'){
							json.hash='SHA-1';
						};
						self.Plugin.DoSignFile(dn,path,json.hash,function(state,data){
							if(state=='success'){
								self.closeloading();
								json.success(data);
							};
							self.errorcallback(json,state,data);
						});
					};
					self.errorcallback(json,state,path);
				});
			};
			self.errorcallback(json,state,dn);
		});
	};
	self.Sign.prototype.File=function(json){//非分离式文件签名
		self.notdn(json.dn,function(state,dn){
			if(state=='success'){
				self.notpath(json.indata,function(state,path){
					if(state=='success'){
						if(typeof(json.hash)=='undefined'){
							json.hash='SHA-1';
						};
						if(typeof(json.suf)=='undefined'){
							json.suf='sig';
						};
						self.Plugin.DoSignFile2(dn,path,json.hash,path+'.'+json.suf,function(state,data){
							if(state=='success'){
								self.closeloading();
								json.success(path+'.'+json.suf);
							};
							self.errorcallback(json,state,data);
						});
					};
					self.errorcallback(json,state,path);
				});
			};
			self.errorcallback(json,state,dn);
		});
	};
	
	//数据加密
	self.Envelope=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				if(json.intype=='file'){
					self.Envelope.prototype.File(json);
				}else{
					if(Object.prototype.toString.call(json.indata) === '[object Array]'){
						self.Envelope.prototype.arraydata=[];
						self.Envelope.prototype.arraynum=0;
						self.Envelope.prototype.MsgLoop(json,function(data){
							self.closeloading();
							json.success(data);
						});
					}else{
						self.Envelope.prototype.Msg(json);
					};
				};
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	self.Envelope.prototype.File=function(json){//文件加密
		self.notpath(json.indata,function(state,path){
			if(state=='success'){
				var certtype;
				if(json.basealg=='SM4'){
					certtype='SM2';
				}else{
					certtype='RSA';
				};
				if(typeof(json.suf)=='undefined'){
					json.suf='enc';
				};
				self.Plugin.EncryptFileCMSEnvelopeEx_ByCert(json.base,certtype,path,path+'.'+json.suf,json.basealg,function(state,data){
					if(state=='success'){
						self.closeloading();
						json.success(path+'.'+json.suf);
					};
					self.errorcallback(json,state,data);
				});
			};
			self.errorcallback(json,state,path);
		});
	};
	self.Envelope.prototype.Msg=function(json){//消息加密
		var certtype;
		if(json.basealg=='SM4'){
			certtype='SM2';
		}else{
			certtype='RSA';
		};
		self.Plugin.EncryptMsgCMSEnvelopeEx_ByCert(json.indata,json.base,certtype,json.basealg,function(state,data){
			if(state=='success'){
				self.closeloading();
				json.success(data);
			};
			self.errorcallback(json,state,data);
		});
	};
	self.Envelope.prototype.MsgLoop=function(json,callback){
			if(self.Envelope.prototype.arraynum<json.indata.length){
				var certtype;
				if(json.basealg=='SM4'){
					certtype='SM2';
				}else{
					certtype='RSA';
				};
				self.Plugin.EncryptMsgCMSEnvelopeEx_ByCert(json.indata[self.Envelope.prototype.arraynum],json.base,certtype,json.basealg,function(state,data){
					if(state=='success'){
						self.Envelope.prototype.arraydata.push(data);
						self.Envelope.prototype.arraynum++;
						self.Envelope.prototype.MsgLoop(json,callback);
					};
					self.errorcallback(json,state,data);
				});
			}else{
				callback(self.Envelope.prototype.arraydata);
			};
	};
	
	//电子签章
	self.Seal=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				switch(json.type){
					case 'file' :
					self.Seal.prototype.File(json);
					break;
					case 'hash' :
					self.Seal.prototype.Hash(json);
					break;
					case 'form' :
					self.Seal.prototype.Form(json);
					break;
					case 'formserver' :
					self.Seal.prototype.FormServer(json);
					break;
					default :
					self.Seal.prototype.Msg(json);
				};
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	self.Seal.prototype.Msg=function(json){//消息签章
		self.notdn(json.dn,function(state,dn){
			if(state=='success'){
				self.Plugin.SignString(dn,'',' ','SHA-1',false,function(state,data){
					if(state=='success'){
						self.UIseallist.get(json,function(state,seal){
							if(state=='success'){
								var sealdata=json.data+'||'+seal.img;
								self.closeloading();
								self.Plugin.SignString(dn,'',sealdata,'SHA-1',false,function(state,data){
									if(state=='success'){
										self.closeloading();
										json.success(data);
									};
									self.errorcallback(json,state,data);
								});
							};
							self.errorcallback(json,state,seal);
						});
					};
					self.errorcallback(json,state,data);
				});
			};
			self.errorcallback(json,state,dn);
		});
	};
	self.Seal.prototype.File=function(json){//文件签章
		self.notpath(json.data,function(state,path){
			if(state=='success'){
				self.notdn(json.dn,function(state,dn){
					if(state=='success'){
						self.Plugin.OpenEKey(json.pin,function(state,pin){
							if(state=='success'){
								self.Plugin.DoSeal(dn,json.pin,path,json.page,json.x,json.y,function(state,bool){
									if(state=='success'){
										self.closeloading();
										json.success(bool);
									};
									self.errorcallback(json,state,bool);
								});
							};
							self.errorcallback(json,state,pin);
						});
					};
					self.errorcallback(json,state,dn);
				});
			};
			self.errorcallback(json,state,path);
		});
	};
	self.Seal.prototype.Hash=function(json){//哈希签章
		self.notdn(json.dn,function(state,dn){
			if(state=='success'){
				self.Plugin.OpenEKey(json.pin,function(state,pin){
					if(state=='success'){
						self.Plugin.GetSignDataOnline(dn,json.pin,json.data,function(state,tmp){
							if(state=='success'){
								self.closeloading();
								json.success(tmp);
							};
							self.errorcallback(json,state,tmp);
						});
					};
					self.errorcallback(json,state,pin);
				});
			};
			self.errorcallback(json,state,dn);
		});
	};
	self.Seal.prototype.Form=function(json){//表单签章
		self.notdn(json.dn,function(state,dn){
			if(state=='success'){
				self.Plugin.OpenEKey(json.pin,function(state,pin){
					if(state=='success'){
						self.UIseallist.get(json,function(state,seal){
							if(state=='success'){
								var idarray=json.id.split(',');
								var boundIDarr=[];
								var signValarr=[];
								for(var i=0;i<idarray.length;i++){
									var ele=document.getElementById(idarray[i]);
									if(ele){
										boundIDarr.push(idarray[i]);
										if(ele.name==undefined){//非表单
											var id=ele.id;
											var name=ele.getAttribute('name')?ele.getAttribute('name'):'';
											var value=ele.value==undefined?ele.getAttribute('value')==undefined?'':ele.getAttribute('value').replace(/\s/g,""):ele.value.replace(/\s/g,"");
											var text=ele.innerHTML==undefined?'':ele.innerHTML;
										}else{//表单
											var id=ele.id;
											var name=ele.name;
											var value=ele.value;
											var text=ele.innerHTML==undefined?'':ele.innerHTML;
										};
										var divcon='<'+ele.tagName+',id='+id+',name='+name+',value='+value+',outerText='+text+'>';
										signValarr.push(divcon);
									};
								};
								var boundID=boundIDarr.join(',');
								var signVal=signValarr.join('<UTCSplit|>');
								var imgid='';
								switch(seal.id){
									case '4' :
									imgid='0,4,0';
									break;
									case '5' :
									imgid='0,0,5';
									break;
									default :
									imgid=seal.id+',0,0';
								};
								self.Plugin.DoWebSealByEKey(dn,json.pin,boundID,signVal,imgid,function(state,sealinfo){
									if(state=='success'){
										self.closeloading();
										json.success(sealinfo);
									};
									self.errorcallback(json,state,sealinfo);
								});
							};
							self.errorcallback(json,state,seal);
						});
					};
					self.errorcallback(json,state,pin);
				});
			};
			self.errorcallback(json,state,dn);
		});
	};
	self.Seal.prototype.FormServer=function(json){//表单签章（服务器）
		self.Plugin.GetAEKeyID(function(state,keyid){
			if(state=='success'&&keyid==''){
				state='fail';
				keyid='没有检测到钥匙';
			}
			if(state=='success'){
				self.Plugin.OpenEKey(json.pin,function(state,pin){
					if(state=='success'){
						var idarray=json.id.split(',');
						var boundIDarr=[];
						var signValarr=[];
						for(var i=0;i<idarray.length;i++){
							var ele=document.getElementById(idarray[i]);
							if(ele){
								boundIDarr.push(idarray[i]);
								if(ele.name==undefined){//非表单
									var id=ele.id;
									var name=ele.getAttribute('name')?ele.getAttribute('name'):'';
									var value=ele.value==undefined?ele.getAttribute('value')==undefined?'':ele.getAttribute('value').replace(/\s/g,""):ele.value.replace(/\s/g,"");
									var text=ele.innerHTML==undefined?'':ele.innerHTML;
								}else{//表单
									var id=ele.id;
									var name=ele.name;
									var value=ele.value;
									var text=ele.innerHTML==undefined?'':ele.innerHTML;
								};
								var divcon='<'+ele.tagName+',id='+id+',name='+name+',value='+value+',outerText='+text+'>';
								signValarr.push(divcon);
							};
						};
						var boundID=boundIDarr.join(',');
						var signVal=signValarr.join('<UTCSplit|>');
						self.Plugin.DoWebSealByService(keyid,json.pin,json.url,boundID,signVal,json.seal,json.mod,function(state,sealinfo){
							if(state=='success'){
								self.closeloading();
								json.success(sealinfo);
							};
							self.errorcallback(json,state,sealinfo);
						});
					};
					self.errorcallback(json,state,pin);
				});
			};
			self.errorcallback(json,state,keyid);
		});
	};
	
	//电子签章验签
	self.VerifySeal=function(json){
		self.Initialize({
			success:function(version){
				self.openloading();
				switch(json.type){
					case 'form' :
					self.VerifySeal.prototype.Form(json);
					break;
					default :
					
				};
			},
			fail:function(message){
				self.errorcallback(json,state,message);
			}
		});
	};
	self.VerifySeal.prototype.Form=function(json){//表单签章
		self.Plugin.DoWebSealGetBoundId(json.data,function(state,idstring){
			if(state=='success'){
				var idarray=idstring.split(',');
				var signValarr=[];
				for(var i=0;i<idarray.length;i++){
					var ele=document.getElementById(idarray[i]);
					if(ele){
						if(ele.name==undefined){//非表单
							var id=ele.id;
							var name=ele.getAttribute('name')?ele.getAttribute('name'):'';
							var value=ele.value==undefined?ele.getAttribute('value')==undefined?'':ele.getAttribute('value').replace(/\s/g,""):ele.value.replace(/\s/g,"");
							var text=ele.innerHTML==undefined?'':ele.innerHTML;
						}else{//表单
							var id=ele.id;
							var name=ele.name;
							var value=ele.value;
							var text=ele.innerHTML==undefined?'':ele.innerHTML;
						};
						var divcon='<'+ele.tagName+',id='+id+',name='+name+',value='+value+',outerText='+text+'>';
						signValarr.push(divcon);
					};
				};
				self.Plugin.DoWebSealVerify(signValarr.join('<UTCSplit|>'),json.data,function(state,data){
					if(state=='success'){
						var bool=data.substring(0,1)=='1';
						var base64='data:image/png;base64,'+data.substring(1);
						if(bool){
							self.closeloading();
							json.success(base64);
						}else{
							self.errorcallback(json,'fail',base64);
						};
					};
					self.errorcallback(json,state,data);
				});
			};
			self.errorcallback(json,state,idstring);
		});
	};
	
	//读取身份证信息
	self.GetIdcardInfo=function(json){
		UTCserver.Initialize({
			success:function(version){
				UTCserver.openloading();
				switch(json.type){
					case 'zkkj' :
					self.GetIdcardInfo.prototype.Zkkj(json);
					break;
					default:
					self.GetIdcardInfo.prototype.Ylt(json);
				};
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	self.GetIdcardInfo.prototype.Zkkj=function(json){
		self.Plugin.ID_Read(function(state,data){
			if(state=='success'){
				UTCserver.closeloading();
				json.success(data);
			};
			UTCserver.errorcallback(json,state,data);
		});
	};
	self.GetIdcardInfo.prototype.Ylt=function(json){
		self.Plugin.SDTGetCard(function(state,data){
			if(state=='success'){
				UTCserver.closeloading();
				json.success(data);
			};
			if(state=='fail'){
				if(data=='Error:加载DLL失败'){
					state='other';
					data='x000006';
					UTCserver.closeloading();
					if(typeof(json.error)=='function'){
						json.error(data);
					}else{
						alert(eval('self.errorstate.'+data));
					};
				};
			};
			UTCserver.errorcallback(json,state,data);
		});
	};
	
	//上传
	self.Upload=function(json){
		self.Initialize({
			success:function(version){
				if(json.type=='yongyou'){
					self.Upload.prototype.yongyou(json);
				};
			},
			fail:function(message){
				self.errorcallback(json,'fail',message);
			},
			error:function(message){
				self.errorcallback(json,'error',message);
			}
		});
	};
	self.Upload.prototype.yongyou=function(json){//用友上传组件
		self.notpath(json.path,function(state,path){
			if(state=='success'){
				var url='file/upload';
				if(json.cross_url != undefined){
					url = json.cross_url + url;
				}else{
					url = window.location.protocol+'//'+window.location.host+window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')+1) + url;
				};
				var isreplace=( json.isreplace == undefined || json.isreplace == false) ? false : true;
				var isencrypt=( json.isencrypt == undefined || json.isencrypt == false) ? false : true;
				self.Plugin.UploadFile(url,json.filepath,json.groupname,path,json.permission,json.url,json.thumbnail,isreplace,isencrypt,function(state,data){
					try{
						data=eval('('+data+')');
					}catch(e){};
					if(state=='success'){
						self.closeloading();
						json.success(data);
					};
					self.errorcallback(json,state,data);
				});
			};
			self.errorcallback(json,state,path);
		});
	};

	//通用参数
	self.notdn=function(data,callback){
		if(typeof(data)=='undefined'){
			self.UIcertlist.get({},function(state,data){
				self.openloading();
				callback(state,data);
			});
		}else{
			callback('success',data);
		};
	};
	self.notpath=function(data,callback){
		if(typeof(data)=='undefined'){
			self.Plugin.GetLocalFilePath('*',function(state,path){
				self.openloading();
				callback(state,path);
			});
		}else{
			callback('success',data);
		};
	};
	
	//判断浏览器
	self.Browser=function(){
		var ele=navigator.userAgent;
		if(ele.indexOf('Firefox')>=0){
			return 'Firefox';
		}else{
			if(ele.indexOf('Edge')>=0){
				return 'Edge';
			}else{
				if(ele.indexOf('Trident')>=0){
					return 'IE';
				}else{
					if(ele.indexOf('Opera')>=0){
						return 'Opera';
					}else{
						if(ele.indexOf('Chrome')>=0){
							return 'Chrome';
						}else{
							if(ele.indexOf('Safari')>=0){
								return 'Safari';
							}else{
								return 'Other';
							};
						};
					};
				};
			};
		};
	};
	
	//错误回调
	self.errorcallback=function(json,state,data){
		if(state=='fail'){
			self.closeloading();
			if(typeof(json.fail)=='function'){
				json.fail(data);
			}else{
				alert(data);
			};
		};
		if(state=='error'){
			self.closeloading();
			if(typeof(json.error)=='function'){
				json.error(data);
			}else{
				alert(eval('self.errorstate.'+data));
			};
		};
	};
	
	//随机数
	self.randomnum=function(a){
		var num='';
		for(var i=1;i<=a;i++){
			//var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
			var o = Math.floor(Math.random()*16);
			num+=chars[o];
		};
		return num;
	};
	//文件base64解码
	self.fromBase64=function(dataURI){
	    var raw = window.atob(dataURI);
	    var rawLength = raw.length;
	    var array = new Uint8Array(new ArrayBuffer(rawLength));
	
	    for(i = 0; i < rawLength; i++) {
	         array[i] = raw.charCodeAt(i);
	    }
	    return array;
	}
	//打开loading
	self.openloading=function(){
		self.loadingflag=setTimeout(function(){self.UIloading.get();},1000);
	};
	//关闭loading
	self.closeloading=function(){
		clearTimeout(self.loadingflag);
		self.UIloading.close();
	};
	//加载文件
	self.loadcss=function(path,callback){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var pathsure=true;
		for(var i=0;i<document.querySelectorAll('script').length;i++){
			if(document.querySelectorAll('script')[i].src.indexOf(path)>=0){
				pathsure=false;
			};
		};
		if(pathsure){
			var head = document.getElementsByTagName('head')[0];
	        var link = document.createElement('link');
	        link.href = path;
	        link.rel = 'stylesheet';
	        link.type = 'text/css';
	        head.appendChild(link);
	        script.onload=script.onreadystatechange=function(){
			   if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
			     callback();
			   }
			   script.onload=script.onreadystatechange=null;
			};
		}else{
			callback();
		};
    };
    self.loadjs=function(path,callback){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var pathsure=true;
		for(var i=0;i<document.querySelectorAll('script').length;i++){
			if(document.querySelectorAll('script')[i].src.indexOf(path)>=0){
				pathsure=false;
			};
		};
		if(pathsure){
			var head = document.getElementsByTagName('head')[0];
	        var script = document.createElement('script');
	        script.src = path;
	        script.type = 'text/javascript';
	        head.appendChild(script);
	        script.onload=script.onreadystatechange=function(){
			   if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
			     callback();
			   }
			   script.onload=script.onreadystatechange=null;
			};
		}else{
			callback();
		};
    };
	//请求
	self.UTCajax=function(json,callback){
		if(true){
			try{
				eval("json = '"+JSON.stringify(json)+"';");
				setTimeout(function(){
					var url = 'http://127.0.0.1:58901/utcapi';
					if(document.location.protocol=='https:'&&self.Browser()!='Chrome'){
						url = 'https://127.0.0.1:58911/utcapi';
					};
					if(self.vnum!=null&&self.vnum<=9){
						 var xdr = new XDomainRequest();
						 xdr.onload = function() {      
							 var obj = eval("(" + xdr.responseText + ")");
							 if(obj.error){
								callback('fail',obj.return_val);
							 }else{
								callback('success',obj.return_val);
							};
						 };
						 xdr.onerror = function() {
							 callback('error','x000000');
						 };
						 xdr.ontimeout = function() {
							 callback('error','x000000');
						 };
						 xdr.open("post", url);
						 xdr.send('json=' + json);
					}else{
							var request = new XMLHttpRequest();
							request.open('POST', url,true);
							request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
							request.onprogress = function(e){
						        e = e || event;
						        if (e.lengthComputable){
						        	try{
						        		//console.log(e.loaded + " ## " + e.total);
						        	}catch(e){};
						        };
						    };
							request.onreadystatechange= function(){
								if(request.readyState == 4) {
									if(request.status == 200) {
										var obj = eval("(" + request.responseText + ")");
										if(obj.error){
											callback('fail',obj.return_val);
										}else{
											callback('success',obj.return_val);
										};
									}else{
										callback('error','x000000');
									};
								};
							};
							json=json.replace(/\\/ig,"\\\\"); 
							eval("json = '"+json+"';");
							//console.log(json);
							request.send('json=' + json);
					};
				},0);
			}catch(e){
				//console.log(e.message);
				callback('error','x000000');
			};
		};
	};
	//外部请求
	self.WEBajax=function(json,callback){
		if(true){
			try{
				var url=json.url;
				setTimeout(function(){
					var request = new XMLHttpRequest();
					request.open('POST', url,true);
					request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
					request.onreadystatechange= function(){
						if(request.readyState == 4) {
							if(request.status == 200) {
								var obj = eval('('+request.responseText+')');
								callback('success',obj);
							}else{
								callback('error','x000005');
							};
						};
					};
					json = (function(obj){ // 转成post需要的字符串.
					    var str = "";
					    for(var prop in obj){
					        str += prop + "=" + obj[prop] + "&"
					    };
					    str=str.substring(0,str.length-1);
					    return str;
					})(json);
					request.send(json);
				},0);
			}catch(e){
				//console.log(e.message);
				callback('error','x000005');
			};
		};
	};
	self.endWith=function(path,s){
		if(s==null||s==""||path.length==0||s.length>path.length){
			return false;
		}else{
			if(path.substring(path.length-s.length)==s){
				return true;
			}else{
				return false;
			};
		};
	};
};
var UTCserver=new UTCserver_Function();

function UTCserver_Plugin(){
	var self=this;
	//获取服务版本号
	self.PluginVersion=function(callback){
		UTCserver.UTCajax({
			'function':'PluginVersion'
		},function(state,data){
			callback(state,data);
		});
	};
	//获取钥匙序列号
	self.GetAEKeyID=function(callback){
		UTCserver.UTCajax({
			'function':'GetAEKeyID'
		},function(state,data){
			callback(state,data);
		});
	};
	//获取加密钥匙序列号
	self.GetAEKeyEnvelopedID=function(callback){
		UTCserver.UTCajax({
			'function':'GetAEKeyEnvelopedID'
		},function(state,data){
			callback(state,data);
		});
	};
	//加密钥匙序列号
	self.UTCEncryptStringtoString=function(id,password,callback){
		UTCserve.UTCajax({
			'function':'UTCEncryptStringtoString',
			'1':id,
			'2':password
		},function(state,data){
			callback(state,data);
		});
	};
	//获取钥匙证书DN
	self.GetAEKeyCertListDetail=function(callback){
		UTCserver.UTCajax({
			'function':'GetAEKeyCertListDetail'
		},function(state,data){
			if(data==''){
				data='[]';
			};
			data=data.replace(/="/ig,'=');
			data=data.replace(/ "/ig,' ');
			data=eval("(" + data + ")");
			callback(state,data);
		});
	};
	//获取IE证书DN
	self.GetCertListDetailFromIE=function(callback){
		UTCserver.UTCajax({
			'function':'GetCertListDetailFromIE'
		},function(state,data){
			if(data==''){
				data='[]';
			};
			data=data.replace(/="/ig,'=');
			data=data.replace(/ "/ig,' ');
			data=eval("(" + data + ")");
			callback(state,data);
		});
	};
	//获取文件路径(系统)
	self.GetLocalFilePath=function(suffix,callback){
		UTCserver.UTCajax({
			'function':'GetLocalFilePath',
			'1':suffix
		},function(state,data){
			callback(state,data);
		});
	};
	//删除文件
	self.DeleteTmpFile = function(localpath,callback){
		UTCserver.UTCajax({
			'function':'DeleteTmpFile',
			'1':localpath
		},function(state,data){
			callback(state,data);
		});
	};
	//检测钥匙PIN码
	self.OpenEKey=function(password,callback){
		UTCserver.UTCajax({
			'function':'OpenEKey',
			'1':password
		},function(state,data){
			callback(state,data);
		});
	};
	//获取Base64
	self.GetSealBase64 = function(filepath,callback){
		UTCserver.UTCajax({
			'function':'GetSealBase64',
			'1':filepath
		},function(state,data){
			callback(state,data);
		});
	};
	//验证文件有效性
	self.DoVerify=function(localfile,callback){
		UTCserve.UTCajax({
			'function':'DoVerify',
			'1':localfile
		},function(state,data){
			callback(state,data);
		});
	};
	//字符串签名
	self.SignString=function(DN,password,source, selectedAlg, bool,callback){
		UTCserver.UTCajax({
			'function':'SignString',
			'1':source,
			'2':password,
			'3':DN,
			'4':selectedAlg,
			'5':bool
		},function(state,data){
			callback(state,data);
		});
	};
	//文件签名
	self.DoSignFile=function(DN,path,hachtype,callback){
		UTCserver.UTCajax({
			'function':'DoSignFile',
			'1':DN,
			'2':path,
			'3':hachtype
		},function(state,data){
			callback(state,data);
		});
	};
	//非分离式文件签名
	self.DoSignFile2=function(DN,path,hachtype,suf,callback){
		UTCserver.UTCajax({
			'function':'DoSignFile2',
			'1':DN,
			'2':path,
			'3':hachtype,
			'4':suf
		},function(state,data){
			callback(state,data);
		});
	};
	//消息加密
	self.EncryptMsgCMSEnvelopeEx_ByCert=function(sourcestring,certbase64,certtype,selectedAlgIndex,callback){
		var certbase64n=certbase64.replace(/=/ig,"#");
		UTCserver.UTCajax({
			'function':'EncryptMsgCMSEnvelopeEx_ByCert',
			'1':certbase64n,
			'2':certtype,
			'3':sourcestring,
			'4':selectedAlgIndex
		},function(state,data){
			callback(state,data);
		});
	};
	//文件加密
	self.EncryptFileCMSEnvelopeEx_ByCert=function(certbase64,certtype,sourcefilepath,envelopefilepath,selectedAlgIndex,callback){
		var certbase64n=certbase64.replace(/=/ig,"#"); 
		UTCserver.UTCajax({
			'function':'EncryptFileCMSEnvelopeEx_ByCert',
			'1':certbase64n,
			'2':certtype,
			'3':sourcefilepath,
			'4':selectedAlgIndex,
			'5':envelopefilepath
		},function(state,data){
			callback(state,data);
		});
	};
	
	//文件签章
	self.DoSeal=function(dn,pin,path,page,x,y,callback){
		UTCserver.UTCajax({
			'function':'DoSeal',
			'1':dn,
			'2':pin,
			'3':path,
			'4':page,
			'5':x,
			'6':y,
		},function(state,data){
			callback(state,data);
		});
	};
	
	//hash值签章
	self.GetSignDataOnline=function(dn,password,hashdata,callback){
		UTCserver.UTCajax({
			'function':'GetSignDataOnline',
			'1':password,
			'2':hashdata,
			'3':dn
		},function(state,data){
			callback(state,data);
		});
	};
	
	//表单签章（电子钥匙）
	self.DoWebSealByEKey=function(DN,Password,BoundId,BoundVal,DataId,callback){
		UTCserver.UTCajax({
			'function':'DoWebSealByEKey',
			'1':DN,
			'2':Password,
			'3':BoundId,
			'4':BoundVal,
			'5':DataId
		},function(state,data){
			callback(state,data);
		});
	};
	
	//表单签章（服务器）
	self.GetServerCertASeal=function(url,name,pw,callback){
		UTCserver.WEBajax({
			url:url,
			name:name,
			pw:pw
		},function(state,data){
			callback(state,data);
		});
	};
	
	//表单签章（服务器）
	self.DoWebSealByService=function(Username,Password,url,BoundId,BoundVal,Seal,type,callback){
		UTCserver.UTCajax({
			'function':'DoWebSealByService',
			'1':Username,
			'2':Password,
			'3':url,
			'4':BoundId,
			'5':BoundVal,
			'6':Seal,
			'type':type
		},function(state,data){
			callback(state,data);
		});
	};
	
	
	//表单签章获取ID
	self.DoWebSealGetBoundId=function(sealinfo,callback){
		UTCserver.UTCajax({
			'function':'DoWebSealGetBoundId',
			'1':sealinfo
		},function(state,data){
			callback(state,data);
		});
	};
	//表单签章验证
	self.DoWebSealVerify=function(val,sealinfo,callback){
		UTCserver.UTCajax({
			'function':'DoWebSealVerify',
			'1':val,
			'2':sealinfo
		},function(state,data){
			callback(state,data);
		});
	};
	
	//获取印章图片数据
	self.GetEKeyPic=function(password,callback){
		UTCserver.UTCajax({
			'function':'GetEKeyPic',
			'1':password
		},function(state,data){
			callback(state,data);
		});
	};
	
	//获取临时路径
	self.GetTmpFilePath = function(path,callback){
		if(UTCserver.usekey){
			UTCserver.UTCajax({
				'function':'GetTmpFilePath'
			},function(state,data){
				callback(state,data);
			});
		}else{
			callback('success',path);
		};
	};
	
	//创建印章图片
	self.GetAEKeySealFile = function(password,sealtype,filepath,callback){
		if(UTCserver.usekey){
			UTCserver.UTCajax({
				'function':'GetAEKeySealFile',
				'1':password,
				'2':sealtype,
				'3':filepath
			},function(state,data){
				callback(state,data);
			});
		}else{
			callback('success',0);
		};
	};
	
	//文件哈希
	self.HashFile=function(path,callback){
		UTCserve.UTCajax({
			'function':'HashFile',
			'1':path,
		},function(state,data){
			callback(state,data);
		});
	};
	
	//用友上传
	self.UploadFile = function(URL,filepath,groupname,path,permission,url,thumbnail,isreplace,isencrypt,callback){
		UTCserver.UTCajax({
			'function':'UploadFile',
			'1':URL,
			'2':filepath,
			'3':groupname,
			'4':path,
			'5':permission,
			'6':url,
			'7':thumbnail,
			'8':isreplace,
			'9':isencrypt
		},function(state,data){
			callback(state,data);
		});
	};
	
	//读取身份证信息
	self.SDTGetCard=function(callback){
		UTCserver.UTCajax({
			'function':'SDTGetCard'
		},function(state,data){
			callback(state,data);
		});
	};
	
	//读取身份证信息
	self.ID_Read=function(callback){
		UTCserver.UTCajax({
			'function':'ID_Read'
		},function(state,data){
			callback(state,data);
		});
	};
	
	//上传加密签名
	/*self.UploadFile = function(filepath,filesign,url,certType,callback){
		filepath=filepath.replace(/\\/ig,"\\\\"); 
		UTCserve.UTCajax({
			'function':'UploadFile',
			'1':filepath,
			'2':filesign,
			'3':url,
			'4':certType
		},function(state,data){
			callback(state,data);
		});
	};*/
};


//选文件
function UTCserver_Filelist(){
	var self=this;
	self.listtype='linelist';
	self.base20head='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkO';
	self.base40head='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkO';
	self.initialize=function(){
	};
	self.load=function(path,callback){
		path=path;
		if(path!=''){
			UTCserver.Plugin.GetList(path,self.rot,function(state,localjson){
				if(localjson){
					localjson.path=localjson.path.replace(/\\\\/ig,"\\"); 
					if(localjson.path.substring(localjson.path.length-1)=='\\'){
						localjson.path=localjson.path.substring(0,localjson.path.length-1);
					};
					localjson.parentpath=localjson.parentpath.replace(/\\\\/ig,"\\");
					if(localjson.parentpath.substring(localjson.parentpath.length-1)=='\\'){
						localjson.parentpath=localjson.parentpath.substring(0,localjson.parentpath.length-1);
					};
					try{callback();}catch(e){};
					document.querySelector('.utc_popupbox.filelist dl').innerHTML='';
					document.querySelector('.utc_popupbox.filelist dl').scrollTop=0;
					document.querySelector('.utc_popupbox.filelist dl').setAttribute('data-path',localjson.path);
					document.querySelector('.utc_popupbox.filelist dl').setAttribute('data-parentpath',localjson.parentpath);
					
					if(localjson.node!=null){
						var dnnum=0;
						if(UTCserver.endWith(localjson.name.toLowerCase(),'desktop')){
							var dnode=document.createElement("dd");
							dnode.setAttribute('title','桌面');
							dnode.setAttribute('data-path','computer');
							dnode.innerHTML='<span><img src="'+self.fileicon('disks')+'"></span><span>计算机</span><span>计算机</span><span></span>';
							document.querySelector('.utc_popupbox.filelist dl').appendChild(dnode);
							dnnum++;
							self.eventlist(0);
						};
						for(var i=0;i<localjson.node.length;i++){
							var node=document.createElement("dd");
							node.setAttribute('title',localjson.node[i].name);
							if(localjson.node[i].path.substring(localjson.node[i].path.length-1)=='\\'){
								localjson.node[i].path=localjson.node[i].path.substring(0,localjson.node[i].path.length-1);
							};
							node.setAttribute('data-path',localjson.node[i].path);
							node.innerHTML='<span><img src="'+self.fileicon(localjson.node[i].type)+'"></span><span>'+localjson.node[i].name+'</span><span>'+self.filetype(localjson.node[i].type)+'</span><span>'+self.filesize(localjson.node[i].size)+'</span>';
							document.querySelector('.utc_popupbox.filelist dl').appendChild(node);
							self.eventlist(i+dnnum);
						};
					};
					document.querySelector('.utc_popupbox.filelist .total').innerText=document.querySelector('.utc_popupbox.filelist dl').getAttribute('data-path');
				};
			});
		};
	};
	self.close=function(){
		self.fadeOut(document.querySelector('.utc_popupbox.filelist'),function(){
			document.querySelector('.utc_popupbox.filelist').parentNode.removeChild(document.querySelector('.utc_popupbox.filelist'));
		});
	};
	self.sure=function(){
		if(self.checkbox){
			var patharray=[];
			for(var o=0;o<document.querySelectorAll('.utc_popupbox.filelist dd').length;o++){
				if(document.querySelectorAll('.utc_popupbox.filelist dd')[o].childNodes[2].innerHTML!='计算机'&&document.querySelectorAll('.utc_popupbox.filelist dd')[o].childNodes[2].innerHTML!='文件夹'){
					patharray.push(document.querySelectorAll('.utc_popupbox.filelist dd')[o].getAttribute('data-path'));
				};
			};
			self.callback(patharray);
		}else{
			self.callback(document.querySelector('.utc_popupbox.filelist dd.active').getAttribute('data-path'));
		};
		self.close();
	};
	self.get=function(rot,callback){
		self.callback=callback;
		self.load('computer',function(){
			var node=document.createElement("div");
			node.classList.add('utc_popupbox');
			node.classList.add('filelist');
			var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><div class="utc_title">选择文件</div><div class="utc_con"><div class="total"></div><ul class="oper">';
			divbox+='<li class="backoff" title="上一级"><img src="'+'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZBQUVDNEFDNzNFODExRTZBRUFCRjNEMjQ2ODUyQjQzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZBQUVDNEFENzNFODExRTZBRUFCRjNEMjQ2ODUyQjQzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkFBRUM0QUE3M0U4MTFFNkFFQUJGM0QyNDY4NTJCNDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkFBRUM0QUI3M0U4MTFFNkFFQUJGM0QyNDY4NTJCNDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6irL/fAAAAq0lEQVR42mL8//8/AzUBEwOVAQvjwWVUM+y/fRT1XYjPQH4gPgDER6lhIMiwnUBsD8R/KTUQZpg5EJ8GYl9KDEQ27BQQuwLxR3INRDfMjVTD0A3cBTUMBMyA+AMoJRCJD1M7YTNiM9AN6lUQOAnEAlCFxGAbbAZ+RDLUHBqe/JQmbHRDd5FqKLYwRDYUFDmbqJFTYIaCYo+FpNIGjxzIULsBLw8ZB32JDRBgALGXL+rnO04OAAAAAElFTkSuQmCC"></li>';
			divbox+='<li class="refresh" title="刷新"><img src="'+'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRCRUJBNTA1NzNGNjExRTY4NUY0QUEwRTlCODQwQURFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRCRUJBNTA2NzNGNjExRTY4NUY0QUEwRTlCODQwQURFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEJFQkE1MDM3M0Y2MTFFNjg1RjRBQTBFOUI4NDBBREUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEJFQkE1MDQ3M0Y2MTFFNjg1RjRBQTBFOUI4NDBBREUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz73Q6kAAAABL0lEQVR42mL8//8/A+PBZQzUAkwMVAb4DNQC4j4gvg7EP4D4KxBfA+LJQKyLSxMjFi+zQQ3KxGPhPyB2BeJ9hFwIMmwrEGcD8R8gngTElkDMi6auGZthIMCCxu8HYhcgfgrEPkB8AYueRiBuICYMtYE4HYh/kWsYuoEpQMwMxDPJNQzdQA8ojStRNpCabJSg9DkSk95hKMYaKaQCHiC2AeIv2Fx4D0obkWCgDpR+iM3AHVA6kgQDYWr3YDNwLhD/hSYdfSIM04OqBemZg83AK9Akww7NLQZ4DANZuA2qdiZUL9asVwh1vjQQnwTiCUBsAsTcUGwCFTsFVbMPqocqhcNsqGHfCRVfoKyXAw2jiUB8E4h/Q4uvq1AxkJcz0A0jlA5BmgtITZhgL1MTAAQYAJZCTFBpyWXNAAAAAElFTkSuQmCC"></li>';
			divbox+='<li class="desktop" title="桌面"><img src="'+'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY4RTZERjY3NzNFOTExRTY5RTgyRkFCN0U3QzBDQUY4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY4RTZERjY4NzNFOTExRTY5RTgyRkFCN0U3QzBDQUY4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjhFNkRGNjU3M0U5MTFFNjlFODJGQUI3RTdDMENBRjgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjhFNkRGNjY3M0U5MTFFNjlFODJGQUI3RTdDMENBRjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4IjXypAAAAhElEQVR42mL8//8/AzUBC4hgPLiMKob9t49iYELiewLxM5A4ifgZVC8YIBs4F4glyXCYJFQvwstIEuAQINWnyA5hYqAyGDVwpBn4HCldkYJB4AU2A1OQJUgAT4E4GVtO2YYn6/0nNhfRLVIOYwkn9PA9TG0XMuIsYLEAW7JtoXYVABBgAN1iM/1DFWQDAAAAAElFTkSuQmCC"></li>';
			divbox+='<li class="view" title="视图"><img src="'+'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkzMzQ5OTRFNzNGNjExRTY5M0UxQTkyOUI0ODI1MzI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkzMzQ5OTRGNzNGNjExRTY5M0UxQTkyOUI0ODI1MzI2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTMzNDk5NEM3M0Y2MTFFNjkzRTFBOTI5QjQ4MjUzMjYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTMzNDk5NEQ3M0Y2MTFFNjkzRTFBOTI5QjQ4MjUzMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz43N8v0AAAAfklEQVR42mL8//8/AzUBC4hgPLiMKob9t49iYELiewLxM5A4En4GFSdaDbKBc4FYEs1SSag40WpY0CTAIYDsCzQDCKphYqAyoKmBz5G8AMMg8IIUNcgGpqBpBoGnQJxMihrkSNmGJQbRAUE1NA3D0YQ9mrAHKmEzUrsKAAgwAJPpSctq/gVAAAAAAElFTkSuQmCC"></li>';
			divbox+='</ul><dl class="'+self.listtype+'"></dl></div><div class="utc_btn"><button class="sure none" disabled>确定</button><button class="close">关闭</button></div></div>';
			node.innerHTML=divbox;
			if(document.querySelectorAll('.utc_popupbox.filelist').length==0){
				document.body.appendChild(node);
				self.fadeIn(document.querySelector('.utc_popupbox.filelist'));
				self.eventbox();
			};
			if(rot==''){
				self.checkbox=true;
				self.ifsure('');
			};
			self.rot=rot;
		});
	};
	self.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		
		  tick()
		}catch(e){};
	};
	self.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		
		  tick()
		}catch(e){};
	};
	self.ifsure=function(type){
		if(self.checkbox){
			document.querySelector('.utc_popupbox.filelist .sure').classList.remove('none');
			document.querySelector('.utc_popupbox.filelist .sure').removeAttribute('disabled');
		}else{
			if(type=='文件夹'||type=='计算机'){
				document.querySelector('.utc_popupbox.filelist .sure').classList.add('none');
				document.querySelector('.utc_popupbox.filelist .sure').setAttribute('disabled',true);
			}else{
				document.querySelector('.utc_popupbox.filelist .sure').classList.remove('none');
				document.querySelector('.utc_popupbox.filelist .sure').removeAttribute('disabled');
			};
		};
	};
	self.filesize=function(size){
		if(size!=''){
			if(size<1024){
				return '1KB';
			}else{
				if(size<1024*1024){
					return (size/1024).toFixed(2)+'KB';
				}else{
					if(size<1024*1024*1024){
						return (size/1024/1024).toFixed(2)+'MB';
					}else{
						if(size<1024*1024*1024*1024){
							return (size/1024/1024/1024).toFixed(2)+'GB';
						}else{
							return size;
						};
					};
				};
			};
		}else{
			return '';
		};
	};
	self.filetype=function(type){
		switch (type){
			case '*directory*':
				return '文件夹';
			break;
			
			case 'doc':
				return 'Word';
			break;
			
			case 'docx':
				return 'Word';
			break;
			
			case 'xls':
				return 'Excel';
			break;
			
			case 'xlsx':
				return 'Excel';
			break;
			
			default:
				return type;
			break;
		};
	};
	self.fileicon=function(type){
		switch (type){
			case 'disks':
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MzJkNTNjZi01MTU5LWViNDktODMzOC05OWM5ZmNlODhjN2YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTY2Nzg2RTg3OTUyMTFFNkFBNURBMkMwMDM0QTlEQkMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTY2Nzg2RTc3OTUyMTFFNkFBNURBMkMwMDM0QTlEQkMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTY1RTg5NDg3OTUyMTFFNkI3MEVGNEQ4MURFQ0IyREQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTY1RTg5NDk3OTUyMTFFNkI3MEVGNEQ4MURFQ0IyREQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6yd1KaAAAB2klEQVR42uyYwUrDQBCGkzWHetGTqPVSLwqVBk8qFB+g+hj1AXwdgxVP+gZ68wlEbCMUvAiCVuiph4IBMc7IBNZ0Y7bG3YngwH/YJTAfszuZ2XHjOHbKbMIpuXlBEKj2W6AOaNkSxwDUBl3qRtAmnEO+OrpHvGAZToZc1AHcZLxyvg5gI7U+BbmGdJLjWwvw1mDEer8BGBoEDKcFnAHVGQHrxJAJuAaaldYvoKFBwCH5SAx9r38H6FuMntY9FDl3oGsBsFsEsGcBMCwCGJYJcA5Uk9ZvoL4FwD75SqxGLBOAPv3dE7sHRRYAI/KVmCsnq2BOkNxEEQwJgr3mM6mV96sRDAmS9JpyDxjmAbpMGezqAmLmzEsfjECPhqAOqLw9UZvvkK+R9A2yrH6+SRgS5CKjY8d7uJuK4oNgrCBamSwYK4hWRSk9oKfqwcCuQBXLgK+K3rQiVF0sA5zKJwZvQ6jeASWyxp8AbKY2cT5SNfgWzlJVMZtpqiLYpmGObRtIleVLBL0SHWl6WPmOgDepzWPQEgPcijM54brD6J2BdqTNPaYjVtk5RjCw3D1P814+EvQm2Dc8JPpJ44AnGSW1GHuzbdAh6Bo0ZoAak29k2CImx/2f8he0DwEGAIxGYvVFfYjqAAAAAElFTkSuQmCC';
			break;
			
			case '*directory*':
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMzOEUwRUI5NzQwMjExRTZBREJERUQxQTE2M0U1MzhDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMzOEUwRUJBNzQwMjExRTZBREJERUQxQTE2M0U1MzhDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzM4RTBFQjc3NDAyMTFFNkFEQkRFRDFBMTYzRTUzOEMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzM4RTBFQjg3NDAyMTFFNkFEQkRFRDFBMTYzRTUzOEMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5tvTnwAAABKUlEQVR42uyZQQrCMBBFk6Fr9RKiR2j3Ih7Aw7irbnoZq7gUca9HKHiJat3HGUihiFRtMrXgfPi0FDI8JknTmWpjjOqyApXq3xLM6xME9jpEb9BXtPnCMX8GlRqhz+hBg/FLe11xAVIGk4ZwVciYE3DiIQ4bJAH2np7pDxzZ9coOCQ3H0ZqdtQEJDmNbgQTH8eyQ4CEGKyR4mgk2SG3WyrzYxU0VovfovkOMG/qIXuAxePEN6AuSlFMsUP5VTnfuGIdOt4QDsISkl/kOXTjEmXJMsdvnVqoNxy5mkwAKoAAKoAAKoAAKoAD+N2Bgq6hqf6bdlmt9A/UOtsTrqg5Uk4zx5qTceoQcoqowogxmtpbdOlZgvlRYlhALqowy+Fu9aaLrrv+GeAgwAHwsVioYKyZVAAAAAElFTkSuQmCC';
			break;
			
			case 'doc':
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMwMjU5RDRBNzQwNDExRTY5NzgwQTkwNTM1QTM0NkNFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjMwMjU5RDRCNzQwNDExRTY5NzgwQTkwNTM1QTM0NkNFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzAyNTlENDg3NDA0MTFFNjk3ODBBOTA1MzVBMzQ2Q0UiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzAyNTlENDk3NDA0MTFFNjk3ODBBOTA1MzVBMzQ2Q0UiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6icmpEAAAB8klEQVR42uyYz0rDMBzH01GvIljwoB7Fgy+wqzLwsAkT8Q3mU3iwu4jP0oIb6EUZ7uoLCHqfiOJgut0U6i/yK4SYNkmbpD34gy9t+m2bD/nlX+slSUK8mweCsQW6ALVAy8ROhKC+yo3J/g7xmfI26B60QuxGiEclyAZzfu4AjoU80wVsEbehBMkC8n3OMyQ++jqQDeI+Qh3IKgC1IKsCVIasElAJsmpAKaTHrCSJYBSbiI+Cq5JHVxIXLTgq87ALwFPQrM6Aj6Am6BI0133YdzQQnkBHss1L3ebB2qTYGWAb9AyagDoCv4M+1UGGP0G/rT7XqM+D9OXreP4K2gR9MX2Z+muKPoXckPRB7XmQHVC0ol2mvMdUruL7NlJ8xZWPM85V/GsbgDFX7oKWsDW6gvvz/MjGPDgGvYMCLAdMGgPB/Vn+FN9lHJB2+CGoJ0ktkfhDZvAYX0liDvAwawXI8SNScGQWSfMq50+56yJ/rFOh7kqSpjkrqDfI8Qc66S261MU5XiTxYxe7GT7NovTJfKstmJXmNH0y38luJpZci02ktwzgHW4I0njj0ifzrQN+g05AL6gelz6Zr/FpZ/+zUzVKb7f+t/yyefCT+wOQVMi1ELXgqEYNdysCLPUHwGDMkOUPYKk/AAZijnU3keU3fgQYACyAkm9ALs5uAAAAAElFTkSuQmCC';
			break;
			
			case 'docx':
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMwMjU5RDRBNzQwNDExRTY5NzgwQTkwNTM1QTM0NkNFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjMwMjU5RDRCNzQwNDExRTY5NzgwQTkwNTM1QTM0NkNFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzAyNTlENDg3NDA0MTFFNjk3ODBBOTA1MzVBMzQ2Q0UiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzAyNTlENDk3NDA0MTFFNjk3ODBBOTA1MzVBMzQ2Q0UiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6icmpEAAAB8klEQVR42uyYz0rDMBzH01GvIljwoB7Fgy+wqzLwsAkT8Q3mU3iwu4jP0oIb6EUZ7uoLCHqfiOJgut0U6i/yK4SYNkmbpD34gy9t+m2bD/nlX+slSUK8mweCsQW6ALVAy8ROhKC+yo3J/g7xmfI26B60QuxGiEclyAZzfu4AjoU80wVsEbehBMkC8n3OMyQ++jqQDeI+Qh3IKgC1IKsCVIasElAJsmpAKaTHrCSJYBSbiI+Cq5JHVxIXLTgq87ALwFPQrM6Aj6Am6BI0133YdzQQnkBHss1L3ebB2qTYGWAb9AyagDoCv4M+1UGGP0G/rT7XqM+D9OXreP4K2gR9MX2Z+muKPoXckPRB7XmQHVC0ol2mvMdUruL7NlJ8xZWPM85V/GsbgDFX7oKWsDW6gvvz/MjGPDgGvYMCLAdMGgPB/Vn+FN9lHJB2+CGoJ0ktkfhDZvAYX0liDvAwawXI8SNScGQWSfMq50+56yJ/rFOh7kqSpjkrqDfI8Qc66S261MU5XiTxYxe7GT7NovTJfKstmJXmNH0y38luJpZci02ktwzgHW4I0njj0ifzrQN+g05AL6gelz6Zr/FpZ/+zUzVKb7f+t/yyefCT+wOQVMi1ELXgqEYNdysCLPUHwGDMkOUPYKk/AAZijnU3keU3fgQYACyAkm9ALs5uAAAAAElFTkSuQmCC';
			break;
			
			case 'xls':
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRFQTRGNkRCNzQwNDExRTY4NjU1RjU0RDlGM0U1MUI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRFQTRGNkRDNzQwNDExRTY4NjU1RjU0RDlGM0U1MUI3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEVBNEY2RDk3NDA0MTFFNjg2NTVGNTREOUYzRTUxQjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEVBNEY2REE3NDA0MTFFNjg2NTVGNTREOUYzRTUxQjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Knp7aAAABv0lEQVR42uyYv0rDQBzHL23m4qYvID6CfYAugkOhxQyZFRx8Aoemi7gLDt0VDqo4OEkfQN9Ad0HdinVxCPEbucAR7y6XJvldBn/woX9yRz5cLt87zkuShHlPYyZqG5yDAeixZioCU5uGye6c+dLvHfAINlizFYlPK8mO9P2MQE6WnJQVHDDaspKUBfNzzquJfE3LSHYYfUVlJF0IlpJ0JWgt6VLQStK1YKEkheBnfoFQMNGEOYngokpnCsFTsGyz4DPog1uwKtvZJ3oRXsCoaPPSthxszSMmF9wH7+ANDC3aj6T2exSCM7AJtsAcBIa26TUutZ9RCMpbqC640kgG4lqX+hEfg7hAUiWX9jmhiJk7EOYEMsmsVHKh6EuSg1whIkuq5Pg6N6oS1DpJVpdcHTnIhUCsuFZZjiKoE9criSlK0v+uwYErQV2UxArJgFowMERJaJGTjb7FQ4Mc12RhJvldNgvXGcFLCzmuGckL6rXYFCWmCGpU8BB8gFcwLsg5LuZe1v6IYg7ei62Tbd0I/nfUTsrPnQD06lymKtSXagQXLRq4B5VgpROAGmspXP4IVjoBqKFW4t594fJbPwIMAAsrdk5QT2B8AAAAAElFTkSuQmCC';
			break;
			
			case 'xlsx':
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRFQTRGNkRCNzQwNDExRTY4NjU1RjU0RDlGM0U1MUI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRFQTRGNkRDNzQwNDExRTY4NjU1RjU0RDlGM0U1MUI3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEVBNEY2RDk3NDA0MTFFNjg2NTVGNTREOUYzRTUxQjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEVBNEY2REE3NDA0MTFFNjg2NTVGNTREOUYzRTUxQjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Knp7aAAABv0lEQVR42uyYv0rDQBzHL23m4qYvID6CfYAugkOhxQyZFRx8Aoemi7gLDt0VDqo4OEkfQN9Ad0HdinVxCPEbucAR7y6XJvldBn/woX9yRz5cLt87zkuShHlPYyZqG5yDAeixZioCU5uGye6c+dLvHfAINlizFYlPK8mO9P2MQE6WnJQVHDDaspKUBfNzzquJfE3LSHYYfUVlJF0IlpJ0JWgt6VLQStK1YKEkheBnfoFQMNGEOYngokpnCsFTsGyz4DPog1uwKtvZJ3oRXsCoaPPSthxszSMmF9wH7+ANDC3aj6T2exSCM7AJtsAcBIa26TUutZ9RCMpbqC640kgG4lqX+hEfg7hAUiWX9jmhiJk7EOYEMsmsVHKh6EuSg1whIkuq5Pg6N6oS1DpJVpdcHTnIhUCsuFZZjiKoE9criSlK0v+uwYErQV2UxArJgFowMERJaJGTjb7FQ4Mc12RhJvldNgvXGcFLCzmuGckL6rXYFCWmCGpU8BB8gFcwLsg5LuZe1v6IYg7ei62Tbd0I/nfUTsrPnQD06lymKtSXagQXLRq4B5VgpROAGmspXP4IVjoBqKFW4t594fJbPwIMAAsrdk5QT2B8AAAAAElFTkSuQmCC';
			break;
			
			case 'jpg':
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUxODk0OTI4QzM1ODExRTZCNTE5RDE5MjBBMDYyMzMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjUxODk0OTI5QzM1ODExRTZCNTE5RDE5MjBBMDYyMzMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTE4OTQ5MjZDMzU4MTFFNkI1MTlEMTkyMEEwNjIzMzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTE4OTQ5MjdDMzU4MTFFNkI1MTlEMTkyMEEwNjIzMzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5tLgNaAAABUElEQVR42mL8//8/w2AGLExtnwa1A5mgtCoQrwXij0D8f4DxR6hbQG5iYGRs/agOpE8AscAgC7wPQGwBCsG2Qeg4Bqib2kAOdBnESdCNBUjwoQkyDrCjkIsVHiaGQQ5GHTiYHegJxM+g2JNcQ0Dl4H8aZRKQwySh7OdALEVGJqFpCEriYI+mwVEHjjpw1IGjDhx1IBXrWlrWxYTqWnLNpVpdLIRW1yLXtxIEHEuXKD6Pxp8DdZgMEM9Fk7tJdsedAgcuA3ULkfhe0KjGBqYORAjOAuKLRKi7BMSzB8KBP4HYG4gv4FFzARqyPweqHHwKxOZAnA8dnfgKxSegYuZQNQNSzNCjXzxa1Q1/B4LKQdAIJh81Sn0agC+gENwziANwF8iB1QyQwcLBBkBuqgY58Aa0yloHxJ8HgcM+Q90CctMNFqTKPHgwxjHjYJ+GAAgwAOZ2aF0kUa5rAAAAAElFTkSuQmCC';
			break;
			
			case 'png':
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY1MDk1NEUxQzM1ODExRTY4QjU4QTg2OEM3N0NEREZFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY1MDk1NEUyQzM1ODExRTY4QjU4QTg2OEM3N0NEREZFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjUwOTU0REZDMzU4MTFFNjhCNThBODY4Qzc3Q0RERkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjUwOTU0RTBDMzU4MTFFNjhCNThBODY4Qzc3Q0RERkUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7LK9y/AAABIklEQVR42uyZQQqCUBCG3xOXEW1cdIDoCh4ghNYdoda1z723qWWL6gAdoQ4QRStNoeVrBibQFiYm+CNv4PeJuPgYZ36H97QxRiGHm6w0NKAj64i0ISUk07ISYWEmpeOlGtN6Ig3AkheTfM5gBAinhCliwAlwCQYuXfpfD9vumryt9BwFHhawTcAp6UF6kbJfflY32AdNzSZhOK+qn5EuNZrkrwx6Fd8biNdC12BQe1hoEEKX+Vlnu7jJDJYNlhl6Bg/IgGwza0TAlLQVDzwjdrH9F1tAC2gBuw54y93fEQEXAnYlzRGnmR1paGvQAjZQg09V3J9B2nLNOINH4ATuGTCUqRctmCl0ZNr1ZfpNAcAKk/jHB3lbYob4jTX6McRbgAEAkMVccwpWYlQAAAAASUVORK5CYII=';
			break;
			
			case 'gif':
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZERUJBMUFFQzM1ODExRTY5MUUzQjZDMkQ3RjAxQUYzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZERUJBMUFGQzM1ODExRTY5MUUzQjZDMkQ3RjAxQUYzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkRFQkExQUNDMzU4MTFFNjkxRTNCNkMyRDdGMDFBRjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkRFQkExQURDMzU4MTFFNjkxRTNCNkMyRDdGMDFBRjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz457Ud1AAABxUlEQVR42uyZMUsDQRCFc+eRSoOlipUQBAVbBQVFRIx26j/QQkUQW9OnDFhYiFhaamcQ8QeIlYiYiGClYmlMChX0fCMTWIYk4CV3O0oGPsIcCXmZ3X2zQxzf92Oaw8uPTagW6PJrEhyCIvAtU2QtyZ8Kgn5wDjqVFC0B5sEkGKEKZhSJM4M0ZUjglOItOO1xSc1wLIsybaXdjSmPlkANAgdAFuTBG3gCqaZ1kgY+G2dhq+KHdoN90GNTIIk7rmNRju0lztYR9wiWbAocBCvi2R1YZPfvBTmbe3AZtBn5LfVM8KLlFM+IfCsscUEF9on8TJsPxkX++tc6SYrNWl5EAxl4GAL32axlVAxcdS92ohD4UeWKLm3ouVkGHkTgvchlR8nVWOJABh5E4InIq800XSIvR3mKaaN/GjlNhRc8iXVwpeRhuI6y1dGX7YI141llrq4VB1H74OYvOsgV2ItaIJ3kObADvuq87xLMgncbnYREroMhsA0ejLGxADbAMNtLcOO8GR33Fc/FrbHz/wv0+D6XqLUHLEfZDftG3GCcksB0mDNFA0Ga0i57Fk1lR6CkQFiJtZCmgmeMjgsa19jR/jfEtwADADPseEBEEW8vAAAAAElFTkSuQmCC';
			break;
			
			default:
				return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY1ODI1MzM0NzU2QjExRTY5RUY1RTExMjUxRjA4Njg5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY1ODI1MzM1NzU2QjExRTY5RUY1RTExMjUxRjA4Njg5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjU4MjUzMzI3NTZCMTFFNjlFRjVFMTEyNTFGMDg2ODkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjU4MjUzMzM3NTZCMTFFNjlFRjVFMTEyNTFGMDg2ODkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4jpAzJAAABHklEQVR42uyYwQ2DIBSGsfHcdImmKziAG3QHl+hBuDSdwSE6QOMAHaHdwtTe6W+DhhqwGBU5vD/5g0QIn8DD8CIpJWtVFMUexQVO4S1bRhwWbSXLssHGsQZ3QHGHd2xZcVUKl8Yb7fnsAU6HzMcCpsyvnCCjdg9iiaX+AnsjchkF/f41kb266IFxjCVcZtDnzOlAHB+ZhwQ4CnItQGfINQGdINcGbIJxENIH4MsQ1Z3V6ZFbDnMvgOWUzj4AT3AVMuADTuArXI/tHHuKhSd8tASJ8U8WTBSHsMQESIAESIAESIAESIAESIAESIAut7omA9DlpW23rLllyS++TTNYBjRxNxPgpAzAjKoUyy8gLtCTMgAzqFZjJ4rlq48AAwAvBlWL3NQYkQAAAABJRU5ErkJggg==';
			break;
		}
	};
	self.eventbox=function(){
		document.querySelector('.utc_popupbox.filelist .backoff').addEventListener('click', function(){
			self.load(document.querySelector('.utc_popupbox.filelist dl').getAttribute('data-parentpath'));
			self.ifsure('');
		});
		document.querySelector('.utc_popupbox.filelist .refresh').addEventListener('click', function(){
			self.load(document.querySelector('.utc_popupbox.filelist dl').getAttribute('data-path'));
			self.ifsure('');
		});
		document.querySelector('.utc_popupbox.filelist .desktop').addEventListener('click', function(){
			self.load('desktop');
			self.ifsure('');
		});
		document.querySelector('.utc_popupbox.filelist .view').addEventListener('click', function(){
			if(self.listtype=='linelist'){
				self.listtype='blocklist';
				document.querySelector('.utc_popupbox.filelist dl').classList.remove('linelist');
				document.querySelector('.utc_popupbox.filelist dl').classList.add('blocklist');
			}else{
				self.listtype='linelist';
				document.querySelector('.utc_popupbox.filelist dl').classList.remove('blocklist');
				document.querySelector('.utc_popupbox.filelist dl').classList.add('linelist');
			};
		});

		document.querySelector('.utc_popupbox.filelist .close').addEventListener('click', function(){
			self.close();
		});
		document.querySelector('.utc_popupbox.filelist .sure').addEventListener('click', function(){
			self.sure();
		});
	};
	self.eventlist=function(i){
		document.querySelectorAll('.utc_popupbox.filelist dd')[i].addEventListener('click', function(){
			if(self.checkbox){
			}else{
				for(var o=0;o<document.querySelectorAll('.utc_popupbox.filelist dd').length;o++){
					document.querySelectorAll('.utc_popupbox.filelist dd')[o].classList.remove('active');
				};
				this.classList.add('active');
				self.ifsure(this.children[2].innerText);
			};
		});
		document.querySelectorAll('.utc_popupbox.filelist dd')[i].addEventListener('dblclick', function(){
			if(self.checkbox){
				if(this.children[2].innerText=='文件夹'||this.children[2].innerText=='计算机'){
					self.load(this.getAttribute('data-path'));
				};
			}else{
				if(this.children[2].innerText=='文件夹'||this.children[2].innerText=='计算机'){
					self.load(this.getAttribute('data-path'));
				}else{
					self.sure();
				};
			};
		});
	};
	self.initialize();
};

//选证书
function UTCserver_Certlist(){
	var self=this;
	self.initialize=function(){
	};
	self.dnsplit=function(cert,data){
		var obj='';
		var dn=cert.SubjectDN+', ';
		var is=cert.IssuerDN+', ';
		switch(data){
			case 'dn' :
			obj=cert.SubjectDN;
			break;
			case 'cn' :
			try{
				obj=dn.match(/CN=.+?, /)[0];
				obj=obj.substring(3,obj.length-2);
			}catch(e){obj='无';};
			break;
			case 'o' :
			try{
				obj=dn.match(/O=.+?, /)[0];
				obj=obj.substring(2,obj.length-2);
			}catch(e){obj='无';};
			break;
			case 'is' :
			try{
				obj=is.match(/O=.+?, /)[0];
				obj=obj.substring(2,obj.length-2);
			}catch(e){obj='无';};
			break;
			case 'sn' :
			try{
				obj=cert.SerialNumber;
			}catch(e){obj='无';};
			break;
			case 'date' :
			obj=cert.Date;
			break;
			default:
			obj='无';
		};
		return obj;
	};
	self.content=function(array){
		if(self.json.ui==false){
			var obj=[];
			for(var i=0;i<array.length;i++){
				switch(self.json.content){
					case 'dn' :
					obj.push(self.dnsplit(array[i],'dn'));
					break;
					case undefined :
					obj.push(self.dnsplit(array[i],'dn'));
					break;
					case 'cn' :
					obj.push(self.dnsplit(array[i],'cn'));
					break;
					case 'sn' :
					obj.push(self.dnsplit(array[i],'sn'));
					break;
					case 'o' :
					obj.push(self.dnsplit(array[i],'o'));
					break;
					case 'is' :
					obj.push(self.dnsplit(array[i],'is'));
					break;
					case 'date' :
					obj.push(self.dnsplit(array[i],'date'));
					break;
					default:
					obj=array;
				};
			};
		}else{
			var obj='';
			switch(self.json.content){
				case 'dn' :
				obj=self.dnsplit(array,'dn');
				break;
				case undefined :
				obj=self.dnsplit(array,'dn');
				break;
				case 'cn' :
				obj=self.dnsplit(array,'cn');
				break;
				case 'sn' :
				obj=self.dnsplit(array,'sn');
				break;
				case 'o' :
				obj=self.dnsplit(array,'o');
				break;
				case 'is' :
				obj=self.dnsplit(array,'is');
				break;
				case 'date' :
				obj=self.dnsplit(array,'date');
				break;
				default:
				obj=array;
			};
		};
		return obj;
	};
	self.getlist=function(callback){
		var listarray=[];
		if(typeof(self.json.type)=='undefined'||self.json.type.indexOf('key')>=0||self.json.type==''){
			UTCserver.Plugin.GetAEKeyCertListDetail(function(state,key){
				UTCserver.closeloading();
				listarray=listarray.concat(key);
				if(typeof(self.json.type)!='undefined'&&self.json.type.indexOf('ie')>=0){
					UTCserver.Plugin.GetCertListDetailFromIE(function(state,ie){
						listarray=listarray.concat(ie);
						callback(listarray);
					});
				}else{
					callback(listarray);
				};
			});
		}else{
			if(typeof(self.json.type)!='undefined'&&self.json.type.indexOf('ie')>=0){
				UTCserver.Plugin.GetCertListDetailFromIE(function(state,ie){
					UTCserver.closeloading();
					listarray=listarray.concat(ie);
					callback(listarray);
				});
			}else{
				callback(listarray);
			};
		};
	};
	self.load=function(callback){
		self.getlist(function(listarray){
			if(listarray.length==0){
				UTCserver.GetKeyInfo({
					type:'id',
					success:function(id){
						self.callback('fail','没有获取到证书');
					},
					fail:function(message){
						self.callback('fail','没有检测到钥匙');
					}
				});
			}else{
				if(self.json.ui==false){
					self.callback('success',self.content(listarray));
				}else{
					if(listarray.length==1){
						self.callback('success',self.content(listarray[0]));
					}else{
						try{callback();}catch(e){};
						document.querySelector('.utc_popupbox.certlist dl').innerHTML='';
						var keyliststr=[];
						for(var i=0;i<listarray.length;i++){
							keyliststr.push(JSON.stringify(listarray[i]));
							var node=document.createElement("dd");
							node.setAttribute('num',JSON.stringify(listarray[i]));
							var is=self.dnsplit(listarray[i],'is');
							if(is=='无'){
								is='';
							}else{
								is='<span>由'+is+'颁发</span>';
							};
							node.innerHTML='<span class="name">证书名：'+self.dnsplit(listarray[i],'cn')+'</span>'+is+'<span>序列号 '+self.dnsplit(listarray[i],'sn')+'</span><span>有效期 '+self.dnsplit(listarray[i],'date')+'</span>';
							document.querySelector('.utc_popupbox.certlist dl').appendChild(node);
							self.eventlist(0,i);
						};
						self.addClass(document.querySelectorAll('.utc_popupbox.certlist dl dd')[0],'active');
					};
				};
			};
		});
	};
	self.close=function(){
		self.fadeOut(document.querySelector('.utc_popupbox.certlist'),function(){
			document.querySelector('.utc_popupbox.certlist').parentNode.removeChild(document.querySelector('.utc_popupbox.certlist'));
		});
	};
	self.sure=function(){
		self.callback('success',self.content(eval('('+document.querySelector('.utc_popupbox.certlist dl dd.active').getAttribute('num')+')')));
		self.close();
	};
	self.get=function(json,callback){
		self.json=json;
		self.callback=callback;
		self.load(function(){
			var node=document.createElement("div");
			self.addClass(node,'utc_popupbox');
			self.addClass(node,'certlist');
			var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><div class="utc_title">选择证书</div><div class="utc_con"><dl></dl></div><div class="utc_btn"><button class="sure">确定</button><button class="close">关闭</button></div></div>';
			node.innerHTML=divbox;
			if(document.querySelectorAll('.utc_popupbox.certlist').length==0){
				document.body.appendChild(node);
				self.fadeIn(document.querySelector('.utc_popupbox.certlist'));
				self.eventbox();
			};
		});
	};
	self.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	self.addClass=function(obj, cls) {
	    if (!self.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	self.removeClass=function(obj, cls) {
	    if (self.hasClass(obj, cls)) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        obj.className = obj.className.replace(reg, ' ');
	    };
	};
	self.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){/*console.log(e.message)*/};
		    }
		  };
		
		  tick()
		}catch(e){};
	};
	self.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){/*console.log(e.message)*/};
		    }
		  };
		
		  tick()
		}catch(e){};
	};
	self.eventbox=function(){
		for(var o=0;o<document.querySelectorAll('.utc_popupbox.certlist .oper li').length;o++){
			document.querySelectorAll('.utc_popupbox.certlist .oper li')[o].index=o;
			if(document.addEventListener){
				document.querySelectorAll('.utc_popupbox.certlist .oper li')[o].addEventListener('click', function(){
					var _this=this;
					self.eventboxfun1(_this);
				});
			}else{
				document.querySelectorAll('.utc_popupbox.certlist .oper li')[o].attachEvent('onclick', function(e){
					e=e||window.event;
	                var _this=e.srcElement||e.target;
					self.eventboxfun1(_this);
				});
			};
		};
		if(document.addEventListener){
			document.querySelector('.utc_popupbox.certlist .close').addEventListener('click', function(){
				self.eventboxfun2();
			});
			document.querySelector('.utc_popupbox.certlist .sure').addEventListener('click', function(){
				self.eventboxfun3();
			});
		}else{
			document.querySelector('.utc_popupbox.certlist .close').attachEvent('onclick', function(){
				self.eventboxfun2();
			});
			document.querySelector('.utc_popupbox.certlist .sure').attachEvent('onclick', function(){
				self.eventboxfun3();
			});
		};
	};
	self.eventboxfun1=function(_this){
		for(var i=0;i<document.querySelectorAll('.utc_popupbox.certlist dl').length;i++){
			self.removeClass(document.querySelectorAll('.utc_popupbox.certlist dl')[i],'show');
		};
		self.addClass(document.querySelectorAll('.utc_popupbox.certlist dl')[_this.index],'show');
	};
	self.eventboxfun2=function(){
		self.close();
	};
	self.eventboxfun3=function(){
		self.sure();
	};
	self.eventlist=function(e,i){
		if(document.addEventListener){
			document.querySelectorAll('.utc_popupbox.certlist dl')[e].children[i].addEventListener('click', function(){
				var _this=this;
				self.eventlistfun(e,_this);
			});
		}else{
			document.querySelectorAll('.utc_popupbox.certlist dl')[e].children[i].attachEvent('onclick', function(w){
				w=w||window.event;
                var _this=document.querySelectorAll('.utc_popupbox.certlist dl')[e].children[i];
				self.eventlistfun(e,_this);
			});
		};
	};
	self.eventlistfun=function(e,_this){
		document.querySelectorAll('.utc_popupbox.certlist dl')[e].setAttribute('num',_this.getAttribute('num'));
		for(var o=0;o<document.querySelectorAll('.utc_popupbox.certlist dl')[e].children.length;o++){
			self.removeClass(document.querySelectorAll('.utc_popupbox.certlist dl')[e].children[o],'active');
		};
		self.addClass(_this,'active');
	};
	self.initialize();
};

//选印章
function UTCserver_Seallist(){
	var self=this;
	self.initialize=function(){
	};
	self.load=function(pin,callback){
		UTCserver.Plugin.GetEKeyPic(pin,function(state,data){
			if(state=='success'){
				var obj = eval("(" + data + ")");
				if(self.json.ui==false){
					var backarray=[];
					for(var i=0;i<obj.length;i++){
						obj[i].data='data:image/png;base64,'+obj[i].data;
						backarray.push({id:obj[i].id,name:obj[i].name,img:obj[i].data});
					};
					self.callback(state,backarray);
				}else{
					if(obj.length==1){
						self.callback(state,'data:image/png;base64,'+obj[0].data);
					}else{
						try{callback();}catch(e){};
						var sealarray=[];
						var signarray=[];
						var waterarray=[];
						for(var i=0;i<obj.length;i++){
							obj[i].data='data:image/png;base64,'+obj[i].data;
							switch(obj[i].id){
								case 4 :
									signarray.push(obj[i]);
								break;
								case 5 :
									waterarray.push(obj[i]);
								break;
								default :
									sealarray.push(obj[i]);
								break;
							};
						};
						var imgcon='';
						imgcon+='<dl class="seal"><dt>印章</dt></dl>';
						imgcon+='<dl class="sign"><dt>签名</dt></dl>';
						imgcon+='<dl class="water"><dt>水印</dt></dl>';
						document.querySelector('.utc_popupbox.seallist .utc_con').innerHTML=imgcon;
						for(var i=0;i<sealarray.length;i++){
							var node=document.createElement('dd');
							node.setAttribute('num',sealarray[i].id)
							node.style.backgroundImage='url('+sealarray[i].data+')';
							self.addClass(node,'img');
							if(document.querySelector('.utc_popupbox.seallist .utc_con .seal')){
								document.querySelector('.utc_popupbox.seallist .utc_con .seal').appendChild(node);
							};
						};
						for(var i=0;i<signarray.length;i++){
							var node=document.createElement('dd');
							node.setAttribute('num',signarray[i].id)
							node.style.backgroundImage='url('+signarray[i].data+')';
							self.addClass(node,'img');
							if(document.querySelector('.utc_popupbox.seallist .utc_con .sign')){
								document.querySelector('.utc_popupbox.seallist .utc_con .sign').appendChild(node);
							};
						};
						for(var i=0;i<waterarray.length;i++){
							var node=document.createElement('dd');
							node.setAttribute('num',waterarray[i].id)
							node.setAttribute('title',waterarray[i].name)
							node.style.backgroundImage='url('+waterarray[i].data+')';
							self.addClass(node,'img');
							if(document.querySelector('.utc_popupbox.seallist .utc_con .water')){
								document.querySelector('.utc_popupbox.seallist .utc_con .water').appendChild(node);
							};
						};
						self.addClass(document.querySelectorAll('.utc_popupbox.seallist .img')[0],'active');
						if(sealarray.length==0){
							var nonode=document.createElement("div");
							self.addClass(nonode,'hint');
							nonode.innerHTML='电子钥匙中没有印章';
							if(document.querySelector('.utc_popupbox.seallist .utc_con .seal')){
								document.querySelector('.utc_popupbox.seallist .utc_con .seal').appendChild(nonode);
							};
						};
						if(signarray.length==0){
							var nonode=document.createElement("div");
							self.addClass(nonode,'hint');
							nonode.innerHTML='电子钥匙中没有签名';
							if(document.querySelector('.utc_popupbox.seallist .utc_con .sign')){
								document.querySelector('.utc_popupbox.seallist .utc_con .sign').appendChild(nonode);
							};
						};
						if(waterarray.length==0){
							var nonode=document.createElement("div");
							self.addClass(nonode,'hint');
							nonode.innerHTML='电子钥匙中没有水印';
							if(document.querySelector('.utc_popupbox.seallist .utc_con .water')){
								document.querySelector('.utc_popupbox.seallist .utc_con .water').appendChild(nonode);
							};
						};
						self.eventlist();
					};
				};
			};
			if(state=='fail'){
				self.callback(state,data);
			};
		});
	};
	self.close=function(){
		self.fadeOut(document.querySelector('.utc_popupbox.seallist'),function(){
			document.querySelector('.utc_popupbox.seallist').parentNode.removeChild(document.querySelector('.utc_popupbox.seallist'));
		});
	};
	self.sure=function(){
		var surecon={id:document.querySelector('.utc_popupbox.seallist .img.active').getAttribute('num'),name:document.querySelector('.utc_popupbox.seallist .img.active').getAttribute('title'),img:document.querySelector('.utc_popupbox.seallist .img.active').style.backgroundImage.substring(5,document.querySelector('.utc_popupbox.seallist .img.active').style.backgroundImage.length-2)};
		self.callback('success',surecon);
		self.close();
	};
	self.get=function(json,callback){
		self.json=json;
		self.callback=callback;
		self.load(json.pin,function(){
			var node=document.createElement("div");
			self.addClass(node,'utc_popupbox');
			self.addClass(node,'seallist');
			var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><div class="utc_con"></div><div class="utc_btn"><button class="sure">确定</button><button class="close">关闭</button></div></div>';
			node.innerHTML=divbox;
			document.body.appendChild(node);
			self.fadeIn(document.querySelector('.utc_popupbox.seallist'));
			self.eventbox();
		});
	};
	self.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	self.addClass=function(obj, cls) {
	    if (!self.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	self.removeClass=function(obj, cls) {
	    if (self.hasClass(obj, cls)) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        obj.className = obj.className.replace(reg, ' ');
	    };
	};
	self.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){/*console.log(e.message)*/};
		    }
		  };
		
		  tick()
		}catch(e){};
	};
	self.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){/*console.log(e.message)*/};
		    }
		  };
		
		  tick()
		}catch(e){};
	};
	self.eventbox=function(){
		if(document.addEventListener){
			document.querySelector('.utc_popupbox.seallist .close').addEventListener('click', function(){
				self.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.seallist .sure').addEventListener('click', function(){
				self.eventboxfun2();
			});
		}else{
			document.querySelector('.utc_popupbox.seallist .close').attachEvent('onclick', function(){
				self.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.seallist .sure').attachEvent('onclick', function(){
				self.eventboxfun2();
			});
		};
	};
	self.eventboxfun1=function(){
		self.callback('fail','取消选择印章');
		self.close();
	};
	self.eventboxfun2=function(){
		self.sure();
	};
	self.eventlist=function(){
		if(document.addEventListener){
			for(var o=0;o<document.querySelectorAll('.utc_popupbox.seallist .img').length;o++){
				document.querySelectorAll('.utc_popupbox.seallist .img')[o].addEventListener('click', function(){
					var _this=this;
					self.eventlistfun(_this);
				});
			};
		}else{
			for(var o=0;o<document.querySelectorAll('.utc_popupbox.seallist .img').length;o++){
				document.querySelectorAll('.utc_popupbox.seallist .img')[o].attachEvent('onclick', function(w){
					w=w||window.event;
	                var _this=document.querySelectorAll('.utc_popupbox.seallist .img')[o];
					self.eventlistfun(_this);
				});
			};
		};
	};
	self.eventlistfun=function(_this){
		for(var o=0;o<document.querySelectorAll('.utc_popupbox.seallist .img').length;o++){
			self.removeClass(document.querySelectorAll('.utc_popupbox.seallist .img')[o],'active');
		};
		self.addClass(_this,'active');
	};
	self.initialize();
};

//loading
function UTCserver_Loading(){
	var self=this;
	self.ran=UTCserver.randomnum(4);
	self.initialize=function(){
	};
	self.close=function(){
		self.fadeOut(document.querySelector('.utc_popupbox.loading.ran'+self.ran),function(){
			document.querySelector('.utc_popupbox.loading.ran'+self.ran).parentNode.removeChild(document.querySelector('.utc_popupbox.loading.ran'+self.ran));
		});
	};
	self.get=function(){
		var node=document.createElement("div");
		self.addClass(node,'utc_popupbox');
		self.addClass(node,'loading');
		self.addClass(node,'ran'+self.ran);
		var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><img src="data:image/gif;base64,R0lGODlhKAAoAJEDAAGg6v///6be+P///yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkREREQ3N0ZCNzk4NzExRTY4QTY2Q0VFQkJFQjkyNENDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkREREQ3N0ZDNzk4NzExRTY4QTY2Q0VFQkJFQjkyNENDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RERERDc3Rjk3OTg3MTFFNjhBNjZDRUVCQkVCOTI0Q0MiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RERERDc3RkE3OTg3MTFFNjhBNjZDRUVCQkVCOTI0Q0MiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQFBAADACwAAAAAKAAoAAACWIyPqcvtD6OctNo7gd68+6854EhuYol6Z8oCa4u+MCnPYG2rTV7ivLn73YJCHaP48QmVPybPmYPapDMqzNrCsrQpboyIBB7DHG8PTDbT0GGM+w2Py+f0SgEAIfkEBQQAAwAsBQAEAB4AIAAAAlOMgQLCEm6inBLZi9dqkOYPWl5IXmNZnmiorl/rYnAsTjQ43zm9x737WwVRw5TtlimSlKwj0uR8Ipi4qJT6sj6xSS2SK/PqxB8F50EJWMzntDtQAAAh+QQFBAADACwIAAMAGAAiAAACTowhacvtAGMSrp6I4bQre7w13xg95GieXqpibAu9sNzSqn3ipI6KsOv7xYJC3se4Iv6QGSaQISwpZ9Na9XbNZXfbHvSn4IU5njHnaz4vCgAh+QQFBAADACwLAAIAEgAkAAACTowhpsuH2SKYE0ZFqbAyZ7543taIYmlmaDqtrJvCpnwyLEV7uWrfwI7r3YAt4csYQ86UtZCP+GPqpDznkBq0pkCBY2d66VbD4igZc1YUAAAh+QQFBAADACwOAAEADAAmAAACQ4xlqQa4CsCDbbLoXsRzx+5lifctpGSSmpp6q9turxyXFHzTuT2yO/qb8S64XpGoMyaRw8BJKGKCOK9oz9qzMLAJbgEAIfkEBQQAAwAsEQABAAYAJgAAAg2Mj6nL7Q+jnLTai20BACH5BAUEAAMALBEAAQAGACYAAAIhnC03AgqNXpTsNfsq3rz7D4biSJbmpkmbgU3QIh1xpCwFACH5BAUEAAMALA4AAQAMACYAAAIrjI+pBhsCohIwtlOtfFmD7oXiSJbmiabqyrbuC8fy7AXmQSbiUjuWgwMeCgAh+QQFBAADACwLAAIAEgAkAAACLoyPqYsiAJhxsMb2rI50+w+G4kiW5omm6sq27gvH8kzXNuBkZJKHUq+R8ChCRgEAIfkEBQQAAwAsCAADABgAIgAAAjOMj6nLJv+AADQICyXdvPsPhuJIluaJpurKtu4Lx/JM1/aN5/rOuw40mZgaiAtQUyEqDQUAIfkEBQQAAwAsBQAEAB4AIAAAAiWMj6lr4A+jnLTai7PevPsPhuJIluaJpurKtu4Lx/JM1zOD50cBACH5BAUEAAMALAQABQAgAB4AAAJIjI+py+0PYwK02ouz3rz7D4aZIIhhaXpkqqLstr6wK2NCUGtGnu385ftVgkIA8XcL0H6GZS7prEGLgGnRKkziigiq5AsOi8UFACH5BAUEAAMALAMACAAiABgAAAJEjI+py+0P4wO02ouz3rxT4YWZEIhmRZ6noZoG2HZkAMfbXNobou9HP0LUgB8h0YJjHSmKJTMx7CVfy6mSKMlqt9zuogAAIfkEBQQAAwAsAgALACQAEgAAAjCMj6nL7Q+jPKDai7PeYfuvGeAIUuR5IegKJCypvOMie0zN3Xja7HzvmwiHxKKxUQAAIfkEBQQAAwAsAQAOACYADAAAAiiMj6nL7Q+jbALYi7PeXBgOhpt3VOKpkYmJoqrCtmAUy9c75frO91ABACH5BAUEAAMALAEAEQAmAAYAAAINjI+py+0Po5y02ottAQAh+QQFBAADACwBABEAJgAGAAACHJw/AsvtDwSaCNq7JDUK+6dN3UcyYVKmDqe2ZgEAIfkEBQQAAwAsAQAOACYADAAAAiiML6DL7SuOnK9aNXO4vEVtdKLygeNYUudormIaum8mo1J93vi87XMBACH5BAUEAAMALAIACwAkABIAAAI9jCOgy+0tjkSvWhWnSbezrHniohnjWHJnBx7qarUm7IV0Z9+x9OpO2/N9JMILsVhxISuZ4BKQeSYD0kegAAAh+QQFBAADACwDAAgAIgAYAAACRYyBqcttL5qcSrxDM7sh6o9YEAiKhkdmZpdqa+teKCxddGbfU647T187ARum4UZorCCToSVTNEuKmBVLNImhIrJaLjVQAAA7"><div class="hint">正在加载</div></div>';
		node.innerHTML=divbox;
		if(document.querySelectorAll('.utc_popupbox.loading.ran'+self.ran).length==0){
			document.body.appendChild(node);
			self.fadeIn(document.querySelector('.utc_popupbox.loading.ran'+self.ran));
		};
	};
	self.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	self.addClass=function(obj, cls) {
	    if (!self.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	self.removeClass=function(obj, cls) {
	    if (self.hasClass(obj, cls)) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        obj.className = obj.className.replace(reg, ' ');
	    };
	};
	self.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		
		  tick()
		}catch(e){};
	};
	self.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		
		  tick()
		}catch(e){};
	};
	self.initialize();
};

export default UTCserver
