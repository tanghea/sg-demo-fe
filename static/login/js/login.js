var verify_code = GetQueryString('verify_code');

var tokenusername = GetQueryString('tokenusername');
var tokeninfo = GetQueryString('tokeninfo');
var openid = GetQueryString('openid');
var service = GetQueryString('service');
var token = GetQueryString('token');

var piccodevalue = true;// 验证码是否输入正确

if (GetQueryString("sysid") == "ipu") {
    if(GetQueryString("ipuid")=="nfsn") {
        document.getElementById("container").className = "nfsn";
        $("#oauthloginUrl").hide();
        $("#registerurl").html("供应商注册").attr("href","http://yc.yonyou.com/yuncai/privateportal#/pages/supplymgr/supplyapplyregister?purentid=92");
    }else{
        document.getElementById("container").className = "ipu";
    }
	document.getElementById("casself_back").style.display = 'none';
} else if (GetQueryString("sysid") == "hr_cloud") {
	document.getElementById("container").className = "hr_cloud";
	document.getElementById("casself_back").style.display = 'none';
	// document.getElementById("registerUrlnow").style.display = "none";
	$(".RegisterP").hide();
} else if (GetQueryString("sysid") == "iform") {
	document.getElementById("container").className = "iform";
	document.getElementById("casself_back").style.display = 'none';
} else if (GetQueryString("sysid") == "einvoice") {
	document.getElementById("container").className = "einvoice";
	document.getElementById("casself_back").style.display = 'none';
} else if (GetQueryString("sysid") == "yy_construction") {
	document.getElementById("container").className = "yy_construction";
	document.getElementById("casself_back").style.display = 'none';
} else if (GetQueryString("sysid") == "icop") {
	document.getElementById("container").className = "icop";
	document.getElementById("casself_back").style.display = 'none';
} else if (GetQueryString("sysid") == "workbench") {
	document.getElementById("container").className = "workbench";
	document.getElementById("casself_back").style.display = 'none';
} else if (GetQueryString("sysid") == "tenant") {
	document.getElementById("container").className = "huishangyun";
	document.getElementById("casself_back").style.display = 'none';
}else if (GetQueryString("sysid") == "idm") {
	document.getElementById("container").className = "idm";
	document.getElementById("casself_back").style.display = 'none';
}
else if(GetQueryString("sysid")=="iesb"){
    document.getElementById("container").className = "iesb";
    document.getElementById("casself_back").style.display = 'none';
}
else if(GetQueryString("sysid")=="ublinker"){
    document.getElementById("container").className = "ublinker";
    document.getElementById("casself_back").style.display = 'none';
}
else if(GetQueryString("sysid")=="uzhao"){
    document.getElementById("container").className = "uzhao";
    document.getElementById("casself_back").style.display = 'none';
}
document.getElementById("password").value = '';
function getFun(funName) {// 检测是否显示用户注册
	$.ajax({
		url : "/cas/sys/getfun?funName=" + funName,
		type : 'get',
		dataType : 'json',
		success : function(result) {
			if (result.status == 1) {
				// console.log(result.msg);
				document.getElementById("ermsg").style.display = "block";
				document.getElementById("ermsg").innerHTML = result.msg;
			} else {

			}
		},
		error : function(e) {
			alert(e.message || "网络请求失败");
		}
	});
}
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
};

if (openid != null && openid.length > 0
		&& document.getElementsByName('error_info').length == 0) {
	try {
		document.getElementById('username').value = openid;
		document.getElementById('shaPassword').value = openid;
		doLogin();
		document.getElementById('fm1').submit();
	} catch (e) {
		alert("error")
	}
}

else if (tokeninfo != null && tokeninfo.length > 0
		&& document.getElementsByName('error_info').length == 0) { // 根据是否 用
																	// token登录来判断是否
																	// 显示界面
	try {
		document.getElementById('username').value = tokenusername;
		document.getElementById('shaPassword').value = tokeninfo;
		document.getElementById('tokeninfo').value = tokeninfo;
		document.getElementById('isAutoLogin').value = "1";
		doLogin();
	} catch (e) {
		alert("error")
	}
} 

else if (token != null && token.length > 0
		&& document.getElementsByName('error_info').length == 0) { // 根据是否用
																	// token登录来判断是否
																	// 显示界面
	try {
		document.getElementById('username').value = token;
		document.getElementById('shaPassword').value = token;
		document.getElementById('tokeninfo').value = token;
		document.getElementById('isAutoLogin').value = "1";
		doLogin();
	} catch (e) {
		alert("error")
	}
} 

