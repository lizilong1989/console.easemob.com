/**
 * Created by kenshinn on 15-6-10.
 */

var Login = function(){

}();


$(function () {
    var browserVersion = getBrowserVersion();
    if (browserVersion != '' && browserVersion < 10) {
        alert($.i18n.prop('index_alert_IEDisable'));
    }

    //读取cookie
    if ($('#rememberme:checked').length > 0) {
        $('#username').val($.cookie('tvs-cookies-userName'));
        $('#password').val($.cookie('tvs-cookies-password'));
    } else {
        $('#username').val($.cookie('tvs-cookies-userName'));
        $('#password').val($.cookie('tvs-cookies-password'));
    }

    $('#username').focus();

    var QSTR = getQueryString('comeFrom');
    if (QSTR == 'easemobHome' || QSTR == '51cto') {
        $('#btnRegist').trigger('click');
    }

    checkBoxStatus();
});

/**
 * 判断浏览器;
 * @return
 */
function getBrowser() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        return "MSIE";
    }
    if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
        return "Firefox";
    }
    if (isChrome = navigator.userAgent.indexOf("Chrome") > 0) {
        return "Chrome";
    }
}

function checkBoxStatus() {
    if ($("#agreeCBox").prop("checked")) {
        $('#agreeCBoxEMsg').text('');
    }
}

/**
 * 判断浏览器具体版本号
 * @return
 */
function getBrowserVersion() {
    if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
        return "6";
    }
    if (navigator.userAgent.indexOf("MSIE 7.0") > 0) {
        return "7";
    }
    if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
        return "8";
    }
    if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
        return "9";
    }
    if (navigator.userAgent.indexOf("MSIE 10.0") > 0) {
        return "10";
    }
    if (navigator.userAgent.indexOf("MSIE 11.0") > 0) {
        return "11";
    }
}

// 回车键登录
function keyLogin() {
    if (!$('#login-box').hasClass('visible')) {
        return;
    }
    if (getBrowser() == 'Firefox') {
        $("html").die().live("keydown", function (event) {
            if (event.keyCode == 13) {
                $('#loginBtn').click();
                $('#loginBtn').attr('disable', 'true');
            }
        });
    } else if (getBrowser() == 'MSIE' || getBrowser() == 'Chrome') {
        if (event.keyCode == 13) {
            $('#loginBtn').click();
        }
    }
}

function onBlurRegOrgNameCheck() {
    $('#regOrgName').val($('#regOrgName').val().trim());

    var regOrgName = $('#regOrgName').val();
    var regOrgNameRegex = /^(?!-)(?!.*?-$)[a-zA-Z0-9-]+$/;
    if (regOrgName != '' && !regOrgNameRegex.test(regOrgName)) {
        $('#regOrgNameSMsg').css('display', 'none');
        $('#regOrgNameEMsg').text($.i18n.prop('index_alert_register_regOrgName_regix'));
        return;
    }
    if (regOrgName != '' && regOrgName.length < 1) {
        $('#regOrgNameSMsg').css('display', 'none');
        $('#regOrgNameEMsg').text($.i18n.prop('index_alert_register_regOrgId_regix'));
        return;
    }

    $('#regOrgNameSMsg').css('display', 'block');
    $('#regOrgNameEMsg').text('');
    $('#regOrgNameEMsg').css('display', 'block');
}

function onBlurRegUserNameCheck() {
    $('#regUserName').val($('#regUserName').val().trim());

    var regUserName = $('#regUserName').val();

    var regUserNameRegex = /^[0-9a-zA-Z]*$/;
    if (regUserName != '' && !regUserNameRegex.test(regUserName)) {
        $('#regUserNameSMsg').css('display', 'none');
        $('#regUserNameEMsg').text($.i18n.prop('index_alert_register_regUserName_regix'));
        return;
    }
    if (regUserName != '' && regUserName.length < 1) {
        $('#regUserNameSMsg').css('display', 'none');
        $('#regUserNameEMsg').text($.i18n.prop('index_alert_register_regUserName_regix_atleast'));
        return;
    }

    $('#regUserNameSMsg').css('display', 'block');
    $('#regUserNameEMsg').text('');
    $('#regUserNameEMsg').css('display', 'block');
}

