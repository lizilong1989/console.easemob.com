(function($){
    $.fn.mailAutoComplete = function(options){
        var defaults = {
            boxClass: "mailListBox", //�ⲿbox��ʽ
            listClass: "mailListDefault", //Ĭ�ϵ��б���ʽ
            focusClass: "mailListFocus", //�б�ѡ��ʽ��
            markCalss: "mailListHlignt", //������ʽ
            zIndex: 1,
            autoClass: true, //�Ƿ�ʹ�ò���Դ�class��ʽ
            mailArr: ["qq.com","gmail.com","126.com","163.com","hotmail.com","yahoo.com","yahoo.com.cn","live.com","sohu.com","sina.com","aliyun.com"], //�ʼ�����
            textHint: false, //������ʾ���Զ���ʾ������
            hintText: "",
            focusColor: "#333"
            //blurColor: "#999"
        };
        var settings = $.extend({}, defaults, options || {});
        
        //ҳ��װ��CSS��ʽ
        if(settings.autoClass && $("#mailListAppendCss").size() === 0){
            $('<style id="mailListAppendCss" type="text/css">.mailListBox{border:1px solid #369; background:#fff; font:12px/20px Arial;}.mailListDefault{padding:0 5px;cursor:pointer;white-space:nowrap;}.mailListFocus{padding:0 5px;cursor:pointer;white-space:nowrap;background:#369;color:white;}.mailListHlignt{color:red;}.mailListFocus .mailListHlignt{color:#fff;}</style>').appendTo($("head"));    
        }
        var cb = settings.boxClass, cl = settings.listClass, cf = settings.focusClass, cm = settings.markCalss; //�����class����
        var z = settings.zIndex, newArr = mailArr = settings.mailArr, hint = settings.textHint, text = settings.hintText, fc = settings.focusColor, bc = settings.blurColor;
        //�����ʼ��ڲ��б�����
        $.createHtml = function(str, arr, cur){
            var mailHtml = "";
            if($.isArray(arr)){
                $.each(arr, function(i, n){
                    if(i === cur){
                        mailHtml += '<div class="mailHover '+cf+'" id="mailList_'+i+'"><span class="'+cm+'">'+str+'</span>@'+arr[i]+'</div>';    
                    }else{
                        mailHtml += '<div class="mailHover '+cl+'" id="mailList_'+i+'"><span class="'+cm+'">'+str+'</span>@'+arr[i]+'</div>';    
                    }
                });
            }
            return mailHtml;
        };
        //һЩȫ�ֱ���
        var index = -1, s;
        $(this).each(function(){
            var that = $(this), i = $(".justForJs").size();    
            if(i > 0){ //ֻ��һ���ı���
                 return;    
            }
            var w = that.outerWidth(), h = that.outerHeight(); //��ȡ��ǰ���󣨼��ı��򣩵Ŀ��
            //��ʽ�ĳ�ʼ��
            that.wrap('<span style="display:inline-block;position:relative;"></span>')
                .before('<div id="mailListBox_'+i+'" class="justForJs '+cb+'" style="min-width:'+w+'px;_width:'+w+'px;position:absolute;left:-6000px;top:'+h+'px;z-index:'+z+';"></div>');
            var x = $("#mailListBox_" + i), liveValue; //�б�����
            that.focus(function(){
                //����ǩ�Ĳ㼶
                $(this).css("color", fc).parent().css("z-index", z);    
                //��ʾ���ֵ���ʾ������
                if(hint && text){
                    var focus_v = $.trim($(this).val());
                    if(focus_v === text){
                        $(this).val("");
                    }
                }
                //�����¼�
                $(this).keyup(function(e){
                    s = v = $.trim($(this).val());    
                    if(/@/.test(v)){
                        s = v.replace(/@.*/, "");
                    }
                    if(v.length > 0){
                        //������������¼�
                        if(e.keyCode === 38){
                            //����
                            if(index <= 0){
                                index = newArr.length;    
                            }
                            index--;
                        }else if(e.keyCode === 40){
                            //����
                            if(index >= newArr.length - 1){
                                index = -1;
                            }
                            index++;
                        }else if(e.keyCode === 13){
                            //�س�
                            if(index > -1 && index < newArr.length){
                                //�����ǰ�м����б�
                                $(this).val($("#mailList_"+index).text());    
                            }
                        }else{
                            if(/@/.test(v)){
                                index = -1;
                                //���@�����ֵ
                                //s = v.replace(/@.*/, "");
                                //������ƥ������
                                var site = v.replace(/.*@/, "");
                                newArr = $.map(mailArr, function(n){
                                    var reg = new RegExp(site);    
                                    if(reg.test(n)){
                                        return n;    
                                    }
                                });
                            }else{
                                newArr = mailArr;
                            }
                        }
                        x.html($.createHtml(s, newArr, index)).css("left", 0);
                        if(e.keyCode === 13){
                            //�س�
                            if(index > -1 && index < newArr.length){
                                //�����ǰ�м����б�
                                x.css("left", "-6000px");    
                            }
                        }
                    }else{
                        x.css("left", "-6000px");    
                    }
                }).blur(function(){
                    if(hint && text){
                        var blur_v = $.trim($(this).val());
                        if(blur_v === ""){
                            $(this).val(text);
                        }
                    }
                    $(this).css("color", bc).unbind("keyup").parent().css("z-index",0);
                    x.css("left", "-6000px");    
                    
                });    
                //��꾭���б����¼�
                //��꾭��
                $(".mailHover").live("mouseover", function(){
                    index = Number($(this).attr("id").split("_")[1]);    
                    liveValue = $("#mailList_"+index).text();
                    x.children("." + cf).removeClass(cf).addClass(cl);
                    $(this).addClass(cf).removeClass(cl);
                });
            });

            x.bind("mousedown", function(){
                that.val(liveValue);        
            });
        });
    };
    
})(jQuery);