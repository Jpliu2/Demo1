var app = new Vue({
  el: '#app',
  data: {
    fullMark: '',
    // token: 'b7d876b6-48de-4908-889a-1453494dcb01',
    // hwid: '2614d59a-821a-4fdb-acc7-ba0222a46ae3',
    // classid: '4400000020000024112',

    // 真实数据
    unPassCount: '', //不达标
    passCount: '', //达标
    goodCount: '', //良好
    fullCount: '', //优秀
    unCorrectedCount: '', //待批改
    unSubmitedCount: '', //未提交
    avgTime: '', //平均用时
    minScore: '', //最低分
    maxScore: '', //最高分
    avgScore: '', //班级平均分
    hwTitle: '', //报告标题
    startTime: '', //报告起始日期
    endTime: '', //报告结束日期
    unSubmitedCount: '', //未提交
    unCorrectedCount: '', //未批改
    reviseInfo: {},
    studentCount: '',
    isTestApi: null,
    fullScore: '',
    deviceType: '1' // 设备类型参数
  },
  mounted: function() {
    this.switchContext()
    //数字格式化：保留一位小数
    function solveNum(num) {
      if (num < 0 || !num) {
        return [0, 0] // 返回[0,0]而不是0，因为html部分没有做0的单独处理
      } else {
        var arr = num
          .toFixed(1)
          .toString()
          .split('.')
        return arr
      }
    }
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
    //解决浏览器缓存,加时间戳
    function timestamp(url) {
      //  var getTimestamp=Math.random();
      var getTimestamp = new Date().getTime()
      url = url + '?timestamp=' + getTimestamp
      return url
    }

    // 获取设备参数
    this.deviceType = this.getQueryObject().deviceType || '1'
    // this.isTestApi = this.getQueryObject().isTestApi || false

    var that = this //保存this指向vue
    $.ajax({
      type: 'POST',
      url:
        (this.isTestApi ? '//mhwtest.zhixue.com' : '//mehwapi.changyan.com') +
        timestamp(
          '/homework_middle_customer_service/homeworkReportService/getClassReport'
        ),
      // 测试url
      //'http://172.31.223.11:30338/homework_middle_customer_service/homeworkReportService/getTeaSyncPracticeReport',
      data:
        'hwId=' +
        (this.getQueryObject().hwId || 'af0bfa58-b603-4430-af6d-304fc0eebca4') +
        '&classId=' +
        (this.getQueryObject().classId || '1500000200030541987'),

      success: function(data) {
        console.log(data)
        var _data = data.result
        //班级平均分
        that.avgScore = solveNum(_data.avgScore)
        //满分
        that.fullScore = _data.fullScore
        //最高分
        that.maxScore = solveNum(_data.maxScore)
        //最低分
        that.minScore = solveNum(_data.minScore)
        //平均用时
        that.avgTime = formatTime(_data.avgTime)
        that.fullCount = _data.fullCount //优秀
        that.goodCount = _data.goodCount //良好
        that.passCount = _data.passCount //达标
        that.unPassCount = _data.unPassCount //不达标
        that.hwTitle = _data.hwTitle
        that.startTime = that.format(_data.startTime)
        that.endTime = that.format(_data.endTime)
        that.unSubmitedCount = _data.unSubmitedCount //未提交
        that.unCorrectedCount = _data.unCorrectedCount || 0 //未批改
        that.studentCount = _data.studentCount //作业总数
        that.reviseInfo = _data.reviseInfo //   {订正数/订正总数}
      },
      error: function(err) {
        console.log(err)
      }
    }).then(function(res) {
      console.log(res)
      that.drawLine()
    })
  },
  methods: {
    //echart画环形图
    drawLine: function() {
      // echarts实例
      var myChart = echarts.init(document.getElementById('eChart'))
      // 指定图表配置项和数据
      var option = {
        series: [
          {
            name: '成绩分布',
            type: 'pie',
            color: ['#08C0A0', '#17DCBA', '#61FDE2', '#FF673E'],
            radius: ['58%', '98%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'normal'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: this.fullCount, name: '优秀' },
              { value: this.goodCount, name: '良好' },
              { value: this.passCount, name: '达标' },
              { value: this.unPassCount, name: '不达标' }
            ]
          }
        ]
      }
      console.log(option)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
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
