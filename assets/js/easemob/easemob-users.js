/**
 * Created by kenshinn on 15-6-10.
 */


// 用户名
function onBlurCheckIMUsername(imUsername){
    var imUsernameReg =  /^[a-zA-Z0-9_\-./]*$/;
    if('' == imUsername) {
        $('#imUsernameMsg').text($.i18n.prop('app_users_form_username_error'));
        return false;
    }

    if(!imUsernameReg.test(imUsername)){
        $('#imUsernameMsg').text($.i18n.prop('app_users_form_username_error'));
        return false;
    }

    $('#imUsernameMsg').text('');
    return true;
}

// 一次密码
function onBlurCheckIMPassword(password){
    var passwordReg =  /^[\s\S]*$/;
    if('' == password) {
        $('#passwordMsg').text($.i18n.prop('app_users_form_password_error'));
        return false;
    }
    if(!passwordReg.test(password)){
        $('#passwordMsg').text($.i18n.prop('app_users_form_password_error'));
        return false;
    }
    $('#passwordMsg').text('');
    return true;
}

// 二次密码
function onBlurCheckIMConfirmPassword(confirmPassword){
    var password = $('#password').val();
    if('' == confirmPassword) {
        $('#confirmPasswordMsg').text($.i18n.prop('app_users_form_password_error'));
        return false;
    }
    if(password != confirmPassword){
        $('#confirmPasswordMsg').text($.i18n.prop('app_users_form_confirm_password_error_notmatch'));
        return false;
    }

    $('#confirmPasswordMsg').text('');
    return true;
}

// save new im user
function saveNewIMUser(appUuid){
    var imUsername = $('#imUsername').val();
    var password = $('#password').val();
    var confirmPassword = $('#confirmPassword').val();

    var token = $.cookie('access_token');
    var orgName = $.cookie('orgName');

    var flag = onBlurCheckIMUsername(imUsername) && onBlurCheckIMPassword(password) && onBlurCheckIMConfirmPassword(confirmPassword);
    if(flag){
        // Create a user
        var d = {
            username:imUsername,
            password:password
        };
        $.ajax({
            url:baseUrl + '/' + orgName + '/' + appUuid + '/users',
            type:EasemobCommon.httpMethod.POST,
            data:JSON.stringify(d),
            headers:{
                'Authorization':'Bearer ' + token,
                'Content-Type':'application/json'
            },
            success:function(respData){
                alert($.i18n.prop('app_users_form_msg_username_saved'));
                EasemobCommon.disPatcher.toPageAppUsers();
            },
            error:function(data){
                var str = JSON.stringify(data.responseText).replace('}','').replace('{','').split(',');
                var tmpArr = new Array();
                var errorMsg = '';
                for(var i = 0; i < str.length; i++) {
                    tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
                }
                for(var i = 0; i < tmpArr.length; i++) {
                    if('error_description' == tmpArr[i][0]){
                        if(tmpArr[i][1].indexOf("Entity user requires that property named username be unique") > -1) {
                            errorMsg = $.i18n.prop('app_users_form_errorMsg_username_duplicated');
                        } else {
                            errorMsg = $.i18n.prop('app_users_form_errorMsg_username_failure');
                        }
                    }
                }
                alert(errorMsg);
            }
        });
    }
}


function selectAppUser(sel,appUuid,username){
    var value = sel.value;

    if(value == 'appIMList'){
        toAppIMList(username);
    }else if(value == 'setUsername'){
        setUsername(appUuid, username);
    }else if(value == 'sendMsg'){
        sendMessgeOne(appUuid, username);
    }else if(value == 'deleteUAdmin'){
        deleteAppUser(appUuid, username);
    }
}