else {
	if (GetQueryString("sysid") == "ipu") {
        if(GetQueryString("ipuid")=="nfsn") {
            document.getElementById("container").className = "nfsn";

        }else{
            document.getElementById("container").className = "ipu";

        }
		// document.getElementById("casself_back").style.display = 'none';
	} else if (GetQueryString("sysid") == "hr_cloud") {
		document.getElementById("container").className = "hr_cloud";
	} else if (GetQueryString("sysid") == "iform") {
		document.getElementById("container").className = "iform";
	} else if (GetQueryString("sysid") == "einvoice") {
		document.getElementById("container").className = "einvoice";

	}else if (GetQueryString("sysid") == "idm") {
		document.getElementById("container").className = "idm";

	} else if (GetQueryString("sysid") == "yy_construction") {
		document.getElementById("container").className = "yy_construction";
	} else if (GetQueryString("sysid") == "icop") {
		document.getElementById("container").className = "icop";
	} else if (GetQueryString("sysid") == "workbench") {
		document.getElementById("container").className = "workbench";
	} else if (GetQueryString("sysid") == "tenant") {
		document.getElementById("container").className = "huishangyun";
	} else if(GetQueryString("sysid")=="iesb"){
        document.getElementById("container").className = "iesb";
    }else if(GetQueryString("sysid")=="ublinker"){
        document.getElementById("container").className = "ublinker";
    }else if(GetQueryString("sysid")=="uzhao"){
        document.getElementById("container").className = "uzhao";
    }else {
		//document.getElementById('casself_back').style.display = 'block';
	}
	document.getElementById('login').style.display = 'block';
}
document.getElementById('modify_newpass').value = '';
// var error_info = "需要修改密码" //修改密码
// var error_info2 ="密码修改失败" ;
if (!elementIsNull('msg')
		&& (document.getElementById('msg').innerHTML == error_info || document
				.getElementById('msg').innerHTML == error_info2)) {
	document.getElementById('fm1').style.display = 'none';
	document.getElementById('fm2').style.display = 'block';
	if (modify_msg != '' && modify_msg != null) {
		if (modifyPW_fail) {
			document.getElementById('modifyPW_msg').innerHTML = modify_msg;
		} else {
			document.getElementById('modifyPW_msg').innerHTML = document
					.getElementById('msg').innerHTML;
		}

	}
}

if (!elementIsNull('msg')) {
	document.getElementById('piccode_div').style.display = 'block'; // 显示输入验证码的层
	document.getElementById('msg').innerHTML = document.getElementById('msg').innerHTML
			+ modify_msg;// 提示异常信息
}

$("#oauthloginUrl").click(function() {
	$("#fm1").hide();
	$("#fm3").show();
});
$("#tenantloginUrl").click(function() {
	$("#fm3").hide();
	$("#fm1").show();
});

document.onkeydown = function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if (e && e.keyCode == 13) { // enter 键
		if ($("#fm1").css("display") != "none") {
			doLogin();
		} else if ($("#fm3").css("display") != "none") {
			doHSYLogin();
		}
	}
};

function doHSYLogin() {
	document.getElementById('tenantid3').value = '-1';
	document.getElementById('isAutoLogin3').value = "0";
	if (document.getElementById('piccode_div3').style.display != 'none') {
		checkCode();
	}
	if (!piccodevalue) {
		$('#inputCode3').focus();
		return false;
	}
	var plainPassword = document.getElementById('password3').value;// $("#password").val();

	var key = RSAUtils.getKeyPair(exponent, '', modulus);
	var encryptedPwd = RSAUtils.encryptedString(key, plainPassword);

	document.getElementById('random_fm3').value = randomvalue;

	var shaPassword = rsa1value(plainPassword);
	var md5Password = hex_md5(plainPassword);

	var key = RSAUtils.getKeyPair(exponent, '', modulus);
	document.getElementById('shaPassword3').value = RSAUtils.encryptedString(
			key, shaPassword)
			+ "_encrypted";
	document.getElementById('md5Password3').value = RSAUtils.encryptedString(
			key, md5Password)
			+ "_encrypted";

	document.getElementById("fm3").submit();
}
function doLogin() {
	submitcallback("uas");
}
function submitcallback(e) {

	var tenantselect = document.getElementById('tenant_select').value;
	if (tenantselect == "") {
		document.getElementById('tenantid').value = '-1';
	} else {
		document.getElementById('tenantid').value = tenantselect;
	}

	if (document.getElementById('piccode_div').style.display != 'none') {
		checkCode();
	}
	if (!piccodevalue) {
		$('#inputCode').focus();
		return false;
	}
	var plainPassword = document.getElementById('password').value;// $("#password").val();
	document.getElementById('random_fm1').value = randomvalue;

	var shaPassword = rsa1value(plainPassword);
	var md5Password = hex_md5(plainPassword);

	var key = RSAUtils.getKeyPair(exponent, '', modulus);
	document.getElementById('shaPassword').value = (RSAUtils.encryptedString(
			key, shaPassword)
			+ "_encrypted");
	document.getElementById('md5Password').value = (RSAUtils.encryptedString(
			key, md5Password)
			+ "_encrypted");

	document.getElementById("fm1").submit();
}
function rsa1value(val) {
	var shaObj = new jsSHA("SHA-1", "TEXT");
	shaObj.update(val);
	var hash = shaObj.getHash("HEX");
	return hash;
}

