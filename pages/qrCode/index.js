var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: null,
    invalid: null, //密码是否有效,当前时间小于结束时间,
    showCancel: false,
    bizInsId: null,
    userId: null
  },

  onShow: function(options) {
   

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      bizInsId: options.bizInsId,
      userId: options.userId
    }, () => {
      this.getQrcode();
    })
  },


  onHide: function() {
  },


  getQrcode: function() {
    wx.showLoading({
      title: '请稍等...',
    })
    var that = this;
    var conf = {
      method: "GET",
      params: {
        bizInsId: that.data.bizInsId,
        userId: that.data.userId
      }
    };
    NetworkService.call("getQrcode", conf,
      function(res) {
        wx.hideLoading();
        if (res && res.code == 0) {

          res.data.startTime = util.dateFtt("MM-dd hh:mm", res.data.validStartTime);
          res.data.endTime = util.dateFtttt("hh:mm", res.data.validEndTime);

          var diff = new Date().getTime() - res.data.validEndTime;
          // var diff2 = res.data.validStartTime - new Date().getTime();
          if (diff >= 0) {
            //当前时间大于结束时间,
            that.setData({
              result: res.data,
              invalid: 2 //失效了
            })
          } else {
            that.setData({
              result: res.data,
              invalid: 1 //有效
            })
          }
        } else if (res.code == 12132) {
          that.setData({
            invalid: null,
            showCancel: true
          })
        }
      },
      function(error) {
        wx.hideLoading();
        wx.showToast({
          title: '请求失败',
        })
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})