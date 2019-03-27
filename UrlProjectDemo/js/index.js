var app = new Vue({
    el: '#app',
    data: {
        // 真实数据
        hwTitle: '2月22日数学练习的解放军队返回收购的书柜的佛UI更好的佛 iu 个好地方 iu9苏佛山东方很对', //作业标题
        hwTypeName:'打卡练习',//作业类型
        hwType: 3, //作业类型
        hwStartTime: '2018-3-24  9：00',//开始时间
        hwEndTime: '2018-3-24  9：00', //结束时间
        isRepeal: false, //作业是否撤销
    },

    mounted: function() {
        this.switchContext()
        document.title = this.hwTitle;
        //时间格式化: 分′秒″
        function formatTime(time) {
            // 取整，小数点后一位
            time = Math.floor(time * 10) / 10
            if (time < 0 || !time) {
                return ['-1', '']
            } else {
                var second = time % 60
                var minutes = parseInt(time / 60)

                //小于一分钟时，只展示秒数
                if (minutes == 0) {
                    return { second: second }
                } else {
                    return { minutes: minutes, second: second }
                }
            }
        }
        // var that = this //保存this指向vue
        // $.ajax({
        //     type: 'POST',
        //     url:
        //         (this.isTestApi ? '//mhwtest.zhixue.com' : '//mehwapi.changyan.com') +
        //         timestamp(
        //             '/homework_middle_customer_service/homeworkReportService/getClassReport'
        //         ),
        //     // 测试url
        //     //'http://172.31.223.11:30338/homework_middle_customer_service/homeworkReportService/getTeaSyncPracticeReport',
        //     data:
        //         'hwId=' +
        //         (this.getQueryObject().hwId || 'af0bfa58-b603-4430-af6d-304fc0eebca4') +
        //         '&classId=' +
        //         (this.getQueryObject().classId || '1500000200030541987'),
        //
        //     success: function(data) {
        //         console.log(data)
        //         var _data = data.result
        //         //班级平均分
        //         that.avgScore = solveNum(_data.avgScore)
        //         //满分
        //         that.fullScore = _data.fullScore
        //         //最高分
        //         that.maxScore = solveNum(_data.maxScore)
        //         //最低分
        //         that.minScore = solveNum(_data.minScore)
        //         //平均用时
        //         that.avgTime = formatTime(_data.avgTime)
        //         that.fullCount = _data.fullCount //优秀
        //         that.goodCount = _data.goodCount //良好
        //         that.passCount = _data.passCount //达标
        //         that.unPassCount = _data.unPassCount //不达标
        //         that.hwTitle = _data.hwTitle
        //         that.startTime = that.format(_data.startTime)
        //         that.endTime = that.format(_data.endTime)
        //         that.unSubmitedCount = _data.unSubmitedCount //未提交
        //         that.unCorrectedCount = _data.unCorrectedCount || 0 //未批改
        //         that.studentCount = _data.studentCount //作业总数
        //         that.reviseInfo = _data.reviseInfo //   {订正数/订正总数}
        //     },
        //     error: function(err) {
        //         console.log(err)
        //     }
        // }).then(function(res) {
        //     console.log(res)
        //     that.drawLine()
        // })
    },
    methods: {
        // 从url上截取参数对象
        getQueryObject: function(url) {
            url = url == null ? window.location.href : url
            var search = url.substring(url.lastIndexOf('?') + 1) //截取到所有参数键值对
            var obj = {} //保存参数的对象
            var reg = /([^?&=]+)=([^?&=]*)/g
            search.replace(reg, function(rs, $1, $2) {
                var name = decodeURIComponent($1)
                var val = decodeURIComponent($2)
                val = String(val)
                obj[name] = val
                return rs
            })
            return obj
        },
        //日期格式化
        format: function(data) {
            // debugger
            if (!data) {
                return ''
            } else {
                var date = new Date(data)
                return (
                    date.getFullYear() +
                    '/' +
                    (date.getMonth() + 1) +
                    '/' +
                    date.getDate() +
                    ' ' +
                    date.getHours() +
                    ':' +
                    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
                )
            }
        },
        // 根据url切换测试、现网环境
        switchContext: function() {
            var url = window.location.href
            var a = url.split('?')[0]
            var flag = a.indexOf('mhwtest.zhixue.com') != -1
            if (flag) {
                this.isTestApi = true
            }
        }
    }
})
