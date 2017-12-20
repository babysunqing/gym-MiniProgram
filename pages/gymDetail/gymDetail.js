Page({
  data: {
    listData:{},
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    storeId:'',
    duration: 1000
  },
  linktoLocation: function (e) {
    wx.navigateTo({
      url: '../location/location?storelatitude=' + e.currentTarget.dataset.storelatitude + '&storelongitude=' + e.currentTarget.dataset.storelongitude
    })
  },
  onLoad: function (option) {
    this.setData({
      storeId: option.storeId
    })
    this.getdata()
  },
  getdata: function () {
    var that = this
    wx.request({
      url: 'https://31388152.qcloud.la/welsh/app/store/store_one',
      data: {
        storeId: that.data.storeId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: function (res) {
        var listData = res.data.data[0]
        var carouselImg = listData.carouselImg
        var storelatitude = listData.storeLatitude
        that.setData({
          listData: listData 
        })
      }
    })
  }
})