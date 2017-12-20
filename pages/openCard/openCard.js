const app = getApp()
Page({
  data: {
    cardId:null
  },
  onLoad:function(option) {
    debugger
    wx.setStorageSync('cardId', option.ticketId) 
  },
  getCard: function() {
    var that = this
    var openid = wx.getStorageSync('openid')
    var cardId = wx.getStorageSync('cardId')
    debugger
    this.setData({ 
      openid: openid,
      cardId: cardId
    })
    //下单  成功后调起卡路里兑换页
    wx.request({
      url: 'https://31388152.qcloud.la/welsh/app/rules/place_an_order',
      data: {
        userId: "25a9a5ab-ac91-4c95-bc46-c20d913f7a14",
        order_info: JSON.stringify({
          appid: "wx5834979d26ab7d30",
          openid: openid,
          mch_name: "welsh",
          body: "card",
          calorie: 1,  // 需要扣除的卡路里
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
          envVersion: 'trial',
          success(res) {
            // 打开成功
            var time = parseInt(new Date().getTime() / 1000) + ''
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