// 获取某个app下的用户
function getAppUserList(appUuid, pageAction){

    fakePageOne = 1;

    // 获取token
    document.getElementById('checkAll').checked = false;
    $('#paginau').html('');
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="9"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
        $('#appUserBody').empty();
        $('#appUserBody').append(loading);
        var userPage = $.cookie('userPage');
        if('next' == pageAction){
            pageNo += 1;
        } else if('forward' == pageAction){
            if(pageNo >= 2) {
                pageNo -= 1;
            } else {
                pageNo = 1;
            }
        }
        var temp = '';
        if(typeof(pageAction) != 'undefined' && pageAction != '' || pageAction == 'no'){
            temp = '&cursor=' + cursors[pageNo];
        }
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid + '/users?limit=10' + temp,
            type:'GET',
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                if(pageAction != 'forward'){
                    if(respData.cursor){
                        cursors[pageNo+1] = respData.cursor;
                    }else{
                        cursors[pageNo+1] = null;
                    }
                }

                if(respData.entities.length == 0 && respData.cursor == '' && (pageAction == 'next' || typeof(pageAction) == 'undefined')){
                    getNextAppUserList();
                } else if(respData.entities.length == 0 && pageAction == 'forward'){
                    if(pageNo >= 2){
                        getPrevAppUserList();
                    } else if(pageNo == 1){
                        getNextAppUserList();
                    }
                } else {
                    $('tbody').html('');
                    var selectOptions = '';
                    $(respData.entities).each(function(){
                        var username = this.username;
                        var created = format(this.created);
                        var notification_display_style = '';
                        if(this.notification_display_style == 0){
                            notification_display_style = $.i18n.prop('app_users_text_notification_display_style_summary');
                        }else if(this.notification_display_style == 1){
                            notification_display_style = $.i18n.prop('app_users_text_notification_display_style_detail');
                        }
                        var nickname = this.nickname;
                        if(nickname == undefined){
                            nickname='';
                        }
                        var notification_no_disturbing = this.notification_no_disturbing;
                        var notification_no_disturbing_time='----';
                        if(this.notification_no_disturbing){
                            notification_no_disturbing = $.i18n.prop('app_users_text_notification_no_disturbing_open');
                            notification_no_disturbing_time = this.notification_no_disturbing_start + ':00'+'--'+this.notification_no_disturbing_end + ':00';
                        }else{
                            notification_no_disturbing = $.i18n.prop('app_users_text_notification_no_disturbing_close');
                        }
                        var notifier_name = this.notifier_name;
                        if(notifier_name == undefined){
                            notifier_name='';
                        }
                        var user_name_show = username;

                        selectOptions += '<tr>'+
                            '<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="'+username+'" />&nbsp;&nbsp;&nbsp;</label></td>'+
                            '<td class="text-center">'+user_name_show+'</td>'+
                            '<td class="text-center">'+notification_display_style+'</td>'+
                            '<td class="text-center">'+nickname+'</td>'+
                            '<td class="text-center">'+notification_no_disturbing+'</td>'+
                            '<td class="text-center">'+notification_no_disturbing_time+'</td>'+
                            '<td class="text-center">'+notifier_name+'</td>'+
                            '<td class="text-center">'+created+'</td>'+
                            '<td class="text-center">'+
                            '<ul class="nav-pills" style="list-style-type:none">'+
                            '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">' + $.i18n.prop('app_users_selections_operation') + '<b class="caret"></b></a>'+
                            '<ul class="dropdown-menu">'+
                            '<li data-filter-camera-type="all"><a href="javascript:EasemobCommon.disPatcher.toPageAppUserContacts(\''+username+'\')">' + $.i18n.prop('app_users_selections_contacts') + '</a></li>'+
                            '<li data-filter-camera-type="Zed"><a href="javascript:showUpdateInfo(\''+appUuid+'\',\''+username+'\')">' + $.i18n.prop('app_users_selections_modify') + '</span></a></li>'+
                            '<li data-filter-camera-type="Zed"><a href="javascript:deleteAppUser(\''+appUuid+'\',\''+username+'\')">' + $.i18n.prop("app_users_selections_delete") + '</a></li>'+
                            '<li data-filter-camera-type="Alpha"><a href="#passwordMondify" id="passwdMod${status.index }" onclick="setUsername(\'' + appUuid + '\',\''+ username +'\');" data-toggle="modal" role="button">'+$.i18n.prop('app_users_selections_resetpassword')+'</a></li>'+
                            '<li data-filter-camera-type="Zed"><a href="javascript:sendMessgeOne(\''+appUuid+'\',\''+username+'\')">' + $.i18n.prop('app_users_selections_sendMessages') + '</a></li>'+
                            '</ul>'+
                            '</li>'+
                            '</ul>'+
                            '</td>'+
                            '</tr>';
                    });
                    $('#tr_loading').remove();
                    $('#appUserBody').append(selectOptions);
                }
                // 无数据
                var tbody = document.getElementsByTagName("tbody")[0];
                if(!tbody.hasChildNodes()){
                    var option = '<tr><td class="text-center" colspan="9">' + $.i18n.prop('table_data_nodata') + '</td></tr>';
                    $('#tr_loading').remove();
                    $('#appUserBody').append(option);
                    var pageLi = $('#paginau').find('li');
                    for(var i=0;i<pageLi.length;i++){
                        $(pageLi[i]).hide();
                    }
                } else {
                    var ulB = '<ul>';
                    var ulE = '</ul>';
                    var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">' + $.i18n.prop('app_users_table_nav_previous') + '</a> </li>';
                    var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">' + $.i18n.prop('app_users_table_nav_next') + '</a> </li>';
                    $('#paginau').html('');


                    // 首页
                    if(pageNo == 1){
                        if(respData.cursor == null){
                            $('#paginau').append(ulB + ulE);
                        } else {
                            if(pageAction == 'no'){
                                $('#paginau1').append(ulB + textOp2 + ulE);
                            } else {
                                $('#paginau').append(ulB + textOp2 + ulE);
                            }
                        }
                        // 尾页
                    } else if(cursors.length != 0 && respData.cursor == null){
                        $('#paginau').append(ulB + textOp1 + ulE);
                    } else {
                        $('#paginau').append(ulB + textOp1 + textOp2 + ulE);
                    }
                }
            }
        });
    }
}

