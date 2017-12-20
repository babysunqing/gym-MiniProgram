Page({
  data: {
    storeList: {},
    far:[],
    latitude:'',  //本地的经纬度
    longitude:''
  },
  linktoGymDetail: function (e) {
    wx.navigateTo({
      url: '../gymDetail/gymDetail?storeId=' + e.currentTarget.dataset.storeid
    })
  },
  getDistance: function (lat1, lng1, lat2, lng2) { // 根据两地的经纬度，计算距离
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    var r = 6378137;
    return (1/1000) * r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))
  },
  onLoad: function () {
    var that = this
    wx.getLocation({
      success: function (res) {
        var latitude
        var longitude
        that.getdata()
      }
    })
  },
  getdata: function () {
    var that = this
    var lat = this.data.latitude  // 要传给后台的本地经纬度
    var lon = this.data.longitude
    wx.request({
      url: 'https://31388152.qcloud.la/welsh/app/store/store_list',
      data: {
        lat: 31.22024,   //这里的数据是上海长宁的经纬度，为了查询。只需把这两个换成lat lon 即可 31.22024  121.42394
        lon: 121.42394
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: function (res) {
        var storeList = res.data.data
        // 获取当前经纬度
        // var currenLat = lat.data.latitude
        // var currenLon = lat.data.longitude
        // debugger
        for (var store in storeList) {    // 
          var far = that.getDistance(storeList[store].storeLatitude, storeList[store].storeLongitude, 121.42394, 31.22024)
          far = far.toFixed(3)
          storeList[store].distances = far  // 把计算出来的距离，添加到storeList
        }
        storeList.sort(function (a, b){     // 把店铺根据距离由小到大排序
          return a.distances - b.distances
        })
        that.setData({
          storeList: storeList,
          far: far
        })
      }
    })
  }
})