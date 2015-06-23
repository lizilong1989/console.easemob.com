/**
 * Created by kenshinn on 15-6-15.
 */

document.write("<script src='/assets/js/easemob/config.js' language=javascript></script>")

var Console = Console || {};

// 初始化加载
$(function() {
    // support crossDomain
    $.support.cors = true;

    // 显示已登录用户nd
    $('#user_info').html('<small>Welcome,</small>'+$.cookie('cuserName'));

    // 注册按钮状态
    $("#agreeCBox").bind("click", function () {
        if($('#agreeCBox').attr('checked')){
            $('#formSubBtn').addClass('btn-success').disabled = false;
        } else {
            $('#formSubBtn').removeClass('btn-success').disabled = true;
        }
    });
    if($('#agreeCBox').attr('checked')){
        $('#formSubBtn').addClass('btn-success').disabled = false;
    } else {
        $('#formSubBtn').removeClass('btn-success').disabled = true;
    }
});

// 获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


function checkTel(value) {
    var isChinaPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    var isChina = /^(((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[0123456789][0-9]{8}|18[0123456789][0-9]{8}|14[0123456789][0-9]{8}))$/;
    var isMalaysia = /^(((\+?60)|(\(\+60\)))?([0123456789]{7}|[0123456789]{8}|[0123456789]{9}))$/;
    var isSingapore = /^(((\+?65)|(0065)|(\+0065)|(\(\+65\)))?[0123456789]{7,10})$/;
    if (isChinaPhone.test(value) || isSingapore.test(value) || isChina.test(value) || isMalaysia.test(value)) {
        return true;
    } else {
        return false;
    }
}


// 时间格式转换 1399434332770 ->
function add0(m){
    return m<10 ? '0'+m : m;
}
function format(timeST){
    var time = new Date(parseInt(timeST));
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}


// 分页基础数据
var cursors = {};
var pageNo = 1;
cursors[1] = '';
var total = 0;
var cursors1 = {};
cursors1[1] = '';

// 分页条更新
function updateUsersPageStatus(){
    // 获取token
    var access_token = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    if(!access_token || access_token==''){
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appUuid + '/users?limit=1000',
            type:'GET',
            headers:{
                'Authorization':'Bearer '+access_token,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(respData, textStatus, jqXHR) {
                total = respData.count;
                var totalPage = (total % 10 == 0) ? (parseInt(total / 10)) : (parseInt(total / 10) + 1);

                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">上一页</a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">下一页</a> </li>';
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


function setUsername(appUuid,username){
    $('#usernameMondify').val(username);
    $('#appUuidHidd').val(appUuid);
    $('#pwdMondify').val('');
}


//调用方法
function deleteAppUsers(appUuid,username){
    var access_token = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    var flag = false;
    $.ajax({
        async: false,
        url:baseUrl + '/' + orgName +'/' + appUuid + '/users/' + username,
        type:'DELETE',
        headers:{
            'Authorization':'Bearer ' + access_token,
            'Content-Type':'application/json'
        },
        error:function(){
        },
        success:function(respData){
            flag =true;
        }
    });
    return flag;
}


var EasemobCommon = function() {
    // fetch token from cookie
    var getToken = function () {
        var access_token = $.cookie('access_token');
        return access_token;
    };

    // responsive logo
    var handleResponsiveLogo = function () {
        window.onresize = window.onload = function () {
            var w, h;
            if (!!(window.attachEvent && !window.opera)) {
                h = document.documentElement.clientHeight;
                w = document.documentElement.clientWidth;
            } else {
                h = window.innerHeight;
                w = window.innerWidth;
            }

            $("#logo_home").width(w / 6.5).height(h / 16);
        }
    };

    var isSessionTimeOut = function() {
        if (!getToken() || getToken() == '') {
            this.logOut();
        }
    };

    return {
        httpMethod: {
            POST : 'POST',
            GET : 'GET',
            DELETE : 'DELETE',
            PUT : 'PUT'
        },

        disPatcher: {
            refreshCurrentPage: function(){
                location.replace(location.href);
            },
            toPageIndex: function () {
                window.location.href = 'index.html';
            },
            toPageIndexRegistOrgSuccess: function(mailSuffix, regEmail) {
                window.location.href = 'index_regist_org_success.html?mailSuffix='+mailSuffix+'&regEmail='+regEmail;
            },
            toPageAppList: function() {
                window.location.href = "app_list.html";
            },
            toPageAppCreate: function() {
                window.location.href = "app_create.html";
            },
            toPageOrgAdminCreate: function() {
                window.location.href = "org_admin_create.html";
            },
            toPageOrgAdminHome: function() {
                window.location.href = "org_admin_home.html";
            },
            toPageOrgAdminList: function() {
                window.location.href = "org_admin_list.html";
            },
            toPageOrgAdminPassword: function() {
                window.location.href = "org_admin_password.html";
            },
            toPageAppProfile: function() {
                window.location.href = 'app_profile.html?appUuid=' + appUuid;
            },
            toPageAppUsers: function() {
                window.location.href = 'app_users.html?appUuid=' + appUuid;
            },
            toPageAppUserContacts: function(owner_username) {
                window.location.href = 'app_user_contacts.html?appUuid=' + appUuid + '&owner_username=' + owner_username;
            },
            toPageAppUserCreate: function(username) {
                window.location.href = 'app_user_create.html?appUuid=' + appUuid + '&username=' + username;
            },
            toPageAppChatGroups: function() {
                window.location.href = 'app_chatgroups.html?appUuid=' + appUuid;
            },
            toPageAppChatGroupUsers: function(groupId) {
                window.location.href = 'app_chatgroup_users.html?appUuid=' + appUuid;
            },
            toPageAppNotifiers: function() {
                window.location.href = 'app_notifiers.html?appUuid=' + appUuid;
            },
            toPageAppCounters: function() {
                window.location.href = 'app_counters.html?appUuid=' + appUuid;
            },
            sessionTimeOut: function () {
                this.logOut();
            }
        },

        logOut: function() {
            // 销毁cookie
            $.cookie("access_token",null,{path:"/"});
            $.cookie("cuser",null,{path:"/"});
            $.cookie("cuserName",null,{path:"/"});
            $.cookie("orgName",null,{path:"/"});
            $.cookie("email",null,{path:"/"});
            $.cookie("companyName",null,{path:"/"});
            $.cookie("telephone",null,{path:"/"});

            this.disPatcher.toPageIndex();
        },

        init: function() {
            isSessionTimeOut();
            handleResponsiveLogo();
        }
    }
}();

String.prototype.Trim = function() {
    var m = this.match(/^\s*(\S+(\s+\S+)*)\s*$/);
    return (m == null) ? "" : m[1];
}
String.prototype.isMobile = function() {
    return (/^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/.test(this.Trim()));
}
String.prototype.isTel = function() {
    //"兼容格式: 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)"
    return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(this.Trim()));
}