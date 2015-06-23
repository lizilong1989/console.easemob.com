/**
 * Created by kenshinn on 15-6-10.
 */

// 登录用户信息
function loginAdminInfo(){
    // get org admin token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    var companyName = $.cookie('companyName');
    var telephone = $.cookie('telephone');
    var email = $.cookie('email');
    if(!access_token || access_token==''){
        EasemobCommonDispatcher.sessionTimeOut();
    } else {
        $('#username').text(cuser);
        $('#email').text(email);
        $('#companyName').text(companyName);
        $('#telephone').text(telephone);
    }
}



// 修改登录用户信息
function updateAdminInfo(username, companyName, telephone){
    // get org admin token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    var d = {};
    if(companyName != '' && companyName != null){
        d.companyName = companyName;
    }
    if(telephone != '' && telephone != null){
        d.telephone = telephone;
    }

    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $.ajax({
            url: baseUrl + '/management/users/' + username,
            type:'PUT',
            data:JSON.stringify(d),
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error:function(respData, textStatus, jqXHR){
            },
            success:function(respData, textStatus, jqXHR){
                alert('修改成功!');

                $('#companyNameInput').val('');
                $('#telephoneInput').val('');
                $('#companyNameInput').hide();
                $('#telephoneInput').hide();
                $('#showEditBtn').show();
                $('#saveAdminInfoBtn').hide();
                $('#cancelSaveAdminInfoBtn').hide();
                $('#telephone').show();
                $('#companyName').show();

                var date = new Date();
                date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
                $.cookie('companyName', companyName,{path:'/',expires:date});
                $.cookie('telephone', telephone,{path:'/',expires:date});

                loginAdminInfo();
            }
        });
    }
}

// 修改登录用户密码表单校验
function updateAdminPasswdFormValidate(){
    // 表单校验
    var oldpassword = $('#oldpassword').val();
    var newpassword = $('#newpassword').val();
    var renewpassword = $('#renewpassword').val();

    if('' == oldpassword){
        $('#oldpasswordEMsg').text($.i18n.prop('admin_home_password_form_passwordEmpty'));
        $('#oldpassword').focus();
        return false;
    }
    $('#oldpasswordEMsg').text('');
    if('' == newpassword){
        $('#newpasswordEMsg').text($.i18n.prop('admin_home_password_form_newPasswordEmpty'));
        $('#newpassword').focus();
        return false;
    }

    if(newpassword.length < 6){
        $('#newpasswordEMsg').text($.i18n.prop('admin_home_password_form_newPasswordIllegal'));
        $('#newpassword').focus();
        return false;
    }
    $('#newpasswordEMsg').text('');
    if(renewpassword != newpassword){
        $('#renewpasswordEMsg').text($.i18n.prop('admin_home_password_form_passwordNotMatch'));
        return false;
    }

    $('#renewpasswordEMsg').text('');
    return true;
}

// 修改登录用户密码
validateAccessToken = '';
function updateAdminPasswd() {
    var access_token = $.cookie('access_token');
    var oldpassword = $('#oldpassword').val();
    var	newpassword = $('#newpassword').val();
    var username = $.cookie('cuser');
    var d = {
        'oldpassword':oldpassword,
        'newpassword':newpassword
    }
    var dtoken = {
        'grant_type':'password',
        'username':username,
        'password':oldpassword
    }
    if(updateAdminPasswdFormValidate()){
        //校验旧密码
        $.ajax({
            url:baseUrl+'/management/token',
            type:'POST',
            data:JSON.stringify(dtoken),
            error: function(jqXHR, textStatus, errorThrown) {
                $('#oldpasswordEMsg').text($.i18n.prop('admin_home_password_form_oldPasswordInCorrect'));
            },
            success: function(respData, textStatus, jqXHR) {
                if(respData.access_token == ''){
                    return ;
                }

                $.ajax({
                    url:baseUrl + '/management/users/' + username + '/password',
                    type:'POST',
                    data:JSON.stringify(d),
                    headers:{
                        'Content-Type':'application/json'
                    },
                    success:function(respData){
                        alert($.i18n.prop('admin_home_password_form_succ'));
                    },
                    error:function(data){
                        alert($.i18n.prop('admin_home_password_form_failed'));
                    }
                });
            }
        });
    }

}


