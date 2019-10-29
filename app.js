const app = getApp()
var NetworkService = require("./utils/NetworkService.js")
App({
  globalData: {
    version: "1.0.0",
    appid: "wx160ed2cbc9d27286", // 您的小程序的appid
    statusBarHeight: 0,
    isIpx: false,
    windowHeight: 0,
    windowWidth: 0,
  },

  onHide: function() {
    console.log("app.js ---onHide---");
  },

  onError: function(msg) {
    console.log("app.js ---onError---" + msg);
  },

  onShow: function(options) {
    var that = this;
    var scene = options.scene;

    //1089：微信聊天主界面下拉，“最近使用”栏（基础库2.2.4版本起将包含“我的小程序”栏）
    if (scene == 1089) {
      let pages = getCurrentPages();
      if (pages && pages.length > 0) {
        let current = pages[pages.length - 1].route;
        if (current != "pages/index") {
          that.getKey();
        }
      }
    }
    //公众号自定义菜单
    if (scene == 1035) {
      that.getKey();
    }
  },

  onLaunch: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.statusBarHeight = res.statusBarHeight * 2;
        that.globalData.windowWidth = res.windowWidth;
        let ratio = 750 / res.windowWidth;
        let height = res.windowHeight * ratio;
        that.globalData.windowHeight = height;

        //判断是否是iphonex
        var model = res.model
        if (model.search('iPhone X') != -1) {
          that.globalData.isIpx = true;
          that.globalData.statusBarHeight = 88;
        } else {
          that.globalData.isIpx = false;
        }
      }
    })

    if (options.scene == 1043) {
      var path = options.path;
      if (path.indexOf("audit") != -1) {
        wx.redirectTo({
          url: "/pages/audit/index?bizInsId=" + options.query.bizInsId + "&userId=" + options.query.userId
        })
      } else {
        wx.redirectTo({
          url: "/pages/qrCode/index?bizInsId=" + options.query.bizInsId + "&userId=" + options.query.userId
        })
      }
    } else {
      that.getKey();
      // wx.redirectTo({
      //   url: "/pages/mine/index"
      // })
    }
  },

  getKey: function() {
    var that = this;
    //未登陆过的用户，首先调用getKey接口，拿到用户的key值
    NetworkService.call("getKey", null,
      function(res) {
        wx.redirectTo({
          url: "/pages/authorization/index?key=" + res.data
        })
      },
      function(error) {
        wx.showToast({
          title: 'app.js获取key报错',
          icon: 'none',
          duration: 1000
        })
      }
    );
  },
})