// 搜索IM用户
function searchUser(appUuid, queryString){
    // 获取token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');

    if(!access_token || access_token=='') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {

        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/' + queryString,
            type:'GET',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('tbody').html('');
                var option = '<tr><td class="text-center" colspan="9">' + $.i18n.prop('app_users_message_alerr_nouser') + '</td></tr>';
                $('#appUserBody').append(option);
                $('#paginau').hide();
            },
            success: function(respData, textStatus, jqXHR) {
                $('tbody').html('');
                $(respData.entities).each(function(){
                    var username = this.username;
                    var created = format(this.created);
                    var notification_display_style='';
                    if(this.notification_display_style == 0){
                        notification_display_style = $.i18n.prop('app_users_search_label_messageType_summary');
                    }else if(this.notification_display_style == 1){
                        notification_display_style = $.i18n.prop('app_users_search_label_messageType_detail');
                    }
                    var nickname = this.nickname;
                    if(nickname == undefined){
                        nickname='';
                    }
                    var notification_no_disturbing = this.notification_no_disturbing;
                    if(this.notification_no_disturbing){
                        notification_no_disturbing  = $.i18n.prop('app_users_search_label_mute_open');
                        var notification_no_disturbing_time = this.notification_no_disturbing_start + ':00'+'--'+this.notification_no_disturbing_end + ':00';
                    }else{
                        notification_no_disturbing = $.i18n.prop('app_users_search_label_mute_close');
                        var notification_no_disturbing_time='----';
                    }
                    var notifier_name = this.notifier_name;
                    if(notifier_name == undefined){
                        notifier_name='';
                    }
                    var user_name_show = username;
                    var selectOptions = '<tr>'+
                        '<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="'+username+'" />&nbsp;&nbsp;&nbsp;</label></td>'+
                        '<td class="text-center">'+user_name_show+'</td>'+
                        '<td class="text-center">'+notification_display_style+'</td>'+
                        '<td class="text-center">'+nickname+'</td>'+
                        '<td class="text-center">'+notification_no_disturbing+'</td>'+
                        '<td class="text-center">'+notification_no_disturbing_time+'</td>'+
                        '<td class="text-center">'+notifier_name+'</td>'+
                        '<td class="text-center">'+created+'</td>'+
                        '<td class="text-center">'+
                        '<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
                        '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span id="app_users_search_selections_operation">操作</span><b class="caret"></b></a>'+
                        '<ul class="dropdown-menu">'+
                        '<li data-filter-camera-type="all"><a href="javascript:EasemobCommon.disPatcher.toPageAppUserContacts(\''+username+'\')"><span id="app_users_search_selections_contacts">查看用户好友</span></a></li>'+
                        '<li data-filter-camera-type="Alpha"><a href="#passwordMondify" id="passwdMod${status.index }" onclick="setUsername(\'' + appUuid + '\',\''+ username +'\');" data-toggle="modal" role="button"><span id="app_users_search_selections_resetpassword">重置密码</span></a></li>'+
                        '<li data-filter-camera-type="Zed"><a href="javascript:showUpdateInfo(\''+appUuid+'\',\''+username+'\')"><span id="app_users_search_selections_modify">修改信息</span></a></li>'+
                        '<li data-filter-camera-type="Zed"><a href="javascript:deleteAppUser(\''+appUuid+'\',\''+username+'\')"><span id="app_users_search_selections_delete">删除</span></a></li>'+
                        '<li data-filter-camera-type="Zed"><a href="javascript:sendMessgeOne(\''+appUuid+'\',\''+username+'\')"><span id="app_users_search_selections_sendMessages">发送消息</span></a></li>'+
                        '</ul>'+
                        '</li>'+
                        '</ul>'+
                        '</td>'+
                        '</tr>';
                    $('#appUserBody').append(selectOptions);
                    $('#paginau').hide();
                });
            }
        });
    }
}


