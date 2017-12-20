Page({
  data: {
    listData:{},
    hidden: false,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  linktoGymNearby: function () {
    wx.navigateTo({
      url: '../gymNearby/gymNearby'
    })
  },
  onLoad: function () {
    this.getdata(),
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              authorization: true
            }
          })
        }
      }
    })
  },
  getdata: function () {
    var that = this
    wx.request({
      url: 'https://31388152.qcloud.la/welsh/app/main/home',
      data: {
        userId: '25a9a5ab-ac91-4c95-bc46-c20d913f7a14'
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: function (res) {        
        var listData = res.data.data　　　　　
        that.setData({
          listData: listData
        }) 
      },
      fail: function (err) { },
      complete: function () { }
    }) 
  }
})