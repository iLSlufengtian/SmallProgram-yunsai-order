const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    key: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //通过options拿到上一个页面传过来的key
    var that = this;
    that.setData({
      url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc2bed302312c4ac7&redirect_uri=http%3a%2f%2fwww.i-lab.sh.cn%2filabservice.cloud%2fyskj%2fapi%2fv2%2funsecure%2fwechat%2fyskj%2fcode&response_type=code&scope=snsapi_base&state=' + options.key,
      key: options.key,
    })
  },

  onbindload: function(res) {
    //调用登录方法
    this.logIn(this.data.key)
  },
  //根据openid获取token
  logIn: function(key) {
    var that = this
    var conf = {
      method: "POST",
      params: {
        key: key
      }
    };
    NetworkService.call("login", conf,
      function(res) {
        console.log(res);
        if (res && res.code == 0) {
          //用户找到之后   存储token,并请求个人信息
          var token = res.data.token;

          NetworkService.setToken(token);
          wx.setStorage({
            key: "token",
            data: token
          })

          that.getUserInfo();

        } else {
          wx.hideLoading();
          wx.showToast({
            title: '获取token错了',
          })
        }
      },
      function(error) {
        if (error && error.data) {
          if (error.data.status == 401) {
            //用户未找到,调到非入孵人员退出页面
            wx.redirectTo({
              url: "/pages/login/login?key=" + key
            })
          }
        }
      }
    );
  },

  getUserInfo: function() {
    var that = this;
    NetworkService.call("me", null,
      function(res) {
        if (res.code == 0) {
          //登录状态 还在有效期
          wx.setStorage({
            key: "userInfo",
            data: res.data
          })
          
          if (res.data.roleName == "AUDIT") {
            wx.redirectTo({
              url: "/pages/index?roleType=manager"
            });
          } else {
            wx.redirectTo({
              url: "/pages/index?roleType=normal"
            });
          }
        }
      },
      function(error) {

      }
    );
  },





  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
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