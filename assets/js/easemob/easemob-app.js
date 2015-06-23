/**
 * Created by kenshinn on 15-6-10.
 */

// 创建应用表单校验
function createAppFormValidate(){
    // 表单校验
    var appName = $('#appName').val();
    var nick = $('#nick').val();
    var appDesc = $('#appDesc').val();

    if('' == appName){
        $('#appNameMsg').text($.i18n.prop('app_create_form_appNameEmpty'));
        $('#appNameMsg').css('color','red');
        $('#appName').focus();
        return false;
    }
    var appNameRegex = /^[0-9a-zA-Z\-]*$/;
    if(!appNameRegex.test(appName)){
        $('#appNameMsg').text($.i18n.prop('app_create_form_productNameMsg'));
        $('#appNameMsg').css('color','red');
        $('#appName').focus();
        return false;
    }
    $('#appNameMsg').text($.i18n.prop('app_create_form_ok'));
    $('#appNameMsg').css('color','blue');

    if('' == nick){
        $('#nickMsg').text($.i18n.prop('app_create_form_productNameEmpty'));
        $('#nickMsg').css('color','red');
        $('#nick').focus();
        return false;
    }
    var nickRegex = /^[0-9a-zA-Z-_\u4e00-\u9faf]*$/;
    if(!nickRegex.test(nick)){
        $('#nickMsg').text($.i18n.prop('app_create_form_appNameMsg'));
        $('#nickMsg').css('color','red');
        $('#nick').focus();
        return false;
    }
    $('#nickMsg').text($.i18n.prop('app_create_form_ok'));
    $('#nickMsg').css('color','blue');

    if('' == appDesc){
        $('#appDescMsg').text($.i18n.prop('app_create_form_appDescEmpty'));
        $('#appDescMsg').css('color','red');
        $('#appDesc').focus();
        return false;
    }
    var appDescReg = /^[0-9a-zA-Z,.?。，？、\/'":\u4e00-\u9faf]{0,100}$/;
    if(!appDescReg.test(appDesc)){
        $('#appDescMsg').text($.i18n.prop('app_create_form_appDescMsg'));
        $('#appDescMsg').css('color','red');
        $('#appDesc').focus();
        return false;
    }

    $('#appDescMsg').text($.i18n.prop('app_create_form_ok'));
    $('#appDescMsg').css('color','blue');

    return true;
}

// 创建app
function saveNewApp(){
    // get org admin token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    var appname = $('#appName').val();
    var allow_open_registration = $('input[name="allow_open_registration"]:checked').val();
    var appDesc = $('#appDesc').val();

    var dataBody = {
        'name':appname,
        'allow_open_registration':allow_open_registration,
        'appDesc':appDesc
    };

    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if(createAppFormValidate()){
            // 保存数据
            $.ajax({
                url:baseUrl+'/management/organizations/'+ orgName +'/applications',
                type:'POST',
                headers:{
                    'Authorization':'Bearer ' + access_token,
                    'Content-Type':'application/json'
                },
                data:JSON.stringify(dataBody),
                error: function(jqXHR, textStatus, errorThrown) {
                    alert($.i18n.prop('app_create_form_failed'));
                },
                success: function(respData, textStatus, jqXHR) {
                    alert($.i18n.prop('app_create_form_succ'));
                    $(respData.entities).each(function(){
                        window.location.href = 'app_profile.html?appUuid=' + this.uuid;
                    });
                }
            });
        }
    }
}


// 获取app列表
function getAppList(){
    // get org admin token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    userCount = 0;
    if(!access_token || access_token=='') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="9"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
        $('#appListBody').empty();
        $('#appListBody').append(loading);
        $.ajax({
            url:baseUrl+'/management/organizations/'+ orgName +'/applications',
            type:'GET',
            crossDomain:true,
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                var appData = jQuery.parseJSON(JSON.stringify(respData.data));
                var uuidArr = [];
                var nameArr = [];
                var option = '';
                $.each(appData, function(key,value){
                    nameArr.push(key);
                    uuidArr.push(value);
                    key = key.substring(key.indexOf('/')+1);
                    userCount = 0;
                    $.ajax({
                        url:baseUrl+'/'+ orgName +'/' + value + '/counters?counter=application.collection.users&pad=true',
                        type:'GET',
                        async:false,
                        headers:{
                            'Authorization':'Bearer '+access_token,
                            'Content-Type':'application/json'
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                        },
                        success: function(respData, textStatus, jqXHR) {
                            $.each(respData.counters, function(){
                                if(this.values.lenght == 0){
                                    userCount = 0;
                                } else {
                                    $.each(this.values,function(){
                                        var userValue = parseInt(this.value);
                                        if(userValue < 0){
                                            userValue = 0;
                                        }
                                        userCount = userValue;
                                    });
                                }
                            });
                        }
                    });

                    option += '<tr><td class="text-center"><a href="app_profile.html?appUuid='+key+'&Application='+key+'">'+key+'</a></td>'+
                        '<td class="text-center">'+userCount+'</td>'+
                        '<td class="text-center">' + $.i18n.prop('app_list_appstatus_content') +'</td>'+
                        '</tr>';

                });
                $('#tr_loading').remove();
                $('#appListBody').append(option);
                // 无数据
                var tbody = document.getElementsByTagName("tbody")[0];
                if(!tbody.hasChildNodes()){
                    var option = '<tr><td class="text-center" colspan="7">无数据!</td></tr>';
                    $('#appListBody').append(option);
                }
            }
        });
    }
}