// 重置app用户密码
function updateAppUserPassword(){
    var username = $('#usernameMondify').val();
    var orgName = $.cookie('orgName');
    var token = $.cookie('access_token');
    var appUuid = $('#appUuidHidd').val();

    var pwdMondifyVal = $('#pwdMondify').val();
    var pwdMondifytwoVal = $('#pwdMondifytwo').attr('value');

    var passwordReg = /^[0-9a-zA-Z]{1,100}$/;
    if(pwdMondifyVal == ''){
        $('#pwdMondify').focus();
        $('#pwdMondifySpan').html($.i18n.prop('app_users_passwordModify_label_newpassword_placeholder'));
        return;
    } else if(!passwordReg.test(pwdMondifyVal)){
        $('#pwdMondify').focus();
        $('#pwdMondifySpan').html($.i18n.prop('app_users_passwordModify_label_newpassword_placeholder'));
        return;
    } else {
        $('#pwdMondifySpan').html('');

        if(pwdMondifytwoVal == ''){
            $('#pwdMondifytwo').focus();
            $('#pwdMondifytwoSpan').html($.i18n.prop('app_users_passwordModify_label_confirmnewpassword'));
            return;
        }else if(pwdMondifytwoVal != pwdMondifyVal){
            $('#pwdMondifytwo').focus();
            $('#pwdMondifytwoSpan').html($.i18n.prop('app_users_passwordModify_label_notmatch'));
            return;
        }else {
            $('#pwdMondifySpan').text('');
            $('#pwdMondifytwoSpan').text('');

            var d = {
                newpassword:pwdMondifyVal
            };
            var layerNum = layer.load('app_users_passwordModify_layer_pending');
            $.ajax({
                url:baseUrl + '/' + orgName + '/' + appUuid + '/users/' + username + '/password',
                type:'POST',
                data:JSON.stringify(d),
                headers:{
                    'Authorization':'Bearer ' + token,
                    'Content-Type':'application/json'
                },
                success:function(respData){
                    layer.close(layerNum);
                    alert($.i18n.prop('app_users_passwordModify_layer_saved'));
                    $('#pwdMondifySpan').text('');
                    $('#pwdMondifytwoSpan').text('');
                    $('#pwdMondify').val('');
                    $('#pwdMondifytwo').val('');
                    $('#passwordMondify').modal('hide');
                },
                error:function(data){
                    layer.close(layerNum);
                    alert($.i18n.prop('app_users_passwordModify_layer_saveerror'));
                }
            });
        }

    }
}

// 删除app下的用户
function deleteAppUser(appUuid,username){
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    if(confirm($.i18n.prop('app_users_confirm_delete_user'))){
        var layerNum = layer.load($.i18n.prop('app_users_delete_layer_user'));
        $.ajax({
            url:baseUrl + '/' + orgName +'/' + appUuid + '/users/' + username,
            type:'DELETE',
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error:function(){
                layer.close(layerNum);
                alert($.i18n.prop('app_users_delete_alert_deleteError'));
            },
            success:function(respData){
                layer.close(layerNum);
                alert($.i18n.prop('app_users_delete_alert_deleted'));
                getAppUserList(appUuid, 'no');
            }
        });
    }
}
//批量删除app下的用户
function deleteAppUserCheckBox(appUuid){
    var checkbox=document.getElementsByName("checkbox");
    var num=0;
    for (var i=0;i<checkbox.length;i++){
        if(checkbox[i].checked){
            num++;
        }
    }
    if(num>0){
        if(confirm($.i18n.prop('app_users_confirm_delete_user'))){
            var layerNum = layer.load($.i18n.prop('app_users_delete_layer_user'));
            var success = 0;
            var fail = 0;
            for (var i=0;i<checkbox.length;i++){
                if(checkbox[i].checked){
                    var flag = deleteAppUsers(appUuid,checkbox[i].value);
                    if(flag){
                        success ++;
                    }else{
                        fail ++;
                    }
                }
            }
            layer.close(layerNum);
            alert($.i18n.prop('app_users_delete_alert_deleteNoteDone'))
            getAppUserList(appUuid);
        }
    }else{
        alert($.i18n.prop('app_users_alert_deleteNoteItem'));
    }
}


//弹出发送消息
function sendMessge(appUuid){
    var checkbox=document.getElementsByName("checkbox");
    var num=0;
    for (var i=0;i<checkbox.length;i++){
        if(checkbox[i].checked){
            num++;
        }
    }
    if(num>0){
        var users = new Array();
        for (var i=0;i<checkbox.length;i++){
            if(checkbox[i].checked){
                users.push(checkbox[i].value);
            }
        }
        $('#usernameMessage').val(users);
        $('#appUuidMessage').val(appUuid);
        $('#messegeContent').val('');
        document.getElementById('messegeContent').style.display = "block";
        $('#img1').remove();
        $('#share-secret').val('');
        $('#file').val('');
        $('#f_file').val('');
        $('#sendMessageA').click();
    }else{
        alert($.i18n.prop('app_users_alert_deleteNoteItem'));
    }
}