function onBlurRegPasswordCheck() {
    $('#regPassword').val($('#regPassword').val().trim());

    var regPassword = $('#regPassword').val();

    if (regPassword != '' && regPassword.length < 1) {
        $('#regPasswordSMsg').css('display', 'none');
        $('#regPasswordEMsg').text($.i18n.prop('index_alert_register_regPassword_regix_atleast'));
        return;
    }

    $('#regPasswordSMsg').css('display', 'block');
    $('#regPasswordEMsg').text('');
}

function onBlurRegRePasswordCheck() {
    var regPassword = $('#regPassword').val();
    $('#regRePassword').val($('#regRePassword').val().trim());

    var regRePassword = $('#regRePassword').val();
    var regPassword = $('#regPassword').val();
    if ('' != regPassword && regPassword != regRePassword) {
        $('#regRePasswordEMsg').text($.i18n.prop('index_alert_register_regRePassword_regix_atleast'));
        return;
    }

    $('#regRePasswordEMsg').text('');
}

function onBlurRegEmailCheck() {
    $('#regEmail').val($('#regEmail').val().trim());
    var regEmail = $('#regEmail').val();

    var emailReg = /^([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z0-9]{1,10}$/;
    if (regEmail != '' && !emailReg.test(regEmail)) {
        $('#regEmailSEMsg').css('display', 'none');
        $('#regEmailEMsg').text($.i18n.prop('index_alert_register_regEmail_regix'));
        return;
    } else if (regEmail == '') {
        $('#regEmailSEMsg').css('display', 'none');
        return;
    }

    $('#regEmailEMsg').text('');
}

function onBlurRegCompanyNameCheck() {
    var regCompanyName = $('#regCompanyName').val();

    if (regCompanyName != '') {
        $('#regCompanyNameSEMsg').css('display', 'none');
        $('#regCompanyNameEMsg').text('');
        return;
    }

}


function onBlurRegTelCheck() {
    $('#regTel').val($('#regTel').val().trim());
    var regTel = $('#regTel').val();
    if (regTel != '' && !checkTel(regTel)) {
        $('#regTelSEMsg').css('display', 'none');
        $('#regTelEMsg').text($.i18n.prop('index_alert_register_regTel_regix'));
        return;
    } else if (regTel == '') {
        $('#regTelSEMsg').css('display', 'none');
        $('#regTelEMsg').text('');
        return;
    }
    $('#regTelEMsg').text('');
}

function onBlurCheckLoginUsername() {
    $('#username').val($('#username').val().trim());

    var loginUserName = $('#username').val();
    if ('' == loginUserName) {
        $('#usernameEMsg').text($.i18n.prop('index_alert_register_username_empty'));
        return false;
    }

    $('#usernameEMsg').text('');
}

function onBlurCheckLoginPassword() {
    var loginPassword = $('#password').val();
    if ('' == loginPassword) {
        $('#passwordEMsg').text($.i18n.prop('index_alert_register_password_empty'));
        return false;
    }

    $('#passwordEMsg').text('');
}

function onBlurCheckResetEmail() {
    var resetEmail = $('#email').val();
    if ('' == resetEmail) {
        $('#emailEMsg').text($.i18n.prop('index_alert_register_email_empty'));
        return false;
    }

    $('#emailEMsg').text('');
}

function login() {
    orgAdminLogin();
}

// 点击返回登录清空注册数据
function clearBox() {
    $('#regOrgName').val('');
    $('#regUserName').val('');
    $('#regPassword').val('');
    $('#regRePassword').val('');
    $('#regEmail').val('');
    $('#regCompanyName').val('');
    $('#regTel').val('');

    $('#regOrgNameEMsg').text('');
    $('#regUserNameEMsg').text('');
    $('#regPasswordEMsg').text('');
    $('#regRePasswordEMsg').text('');
    $('#regEmailEMsg').text('');
    $('#regTelEMsg').text('');
    $('#agreeCBoxEMsg').text('');
}


// 显示不同窗口
function show_box(boxId){
    // 登录
    if('login-box' == boxId){
        $('#login-box').addClass('visible');

        var oldSignupClassVal = $('#signup-box').attr('class');
        if(oldSignupClassVal.indexOf("visible") > -1){
            $('#signup-box').removeClass('visible');
        }

        var oldForgotClassVal = $('#forgot-box').attr('class');
        if(oldForgotClassVal.indexOf("visible") > -1){
            $('#forgot-box').removeClass('visible');
        }
    }
    // 注册
    if('signup-box' == boxId){
        $('#signup-box').addClass('visible');

        var oldLoginClassVal = $('#login-box').attr('class');
        if(oldLoginClassVal.indexOf("visible") > -1){
            $('#login-box').removeClass('visible');
        }

        var oldForgotClassVal = $('#forgot-box').attr('class');
        if(oldForgotClassVal.indexOf("visible") > -1){
            $('#forgot-box').removeClass('visible');
        }
    }
    // 找回密码
    if('forgot-box' == boxId){
        $('#forgot-box').addClass('visible');

        var oldLoginClassVal = $('#login-box').attr('class');
        if(oldLoginClassVal.indexOf("visible") > -1){
            $('#login-box').removeClass('visible');
        }

        var oldSignupClassVal = $('#signup-box').attr('class');
        if(oldSignupClassVal.indexOf("visible") > -1){
            $('#signup-box').removeClass('visible');
        }
    }
}

// 找回密码表单校验
function resetPasswdFormValidate(){
    // 表单校验
    var email = $('#email').val();

    if('' == email){
        $('#emailEMsg').text($.i18n.prop('index_alert_getpassword_empty'));
        $('#email').focus();
        return false;
    }

    $('#emailEMsg').text();
    return true;
}

// 找回密码
function resetPasswd(){
    var email = $('#email').val();
    var orgName = $('#orgName').val();

    if(resetPasswdFormValidate()){
        $.ajax({
            url:baseUrl + '/management/users/' + email + '/resetpw',
            type:'PUT',
            data:{},
            crossDomain:true,
            success:function(respData){
                if(respData.status && respData.status == 'ok') {
                    alert($.i18n.prop('index_alert_getpassword_sendalert'));
                }
            },
            error:function(respData){
                var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
                var tmpArr = new Array();
                var errorMsg = '';
                for(var i = 0; i < str.length; i++) {
                    tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
                }
                for(var i = 0; i < tmpArr.length; i++) {
                    if('error_description' == tmpArr[i][0]){
                        if(tmpArr[i][1].indexOf("Could not find organization for email") > -1 || tmpArr[i][1].indexOf("Could not find organization for username") > -1) {
                            errorMsg = $.i18n.prop('index_alert_getpassword_noaccount');
                        } else if(tmpArr[i][1].indexOf("username") > -1) {
                            errorMsg = $.i18n.prop('index_alert_getpassword_contactme');
                        }
                    }
                }

                alert(errorMsg);
            }
        });
    }
}

// 找回密码表单校验
function resetPasswdReqFormValidate(){
    // 表单校验
    var password1 = $('#password1').val();
    var password2 = $('#password2').val();

    if('' == password1){
        alert($.i18n.prop('index_alert_register_password_empty'));
        $('#password1').focus();
        return false;
    }
    if(password1.length < 6){
        $('#password1').focus();
        alert($.i18n.prop('index_alert_register_regPassword_regix_atleast'));
        return false;
    }
    if(password2 != password1){
        alert($.i18n.prop('index_alert_register_regRePassword_regix_atleast'));
        $('#password2').focus();
        return false;
    }

    return true;
}

// 注册表单校验
function regsFormValidate(){
    // 表单校验
    var regOrgName = $('#regOrgName').val();
    var regUserName = $('#regUserName').val();
    var regEmail = $('#regEmail').val();
    var regPassword = $('#regPassword').val();
    var regRePassword = $('#regRePassword').val();
    var regCompanyName = $('#regCompanyName').val();
    var regTel = $('#regTel').val();
    var comefrom = $('input:radio[name="comefrom"]:checked').val();

    if('' == regOrgName){
        $('#regOrgNameSMsg').css('display','none');
        $('#regOrgNameEMsg').text($.i18n.prop('index_alert_register_regOrgId_regix'));
        return false;
    }
    var regOrgNameRegex = /^(?!-)(?!.*?-$)[a-zA-Z0-9-]+$/;
    if(!regOrgNameRegex.test(regOrgName)){
        $('#regOrgNameSMsg').css('display','none');
        $('#regOrgNameEMsg').text($.i18n.prop('index_alert_register_regOrgName_regix'));
        return false;
    }
    if(regOrgName != '' && regOrgName.length < 1){
        $('#regOrgNameSMsg').css('display','none');
        $('#regOrgNameEMsg').text($.i18n.prop('index_alert_register_regOrgId_regixs'));
        return false;
    }
    $('#regOrgNameSMsg').css('display','block');

    if('' == regUserName){
        $('#regUserNameSMsg').css('display','none');
        $('#regUserNameEMsg').text($.i18n.prop('index_alert_register_regUserName_regix_atleast'));
        return false;
    }
    var regUserNameRegex = /^[a-zA-Z0-9_\-./]*$/;
    if(!regUserNameRegex.test(regUserName)){
        $('#regUserNameEMsg').text($.i18n.prop('index_alert_register_regUserName_regix_atleast'));
        return false;
    }
    if(regUserName != '' && regUserName.length < 1){
        $('#regUserNameSMsg').css('display','none');
        $('#regUserNameEMsg').text($.i18n.prop('index_alert_register_regUserName_regix_atleast'));
        return false;
    }
    $('#regUserNameSMsg').css('display','block');
    if('' == regPassword){
        $('#regPasswordSMsg').css('display','none');
        $('#regPasswordEMsg').text($.i18n.prop('index_alert_register_regPassword_regix_atleast'));
        return false;
    }
    if(regPassword.length < 1){
        $('#regPasswordEMsg').text($.i18n.prop('index_alert_register_regPassword_regix_atleast'));
        return false;
    }
    $('#regPasswordSMsg').css('display','block');
    if('' == regRePassword){
        $('#regRePasswordEMsg').text($.i18n.prop('index_alert_register_regPassword_regix_atleast'));
        return false;
    }
    if('' != regRePassword && regPassword != regRePassword){
        $('#regRePasswordEMsg').text($.i18n.prop('index_alert_register_regRePassword_regix_atleast'));
        return false;
    }
    var emailReg = /^([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z0-9]{1,10}$/;
    if('' == regEmail){
        $('#regEmailEMsg').text($.i18n.prop('index_alert_register_regEmail_regix'));
        return false;
    }
    if(regEmail != '' && !emailReg.test(regEmail)){
        $('#regEmailEMsg').text($.i18n.prop('index_alert_register_regEmail_regix'));
        return false;
    }

    if('' == regCompanyName){
        $('#regCompanyNameSEMsg').css('display','none');
        $('#regCompanyNameEMsg').text($.i18n.prop('index_alert_register_regOrgName_empty'));
        return false;
    }

    if('' == regTel){
        $('#regTelSEMsg').css('display','none');
        $('#regTelEMsg').text($.i18n.prop('index_alert_register_regTel_regix'));
        return false;
    }
    if(!checkTel(regTel)){
        $('#regTelSEMsg').css('display','none');
        $('#regTelEMsg').text($.i18n.prop('index_alert_register_regTel_regix'));
        return false;
    }

    if(typeof(comefrom) == 'undefined'){
        $('#comeFromEMsg').text($.i18n.prop('index_alert_register_comeFromEMsg'));
        return false;
    }
    $('#comeFromEMsg').css('display','none');
    $('#comeFromEMsg').text('');

    if(!$("#agreeCBox").prop("checked")) {
        $('#agreeCBoxEMsg').text($.i18n.prop('index_alert_register_agreeCBox'));
        return false;
    }


    $('#regOrgNameEMsg').text('');
    $('#regUserNameEMsg').text('');
    $('#regPasswordEMsg').text('');
    $('#regRePasswordEMsg').text('');
    $('#regEmailEMsg').text('');
    $('#regCompanyNameEMsg').text('');
    $('#regTelEMsg').text('');
    $('#agreeCBoxEMsg').text('');

    return true;
}


//注册表单清空
function resetForm(){
    $('#regOrgName').val('');
    $('#regUserName').val('');
    $('#regPassword').val('');
    $('#regRePassword').val('');
    $('#regEmail').val('');
    $('#regCompanyName').val('');
    $('#regTel').val('');

    $('#regOrgNameEMsg').text('');
    $('#regUserNameEMsg').text('');
    $('#regPasswordEMsg').text('');
    $('#regRePasswordEMsg').text('');
    $('#regEmailEMsg').text('');
    $('#regCompanyNameEMsg').text('');
    $('#regTelEMsg').text('');
}

// 注册
function formSubmit(){
    var regOrgName = $('#regOrgName').val();
    var regUserName = $('#regUserName').val();
    var regEmail = $('#regEmail').val();
    var regPassword = $('#regPassword').val();
    var regCompanyName = $('#regCompanyName').val();
    var regTel = $('#regTel').val();
    var mailSuffix = regEmail.substring(regEmail.indexOf('@')+1);
    var comeFrom = $('input:radio[name="comefrom"]:checked').val();


    var d = {
        organization:regOrgName,
        username:regUserName,
        email:regEmail,
        password:regPassword,
        companyName:regCompanyName,
        telephone:regTel,
        comefrom:comeFrom
    };

    if(regsFormValidate()){
        // 注册用户信息
        $.ajax({
            url:baseUrl + '/management/organizations',
            type:'POST',
            crossDomain:true,
            headers:{
                'Content-Type':'application/json'
            },
            data:JSON.stringify(d),
            success: function(respData, textStatus, jqXHR) {
                $('#signup-box').removeClass('visible');
                $('#login-box').addClass('visible');
                $('#username').val(regUserName);

                EasemobCommon.disPatcher.toPageIndexRegistOrgSuccess(mailSuffix, regEmail);
            },
            error: function(respData, textStatus, jqXHR) {
                var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
                var tmpArr = new Array();
                var errorMsg = '';
                for(var i = 0; i < str.length; i++) {
                    tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
                }
                for(var i = 0; i < tmpArr.length; i++) {
                    if('error_description' == tmpArr[i][0]){
                        if(tmpArr[i][1].indexOf("path") > -1) {
                            errorMsg = $.i18n.prop('index_alert_register_duplicate_orgid');
                        }
                        if(tmpArr[i][1].indexOf("username") > -1) {
                            errorMsg = $.i18n.prop('index_alert_register_duplicate_username');
                        }
                        if(tmpArr[i][1].indexOf("email") > -1) {
                            errorMsg = $.i18n.prop('index_alert_register_duplicate_email');
                        }
                    }
                }
                alert(errorMsg);
            }
        });
    }
}


// 设置新密码
function resetPasswdReq(token,uuid){
    var password1=$('#password1').val();
    var	password2=$('#password2').val();
    var d = {
        'password1':password1,
        'password2':password2,
        'token':token
    };
    if(resetPasswdReqFormValidate()){
        $.ajax({
            url:baseUrl + '/management/users/'+uuid+'/resetpw',
            type:'POST',
            data:JSON.stringify(d),
            headers:{
                'Content-Type':'multipart/form-data'
            },
            success:function(respData){
                alert($.i18n.prop('index_alert_resetPassword_succ'));
                EasemobCommon.disPatcher.toPageIndex();
            },
            error:function(data){
                alert($.i18n.prop('index_alert_resetPassword_failed'));
            }
        });
    }
}


// 登录表单校验
function loginFormValidate(){
    // 表单校验
    var loginUserName = $('#username').val();
    var loginPassword = $('#password').val();
    if('' == loginUserName){
        $('#usernameEMsg').text($.i18n.prop('index_alert_register_username_empty'));
        $('#username').focus();
        return false;
    }
    if('' == loginPassword){
        $('#passwordEMsg').text($.i18n.prop('index_alert_register_password_empty'));
        $('#password').focus();
        return false;
    }

    $('#usernameEMsg').text('');
    $('#passwordEMsg').text('');
    return true;
}


// ORG管理员登录
function orgAdminLogin() {
    var loginUser = $('#username').val();
    var d = {
        'grant_type':'password',
        'username':loginUser,
        'password':$('#password').val()
    };
    if($('#rememberme:checked').length>0){
        $.cookie('tvs-cookies-userName',$('#username').val());
        $.cookie('tvs-cookies-password',$('#password').val());
    }else{
        $.cookie('tvs-cookies-userName','');
        $.cookie('tvs-cookies-password','');
    }
    if(loginFormValidate()){
        $('#cont').text($.i18n.prop('index_alert_login_pending'));
        $('#loginBtn').attr("disabled",true);

        // 登录获取token
        $.ajax({
            url:baseUrl+'/management/token',
            type:'POST',
            data:JSON.stringify(d),
            headers:{
                'Content-Type':'application/json'
            },
            crossDomain:true,
            error: function(respData, textStatus, errorThrown) {
                $('#cont').text($.i18n.prop('index_text_login'));
                $('#loginBtn').attr("disabled",false);

                var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
                var tmpArr = new Array();
                var errorMsg = '';
                for(var i = 0; i < str.length; i++) {
                    tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
                }
                for(var i = 0; i < tmpArr.length; i++) {
                    if('error_description' == tmpArr[i][0]){
                        if(tmpArr[i][1].indexOf("User must be confirmed to authenticate") > -1) {
                            errorMsg = $.i18n.prop('index_alert_login_failed_unConfirm');
                        }
                        if(tmpArr[i][1].indexOf("invalid username or password") > -1) {
                            errorMsg = $.i18n.prop('index_alert_login_failed_wrongparams');
                        }
                    }
                }
                alert(errorMsg);
            },
            success: function(respData, textStatus, jqXHR) {
                var access_token = respData.access_token;
                var cuser = respData.user.username;
                var cuserName = respData.user.username;
                var email = respData.user.email;
                var companyName = respData.user.properties.companyName;
                var telephone = respData.user.properties.telephone;
                var orgName = '';
                var orgs = respData.user.organizations;

                $.each(orgs, function(i) {
                    orgName = i;
                });

                if(orgName == '') {
                    alert($.i18n.prop('index_text_login_notFound'));
                    EasemobCommon.disPatcher.toPageIndex();
                } else {
                    var date = new Date();
                    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
                    $.cookie('access_token', access_token,{path:'/',expires:date});
                    $.cookie('cuser', cuser,{path:'/',expires:date});
                    $.cookie('cuserName', cuserName,{path:'/',expires:date});
                    $.cookie('email', email,{path:'/',expires:date});
                    $.cookie('orgName', orgName,{path:'/',expires:date});
                    $.cookie('companyName', companyName,{path:'/',expires:date});
                    $.cookie('telephone', telephone,{path:'/',expires:date});

                    EasemobCommon.disPatcher.toPageAppList();
                }
            }
        });
    } else {
        $('#cont').text($.i18n.prop('index_text_login'));
        $('#loginBtn').attr("disabled",false);
    }
}