/**
 * 导入接口定义
 * auther ck 
 * addTime 20170906
 */
var import_file = function(){}
// 通过prototype对象定义类的其他成员；
//接口方法的定义
import_file.prototype = {
	/**
    * 导入方法
    * @param parameter 必要参数
    * @param callback  回调函数
    */
	filesystem_import: function(parameter,callback) {
		import_file.importFile(parameter,callback);
	}
}
// 实现继承的方法  
import_file.extend = function(o, p) {  
	debugger
	if ( !p ) {p = o; o = this; }  
	for ( var i in p ) o[i] = p[i];  
	return o;  
}; 