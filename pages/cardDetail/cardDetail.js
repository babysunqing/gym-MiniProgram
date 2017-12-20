Page({
  data: {
    item: {}
  },
    onLoad: function (options) {
      // 生命周期函数--监听页面加载
      let item = JSON.parse(options.str)
      this.setData({ item: item })
    }
})