//单个消息发送
function sendMessgeOne(appUuid,users){
    $('#usernameMessage').val(users);
    $('#appUuidMessage').val(appUuid);
    $('#messegeContent').val('');
    document.getElementById('messegeContent').style.display="block";
    $('#img1').remove();
    $('#share-secret').val('');
    $('#file').val('');
    $('#f_file').val('');
    $('#sendMessageA').click();
}

//发送消息
function sendUserMessage1(){
    var users = document.getElementById('usernameMessage').value;
    var appUuid = document.getElementById('appUuidMessage').value;
    var orgName = $.cookie('orgName');
    var token = $.cookie('access_token');
    var messageContent = $('#messegeContent').val().trim();
    var target = users.split(',');
    if ( messageContent ==''){
        alert($.i18n.prop('app_users_sendMessage_label_nomsg'));
    }else{
        var d = {
            "target_type" : "users",
            "target" : target,

            "msg" : {
                "type" : "txt",
                "msg" : messageContent
            }
        }
        var layerNum = layer.load($.i18n.prop('app_users_sendMessage_layer_pending'));
        $.ajax({
            url:baseUrl + '/'+ orgName + "/" + appUuid + '/messages',
            type:'POST',
            headers:{
                'Authorization':'Bearer '+token,
                'Content-Type':'application/json'
            },
            data:JSON.stringify(d),
            error:function(respData){
                layer.close(layerNum);
            },
            success:function(respData){
                layer.close(layerNum);
                $('#closeButn').click();
            }
        });
    }

}

//发送消息
function sendUserMessage(){
    var users = document.getElementById('usernameMessage').value;
    var appUuid = document.getElementById('appUuidMessage').value;
    var orgName = $.cookie('orgName');
    var token = $.cookie('access_token');
    var messageContent = $('#messegeContent').val().trim();
    var target = users.split(',');
    if ( messageContent ==''){
        alert($.i18n.prop('app_users_sendMessage_label_nomsg'));
    }else{
        var d = {
            "target_type" : "users",
            "target" : target,

            "msg" : {
                "type" : "txt",
                "msg" : messageContent
            }
        };
        var layerNum = layer.load($.i18n.prop('app_users_sendMessage_layer_pending'));
        $.ajax({
            url:baseUrl+'/'+ orgName + "/" + appUuid + '/messages',
            type:'POST',
            headers:{
                'Authorization':'Bearer '+token,
                'Content-Type':'application/json'
            },
            data:JSON.stringify(d),
            error:function(respData){
                layer.close(layerNum);
                alert($.i18n.prop('app_users_sendMessage_alert_failed'));
            },
            success:function(respData){
                layer.close(layerNum);
                $('#closeButn').click();
                alert($.i18n.prop('app_users_sendMessage_alert_succ'));
            }
        });
    }

}
//发送图片
function sendUserImgMessage(){
    if($('#sndBtn').attr('disabled') == 'disabled'){
        return ;
    }

    var shareSecret = $('#share-secret').val();
    if( shareSecret == '' || shareSecret == null){
        alert($.i18n.prop('app_users_sendMessage_selectPicture'));
    } else {
        var users = document.getElementById('usernameMessage').value;
        var appUuid = document.getElementById('appUuidMessage').value;
        var orgName = $.cookie('orgName');
        var token = $.cookie('access_token');
        var target = users.split(',');
        var str = $('#share-secret').val().split(',');
        var d = {
            "target_type" : "users",
            "target" : target,
            "msg" : {
                "type":"img","filename":str[0], "secret": str[1],"url":$('#imgUuid').val()
            }
        };
        var layerContent = layer.load($.i18n.prop('app_users_sendMessage_layer_pending'));
        $.ajax({
            url:baseUrl+'/'+ orgName + "/" + appUuid + '/messages',
            type:'POST',
            headers:{
                'Authorization':'Bearer '+token,
                'Content-Type':'application/json'
            },
            data:JSON.stringify(d),
            error:function(respData){
                layer.close(layerContent);
                alert($.i18n.prop('app_users_sendMessage_alert_failed'));
            },
            success:function(respData){
                layer.close(layerContent);
                $('#closeButn').click();
                alert($.i18n.prop('app_users_sendMessage_alert_succ'));
                $('#uploadresspan').text($.i18n.prop('app_users_sendMessage_layer_pending'));
                $('#img2').attr("src", "assets/img/140144.jpg");
            }
        });
    }

}


