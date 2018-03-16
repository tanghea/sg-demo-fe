//author:gaotg
var RSA = function(){
	var configuration = {
			url : "/sg-basedoc-orgrights/sglogin/getPublicKey",
			type : "POST"
	};
	//获取公钥，放置到页面中
	function getPublicKey(){
		$(document).ready(
				function() {
					$.ajax( {
						type : configuration.type,
						url : configuration.url,
						async : false,
						data : "",
						success : function(msg) {
							$(document.body).append(
									"<input id='publicKey' name='publicKey' type='hidden' value='"
											+ msg + "'/>");
						}
					});
				});
	}
	//使用公钥对字符串进行加密
	function encryptStringByRSA(str){
		var encryptedStr  = str;
		var publicKey = $("#publicKey").val();
		if(publicKey != undefined && publicKey != null && publicKey != "" && publicKey != "null"){
			var array = publicKey.split("||");
			if(array.length == 2){
				var modulus = array[0];
				var exponent = array[1];
				var keyPair = RSAUtils.getKeyPair(exponent, '', modulus);
				encryptedStr = RSAUtils.encryptedString(keyPair, str);
			}
		}
		return encryptedStr;
	}
	return {
		getPublicKey : getPublicKey,
		encryptString : encryptStringByRSA
	};
}();

RSA.getPublicKey();
