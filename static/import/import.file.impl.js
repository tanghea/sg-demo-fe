//对import_file进行扩展
	import_file.extend({
		//上传方法的实现
		importFile : function (parameter,callback) {
				$.ajaxfileImport({//ajaxFileImport包已经修改成支持json.  不是所有的ajaxFileImport都支持json
			 		//固定不能修改 它对应的是 接口方法的 value = "/upload"
			 		url : parameter.url,
			 		//文件上传空间的id属性  <input type="file" id="id_file" name="file" />,可以修改，主要看你使用的 id是什么 
			 		fileElementId : parameter.fileElementId,
			 		type : 'post',//固定 post类型 不可修改 
			 		dataType : 'json', //返回值类型 一般设置为json
			 		data : JSON.parse(parameter.param),//参数
			 		success : function(data, status) //服务器成功响应处理函数
			 		{
			 			callback(data);
			 		},
			 		error : function(data, status) //服务器成功响应处理函数
			 		{
			 			callback(status);
			 		}
				});
		}
    });		
