/**
 * Created by kenshinn on 15-6-10.
 */


//群组发送消息
function sendUserMessages(){
    var users = document.getElementById('usernameMessage').value;
    var appUuid = document.getElementById('appUuidMessage').value;
    var orgName = $.cookie('orgName');
    var token = $.cookie('access_token');
    var messageContent = $('#messegeContent').val().trim();
    var target = users.split(',');
    if ( messageContent ==''){
        alert($.i18n.prop('app_chatgroups_form_sendMsg_contentEmpty'));
    }else{
        var d = {
            "target_type" : "chatgroups",
            "target" : target,

            "msg" : {
                "type" : "txt",
                "msg" : messageContent
            }
        };
        var layerNum = layer.load($.i18n.prop('app_chatgroups_form_sendMsg_pending'));
        $.ajax({
            url:baseUrl + '/' + orgName + "/" + appUuid + '/messages',
            type:'POST',
            headers:{
                'Authorization':'Bearer ' + token,
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
//群组发送图片
function sendUserImgMessages(){
    if( $('#share-secret').val() == ''|| $('#share-secret').val() == null){
        alert($.i18n.prop('app_chatgroups_sendMsg_label_selectPicture'));
    }else{
        var users = document.getElementById('usernameMessage').value;
        var appUuid = document.getElementById('appUuidMessage').value;
        var orgName = $.cookie('orgName');
        var token = $.cookie('access_token');
        var target = users.split(',');
        var str = $('#share-secret').val().split(',');
        var d = {
            "target_type" : "chatgroups",
            "target" : target,
            "msg" : {
                "type":"img","filename":str[0], "secret": str[1],"url":$('#imgUuid').val()
            }
        };
        var layerNum = layer.load($.i18n.prop('app_chatgroups_sendMsg_layer_sending'));
        $.ajax({
            url:baseUrl + '/' + orgName + "/" + appUuid + '/messages',
            type:'POST',
            headers:{
                'Authorization':'Bearer '+token,
                'Content-Type':'application/json'
            },
            data:JSON.stringify(d),
            error:function(respData){
                layer.close(layerNum);
                alert($.i18n.prop('app_chatgroups_sendMsg_label_sendError'));
            },
            success:function(respData){
                layer.close(layerNum);
                $('#closeButn').click();
                $('#uploadresspan').text($.i18n.prop('app_chatgroups_sendMsg_label_wait'));
                alert($.i18n.prop('app_chatgroups_sendMsg_label_sent'));
            }
        });
    }
}


// 获取app群组列表
function getAppChatrooms(appUuid, pageAction){

    // 获取token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if('next' == pageAction){
            pageNo += 1;
        } else if('forward' == pageAction){
            pageNo -= 1;
        }

        var tmp = '';
        if(typeof(pageAction) != 'undefined' && pageAction != '' && cursors[pageNo] != ''){
            tmp = '&cursor=' + cursors[pageNo];
        }
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="4"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
        $('#appChatroomBody').empty();
        $('#appChatroomBody').append(loading);
        $.ajax({
            url:baseUrl+'/'+ orgName + "/" + appUuid + '/chatgroups?limit=10' + tmp,
            type:'GET',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error:function(respData){

            },
            success:function(respData){

                $('tbody').html('');
                $(respData.data).each(function(){
                    var groupid = $.trim(this.groupid);
                    var groupname = $.trim(this.groupname);
                    if(groupname == '' || groupname == null){
                        groupname = '-';
                    }
                    var selectOptions = '<tr>'+
                        '<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="'+groupid+'" />&nbsp;&nbsp;&nbsp;</label></td>'+
                        '<td class="text-center" width="222px" style="word-break:break-all">'+ groupid +'</td>'+
                        '<td class="text-center" width="666px" style="word-break:break-all">'+ groupname +'</td>'+
                        '<td class="text-center">'+
                        '<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
                        '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">' + $.i18n.prop('app_chatgroups_table_operation') + '<b class="caret"></b></a>'+
                        '<ul class="dropdown-menu">'+
                        '<li data-filter-camera-type="all"><a href="javascript:togroupaddAppAdminuserusers(\''+appUuid+'\',\''+groupid+'\')">' + $.i18n.prop('app_chatgroups_table_operation_members') + '</a></li>'+
                        '<li data-filter-camera-type="Alpha"><a href="javascript:deleteAppChatroom(\''+appUuid+'\',\''+groupid+'\')">' + $.i18n.prop('app_chatgroups_table_operation_delete') + '</a></li>'+
                        '<li data-filter-camera-type="Zed"><a href="javascript:sendMessgeOne(\''+appUuid+'\',\''+groupid+'\')">' + $.i18n.prop('app_chatgroups_table_operation_sendmessage') + '</a></li>'+
                        '</ul>'+
                        '</li>'+
                        '</ul>'+
                        '</td>'+
                        '</tr>';
                    $('#tr_loading').remove();
                    $('#appChatroomBody').append(selectOptions);
                });

                var tbody = document.getElementsByTagName("tbody")[0];
                if(!tbody.hasChildNodes()){
                    var option = '<tr><td class="text-center" colspan="7">' + $.i18n.prop('table_data_nodata') + '</td></tr>';
                    $('#appChatroomBody').append(option);
                    var pageLi = $('#pagina').find('li');
                    for(var i=0;i<pageLi.length;i++){
                        $(pageLi[i]).hide();
                    }
                }

                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getAppChatrooms(\'' + appUuid + '\',\'forward\')">' + $.i18n.prop('app_chatgroups_table_nav_previous') + '</a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getAppChatrooms(\'' + appUuid + '\',\'next\')">' + $.i18n.prop('app_chatgroups_table_nav_next') + '</a> </li>';
                $('#paginau').html('');
                var hasNext = (respData.cursor != undefined);
                cursors[pageNo+1] = respData.cursor;
                if(pageNo == 1){
                    if(hasNext){
                        $('#paginau').append(ulB + textOp2 + ulE);
                    } else {
                        $('#paginau').append(ulB + ulE);
                    }
                } else {
                    if(hasNext){
                        $('#paginau').append(ulB + textOp1 + textOp2 + ulE);
                    } else {
                        $('#paginau').append(ulB + textOp1 + ulE);
                    }
                }
            }
        });
    }
}


// 搜索app群组
function getAppChatgroups(appUuid, groupid, pageAction){
    $('#paginau').html('');
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if('forward' == pageAction){
            pageNo += 1;
        } else if('next' == pageAction){
            pageNo -= 1;
        }
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="4"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;' + $.i18n.prop('app_chatgroups_table_loading') + '</td></tr>';
        $('#appChatroomBody').empty();
        $('#appChatroomBody').append(loading);
        $.ajax({
            url:baseUrl+'/'+ orgName + "/" + appUuid + '/chatgroups/'+groupid,
            type:'GET',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error:function(respData){
                var error = jQuery.parseJSON(respData.responseText).error;
                $('tbody').html('');
                if('service_resource_not_found' == error || 'illegal_argument' == error){
                    var option = '<tr><td class="text-center" colspan="4">' + $.i18n.prop('app_chatgroups_btn_search_alert') + '</td></tr>';
                    $('#appChatroomBody').append(option);
                }
            },
            success:function(respData){
                if(pageAction!='forward'){
                    cursors[pageNo+1] =	respData.cursor;
                } else {
                    cursors[pageNo+1] = null;
                }
                $('tbody').html('');
                var groupid = respData.data[0].id;
                var groupname = respData.data[0].name;
                var errors=respData.data[0].error;
                if(errors != null){
                    var option = '<tr><td class="text-center" colspan="4">' + $.i18n.prop('app_chatgroups_btn_search_alert') + '</td></tr>';
                    $('#appChatroomBody').append(option);
                    return;
                }
                if(groupname == '' || groupname == null){
                    groupname = '-';
                }

                var selectOptions = '<tr>'+
                    '<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="'+groupid+'" />&nbsp;&nbsp;&nbsp;</label></td>'+
                    '<td class="text-center">'+groupid+'</td>'+
                    '<td class="text-center">'+ groupname +'</td>'+
                    '<td class="text-center">'+
                    '<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
                    '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">' + $.i18n.prop('app_chatgroups_table_operation') + '<b class="caret"></b></a>'+
                    '<ul class="dropdown-menu">'+
                    '<li data-filter-camera-type="all"><a href="javascript:togroupaddAppAdminuserusers(\''+appUuid+'\',\''+groupid+'\')">' + $.i18n.prop('app_chatgroups_table_operation_members') + '</a></li>'+
                    '<li data-filter-camera-type="Alpha"><a href="javascript:deleteAppChatroom(\''+appUuid+'\',\''+groupid+'\')">' + $.i18n.prop('app_chatgroups_table_operation_delete') + '</a></li>'+
                    '<li data-filter-camera-type="Zed"><a href="javascript:sendMessgeOne(\''+appUuid+'\',\''+groupid+'\')">' + $.i18n.prop('app_chatgroups_table_operation_sendmessage') + '</a></li>'+
                    '</ul>'+
                    '</li>'+
                    '</ul>'+
                    '</td>'+
                    '</tr>';

                $('#tr_loading').remove();
                $('#appChatroomBody').append(selectOptions);
            }
        });
    }

}

// 获取群组成员列表
function getAppChatroomsuser(appUuid,groupid,pageAction){
    // 获取token
    $('#paginau').html('');
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if('forward' == pageAction){
            pageNo += 1;
        } else if('next' == pageAction){
            pageNo -= 1;
        }

        var tmp = '';
        if(typeof(pageAction)!='undefined' && pageAction != ''){
            tmp = '&cursor=' + cursors[pageNo];
        }
        $.ajax({
            url:baseUrl + '/' +orgName +'/'+appUuid+'/chatgroups/' +groupid+'/users',
            type:'GET',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error:function(respData){
            },
            success:function(respData){
                if(pageAction!='forward'){
                    cursors[pageNo+1] = respData.cursor;
                } else {
                    cursors[pageNo+1] = null;
                }
                if(respData.entities.length ==0 && pageAction == 'no'){
                    getAppChatroomsuser(appUuid,groupid,'forward' );
                }else{
                    $('#showUsername').text(cuser)
                    $('tbody').html('');
                    $(respData.data).each(function(){

                        var members = this.member;
                        var owner = this.owner;
                        if(owner !=undefined){
                            $.cookie('owner',owner);

                            var selectOptions = '<tr>'+
                                '<td class="text-center" style="color:#FF0000;"><i class="icon-user"></i>&nbsp;'+owner+'</td>'+
                                '<td class="text-center">'+ $.i18n.prop('app_chatgroups_users_table_disable') +
                                '</td>'+
                                '</tr>';

                            $('#appIMBody').append(selectOptions);
                        }

                        if(members != undefined) {
                            var selectOptions = '<tr>'+
                                '<td class="text-center">'+members+'</td>'+
                                '<td class="text-center">'+
                                '<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
                                '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">' + $.i18n.prop('app_chatgroups_users_table_selection_operation') + '<b class="caret"></b></a>'+
                                '<ul class="dropdown-menu" style="left:200px">'+
                                '<li><a href="javascript:deleteAppChatroomUsers(\''+appUuid+'\',\''+groupid+'\',\''+members+'\')">' + $.i18n.prop('app_chatgroups_users_table_selection_remove') + '</a></li>'+
                                '</ul>'+
                                '</li>'+
                                '</ul>'+
                                '</td>'+
                                '</tr>';
                            $('#appIMBody').append(selectOptions);

                        }
                    });
                }
                var tbody = document.getElementsByTagName("tbody")[0];
                if(!tbody.hasChildNodes()){
                    var option = '<tr><td class="text-center" colspan="3">无数据!</td></tr>';
                    $('#appIMBody').append(option);
                    var pageLi = $('#pagina').find('li');
                    for(var i=0;i<pageLi.length;i++){
                        $(pageLi[i]).hide();
                    }
                }
            }
        });
    }

}
// 删除app下的群组
function deleteAppChatroom(appUuid,groupuuid){
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');

    if(confirm($.i18n.prop('app_chatgroups_delete_confirm'))){
        $.ajax({
            url:baseUrl + '/' +orgName + '/' + appUuid + '/chatgroups/' + groupuuid,
            type:'DELETE',
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error:function(){
                alert($.i18n.prop('app_chatgroups_delete_failed'));
            },
            success:function(respData){
                alert($.i18n.prop('app_chatgroups_delete_succ'));
                EasemobCommon.disPatcher.toPageAppChatGroups();
            }
        });
    }
}
// 移除群组下的成员
function deleteAppChatroomUsers(appUuid,groupuuid,usersname){
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');

    if(confirm($.i18n.prop('app_chatgroups_users_delete_confirm'))){
        $.ajax({
            url:baseUrl + '/' +orgName +'/'+appUuid+'/chatgroups/' +groupuuid+'/users/'+usersname,
            type:'DELETE',
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error:function(){
                alert($.i18n.prop('app_chatgroups_users_delete_confirm'));
            },
            success:function(respData){
                alert($.i18n.prop('app_chatgroups_users_delete_confirm'));
                EasemobCommon.disPatcher.refreshCurrentPage();
            }
        });
    }
}
// 添加群内成员
function addChatgroupMember(appUuid, groupid, newmember) {
    var orgName = $.cookie('orgName');
    var access_token = $.cookie('access_token');
    if (newmember == ''){
        $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_add_alert_user_invalid'));
    }else{
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid +'/users/' + newmember,
            type:'POST',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_add_alert_user_notfoud'));
            },
            success: function(respData, textStatus, jqXHR) {
                var owner = $.cookie('owner');
                if(newmember != owner){
                    $.ajax({
                        url:baseUrl + '/' +orgName +'/' + appUuid+'/chatgroups/' + groupid + '/users/' + newmember,
                        type:'POST',
                        headers:{
                            'Authorization':'Bearer '+access_token,
                            'Content-Type':'application/json'
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                        },
                        success: function(respData, textStatus, jqXHR) {
                            alert($.i18n.prop('app_chatgroups_add_succ'));
                            EasemobCommon.disPatcher.refreshCurrentPage();
                        }
                    });
                }else{
                    $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_add_alert_owner_duplicate'));
                }
            }
        });
    }
}