//获取用户好友列表
function getAppIMList(appUuid, owner_username){
    // 获取token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="3"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span id="app_users_contacts_table_loading">正在读取数据...</span></td></tr>';
        $('#appIMBody').empty();
        $('#appIMBody').append(loading);
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/'+owner_username+'/contacts/users',
            type:'GET',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                $('tbody').html('');
                var i=0;
                var selectOptions = '';
                $(respData.data).each(function(){
                    selectOptions += '<tr>'+
                        '<td style=" visibility:visible;"><input type="checkbox" value="fff"  style="width:100px; height:20px;border:1px solid #F00;"/>'+(i+1)+'</td>'+
                        '<td>'+respData.data[i]+'</td>'+
                        '<td class="text-center">'+
                        '<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
                        '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">' + $.i18n.prop('app_users_contacts_table_operation') + '<b class="caret"></b></a>'+
                        '<ul class="dropdown-menu" style="left:150px;">'+
                        '<li><a href="javascript:deleteAppIMFriend(\''+appUuid+'\', \''+owner_username+'\',\''+respData.data[i]+'\')">' + $.i18n.prop('app_users_contacts_table_disconn') + '</a></li>'+
                        '</ul>'+
                        '</li>'+
                        '</ul>'+
                        '</td>'+
                        '</tr>';
                    i++;
                });
                $('#tr_loading').remove();
                $('#appIMBody').append(selectOptions);
                var tbody = document.getElementsByTagName("tbody")[0];
                if(!tbody.hasChildNodes()){
                    var option = '<tr><td class="text-center" colspan="3">' + $.i18n.prop('table_data_nodata') + '</td></tr>';
                    $('#appIMBody').append(option);
                    var pageLi = $('#paginau').find('li');
                    for(var i=0;i<pageLi.length;i++){
                        $(pageLi[i]).hide();
                    }
                }
            }
        });
    }
}


//删除某个好友
function deleteAppIMFriend(appUuid, owner_username, friend_username){
    //获取token
    var orgName = $.cookie('orgName');
    var access_token = $.cookie('access_token');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if(window.confirm($.i18n.prop('app_users_contacts_delete_confirm'))){
            $.ajax({
                url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/'+owner_username+'/contacts/users/'+friend_username,
                type:'DELETE',
                headers:{
                    'Authorization':'Bearer '+access_token,
                    'Content-Type':'application/json'
                },
                error: function(jqXHR, textStatus, errorThrown) {
                },
                success: function(respData, textStatus, jqXHR) {
                    EasemobCommon.disPatcher.refreshCurrentPage();
                }
            });
        }
    }

}

//弹出添加好友页面
function showAddFriend(appUuid,username){
    $('#usernameFriend').val(username);
    $('#appUuidFriend').val(appUuid);
    $('#friendUsername').val('');
    $('#showAddFriend').click();
}

//添加好友
function addIMFriend(){
    var orgName = $.cookie('orgName');
    var access_token = $.cookie('access_token');
    var owner_username = $('#usernameFriend').val();
    var appUuid = $('#appUuidFriend').val();
    var friend_username = $('#friendUsername').val();
    if (friend_username == ''){
        alert($.i18n.prop('app_users_contacts_add_alert_needusername'));
    }else{
        var layerNum = layer.load($.i18n.prop('app_users_contacts_add_layer_pending'));
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid +'/users/' + friend_username,
            type:'POST',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                layer.close(layerNum);
                alert($.i18n.prop('app_users_contacts_add_note_nouser'));
            },
            success: function(respData, textStatus, jqXHR) {
                var layerNum = layer.load($.i18n.prop('app_users_contacts_add_layer_pending'));
                $.ajax({
                    url:baseUrl + '/' + orgName +'/' + appUuid + '/users/' + owner_username + '/contacts/users/' + friend_username,
                    type:'POST',
                    headers:{
                        'Authorization':'Bearer '+access_token,
                        'Content-Type':'application/json'
                    },
                    error: function(jqXHR, textStatus, errorThrown) {

                    },
                    success: function(respData, textStatus, jqXHR) {
                        layer.close(layerNum);
                        alert($.i18n.prop('app_users_contacts_add_note_addContactDone'));
                        EasemobCommon.disPatcher.refreshCurrentPage();
                    }
                });
            }
        });


    }

}


// 好友分页条更新
function updateIMPageStatus(owner_username){
    // 获取token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/'+owner_username+'/contacts/users?limit=1000',
            type:'GET',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                total = respData.entities.length;
                var totalPage = (total % 10 == 0) ? (parseInt(total / 10)) : (parseInt(total / 10) + 1);
                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">' + $.i18n.prop('app_users_table_tab_previous') + '</a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">' + $.i18n.prop('app_users_table_tab_next') + '</a> </li>';
                $('#paginau').html('');
                // 首页
                if(pageNo == 1){
                    if(totalPage == 1){
                        $('#paginau').append(ulB + ulE);
                    } else {
                        $('#paginau').append(ulB + textOp2 + ulE);
                    }
                    // 尾页
                } else if(totalPage ==  pageNo){
                    $('#paginau').append(ulB + textOp1 + ulE);
                } else {
                    $('#paginau').append(ulB + textOp1 + textOp2 + ulE);
                }
            }
        });
    }
}


