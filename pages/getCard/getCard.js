const app = getApp()
Page({
  data:{
    rulesData:[]
  },
  onLoad: function () {
    this.getdata()
  },
  getdata: function () {
     var that = this
     var sessionKey = wx.getStorageSync('sessionKey')
     this.setData({
       sessionKey: sessionKey,
     })
    wx.getWeRunData({
      success(res) {
        // debugger
        const iv = res.iv
        const encryptedData = res.encryptedData
        that.setData({
           iv: iv,
           encryptedData: encryptedData
        })
        wx.request({
          url: 'https://31388152.qcloud.la/welsh/app/rules/sport',
          data: {
            sessionKey: sessionKey,
            iv: iv,
            encryptedData: encryptedData,
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "post",
          success: function (res) {
            var runData = res.data.sport.stepInfoList[29]
            var calorie = runData.step/50
            var rulesData = res.data.rules
            for (var i in rulesData) {
              var beginday = new Date(parseInt(rulesData[i].beginTime) * 1000).toLocaleDateString()
              var endday = new Date(parseInt(rulesData[i].endTime) * 1000).toLocaleDateString()
              rulesData[i].beginTime = beginday
              rulesData[i].endTime = endday
            }
            that.setData({
              calorie: calorie,
              rulesData: rulesData
            })
          }
        })
      }
    })
  },
  getCard: function (e) {
    var that = this
    var openid = wx.getStorageSync('openid')
    //获取当前点击的卡券的ticketId和兑换卡路里
    var cardId = e.currentTarget.dataset.index[0].ticketId
    var needCalorie = e.currentTarget.dataset.index[0].rulesLimit
    this.setData({
      openid: openid,
      cardId: cardId
    })
    //下单
    wx.request({
      url: 'https://31388152.qcloud.la/welsh/app/rules/place_an_order',
      data: {
        userId: "25a9a5ab-ac91-4c95-bc46-c20d913f7a14",
        order_info: JSON.stringify({
          appid: "wx5834979d26ab7d30",
          openid: openid,
          mch_name: "welsh",
          body: "card",
          calorie: needCalorie,  // 兑换卡券需要扣除的卡路里
          return_uri: "pages/myCardHolder/myCardHolder" // 调回小程序的路径
        })
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: function (res) {
        //调起卡路里兑换页
        wx.navigateToMiniProgram({
          appId: res.data.user_pay_appid,
          path: res.data.user_pay_key,
          envVersion: 'trial', //体验版卡路里插件
          success(res) { // 打开成功
            //当前的时间戳
            var time = parseInt(new Date().getTime() / 1000) + ''
            //随机字符串
            var nonce = Math.random().toString(36).substr(2, 15) 
            //获取签名 
            wx.request({
              url: 'https://31388152.qcloud.la/welsh/app/ticket/getCardSignature',
              data: {
                userId: "25a9a5ab-ac91-4c95-bc46-c20d913f7a14",
                timestamp: time,
                nonce: nonce,
                cardId: cardId
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "post",
              success: function (res) {
                //添加卡券
                wx.addCard({
                  cardList: [{
                    cardId: cardId,
                    cardExt: JSON.stringify({
                      signature: res.data.sign,
                      timestamp: parseInt(time),
                      nonce_str: nonce,
                      api_ticket: res.data.cardTicket
                    })
                  }],
                  success: function (res) {
                    console.log(res)
                    var codeObj = res.cardList[0]
                    // 保存卡券到卡包
                    wx.request({
                      url: 'https://31388152.qcloud.la/welsh/app/ticket/save_mycard',
                      method: 'POST',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      data: {
                        ticketId: codeObj.cardId,
                        code: codeObj.code,
                        userId: "25a9a5ab-ac91-4c95-bc46-c20d913f7a14",
                        openId: openid
                      },
                      success(res) {
                        console.log(res)
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
  }
})