// 添加群组
function createNewChatgroups(appUuid,qunzuname,qunzumiaosu,approval,publics,qunzuguan){
    var orgName = $.cookie('orgName');
    var access_token = $.cookie('access_token');
    var maxusers = $('#maxusers').val();

    if (qunzuname == ''){
        $('#groupnameSpan').text($.i18n.prop('app_chatgroups_add_alert_groupname_null'));
        return false;
    }

    if(qunzumiaosu ==''){
        $('#groupnameSpan').text('');
        $('#groupdescSpan').text($.i18n.prop('app_chatgroups_add_alert_groupdesc_null'));
        return false;
    }
    var maxusersReg = /^[0-9]+$/;
    if (maxusers == ''){
        $('#groupnameSpan').text('');
        $('#groupdescSpan').text('');
        $('#groupmaxuserSpan').text($.i18n.prop('app_chatgroups_add_alert_groupmaxusers_null'));
        return false;
    } else if(!(maxusersReg.test(maxusers) && parseInt(maxusers) >= 1)) {
        $('#groupmaxuserSpan').text($.i18n.prop('app_chatgroups_add_alert_groupmaxuser_duration'));
    }else if(qunzuguan==''){
        $('#groupnameSpan').text('');
        $('#groupdescSpan').text('');
        $('#groupmaxuserSpan').text('');
        $('#qunzuguanSpan').text($.i18n.prop('app_chatgroups_add_alert_groupowner_null'));
        return false;
    }else{
        $('#groupnameSpan').text('');
        $('#groupdescSpan').text('');
        $('#groupmaxuserSpan').text('');
        $('#qunzuguanSpan').text('');
        var qun={
            "groupname":qunzuname,
            "desc":qunzumiaosu,
            "public":publics,
            "owner":qunzuguan,
            "maxusers":parseInt(maxusers)
        };
        if(publics==true){
            qun.approval=approval;
        }
        $.ajax({
            url:baseUrl + '/' +orgName +'/'+appUuid+'/chatgroups',
            type:'POST',
            data:JSON.stringify(qun),
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#qunzuguanSpan').text($.i18n.prop('app_chatgroups_add_alert_user_notfoud'));
            },
            success: function(respData, textStatus, jqXHR) {
                $('#qunzuguanSpan').text('');
                EasemobCommon.disPatcher.refreshCurrentPage();
            }
        });
    }
}