//弹出修改信息框
function showUpdateInfo(appUuid, username){
    // 获取token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');

    if(!access_token || access_token=='') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/' + username,
            type:'GET',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                $(respData.entities).each(function(){
                    var username = this.username;
                    var notification_display_style = this.notification_display_style;
                    var nickname = this.nickname;
                    var notification_no_disturbing=this.notification_no_disturbing;
                    var notification_no_disturbing_start = this.notification_no_disturbing_start;
                    var notification_no_disturbing_end = this.notification_no_disturbing_end ;
                    $('#username').text(username);
                    document.getElementById('messageType_0').checked=false;
                    document.getElementById('messageType_1').checked=false;
                    if(notification_display_style == 0){
                        document.getElementById('messageType_0').checked='checked';
                    }else if(notification_display_style == 1){
                        document.getElementById('messageType_1').checked='checked';
                    }
                    $('#nickname').val(nickname);
                    document.getElementById('notification_true').checked=false;
                    document.getElementById('notification_false').checked=false;
                    if(notification_no_disturbing){
                        document.getElementById('notification_true').checked='checked';
                        document.getElementById('notification_time_div').style.display="block";
                        $('#notification_starttime').val(notification_no_disturbing_start);
                        $('#notification_endtime').val(notification_no_disturbing_end);
                    }else if(!notification_no_disturbing){
                        document.getElementById('notification_false').checked='checked';
                        document.getElementById('notification_time_div').style.display="none";
                        $('#notification_starttime').val('');
                        $('#notification_endtime').val('');
                    }
                    $('#showUpdateInfoA').click();
                });
            }
        });
    }
}