// 获取orgadmin列表
function getOrgAdminList(){
    // 获取token
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    var loginUser = $.cookie('cuser');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="9"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;' + $.i18n.prop('admin_home_password_loading') + '</td></tr>';
        $('#orgadminsBody').empty();
        $('#orgadminsBody').append(loading);

        $.ajax({
            url:baseUrl+'/management/organizations/'+ orgName +'/users',
            type:'GET',
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                $('tbody').html('');
                var selectOptions = '';
                $(respData.data).each(function(){
                    var username = this.username;
                    var confirmedStr = (this.confirmed == true) ? $.i18n.prop('admin_list_table_confirmed') : $.i18n.prop('admin_list_table_unConfirmed');
                    var email = this.email;
                    var companyName = this.properties.companyName;
                    var telephone = this.properties.telephone;

                    var ops = '';
                    if(username != loginUser){
                        ops = '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">操作<b class="caret"></b></a>'+
                            '<ul class="dropdown-menu">'+'<li data-filter-camera-type="all"><a href="javascript:disConnAdminAndOrg(\''+username+'\')">移出管理员</a></li>';
                    } else {
                        ops = $.i18n.prop('admin_list_table_currentUser_disable');
                    }

                    selectOptions += '<tr>'+
                        '<td class="text-center">'+username+'</td>'+
                        '<td class="text-center">'+email+'</td>'+
                        '<td class="text-center">'+companyName+'</td>'+
                        '<td class="text-center">'+telephone+'</td>'+
                        '<td class="text-center">'+confirmedStr+'</td>'+
                        '<td class="text-center">'+
                        '<ul class="nav-pills" style="list-style-type:none">'+ ops
                    '</ul>'+
                    '</li>'+
                    '</ul>'+
                    '</td>'+
                    '</tr>';
                });
                $('#tr_loading').remove();
                $('#orgadminsBody').append(selectOptions);
                var tbody = document.getElementsByTagName("tbody")[0];
                if(!tbody.hasChildNodes()){
                    var option = '<tr><td class="text-center" colspan="9">无数据!</td></tr>';
                    $('#tr_loading').remove();
                    $('#orgadminsBody').append(option);
                }
            }
        });
    }
}

// remove user from organization
function disConnAdminAndOrg(adminUserName){
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    var loginUser = $.cookie('cuser');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if(adminUserName != ''){
            if(loginUser == adminUserName){
                alert($.i18n.prop('admin_list_table_currentUser_disable'));
            } else {
                if(confirm($.i18n.prop('admin_list_table_disConnUser_confirm'))){
                    $.ajax({
                        url:baseUrl　+　'/management/users/' + adminUserName + '/orgs/' + orgName,
                        type:'DELETE',
                        headers:{
                            'Authorization':'Bearer ' + access_token,
                            'Content-Type':'application/json'
                        },
                        error: function(respData, textStatus, jqXHR) {
                            var error_description = jQuery.parseJSON(respData.responseText).error_description;
                            if('Organizations must have at least one member.' == error_description){
                                alert($.i18n.prop('admin_list_table_disConnUser_oneAtLeast'));
                            } else {
                                alert($.i18n.prop('admin_list_table_disConnUser_failed'));
                            }
                        },
                        success: function(respData, textStatus, jqXHR) {
                            var orgname = respData.data.name;
                            if(orgName == orgname){
                                alert($.i18n.prop('admin_list_table_disConnUser_succ'));
                                EasemobCommon.disPatcher.toPageOrgAdminList();
                            }
                        }
                    });
                }
            }
        }
    }
}