// 获取app详情
function getAppProfile(appUuid){
    // 获取token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        // 获取app基本信息
        $.ajax({
            url:baseUrl + '/management/organizations/' + orgName + '/applications/' + appUuid,
            type:'GET',
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                $(respData.entities).each(function(){
                    var created = format(this.created);
                    var modified = format(this.modified);
                    var applicationName = this.applicationName;
                    var organizationName = this.organizationName;
                    var allowOpen = this.allow_open_registration?
                        $.i18n.prop('app_profile_text_registrationModel_open'):
                        $.i18n.prop('app_profile_text_registrationModel_auth');
                    var tag = this.allow_open_registration?'0':'1';
                    var image_thumbnail_width = '170';
                    if(this.image_thumbnail_width != null && this.image_thumbnail_width != undefined){
                        image_thumbnail_width = this.image_thumbnail_width;
                    }
                    var image_thumbnail_height = '170';
                    if(this.image_thumbnail_height != null && this.image_thumbnail_height!= undefined){
                        image_thumbnail_height=this.image_thumbnail_height;
                    }
                    $('#appKey').text(organizationName+'#'+applicationName);
                    $('#xmlandroidAppkey').text(organizationName+'#'+applicationName);
                    $('#created').text(created);
                    $('#modified').text(modified);
                    $('#allowOpen').text(allowOpen);
                    $('#allowOpenHdd').val(tag);
                    $('#image_thumbnail_width').text(image_thumbnail_width+'px');
                    $('#image_thumbnail_height').text(image_thumbnail_height+'px');
                    $('#imageHeightHide').val(image_thumbnail_width);
                    $('#imageWidthHide').val(image_thumbnail_height);
                });

                $('#showName').text(respData.applicationName);
            }
        });

        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appUuid + '/credentials',
            type:'GET',
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                $('#client_id').text(respData.credentials.client_id);
                $('#client_secret').text(respData.credentials.client_secret);
            }
        });

    }
}


//修改缩略图大小
function updateImage(appUuid){
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    var imgReg =  /^[0-9]*$/;
    var imgwidth = $('#imageWidth').val();
    var imgheight = $('#imageHeight').val();

    if(imgwidth == ''){
        $('#imageWidthSpan').text($.i18n.prop('app_profile_alert_imageHeightSpan_empty'));
        return;
    }
    if(imgheight == ''){
        $('#imageHeightSpan').text($.i18n.prop('app_profile_alert_imageWidthSpan_empty'));
        return;
    }

    $('#imageWidthSpan').text('');
    $('#imageHeightSpan').text('');

    if(!imgReg.test(imgheight)){
        $('#imageHeightSpan').text($.i18n.prop('app_profile_alert_imageHeightSpan_int'));
    }else if(!imgReg.test(imgwidth)){
        $('#imageWidthSpan').text($.i18n.prop('app_profile_alert_imageWidthSpan_int'));
    }else{

        var d ={
            image_thumbnail_width:parseInt(imgwidth),
            image_thumbnail_height:parseInt(imgheight)
        };
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appUuid ,
            type:'PUT',
            data:JSON.stringify(d),
            headers:{
                'Authorization':'Bearer ' + access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert($.i18n.prop('app_profile_alert_update_failure'));
            },
            success: function(respData, textStatus, jqXHR) {
                alert($.i18n.prop('app_profile_alert_update_done'));
                EasemobCommon.disPatcher.refreshCurrentPage();
            }
        });
    }
}

// 切换app注册模式
function changeAllowOpen(){
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    var appKey = $('#appKey').text().replace('#','/');
    var tag = $('#allowOpenHdd').val();

    var allow_open_registration = true;
    if(tag == 0){
        allow_open_registration = false;
    }

    var d = {
        'allow_open_registration':allow_open_registration
    };

    $.ajax({
        url:baseUrl+'/'+ appKey,
        type:'PUT',
        data:JSON.stringify(d),
        headers:{
            'Authorization':'Bearer ' + access_token,
            'Content-Type':'application/json'
        },
        success:function(respData){
            alert($.i18n.prop('app_profile_btn_change_alert_succ'));
            $(respData.entities).each(function(){
                var tag = this.allow_open_registration?'0':'1';
                var modified = format(this.modified);
                $('#modified').text(modified);
                $('#allowOpenHdd').val(tag);
                if(this.allow_open_registration){
                    $('#allowOpen').text($.i18n.prop('app_profile_text_registrationModel_open'));
                }else {
                    $('#allowOpen').text($.i18n.prop('app_profile_text_registrationModel_auth'));
                }
            });
        },
        error:function(data){
            alert($.i18n.prop('app_profile_btn_change_alert_failure'));
        }
    });
}


function check() {
    if (count == 0) {
        count++;
        return true;
    } else {
        return false;
    }
}

function saveNewAppPre() {
    if (check()) {
        count = 0;
        saveNewApp();
    }
}

function removeAllSpace(str) {
    return str.replace(/\s+/g, '');
}

//显示修改缩略图
function showImage() {
    $('#imageWidth').val('' + $('#imageHeightHide').val());
    $('#imageHeight').val('' + $('#imageWidthHide').val());
    $('#showUpdateImage').click();
}

//修改缩略图
function updateImageHTML() {
    updateImage(appUuid);
}