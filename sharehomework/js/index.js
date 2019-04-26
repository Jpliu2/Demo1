var app = new Vue({
    el: '#app',
    data: {
        // 真实数据
        hwTitle: '', //作业标题
        hwTypeName:'',//作业类型
        hwType: null, //作业类型
        hwStartTime: '',//开始时间
        hwEndTime: '', //结束时间
        isRepeal: null, //作业是否撤销
        isTestApi: null,//网络请求
        gradeCode: '',//年级code
        phaseCode: '',//学段code
        subjectCode: '',//学科code
        equipmentName: '',//设备名称
        isRequestSuccess:false,//网络请求是否成功（默认不成功，请求完成后进行修改）
        tipText: '',//缺省文字
        tipImageSrc: ''//缺省图片
    },

    mounted: function() {
        this.switchContext()
        var that = this //保存this指向vue
        $.ajax({
            type: 'POST',
            url:
                (this.isTestApi ? '//mhwtest.zhixue.com' : '//mehwapi.changyan.com') +
                (
                    '/homework_middle_customer_service/homeworkReportService/getShareHomeworkInfo'
                ),
            // 测试url
            // 'http://172.31.223.17:30338/homework_middle_customer_service/homeworkReportService/getShareHomeworkInfo',
            data:
                'hwId=' + this.getQueryObject().hwId,
            success: function(data) {
                //判断数据时候获取异常
                if (data.code == 200) {
                    that.isRequestSuccess = true
                    var _data = data.result
                    console.log(data)
                    document.title = _data.hwTitle
                    that.hwTitle = _data.hwTitle
                    that.hwTypeName = _data.hwTypeName
                    that.hwType = _data.hwType
                    that.hwStartTime = that.format(_data.hwStartTime)
                    that.hwEndTime = that.format(_data.hwEndTime)
                    that.isRepeal = _data.isRepeal
                    that.gradeCode = _data.gradeCode
                    that.phaseCode = _data.phaseCode
                    that.subjectCode = _data.subjectCode
                    that.buryingPoint()
                } else {
                    //数据获取异常
                    that.isRequestSuccess = false
                    console.log(data)
                    that.tipText = '加载失败，请稍后重试～'
                    that.tipImageSrc = './image/share_noData_error@2x.png'
                    that.buryingPoint()
                }
            },
            error: function(err) {
                //判断是否没有网络
                that.isRequestSuccess = false
                that.tipText = '无法连接至网络哦～'
                that.tipImageSrc = './image/share_network_error@2x.png'
                that.buryingPoint()
            }
        }).then(function(res) {
            //其它情况
        })
    },
    methods: {
        //从url上截取参数对象
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
        },
        //点击打开app按钮
        openApp: function() {
            var userAgent = navigator.userAgent
            var isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)  //iOS终端
            var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1    //Android终端
            var isWeiXin = (userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger')
            var isIOSQQ = (isiOS && / QQ/i.test(userAgent))
            //打开应用埋点
            if (((!isWeiXin)&&(isiOS&&!isIOSQQ))&&(this.equipmentName == 'app')) {
                this.getEquipmentName(this.getQueryObject().type)//获取设备名称
                if (typeof IFlyCollector !== 'undefined') {
                    // if (this.isRequestSuccess) {
                    //     IFlyCollector.onEvent('30081002',null,'3008',null,{
                    //         hwid: this.getQueryObject().hwId,
                    //         phase: this.phaseCode,
                    //         grade: this.gradeCode,
                    //         subject: this.subjectCode,
                    //         time: new Date().getTime(),
                    //         equipment: this.equipmentName
                    //     })
                    // } else {
                    //     IFlyCollector.onEvent('30081002',null,'3008',null,{
                    //         hwid: this.getQueryObject().hwId,
                    //         time: new Date().getTime(),
                    //         equipment: this.equipmentName
                    //     })
                    // }
                    alert("打开app埋点")
                }
            }
        },
        //点击下载app按钮
        downApp: function() {
            if (!(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger')) {
                this.getEquipmentName(this.getQueryObject().type)//获取设备名称
                if (typeof IFlyCollector !== 'undefined') {
                    // if (this.isRequestSuccess) {
                    //     IFlyCollector.onEvent('30081003',null,'3008',null,{
                    //         hwid: this.getQueryObject().hwId,
                    //         phase: this.phaseCode,
                    //         grade: this.gradeCode,
                    //         subject: this.subjectCode,
                    //         time: new Date().getTime(),
                    //         equipment: this.equipmentName
                    //     })
                    // } else {
                    //     IFlyCollector.onEvent('30081003',null,'3008',null,{
                    //         hwid: this.getQueryObject().hwId,
                    //         time: new Date().getTime(),
                    //         equipment: this.equipmentName
                    //     })
                    // }
                    alert("下载app埋点")
                }
            }
        },
        //进行数据埋点
        buryingPoint: function () {
            this.getEquipmentName(this.getQueryObject().type)//获取设备名称
            this.openApp()
            if (typeof IFlyCollector !== 'undefined') {
                // if (this.isRequestSuccess) {
                //     IFlyCollector.onEvent('30081001',null,'3008',null,{
                //         hwid: this.getQueryObject().hwId,
                //         phase: this.phaseCode,
                //         grade: this.gradeCode,
                //         subject: this.subjectCode,
                //         time: new Date().getTime(),
                //         equipment: this.equipmentName,
                //         type: this.getQueryObject().type
                //     })
                // } else {
                //     IFlyCollector.onEvent('30081001',null,'3008',null,{
                //         hwid: this.getQueryObject().hwId,
                //         time: new Date().getTime(),
                //         equipment: this.equipmentName,
                //         type: this.getQueryObject().type
                //     })
                // }
                alert("预览页面埋点")
            }
        },
        //判断设备名称
        getEquipmentName: function (type) {
            if (type == 5||type == 6||type == 7||type == 8) {
                this.equipmentName = 'app'
            } else {
                this.equipmentName = 'web'
            }
        }
    }
})