// 批量删除app下的群组的Ajax
function deleteAppChatrooms(appUuid,groupuuid){
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    $.ajax({
        async: false,
        url:baseUrl + '/' +orgName +'/'+appUuid+'/chatgroups/' + groupuuid,
        type:'DELETE',
        headers:{
            'Authorization':'Bearer ' + access_token,
            'Content-Type':'application/json'
        },
        error:function(){
        },
        success:function(respData){
        }
    });
}


//批量删除app下的群组调用
function deleteAppChatgroupsCheckBox(appUuid){
    var checkbox = document.getElementsByName("checkbox");
    var num = 0;
    for (var i=0;i<checkbox.length;i++){
        if(checkbox[i].checked){
            num++;
        }
    }
    if(num>0){
        if(confirm($.i18n.prop('app_chatgroups_delete_confirm'))){
            for (var i=0;i<checkbox.length;i++){
                if(checkbox[i].checked){
                    deleteAppChatrooms(appUuid, checkbox[i].value);
                }
            }
            EasemobCommon.disPatcher.refreshCurrentPage();
        }
    }else{
        alert($.i18n.prop('app_chatgroups_delete_deleteNoteItem'));
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


function checkMaxusers() {
    var ii = 0;
    var maxusers = 0;
    $('#appIMBody').find("tr").each(function (i) {
        ii++;
    });

    var orgName = $.cookie('orgName');
    var access_token = $.cookie('access_token');
    $.ajax({
        url: baseUrl + '/' + orgName + "/" + appUuid + '/chatgroups/' + groupid,
        type: 'GET',
        async: false,
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
        error: function (respData) {
        },
        success: function (respData) {
            maxusers = respData.data[0].maxusers;
        }
    });
    if (ii >= maxusers) {
        return false;
    } else {
        return true;
    }
}

function addChatgroupMemberPre() {
    var newmember = $('#newmember').val().trim();
    if (checkMaxusers()) {
        $('#newmemberEMsg').text('');
        addChatgroupMember(appUuid, groupid, newmember)
    } else {
        $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_table_overLoad'));
    }
}

//发送消息
function showSendMessge() {
    sendMessge(appUuid);
}

// 搜索群组
function searchChatgroup() {
    var groupidV = $('#groupid').val().trim();
    if (groupidV == '' || groupidV == null) {
        alert($.i18n.prop('app_chatgroups_btn_search_placeholder'));
    } else {
        getAppChatgroups(appUuid, groupidV);
    }
}

//删除选定的群组
function deleteAppChatgroupBox() {
    deleteAppChatgroupsCheckBox(appUuid);
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

//发送消息判断
function sendMessage() {
    var uploadResspan = $('#uploadresspan').text();
    var messageContent = $('#messegeContent').val();
    var pending = $.i18n.prop('app_chatgroups_sendMsg_label_wait');
    if (uploadResspan == pending && messageContent == '') {
    } else if (uploadResspan != pending && messageContent == '') {
        sendUserImgMessages();
    } else if (uploadResspan == pending && messageContent != '') {
        sendUserMessages();
    } else if (uploadResspan != pending && messageContent != '') {
        sendUserMessages();
        sendUserImgMessages();
    }
}

function check() {
    if (count == 0) {
        count++;
        return true;
    } else {
        count = 0;
        return false;
    }
}

//添加群组
var publics = true;
var approval = true;
function createNewChatgroupPre() {
    if (check()) {
        var groupName = $("#groupName").val().trim();
        var groupDesc = $("#groupDesc").val().trim();
        var groupOwner = $("#groupOwner").val().trim();
        var maxusers = $("#maxusers").val().trim();
        var res = createNewChatgroups(appUuid, groupName, groupDesc, approval, publics, groupOwner);
        if (!res) {
            count = 0;
        }
    }
}

//判断是否是公开群
function nums() {
    publics = true;
    $('#validation').show();
}
function numss() {
    publics = false;
    $('#validation').hide();
}

//判断是否需要验证
function approvalon() {
    approval = true;
}
function approvals() {
    approval = false;
}


function imgMessage() {
    $('#uploadresspan').text($.i18n.prop('app_chatgroups_sendMsg_label_uploading'));
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
                'Authorization': 'Bearer ' + access_token,
            },
            success: function (respData) {
                $('#uploadresspan').text($.i18n.prop('app_chatgroups_alert_upload_picture_saved'));
                var str = $('#file').val() + "," + respData.entities[0]['share-secret'];
                $('#share-secret').val(str);
                $('#imgUuid').val(baseUrl + '/' + orgName + '/' + appUuid + '/chatfiles/' + respData.entities[0].uuid);
            },
            error: function (respData) {
            }
        };

        $('#myForm').ajaxSubmit(ajax_option);
    } else {
        alert($.i18n.prop('app_chatgroups_alert_upload_picture_wrongtype'));
    }

}

function clsupSpan() {
    $('#uploadresspan').text($.i18n.prop('app_chatgroups_sendMsg_label_wait'));
}