Page({
  data: {
    latitude: '',
    longitude: '',
    markers: []
  },
  onLoad: function (option) {
    var latitude = option.storelatitude
    var longitude = option.storelongitude
    this.setData({
      latitude: latitude,
      longitude: longitude,
      markers: [{
        iconPath: "../../img/lALOxU38Ty4e_30_46.png",
        latitude: latitude,
        longitude: longitude,
        width: 20,
        height: 30
      }]
    })
  }
})