//修改信息
function updateInfo(appUuid){
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    var username =$('#username').text();
    var notification_display_style;
    if(document.getElementById('messageType_0').checked){
        notification_display_style = 0;
    }else if(document.getElementById('messageType_1').checked){
        notification_display_style = 1;
    }else{
        notification_display_style = '';
    }
    var nickname =$('#nickname').val();
    var notification_no_disturbing;
    var notification_no_disturbing_start;
    var notification_no_disturbing_end;
    if(document.getElementById('notification_true').checked){
        notification_no_disturbing = true;
        notification_no_disturbing_start = $('#notification_starttime').val();
        notification_no_disturbing_end = $('#notification_endtime').val();
    }else if(document.getElementById('notification_false').checked){
        notification_no_disturbing = false;
        notification_no_disturbing_start = '';
        notification_no_disturbing_end = '';
    }else{

    }
    var flag = true;
    if(nickname.length>20){
        flag =false;
    }

    if(document.getElementById('notification_true').checked){
        var numReg = /^[0-9]*$/;
        if(numReg.test(notification_no_disturbing_start) && numReg.test(notification_no_disturbing_end)){

            notification_no_disturbing_end = parseInt(notification_no_disturbing_end);
            notification_no_disturbing_start = parseInt(notification_no_disturbing_start);

            if(notification_no_disturbing_end >= 0 && notification_no_disturbing_end<=24 && notification_no_disturbing_start >= 0 && notification_no_disturbing_start <= 24){
                var d ={
                    notification_display_style : notification_display_style,
                    nickname : nickname,
                    notification_no_disturbing :  notification_no_disturbing,
                    notification_no_disturbing_start : notification_no_disturbing_start,
                    notification_no_disturbing_end : notification_no_disturbing_end
                };
                var layerNum = layer.load($.i18n.prop('app_users_infoModify_layer_content'));
                if(flag){
                    $.ajax({
                        url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/' + username,
                        type:'PUT',
                        headers:{
                            'Authorization':'Bearer '+access_token,
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify(d),
                        error: function(jqXHR, textStatus, errorThrown) {
                            layer.close(layerNum);
                            alert($.i18n.prop('app_users_infoModify_layer_saveerror'));
                        },
                        success: function(respData, textStatus, jqXHR) {
                            layer.close(layerNum);
                            alert($.i18n.prop('app_users_infoModify_layer_saved'));
                            $('#infoCloseButn').click();
                            getAppUserList(appUuid,'no');
                        }
                    });
                }else{
                    alert($.i18n.prop('app_users_infoModify_layer_nicknameError'));
                }
            }else{
                alert($.i18n.prop('app_users_infoModify_layer_periodError'));
            }

        }else{
            alert($.i18n.prop('app_users_infoModify_layer_periodError'));
        }

    }else if(!document.getElementById('notification_true').checked){
        var d ={
            notification_display_style : notification_display_style,
            nickname : nickname,
            notification_no_disturbing :  notification_no_disturbing,
            notification_no_disturbing_start : notification_no_disturbing_start,
            notification_no_disturbing_end : notification_no_disturbing_end
        };
        if(flag){
            $.ajax({
                url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/' + username,
                type:'PUT',
                headers:{
                    'Authorization':'Bearer '+access_token,
                    'Content-Type':'application/json'
                },
                data:JSON.stringify(d),
                error: function(jqXHR, textStatus, errorThrown) {
                    alert($.i18n.prop('app_users_infoModify_layer_saveerror'));
                },
                success: function(respData, textStatus, jqXHR) {
                    alert($.i18n.prop('app_users_infoModify_layer_saved'));
                    $('#infoCloseButn').click();
                    getAppUserList(appUuid,'no');
                }
            });
        }else{
            alert($.i18n.prop('app_users_infoModify_layer_nicknameError'));
        }
    }
}

// 上一页数据
function getPrevAppUserList() {
    getAppUserList(appUuid, 'forward');
}
// 下一页数据
function getNextAppUserList() {
    getAppUserList(appUuid, 'next');
}

// 去除字符串中所有空格
function removeAllSpace(str) {
    return str.replace(/\s+/g, "");
}

function showAddFriendHTML() {
    showAddFriend(appUuid, owner_username);
}

function check() {
    if (count == 0) {
        count++;
        return true;
    } else {
        return false;
    }
}
function preSaveNewIMUser() {
    if (check()) {
        count = 0;
        saveNewIMUser(appUuid);
    }
}


// 图片上传
function imgMessage() {
    $('#uploadresspan').text($.i18n.prop('app_users_alert_upload_picture_pending'));
    var img = $('#file').val().substr($('#file').val().lastIndexOf('.') + 1);
    img = img.toLowerCase();
    if (img == 'jpg' || img == 'png' || img == 'bmp' || img == 'gif' || img == 'jpeg') {
        var access_token = $.cookie('access_token');
        var orgName = $.cookie('orgName');
        var ajax_option = {
            url: baseUrl + '/' + orgName + '/' + appUuid + '/chatfiles',
            headers: {
                'Accept': 'application/json',
                'restrict-access': true,
                'Accept-Encoding': 'gzip,deflate',
                'Authorization': 'Bearer ' + access_token
            },
            success: function (respData) {
                $('#sndBtn').removeAttr('disabled');
                $('#uploadresspan').text($.i18n.prop('app_users_alert_upload_picture_saved'));
                var str = $('#file').val() + "," + respData.entities[0]['share-secret'];
                $('#share-secret').val(str);
                $('#imgUuid').val(baseUrl + '/' + orgName + '/' + appUuid + '/chatfiles/' + respData.entities[0].uuid);
            },
            error: function (respData) {
                $('#uploadresspan').text($.i18n.prop('app_users_alert_upload_picture_failure'));
                $('#sndBtn').attr('disabled', "true");
            }
        }

        $('#myForm').ajaxSubmit(ajax_option);
    } else {
        alert($.i18n.prop('app_users_alert_upload_picture_wrongtype'));
    }
}

// 搜索用户
function searchUserTmp() {
    var username = $('#userInbox').val();
    if (username == '' || username == null) {
        alert($.i18n.prop('app_users_text_search_box_placeholder'));
    } else {
        searchUser(appUuid, username);
    }
}
// 注册用户
function addNewAppUsers() {
    window.location.href = 'app_users_create.html?appUuid=' + appUuid;
}

// 删除选定的用户
function deleteAppUsersBox() {
    deleteAppUserCheckBox(appUuid);
}

//发送消息
function showSendMessge() {
    sendMessge(appUuid);
}

//发送消息判断
function sendMessage() {
    var waiting = $.i18n.prop('app_users_alert_upload_picture_waiting');
    var uploadresspan = $('#app_users_alert_upload_picture_waiting').text();
    var messageContent = $('#messegeContent').val();
    if (uploadresspan == waiting && messageContent == '') {
    } else if (uploadresspan != waiting && messageContent == '') {
        sendUserImgMessage();
    } else if (uploadresspan == waiting && messageContent != '') {
        sendUserMessage();
    } else if (uploadresspan != waiting && messageContent != '') {
        sendUserMessage1();
        sendUserImgMessage();
    }
}

//免打扰时段显示隐藏
function showTimeDiv(num) {
    if (num) {
        document.getElementById('notification_time_div').style.display = 'block';
    } else {
        document.getElementById('notification_time_div').style.display = 'none';
    }
}

//修改信息
function updateInfoHTML() {
    updateInfo(appUuid);
}

function checkAll() {
    var ischeck = document.getElementById('checkAll');
    var checkbox = document.getElementsByName('checkbox');
    if (ischeck.checked) {
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = true;
        }
    } else {
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = false;
        }
    }
}

function clsupSpan() {
    $('#app_users_alert_upload_picture_waiting').text($.i18n.prop('app_users_alert_upload_picture_waiting'));
}