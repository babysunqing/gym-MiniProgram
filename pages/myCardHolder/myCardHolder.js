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
          var beginday = new Date(parseInt(ticketList[i].beginTimeStamp) * 1000).toLocaleDateString()
          var endday = new Date(parseInt(ticketList[i].rangeEndTimeStamp) * 1000).toLocaleDateString()
          ticketList[i].ticketinfo.beginTime = beginday
          ticketList[i].ticketinfo.endTime = endday
          var date = parseInt(new Date().getTime() / 1000)
          // debugger
          if (parseInt(ticketList[i].ticketinfo.rangeEndTimeStamp) < date) {
            ticketList[i].ticketinfo.status = '已过期'
          } else if (parseInt(ticketList[i].ticketinfo.rangeEndTimeStamp) > date){
            //大于10天
            if (parseInt(ticketList[i].ticketinfo.rangeEndTimeStamp) - date > 864000){
              ticketList[i].ticketinfo.status = '可使用'
            }else{
              var day = (parseInt(ticketList[i].ticketinfo.rangeEndTimeStamp) - date )/3600/24
              day = day.toFixed(0)
              ticketList[i].ticketinfo.status = day
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
