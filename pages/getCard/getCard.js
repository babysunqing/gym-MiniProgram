const app = getApp()
Page({
  data:{
    pay: true,
    rulesData:[],
    extraData:false
  }, 
  onLoad: function () {
    this.getdata()
  },
  onShow: function () {
    let that = this
    var extraData = wx.getStorageSync('extraData')
    if (extraData == '' || extraData == false){
      this.extraData =false
    }else{
      this.extraData = true
    }
    this.setData({
      extraData: extraData,
    })
    console.log('extraData是' + extraData)
  },
  getdata: function () {
     var that = this
     var sessionKey = wx.getStorageSync('sessionKey')
    //  debugger
    //  if (wx.getStorageSync('extraData') != ''){     
    //    var extraData = wx.getStorageSync('extraData')
    //    console.log(extraData)
    //  }
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
              // debugger
              var date = parseInt(new Date().getTime() / 1000)
              if (rulesData[i].ticketinfo.dateType == 'DATE_TYPE_FIX _TIME_RANGE'){
                var beginday = new Date(parseInt(rulesData[i].ticketinfo.beginTimeStamp) * 1000).toLocaleDateString()
                var endday = new Date(parseInt(rulesData[i].ticketinfo.rangeEndTimeStamp) * 1000).toLocaleDateString()
                rulesData[i].ticketinfo.beginTime = beginday
                rulesData[i].ticketinfo.endTime = endday
              }
              // if (rulesData[i].ticketinfo.dateType == 'date_type_fix_term') {}
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
  //兑换卡券，
  exchange:function(){
    //下单
    var that = this
    var openid = wx.getStorageSync('openid')
    var needCalorie = wx.getStorageSync('needCalorie')
    wx.request({
      url: 'https://31388152.qcloud.la/welsh/app/rules/place_an_order',
      data: {
        userId: "25a9a5ab-ac91-4c95-bc46-c20d913f7a14",
        order_info: JSON.stringify({
          appid: "wx5834979d26ab7d30",
          openid: openid,
          mch_name: "welsh",
          body: "card",
          calorie: needCalorie, // needCalorie
          return_uri: "pages/openCard/openCard"
        })
      },
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      method: "post",
      success: function (res) {
        var order_no = res.data.order_no
        that.setData({
          order_no: order_no
        })
        // 下单完成，调起卡路里兑换页
        wx.navigateToMiniProgram({
          appId: res.data.user_pay_appid,
          path: res.data.user_pay_key,
          envVersion: 'trial',
          success(res) {
          }
        })
      }
    })
  },
  openCard:function(){
    //当前的时间戳
    var time = parseInt(new Date().getTime() / 1000) + ''
    //随机字符串
    var nonce = Math.random().toString(36).substr(2, 15)
    var cardId = wx.getStorageSync('cardId')
    var openid = wx.getStorageSync('openid')
    //获取签名 
    wx.request({
      url: 'https://31388152.qcloud.la/welsh/app/ticket/getCardSignature',
      data: {
        userId: "25a9a5ab-ac91-4c95-bc46-c20d913f7a14",
        timestamp: time,
        nonce: nonce,
        cardId: cardId
      },
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      method: "post",
      success: function (res) {
        console.log('获取签名成功')
        wx.setStorageSync('extraData', false)
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
            var codeObj = res.cardList[0]
            wx.setStorageSync('extraData', false)
            console.log('领取成功')
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
              }
            })
          }
        })
      }
    })
  },
  getCard: function (e) {
    //获取当前点击的卡券的ticketId和兑换卡路里
    var cardId = e.currentTarget.dataset.index[0].ticketId
    var needCalorie = e.currentTarget.dataset.index[0].rulesLimit/20

    wx.setStorageSync('cardId', cardId)
    wx.setStorageSync('needCalorie', needCalorie)
    if (this.extraData == false) {
      this.exchange()
    }
    if (this.extraData == true){
      this.openCard()
    }
    
  }
})
