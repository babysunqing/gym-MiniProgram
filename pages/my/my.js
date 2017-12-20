//{"session_key":"2pFn3+orUPgSkMAmeHWGOg==",
//"expires_in":7200,
//"openid":"oFrIf0UbI78mEESzWzM5RqFzdaYk"}
const app = getApp()
Page({
  data: {
    userInfo: {},
    runData: [],
    nickName:"",
    code:"",
    sessionKey:"",
    authorization: true,
    step:'',
    runData:''
  },
  onLoad: function(options) {
    var that = this
    var user_Info
    var nickName
    var gender
    this.setData({
      authorization: app.globalData.authorization
    })
    wx.login({
      success: function (res) {
        var code = res.code
        that.setData({ code: code })
        wx.getUserInfo({
          success: function (res) {
            user_Info = res.userInfo
            nickName = user_Info.nickName
            gender = user_Info.gender
            that.setData({ userInfo: user_Info })
            that.setData({ nickName: nickName })
            wx.request({ //获取sessionKey openid
              url: 'https://31388152.qcloud.la/welsh/app/member/login',
              data: {
                userId: '25a9a5ab-ac91-4c95-bc46-c20d913f7a14',
                code: code,
                userInfo: JSON.stringify({
                  nickName: user_Info.nickName,
                  gender: user_Info.gender
                }),
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "post",
              success: function (res) {
                var sessionKey = res.data.session_key
                var openid = res.data.openid
                that.setData({ sessionKey: sessionKey })
                wx.setStorageSync('sessionKey', sessionKey)   // 设置缓存sessionKey  openid
                wx.setStorageSync('openid', openid)
                wx.getWeRunData({
                  success(res) {
                    const iv = res.iv
                    const encryptedData = res.encryptedData
                    that.setData({
                      iv: iv,
                      encryptedData: encryptedData
                    })
                    wx.request({    // 获取运动数据
                      url: 'https://31388152.qcloud.la/welsh/app/rules/sport',
                      data: {
                        sessionKey: sessionKey,
                        iv: iv,
                        encryptedData: encryptedData,
                        userId: '25a9a5ab-ac91-4c95-bc46-c20d913f7a14'
                      },
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      method: "post",
                      success: function (res) {
                        // debugger                    
                        var runData = res.data.sport.stepInfoList[29]
                        that.setData({
                          runData: runData
                        })
                        // console(runData)
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
    // var sessionKey = wx.getStorageSync('sessionKey')
    // this.setData({
    //   sessionKey: sessionKey,
    // })
    // wx.setStorageSync('openid', this.openid)
  },
  linktoMyCardHolder: function () {
    wx.navigateTo({
      url: '../myCardHolder/myCardHolder'
    })
  },
  linktoGetCard: function () {
    wx.navigateTo({
      url: '../getCard/getCard'
    })
  }
})
