/**
 * Created by kenshinn on 15-6-2.
 */

var Console = Console || {};
Console.counterServices = {
    //初始开始时间段
    //记录当前时间
    nowTime;
    nowTimeSec;
    timePikerInput = function(){

        return {
            init:function(){
                //记录计算过后的时间
                var startTime;

                //计算当前时间
                var type = "Y-M-D";
                var type1 = "Y-M-D h:m";
                //获取年-月-日
                var myDate = new Date();
                //年份：如2013
                Y = myDate.getFullYear();
                //月份：如06
                M = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
                //日：如15
                D = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
                nowTime = type.replace("Y", Y).replace("M", M).replace("D", D);

                h = myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours();
                m = myDate.getMinutes() < 10 ? "0" + myDate.getMinutes() : myDate.getMinutes();
                //s = myDate.getSeconds() < 10 ? "0" + myDate.getSeconds() : myDate.getSeconds();
                nowTimeSec = type1.replace("Y", Y).replace("M", M).replace("D", D).replace("h", h).replace("m", m);

                //计算前7天时间
                if (D - 6 <= 0) {
                    startTime = new Date(Y, M - 1, D - 6).format('yyyy-MM-dd');
                } else {
                    startTime = new Date(Y, M - 1, D - 6).format('yyyy-MM-dd');
                }
                $('#pickerStartDate').val(startTime);
                $('#pickerEndDate').val(nowTime);
                $('#pickerEndDateHide').val(nowTimeSec);
            }
        };
    }();


    // 趋势
    var drawChartFunction = function () {
        return {
            draw: function (labels, datas) {
                var data = {
                    labels: labels,
                    datasets: [
                        {
                            fillColor: "rgba(151,187,205,0.5)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",

                            data:datas
                        }
                    ]
                };

                // 渲染
                var options = {
                    //Boolean - If we show the scale above the chart data
                    scaleOverlay : true,
                    //Boolean - If we want to override with a hard coded scale
                    scaleOverride : false,
                    //** Required if scaleOverride is true **
                    //Number - The number of steps in a hard coded scale
                    scaleSteps : null,
                    //Number - The value jump in the hard coded scale
                    scaleStepWidth : null,
                    //Number - The scale starting value
                    scaleStartValue : null,
                    //String - Colour of the scale line
                    scaleLineColor : "rgba(0,0,0,.1)",
                    //Number - Pixel width of the scale line
                    scaleLineWidth : 2,
                    //Boolean - Whether to show labels on the scale
                    scaleShowLabels : true,
                    //Interpolated JS string - can access value
                    scaleLabel : "<%=value%>",
                    //String - Scale label font declaration for the scale label
                    scaleFontFamily : "'Arial'",
                    //Number - Scale label font size in pixels
                    scaleFontSize : 12,
                    //String - Scale label font weight style
                    scaleFontStyle : "normal",
                    //String - Scale label font colour
                    scaleFontColor : "#666",
                    ///Boolean - Whether grid lines are shown across the chart
                    scaleShowGridLines : true,
                    //String - Colour of the grid lines
                    scaleGridLineColor : "rgba(0,0,0,.05)",
                    //Number - Width of the grid lines
                    scaleGridLineWidth : 1,
                    //Boolean - Whether the line is curved between points
                    bezierCurve : false,
                    //Boolean - Whether to show a dot for each point
                    pointDot : true,
                    //Number - Radius of each point dot in pixels
                    pointDotRadius : 3,
                    //Number - Pixel width of point dot stroke
                    pointDotStrokeWidth : 1,
                    //Boolean - Whether to show a stroke for datasets
                    datasetStroke : true,
                    //Number - Pixel width of dataset stroke
                    datasetStrokeWidth : 2,
                    //Boolean - Whether to fill the dataset with a colour
                    datasetFill : true,
                    //Boolean - Whether to animate the chart
                    animation : true,
                    //Number - Number of animation steps
                    animationSteps : 60,
                    //String - Animation easing effect
                    animationEasing : "easeOutQuart",
                    //Function - Fires when the animation is complete
                    onAnimationComplete : null,
                    responsive: true
                };

                $('#counters').html('');
                $('#counters').append('<canvas id="countersCharts" width="1200%" height="400"></canvas>');
                var countersChartsCtx = $("#countersCharts").get(0).getContext("2d");
                new Chart(countersChartsCtx).Line(data, options);
            }
        };
    }();


    function getCounterNameFromHtml() {
        var queryStr = {}

        var counterName = '';
        var restStr = '';
        var counterType = $('#drawCountersChartsType').val();

        switch(counterType){
            case 'register_users':
                counterName = 'application.collection.users';
                break;
            case 'daily_active_users':
                counterName = 'daily_active_user';
                break;
            case 'daily_chat_users':
                counterName = 'daily_chat_user';
                break;
            case 'daily_new_active_users':
                counterName = 'daily_new_user';
                break;
            case 'msg_outgoing_chat':
                counterName = 'application.collection.chatmessages';
                //restStr = '&direction=outgoing&chat_type=chat';
                break;
            case 'msg_outgoing_groupchat':
                counterName = 'application.collection.chatmessages';
                //restStr = '&direction=outgoing&chat_type=groupchat';
                break;
            case 'msg_offline_chat':
                counterName = 'application.collection.chatmessages';
                //restStr = '&direction=offline&chat_type=chat';
                break;
            case 'msg_offline_groupchat':
                counterName = 'application.collection.chatmessages';
                //restStr = '&direction=offline&chat_type=groupchat';
                break;
            default:
                counterName = '';
                break;
        }

        queryStr.counterName = counterName;
        queryStr.restStr = restStr;

        return queryStr;
    }

    // 快捷查询
    function drawCountersCharts(peroid) {
        var textStartTime = $("#pickerStartDate").val();
        var textEndTime = $("#pickerEndDate").val();

        if (textStartTime > textEndTime || textStartTime == textEndTime) {
            alert("请重新选择时间，开始时间必须小于结束时间");
            return;
        } else if (textEndTime > nowTime) {
            alert("请重新选择结束日期，结束日期不能大于本日日期");
            return;
        }

        var resolution = '';
        var type = "Y-M-D";
        endTime = type.replace("Y", Y).replace("M", M).replace("D", D);
        $('#pickerEndDate').val(endTime);
        if (peroid == "oneday") {
            //计算当前时间
            startTime = new Date(Y, M - 1, D - 1).format('yyyy-MM-dd');
            $('#pickerStartDate').val(startTime);

            resolution = 'six_hour';
        } else if (peroid == "sevendays") {
            //计算当前时间
            startTime = new Date(Y, M - 1, D - 6).format('yyyy-MM-dd');
            $('#pickerStartDate').val(startTime);

            resolution = 'day';
        } else {
            resolution = 'day';
        }

        var queryStr = getCounterNameFromHtml();

        var startTimeStr = $("#pickerStartDate").val();
        var endTimeSecStr = $("#pickerEndDateHide").val();

        //开始时间
        var dt = Date.parse(startTimeStr.replace(/-/g, "/"));
        var startTime = new Date(dt);
        var startTimeTime = startTime.getTime();
        //结束时间(毫秒)
        var dt1Sec = Date.parse(endTimeSecStr.replace(/-/g, "/"));
        var endTimeSec = new Date(dt1Sec);
        var endTimeTimeSec = endTimeSec.getTime();

        var chartDatas = applyCountersData(appUuid, queryStr.counterName, resolution, startTimeTime, endTimeTimeSec, queryStr.restStr);
        drawChartFunction.draw(chartDatas.labels, chartDatas.datas);
    }

    // 按时间段
    function drawCountersChartsPeroidSearch() {

        $("input[name='chartsRadio1']").attr('checked', false);

        var textStartTime = $("#pickerStartDate").val();
        var textEndTime = $("#pickerEndDate").val();

        //开始时间
        var dt = Date.parse(textStartTime.replace(/-/g, "/"));
        var startTime = new Date(dt);
        var startTimeTime = startTime.getTime();
        //结束时间
        var dt1 = Date.parse(textEndTime.replace(/-/g, "/"));
        var endTime = new Date(dt1);
        var endTimeTime = endTime.getTime();
        var endTimeTimeSec = '';

        if(formatTimeDay(endTimeTime) == formatTimeDay(nowTimeSec)){
            // 结束时间是当天
            var endTimeSecStr = $("#pickerEndDateHide").val();
            //结束时间(毫秒)
            var dt1Sec = Date.parse(endTimeSecStr.replace(/-/g, "/"));
            var endTimeSec = new Date(dt1Sec);
            endTimeTimeSec = endTimeSec.getTime();
        } else {
            // 结束时间当天最后一毫秒
            endTimeTimeSec = endTimeTime + 86399000;
        }

        var timeDifference = endTimeTime - startTimeTime;
        var days = Math.floor(timeDifference / (24 * 3600 * 1000));
        if (days > 30) {
            alert($.i18n.prop('app_collection_counters_searchAlert_with30days'));
            return;
        } else if (days == 0) {
            alert($.i18n.prop('app_collection_counters_searchAlert_startLessThanEnd'));
            return;
        } else if(textEndTime > nowTime){
            alert($.i18n.prop('app_collection_counters_searchAlert_endMustLessThanToday'));
            return;
        }

        var resolution = '';
        if (days == 1) {
            resolution = 'six_hour';
        } else {
            resolution = 'day';
        }

        var queryStr = getCounterNameFromHtml()
        var chartDatas = applyCountersData(appUuid, queryStr.counterName, resolution, startTimeTime, endTimeTimeSec, queryStr.restStr);
        drawChartFunction.draw(chartDatas.labels, chartDatas.datas);
    }


    function applyCountersData(appUuid, counterName, resolution, startTimeTime, endTimeMilSec, restStr) {
        var applyRequest = {
            orgName: $.cookie('orgName'),
            access_token: $.cookie('access_token'),
            appUuid: appUuid,
            start_time: '',
            end_time: '',
            pad: 'true',
            resolution: resolution
        };

        var chartData = {};
        var datas = [], labels = [];
        applyRequest.start_time = startTimeTime;
        applyRequest.end_time = endTimeMilSec;

        var tokenStr = applyRequest.access_token;

        var payloadd = {
            'grant_type': 'client_credentials',
            'client_id': '',
            'client_secret': ''
        };

        if (counterName == 'application.collection.chatmessages') {
            // fetch credentials for app
            $.ajax({
                url: baseUrl + '/' + applyRequest.orgName + '/' + applyRequest.appUuid + '/credentials',
                type: 'GET',
                async: false,
                headers: {
                    'Authorization': 'Bearer ' + applyRequest.access_token,
                    'Content-Type': 'application/json'
                },
                error: function (jqXHR, textStatus, errorThrown) {
                },
                success: function (respData, textStatus, jqXHR) {
                    payloadd.client_id = respData.credentials.client_id;
                    payloadd.client_secret = respData.credentials.client_secret;
                }
            });

            // fetch apptoken
            $.ajax({
                url: baseUrl + '/' + applyRequest.orgName + '/' + applyRequest.appUuid + '/token',
                type: 'POST',
                async: false,
                data: JSON.stringify(payloadd),
                headers: {
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                error: function (respData, textStatus, errorThrown) {
                },
                success: function (respData, textStatus, jqXHR) {
                    tokenStr = respData.access_token;
                }
            });
        }

        // fetch counters
        $.ajax({
            url: baseUrl + '/' + applyRequest.orgName + '/' + applyRequest.appUuid + '/counters?counter=' + counterName
            + '&start_time=' + applyRequest.start_time + '&end_time=' + applyRequest.end_time + '&pad=' + applyRequest.pad
            + '&resolution=' + applyRequest.resolution + restStr,
            type: 'GET',
            async: false,
            headers: {
                'Authorization': 'Bearer ' + tokenStr,
                'Content-Type': 'application/json'
            },
            success: function (respData, textStatus, jqXHR) {
                $.each(respData.counters, function () {
                    if (this.values.length == 0) {
                        for(var i=0; i<10; i++){
                            labels.push(0);
                            datas.push(0);
                        }
                    } if (this.values.length == 1) {
                        labels.push(0);
                        datas.push(0);
                        $.each(this.values, function () {
                            if(applyRequest.resolution == 'six_hour') {
                                labels.push(formatTimeHour(this.timestamp));
                            } else {
                                labels.push(formatTimeDay(this.timestamp));
                            }
                            datas.push(this.value.toString());
                        });
                    } else {
                        $.each(this.values, function () {
                            if(applyRequest.resolution == 'six_hour') {
                                labels.push(formatTimeHour(this.timestamp));
                            } else {
                                labels.push(formatTimeDay(this.timestamp));
                            }
                            datas.push(this.value.toString());
                        });
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('提示\n\n数据获取失败!');
            }
        });

        chartData.labels = labels;
        chartData.datas = datas;

        return chartData;
    }


    function formatTimeDay(timeST) {
        var dat = new Date(timeST);
        return (dat.getFullYear()) + "-" + (dat.getMonth() + 1) + "-" + (dat.getDate());
    }

    function formatTimeHour(timeST) {
        var dat = new Date(timeST);
        return (dat.getFullYear()) + "-" + (dat.getMonth() + 1) + "-" + (dat.getDate()) + " " + (dat.getHours()) + ":00:00";
    }

    function applyCountersAndDraw(selector) {
        var counterType = $(selector).children("option:selected").val();
        $('#drawCountersChartsType').val(counterType);

        var drawCountersChartsType = $('#drawCountersChartsType').val();
        var chartTitle = $('#chartTitle');
        switch(drawCountersChartsType){
            case 'daily_active_users':
                chartTitle.text(chartTileDailyActiveUser);
                break;
            case 'daily_chat_users':
                chartTitle.text(chartTileDailyChatUser);
                break;
            case 'daily_new_active_users':
                chartTitle.text(chartTileDailyNewActiveUser);
                break;
            default:
                break;
        }

        var peroid = $("input[name='chartsRadio1']:checked").val();
        drawCountersCharts(peroid);
    }

    function preDrawCountersCharts(){
        var peroid = $("input[name='chartsRadio1']:checked").val();
        drawCountersCharts(peroid);
    }

    function showUsersChartTab() {
        $('#userChartSelector').show();
        $('#countersChartType').show();
    //            $('#chatmessagsChartSelector').hide();
        $('#chatgroupsChartSelector').hide();
        $('#drawCountersChartsType').val('register_users');

        var peroid = $("input[name='chartsRadio1']:checked").val();
        drawCountersCharts(peroid);
        $('#chartTitle').text(chartTileUsers);
    }

    function showChatmessagsChartTab() {
        $('#countersChartType').hide();
    //            $('#chatmessagsChartSelector').show();
        $('#userChartSelector').hide();
        $('#chatgroupsChartSelector').hide();
        $('#drawCountersChartsType').val('msg_outgoing_chat');

        var peroid = $("input[name='chartsRadio1']:checked").val();
        drawCountersCharts(peroid);
        $('#chartTitle').text(chartTileChatmessages);
    }

    //        function showChatgroupsChartTab() {
    //            $('#userChartSelector').hide();
    //            $('#chatmessagsChartSelector').hide();
    //            $('#chatgroupsChartSelector').show();
    //            $('#drawCountersChartsType').val('');
    //        }

};
