//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list: []
  },
  linktoCardDetail: function (e) {
    let index = JSON.parse(e.currentTarget.dataset.index)
    let str = JSON.stringify(this.data.list[index])
    wx.navigateTo({
      url: '../cardDetail/cardDetail?str='+ str
    })
  },
  onLoad: function () {
    this.getdata()
  },
  getdata: function () {
    var that = this
    var openid = wx.getStorageSync('openid')
    this.setData({
      openid: openid,
    })
    wx.request({
      url: 'https://31388152.qcloud.la/welsh/app/ticket/myticket',
      data: {
        openid: openid,
        userId: '25a9a5ab-ac91-4c95-bc46-c20d913f7a14'
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: function (res) {
        var ticketList = res.data.data
        var list = []
        for(var i in ticketList){
          var date = parseInt(new Date().getTime() / 1000)
          //固定日期区间
          if (ticketList[i].ticketinfo.dateType == 'DATE_TYPE_FIX _TIME_RANGE'){
            var beginday = new Date(parseInt(ticketList[i].ticketinfo.beginTimeStamp) * 1000).toLocaleDateString()
            var endday = new Date(parseInt(ticketList[i].ticketinfo.rangeEndTimeStamp) * 1000).toLocaleDateString()
            ticketList[i].ticketinfo.beginTime = beginday
            ticketList[i].ticketinfo.endTime = endday
            
            if (ticketList[i].ticketinfo.rangeEndTimeStamp < date) { //结束时间小于当前时间,说明过期了
              ticketList[i].ticketinfo.status = '已过期'
            } else if (ticketList[i].ticketinfo.rangeEndTimeStamp < date){//没过期，计算剩下几天时间
              ticketList[i].ticketinfo.status = '剩' + (ticketList[i].ticketinfo.rangeEndTimeStamp - date)/24/60/60 +'天'
            }
          }
          //固定时长
          // debugger
          if (ticketList[i].ticketinfo.dateType == 'date_type_fix_term'){
            //开始时间
            ticketList[i].ticketinfo.beginTimeStamp = parseInt(ticketList[i].startDate) + ticketList[i].ticketinfo.fixedBeginTerm*24*60*60
            //结束时间
            ticketList[i].ticketinfo.endTimeStamp = parseInt(ticketList[i].startDate) + (ticketList[i].ticketinfo.fixedBeginTerm + ticketList[i].ticketinfo.fixedTerm)* 24 * 60 * 60
            ticketList[i].ticketinfo.beginTime = new Date(parseInt(ticketList[i].ticketinfo.beginTimeStamp) * 1000).toLocaleDateString()
            ticketList[i].ticketinfo.endTime = new Date(parseInt(ticketList[i].ticketinfo.endTimeStamp) * 1000).toLocaleDateString()

            if (parseInt(ticketList[i].ticketinfo.endTimeStamp) < date) { //结束时间小于当前时间,说明过期了
              ticketList[i].ticketinfo.status = '已过期'
            } else if (parseInt(ticketList[i].ticketinfo.endTimeStamp) > date) {//没过期，计算剩下几天时间
              var day = (ticketList[i].ticketinfo.endTimeStamp - ticketList[i].ticketinfo.beginTimeStamp)/24/60/60
              ticketList[i].ticketinfo.status = '剩' + day + '天'
            }
          }
          if (ticketList[i].ticketStatus == 'get'){
            list.push(ticketList[i])
          }
          
        }
        that.setData({ list: list })
      }
    })
  }
})