function modifyPW() {// 修改密码验证以及提交操作 ，对密码进行加密传输
	var password = document.getElementById('modify_password').value;
	var newpass = document.getElementById('modify_newpass').value;
	var againnewpass = document.getElementById('modify_againnewpass').value;

	if (password == '' || newpass == '' || againnewpass == '') {
		alert('not null');
		return false;
	}
	if (password == newpass) {
		alert(needdiff); // screen.tenant.needdiff
		return false;
	}
	if (newpass != againnewpass) {
		alert(notsame);
		return false;
	}

	// 加密
	var key = RSAUtils.getKeyPair(exponent, '', modulus);
	// password = rsa1value(password) ;
	// newpass = rsa1value(newpass) ;
	// againnewpass = rsa1value(againnewpass) ;

	password = RSAUtils.encryptedString(key, password);
	newpass = RSAUtils.encryptedString(key, newpass);
	againnewpass = RSAUtils.encryptedString(key, againnewpass);

	document.getElementById('modify_password').value = password + "_encrypted";
	document.getElementById('modify_shaPassword').value = password + "_encrypted";
	document.getElementById('modify_newpass').value = newpass + "_encrypted";
	document.getElementById('modify_againnewpass').value = againnewpass
			+ "_encrypted";
	document.getElementById('random_fm2').value = randomvalue;
	// document.getElementById('random_fm2').value =
	// RSAUtils.encryptedString(key, randomvalue);
}

/** 判断指定的id元素是都为空 */
function elementIsNull(id) {
	var ele = document.getElementById(id);
	if (ele == undefined || ele == null) {
		return true;
	}
	return false;
}
// 获取验证码
var timetemp = Date.parse(new Date());
$("#piccode img").attr("src", "./images/getValiImage.jpg");
$("#piccode img").click(function() {
	timetemp = Date.parse(new Date())
	$("#piccode img").attr("src", "./images/getValiImage.jpg")
});
// 验证
// $("#inputCode").on('blur',function(){
function checkCode() {
	var _this = $(this);
	var inuptcode = $("#inputCode").val();

	if (inuptcode == "") {
		// $('#piccode_div').append('<spring:message
		// code="validate.image.pleaseInput" />') ;
		$('#msg').html(pleaseInput);
		piccodevalue = false;
		return false
	}
	$
			.ajax({
				url : "/cas/images/validateCode?key=" + timetemp + "&code="
						+ inuptcode,
				type : 'GET',
				dataType : 'json',
				async : false,
				// data: JSON.stringify(data),
				contentType : 'application/json',
				success : function(result) {
					if (result.status == 1) {
						piccodevalue = true;
					} else {
						// alert("验证码错误或已过期") ;
						$('#msg').html(codeError);
						$("#piccode img").click();
						piccodevalue = false;
					}
				},
				error : function(e) {
					$('#msg').html("CAPTCHA request if failed");
					// alert( "CAPTCHA request if failed");
				}
			});
}

window.onload = function onLoginLoaded() {
	GetLastUser();
}
function GetLastUser() {
	var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";// GUID标识符
	var usr = GetCookie(id);
	if (usr != null) {
		document.getElementById('username').value = usr;
	} else {
		// document.getElementById('txtUserName').value = "001";
	}
	// GetPwdAndChk();
}
function SetUsername() {
	if (document.getElementById('warn').checked == true) {
		SetLastUser(document.getElementById('username').value);
	} else {
		ResetCookie();
	}
};
function SetLastUser(usr) {
	var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";
	var expdate = new Date();
	// 当前时间加上两周的时间
	expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
	SetCookie(id, usr, expdate);
}

// 取Cookie的值
function GetCookie(name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg)
			return getCookieVal(j);
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0)
			break;
	}
	return null;
}

function getCookieVal(offset) {
	var endstr = document.cookie.indexOf(";", offset);
	if (endstr == -1)
		endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}
// 写入到Cookie
function SetCookie(name, value, expires) {
	var argv = SetCookie.arguments;
	// 本例中length = 3
	var argc = SetCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	var path = (argc > 3) ? argv[3] : null;
	var domain = (argc > 4) ? argv[4] : null;
	var secure = (argc > 5) ? argv[5] : false;
	// document.cookie = name + "=" + escape(value)
	// 		+ ((expires == null) ? "" : ("; expires=" + expires.toGMTString()))
	// 		+ ((path == null) ? "" : ("; path=" + path))
	// 		+ ((domain == null) ? "" : ("; domain=" + domain))
	// 		+ ((secure == true) ? "; secure" : "");
}
function ResetCookie() {
	var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";
	var expdate = new Date();
	SetCookie(id, null, expdate);
}