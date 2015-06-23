/**
 * Created by kenshinn on 15-6-10.
 */


// 分页条更新
function updatequnzuPageStatus(){

    // 获取token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid + '/notifiers?limit=1000',
            type:'GET',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                total = respData.entities.length;
                var totalPage = (total % 5 == 0) ? (parseInt(total / 5)) : (parseInt(total / 5) + 1);
                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">' + $.i18n.prop('app_notifiers_table_notifier_nav_previous') + '</a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">' + $.i18n.prop('app_notifiers_table_notifier_nav_next') + '</a> </li>';
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

// 查询证书信息
function getAppNotifiers(appUuid, pageAction){
    $('#paginau').html('');
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    if('next' == pageAction){
        pageNo += 1;
    } else if('forward' == pageAction){
        pageNo -= 1;
    }
    var temp = '';
    if(typeof(pageAction)!='undefined' && pageAction != ''){
        temp = '&cursor='+cursors[pageNo];
    }

    var loading = '<tr id="tr_loading"><td class="text-center" colspan="6"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;' + $.i18n.prop('app_notifiers_table_loading') + '</span></td></tr>';
    $('#appCredentialBody').empty();
    $('#appCredentialBody').append(loading);
    $.ajax({
        url:baseUrl+'/'+ orgName +'/' + appUuid + '/notifiers?limit=8'+temp,
        type:'GET',
        headers:{
            'Authorization':'Bearer ' + access_token,
            'Content-Type':'application/json'
        },
        error: function(jqXHR, textStatus, errorThrown) {

        },
        success: function(respData, textStatus, jqXHR) {
            if(pageAction != 'forward'){
                cursors[pageNo + 1] =	respData.cursor;
            } else {
                cursors[pageNo + 1] = null;
            }

            var option = '';
            $(respData.entities).each(function(){
                var name = this.name;
                var credentialId = this.uuid;
                var environment = '';
                if(this.environment == 'DEVELOPMENT') {
                    environment = $.i18n.prop('app_notifiers_table_notifier_dev');
                } else if(this.environment == 'PRODUCTION'){
                    environment = $.i18n.prop('app_notifiers_table_notifier_production');
                }

                var created = format(this.created);
                var modified = format(this.modified);
                option += '<tr>'+
                    '<td class="text-center">'+name+'</td>'+
                    '<td class="text-center">'+environment+'</td>'+
                    '<td class="text-center">'+created+'</td>'+
                    '<td class="text-center">'+modified+'</td>'+
                    '<td class="text-center">&nbsp;<a href="javascript:deleteAppNotifiers(\''+ credentialId + '\',\''+ appUuid +'\')">' + $.i18n.prop('app_notifiers_table_notifier_delete') + '</a></td>'+
                    '</tr>';

            });
            $('#appCredentialBody').html('');
            $('#appCredentialBody').append(option);

            // 无数据
            var tbody = document.getElementsByTagName("tbody")[0];
            if(!tbody.hasChildNodes()){
                var option = '<tr><td class="text-center" colspan="6">无数据!</td></tr>';
                $('#tr_loading').remove();
                $('#appUserAdminBody').append(option);
                var pageLi = $('#paginau').find('li');
                for(var i=0;i<pageLi.length;i++){
                    $(pageLi[i]).hide();
                }
            } else {
                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppNotifiers();">' + $.i18n.prop('app_notifiers_table_notifier_nav_previous') + '</a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppNotifiers();">' + $.i18n.prop('app_notifiers_table_notifier_nav_next') + '</a> </li>';
                $('#paginau').html('');

                // 首页
                if(pageNo == 1){
                    if(respData.cursor == null){
                        $('#paginau').append(ulB + ulE);
                    } else {
                        $('#paginau').append(ulB + textOp2 + ulE);
                    }
                    // 尾页
                } else if(cursors.length != 0 && respData.cursor == null){
                    $('#paginau').append(ulB + textOp1 + ulE);
                } else {
                    $('#paginau').append(ulB + textOp1 + textOp2 + ulE);
                }
            }
            if(respData.entities.length == 0){
                var option = '<tr><td class="text-center" colspan="6">' + $.i18n.prop('app_notifiers_table_notifier_nodata') + '</td></tr>';
                $('#appCredentialBody').append(option);
            }
        }
    });
}

// 删除开发者推送证书
function deleteAppNotifiers(credentialId,appUuid){
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    if(confirm($.i18n.prop('app_notifiers_delete_confirm'))){
        var layerNum = layer.load($.i18n.prop('app_notifiers_delete_layer_pending'));
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid + '/notifiers/' + credentialId,
            type:'DELETE',
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                layer.close(layerNum);
                alert($.i18n.prop('app_notifiers_delete_failed'))
            },
            success: function(respData, textStatus, jqXHR) {
                layer.close(layerNum);
                alert($.i18n.prop('app_notifiers_delete_succ'))
                getAppNotifiers(appUuid,'no');
            }
        });
    }
}



// 上一页数据
function getPrevAppNotifiers() {
    getAppNotifiers(appUuid, 'forward');
}
// 下一页数据
function getNextAppNotifiers() {
    getAppNotifiers(appUuid, 'next');
}
function check() {
    if (count == 0) {
        count++;
        return true;
    } else {
        return false;
    }
}

function changeform() {
    if (check()) {
        var access_token = $.cookie('access_token');
        var orgName = $.cookie('orgName');

        var notifierName = $('#name').val();
        var passphrase = $('#passphrase').val();
        var notifierNameRegx = /^[A-Za-z0-9-_]*$/;
        if (!notifierNameRegx.test(notifierName)) {
            alert($.i18n.prop('app_notifiers_form_name_illegal'));
            return;
        }
        if (!validateSuffix($('#file').val())) {
            return;
        }
        if (passphrase == '') {
            alert($.i18n.prop('app_notifiers_form_phrase_illegal'));
            return;
        }

        var ajax_option = {
            url: baseUrl + '/' + orgName + '/' + appUuid + '/notifiers',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip,deflate',
                'Authorization': 'Bearer ' + access_token,
            },
            success: function (data) {
                layer.close(layerNum);
                alert($.i18n.prop('app_notifiers_form_save_succ'));
                //clear form
                $('#name').val('');
                $('#passphrase').val('');

                getAppNotifiers(appUuid);
            },
            error: function (data) {
                layer.close(layerNum);
                alert($.i18n.prop('app_notifiers_form_save_failed'));
            }
        }
        var layerNum = layer.load($.i18n.prop('app_notifiers_layer_pending'), 3);
        $('#myForm').ajaxSubmit(ajax_option);
    }
}

// 文件后缀校验
function validateSuffix(fileName) {
    var fileExt = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
    var allowExt = '.p12';
    if (allowExt != fileExt) {
        alert($.i18n.prop('app_notifiers_layer_typeError') + fileExt);
        return false;
    }
    return true;
}

//显示制作证书按钮
function displayCertificate() {
    $('#certificate').show();
    document.getElementById("div").style.width = 240 + "px";
}
//隐藏制作证书按钮
function hideCertificate() {
    $('#certificate').hide();
    document.getElementById("div").style.width = 80 + "px";
}