// 增加orgadminuser表单校验
function createAdminUserFormValidate(){
    // 表单校验
    $('#admin_create_adminUserName').val($('#admin_create_adminUserName').val().trim());
    var adminUserName = $('#admin_create_adminUserName').val();
    if(adminUserName == ''){
        $('#admin_create_adminUserNameMsg').hide();
        $('#admin_create_adminUserNameEEMsg').hide();
        $('#admin_create_adminUserNameEMsg').show();
        $('#admin_create_adminUserNameOMsg').hide();
        return false;
    }

    var adminUserNameRegex = /^[0-9a-zA-Z]*$/;
    if(adminUserName != '' && !adminUserNameRegex.test(adminUserName)){
        $('#admin_create_adminUserNameMsg').hide();
        $('#admin_create_adminUserNameOMsg').hide();
        $('#admin_create_adminUserNameEEMsg').hide();
        $('#admin_create_adminUserNameEMsg').show();
        return false;
    }

    $('#admin_create_adminPassword').val($('#admin_create_adminPassword').val().trim());
    var adminPassword = $('#admin_create_adminPassword').val();
    if(adminPassword == ''){
        $('#admin_create_adminPasswordMsg').hide();
        $('#admin_create_adminPasswordEMsg').show();
        $('#admin_create_adminPasswordOMsg').hide();
        return false;
    }

    $('#admin_create_adminRePassword').val($('#admin_create_adminRePassword').val().trim());
    var adminRePassword = $('#admin_create_adminRePassword').val();
    var adminPassword = $('#admin_create_adminPassword').val();

    if(adminRePassword == ''){
        $('#admin_create_adminRePasswordMsg').hide();
        $('#admin_create_adminRePasswordEMsg').show();
        $('#admin_create_adminRePasswordOMsg').hide();
        return false;
    }
    if('' != adminRePassword && adminPassword != adminRePassword){
        $('#admin_create_adminRePasswordMsg').hide();
        $('#admin_create_adminRePasswordEMsg').show();
        $('#admin_create_adminRePasswordOMsg').hide();
        return false;
    }

    $('admin_create_adminEmail').val($('#admin_create_adminEmail').val().trim());
    var adminEmail = $('#admin_create_adminEmail').val();
    if(adminEmail == ''){
        $('#admin_create_adminEmailMsg').show();
        $('#admin_create_adminEmailEMsg').hide();
        $('#admin_create_adminEmailEEMsg').hide();
        $('#admin_create_adminEmailOMsg').hide();
        return false;
    }
    var adminEmailRegex = /^([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z0-9]{1,10}$/;
    if(adminEmail != '' && !adminEmailRegex.test(adminEmail)){
        $('#admin_create_adminEmailMsg').hide();
        $('#admin_create_adminEmailEMsg').show();
        $('#admin_create_adminEmailEEMsg').hide();
        $('#admin_create_adminEmailOMsg').hide();
        return false;
    }

    var adminCompany = $('#admin_create_adminCompany').val();
    if(adminCompany == ''){
        $('#admin_create_adminCompanyMsg').show();
        $('#admin_create_adminCompanyEMsg').hide();
        $('#admin_create_adminCompanyOMsg').hide();
        return false;
    }
    var adminCompanyRegex = /^[0-9a-zA-Z\-_\u4e00-\u9faf]*$/;
    if (adminCompany != '' && !adminCompanyRegex.test(adminCompany)) {
        $('#admin_create_adminCompanyMsg').hide();
        $('#admin_create_adminCompanyEMsg').show();
        $('#admin_create_adminCompanyOMsg').hide();
        return false;
    }

    $('admin_create_adminTel').val($('#admin_create_adminTel').val().trim());
    var regTel = $('#admin_create_adminTel').val();
    if(regTel == ''){
        $('#admin_create_adminTelMsg').show();
        $('#admin_create_adminTelEMsg').hide();
        $('#admin_create_adminTelOMsg').hide();
        return false;
    }

    if(regTel != '' && !checkTel(regTel)){
        $('#admin_create_adminTelMsg').hide();
        $('#admin_create_adminTelEMsg').show();
        $('#admin_create_adminTelOMsg').hide();
        return false;
    }

    return true;
}

// 添加企业管理员
function saveNewAdminUserSubmit(adminUsername, adminPassword, adminEmail, adminCompany, adminTel){
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');

    if(!access_token || access_token=='') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if(createAdminUserFormValidate()){
            if(confirm($.i18n.prop('admin_create_form_confirm'))) {
                var data ={
                    username:adminUsername,
                    password:adminPassword,
                    email:adminEmail,
                    companyName:adminCompany,
                    telephone:adminTel,
                    category:'admin_append'
                };

                // 创建管理员用户
                $.ajax({
                    url:baseUrl+'/management/users',
                    type:'POST',
                    headers:{
                        'Authorization':'Bearer ' + access_token,
                        'Content-Type':'application/json'
                    },
                    async:false,
                    data:JSON.stringify(data),
                    error: function(respData, textStatus, errorThrown) {
                        var error_description = jQuery.parseJSON(respData.responseText).error_description;
                        if(error_description.indexOf("Entity user requires that property named username be unique") > -1) {
                            $('#adminUserNameEEMsg').show();
                            $('#adminUserNameEMsg').hide();
                            $('#adminUserNameOMsg').hide();
                        } else if(error_description.indexOf("Entity user requires that property named email be unique") > -1) {
                            $('#adminEmailEEMsg').show();
                            $('#adminEmailOMsg').hide();
                            $('#adminEmailEMsg').hide();
                        } else {
                            alert($.i18n.prop('admin_create_form_failed'));
                        }
                    },
                    success: function(respData, textStatus, jqXHR) {
                        clearNewAdminUserBox();
                        var adminUserName = respData.data.username;
                        if(adminUserName != '') {
                            //　建立关系
                            $.ajax({
                                url:baseUrl　+　'/management/users/' + adminUserName + '/orgs/' + orgName,
                                type:'PUT',
                                headers:{
                                    'Authorization':'Bearer ' + access_token,
                                    'Content-Type':'application/json'
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    alert($.i18n.prop('admin_create_form_failed'));
                                },
                                success: function(respData, textStatus, jqXHR) {
                                    var orgname = respData.data.name;
                                    if(orgName == orgname){
                                        alert($.i18n.porp('admin_create_form_succ'));
                                        EasemobCommon.disPatcher.toPageOrgAdminList();
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    }
}



function saveNewAdminUser() {
    var adminUsernameInput = $('#admin_create_adminUserName').val();
    var adminEmailInput = $('#admin_create_adminEmail').val();
    var adminPasswordInput = $('#admin_create_adminPassword').val();
    var adminCompanyInput = $('#admin_create_adminCompany').val();
    var adminTelInput = $('#admin_create_adminTel').val();

    saveNewAdminUserSubmit(adminUsernameInput, adminPasswordInput, adminEmailInput, adminCompanyInput, adminTelInput);
}

function check() {
    if (count == 0) {
        count++;
        return true;
    } else {
        return false;
    }
}

function saveNewAdminUserPre() {
    if (check()) {
        count = 0;
        saveNewAdminUser();
    }
}


//　用户名输入框失焦检测
function onBlurAdminUserNameCheck() {
    $('#admin_create_adminUserName').val($('#admin_create_adminUserName').val().trim());

    var adminUserName = $('#admin_create_adminUserName').val();
    if (adminUserName == '') {
        $('#admin_create_adminUserNameMsg').show();
        $('#admin_create_adminUserNameEEMsg').hide();
        $('#admin_create_adminUserNameEMsg').hide();
        $('#admin_create_adminUserNameOMsg').hide();
        return;
    }

    var adminUserNameRegex = /^[0-9a-zA-Z]*$/;
    if (adminUserName != '' && !adminUserNameRegex.test(adminUserName)) {
        $('#admin_create_adminUserNameMsg').hide();
        $('#admin_create_adminUserNameEEMsg').hide();
        $('#admin_create_adminUserNameOMsg').hide();
        $('#admin_create_adminUserNameEMsg').show();
        return;
    }

    $('#admin_create_adminUserNameMsg').hide();
    $('#admin_create_adminUserNameOMsg').show();
    $('#admin_create_adminUserNameEEMsg').hide();
    $('#admin_create_adminUserNameEMsg').hide();
}

//　密码输入框失焦检测
function onBlurAdminPasswordCheck() {
    $('#admin_create_adminPassword').val($('#admin_create_adminPassword').val().trim());

    var adminPassword = $('#admin_create_adminPassword').val();

    if (adminPassword == '') {
        $('#admin_create_adminPasswordMsg').hide();
        $('#admin_create_adminPasswordEMsg').show();
        $('#admin_create_adminPasswordOMsg').hide();
        return;
    }

    $('#admin_create_adminPasswordMsg').hide();
    $('#admin_create_adminPasswordEMsg').hide();
    $('#admin_create_adminPasswordOMsg').show();
}

//　重复密码输入框失焦检测
function onBlurAdminRePasswordCheck() {
    $('#admin_create_adminRePassword').val($('#admin_create_adminRePassword').val().trim());

    var adminRePassword = $('#admin_create_adminRePassword').val();
    var adminPassword = $('#admin_create_adminPassword').val();
    if (adminRePassword == '') {
        if(adminPassword != ''){
            $('#admin_create_adminRePasswordMsg').hide();
            $('#admin_create_adminRePasswordEMsg').show();
            $('#admin_create_adminRePasswordOMsg').hide();
        } else {
            $('#admin_create_adminRePasswordMsg').show();
            $('#admin_create_adminRePasswordEMsg').hide();
            $('#admin_create_adminRePasswordOMsg').hide();
        }
        return;
    }

    if ('' != adminRePassword && adminPassword != adminRePassword) {
        $('#admin_create_adminRePasswordMsg').hide();
        $('#admin_create_adminRePasswordEMsg').show();
        $('#admin_create_adminRePasswordOMsg').hide();
        return;
    }

    $('#admin_create_adminRePasswordMsg').hide();
    $('#admin_create_adminRePasswordEMsg').hide();
    $('#admin_create_adminRePasswordOMsg').show();
}

//　邮箱输入框失焦检测
function onBlurAdminEmailCheck() {
    $('#admin_create_adminEmail').val($('#admin_create_adminEmail').val().trim());
    var adminEmail = $('#admin_create_adminEmail').val();

    if (adminEmail == '') {
        $('#admin_create_adminEmailMsg').show();
        $('#admin_create_adminEmailEMsg').hide();
        $('#admin_create_adminEmailEEMsg').hide();
        $('#admin_create_adminEmailOMsg').hide();
        return;
    }

    var adminEmailRegex = /^([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z0-9]{1,10}$/;
    if (adminEmail != '' && !adminEmailRegex.test(adminEmail)) {
        $('#admin_create_adminEmailMsg').hide();
        $('#admin_create_adminEmailEMsg').show();
        $('#admin_create_adminEmailEEMsg').hide();
        $('#admin_create_adminEmailOMsg').hide();
        return;
    }

    $('#admin_create_adminEmailMsg').hide();
    $('#admin_create_adminEmailEMsg').hide();
    $('#admin_create_adminEmailEEMsg').hide();
    $('#admin_create_adminEmailOMsg').show();
}

//　联系电话输入框失焦检测
function onBlurAdminTelCheck() {
    $('#admin_create_adminTel').val($('#admin_create_adminTel').val().trim());
    var regTel = $('#admin_create_adminTel').val();
    if (regTel == '') {
        $('#admin_create_adminTelMsg').show();
        $('#admin_create_adminTelEMsg').hide();
        $('#admin_create_adminTelOMsg').hide();
        return;
    }

    if (regTel != '' && !checkTel(regTel)) {
        $('#admin_create_adminTelMsg').hide();
        $('#admin_create_adminTelEMsg').show();
        $('#admin_create_adminTelOMsg').hide();
        return;
    }

    $('#admin_create_adminTelMsg').hide();
    $('#admin_create_adminTelEMsg').hide();
    $('#admin_create_adminTelOMsg').show();
}

//　公司名称输入框失焦检测
function onBlurAdminCompanyCheck() {
    $('#admin_create_adminCompany').val($('#admin_create_adminCompany').val().trim());
    var adminCompany = $('#admin_create_adminCompany').val();

    if (adminCompany == '') {
        $('#admin_create_adminCompanyMsg').show();
        $('#admin_create_adminCompanyEMsg').hide();
        $('#admin_create_adminCompanyOMsg').hide();
        return;
    }

    var adminCompanyRegex = /^[0-9a-zA-Z\-_\u4e00-\u9faf]*$/;
    if (adminCompany != '' && !adminCompanyRegex.test(adminCompany)) {
        $('#admin_create_adminCompanyMsg').hide();
        $('#admin_create_adminCompanyEMsg').show();
        $('#admin_create_adminCompanyOMsg').hide();
        return;
    }

    $('#admin_create_adminCompanyMsg').hide();
    $('#admin_create_adminCompanyEMsg').hide();
    $('#admin_create_adminCompanyOMsg').show();
}

// 点击返回列表,清空表单数据
function clearNewAdminUserBox() {
    $('#admin_create_adminUserName').val('');
    $('#admin_create_adminPassword').val('');
    $('#admin_create_adminRePassword').val('');
    $('#admin_create_adminEmail').val('');
    $('#admin_create_adminTel').val('');
    $('#admin_create_adminCompany').val('');
}

function showEdit() {
    var companyName = $('#companyName').text();
    var telephone = $('#telephone').text();
    $('#showEditBtn').hide();
    $('#companyName').hide();
    $('#telephone').hide();
    $('#saveAdminInfoBtn').show();
    $('#cancelSaveAdminInfoBtn').show();
    $('#companyNameInput').show();
    $('#companyNameInputMsg').show();
    $('#telephoneInput').show();
    $('#telephoneInputMsg').show();

    $('#companyNameInput').val(companyName);
    $('#telephoneInput').val(telephone);
}

function cancelSaveAdminInfo() {
    $('#showEditBtn').show();
    $('#companyName').show();
    $('#telephone').show();
    $('#saveAdminInfoBtn').hide();
    $('#cancelSaveAdminInfoBtn').hide();
    $('#companyNameInput').hide();
    $('#telephoneInput').hide();
    $('#companyNameInput').val('');
    $('#telephoneInput').val('');
    $('#companyNameInputMsg').hide();
    $('#telephoneInputMsg').hide();
}

function saveAdminInfo() {
    var username = $('#username').text();
    var companyNameInput = $('#companyNameInput').val();
    var telephoneInput = $('#telephoneInput').val();

    var companyNameInputRegex = /^[0-9a-zA-Z\-_\u4e00-\u9faf]*$/;
    if (!companyNameInputRegex.test(companyNameInput)) {
        $('#companyNameInputMsg').text($.i18n.prop('admin_create_form_companyIllegal'));
        $('#companyNameInputMsg').css('color', 'red');
        return;
    }
    $('#companyNameInputMsg').hide();

    var telephoneInputRegex = /^[0-9]*$/;
    if (telephoneInput != '' && !telephoneInputRegex.test(telephoneInput)) {
        $('#telephoneInputMsg').text($.i18n.prop('admin_create_form_telephoneIllegal'));
        $('#telephoneInputMsg').css('color', 'red');
        return;
    }
    $('#telephoneInputMsg').hide();

    updateAdminInfo(username, companyNameInput, telephoneInput);
}

