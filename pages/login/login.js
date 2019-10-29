var NetworkService = require("../../utils/NetworkService.js")
//获取应用实例
var app = getApp();
Page({
  data: {
    phone: '',
    btnText: '发送验证码',
    code: '',
    second: 30,
    disabled: false,
    key:""
  },

  onLoad: function (options) {
    this.setData({
      key: options.key
    })
  },

  bindPhoneInput(e) {
    var val = e.detail.value;
    this.setData({
      phone: e.detail.value
    })
  },

  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },

  getCode() {
    var that = this;
    if (that.data.phone == "" || !that.data.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    if (that.data.phone.trim().length != 11) {
      wx.showToast({
        title: '手机号号码有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    if (!(/^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/.test(that.data.phone))) {
      wx.showToast({
        title: '手机号号码有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    wx.showLoading({
      title: '请稍等...',
    })

    var conf = {
      method: "POST",
      urlParams: true,
      params: {
        phone: that.data.phone,
      }
    };
    NetworkService.call("sendCode", conf,
      function(res) {
        wx.hideLoading();
        if (res.code == 0) {
          //请求成功，开启倒计时
          that.timer()
        } else {
          wx.showToast({
            title: res.message + '',
            icon: 'none',
            duration: 800
          })
        }
      },
      function(error) {
        wx.hideLoading();
      }
    );
  },


  timer: function() {
    var that = this;

    that.setData({
      disabled: true,
    })
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(() => {
        var sec = that.data.second;
        sec--;
        that.setData({
          second: sec,
          btnText: sec + 's'
        })
        if (that.data.second <= 0) {
          that.setData({
            second: 30,
            btnText: "发送验证码",
            disabled: false,
          })
          resolve(setTimer)
        }
      }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  verify: function() {
    var that=this;
    if (that.data.phone == "" || !that.data.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (that.data.phone.trim().length != 11) {
      wx.showToast({
        title: '手机号号码有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    if (!(/^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/.test(that.data.phone))) {
      wx.showToast({
        title: '手机号号码有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!this.data.code || this.data.code == "") {
      wx.showToast({
        title: '验证码不正确',
        icon: 'none',
        duration: 800
      })
      return;
    }
    let conf = {
      method: "POST",
      urlParams: true,
      params: {
        code: this.data.code,
        phone: this.data.phone
      }
    }
    console.log(conf)
    var that = this;
    NetworkService.call("customerVerify", conf,
      function(res) {
        if (res && res.code == 0) {
          that.logIn({
            method: "POST",
            params: {
              phone: that.data.phone,
              key:that.data.key
            }
          })
        }
        if (res.code === 5008) {
          wx.showToast({
            title: res.message + '',
            icon: 'none',
            duration: 800
          })
        }
      },
      function(error) {
        wx.hideLoading();
      })
  },

  logIn: function(conf) {
    var that = this
    wx.showLoading({
      title: '正在登录',
    })
    NetworkService.call("login", conf,
      function(res) {
        console.log(res);
        wx.hideLoading();

        if (res && res.code == 0) {
          //登陆成功之后存储个人信息
          var token = res.data.token;

          NetworkService.setToken(token);
          wx.setStorageSync(
            'token', token
          )
          that.getUserInfo();

        } else {
          wx.hideLoading();
          wx.redirectTo({
            url: "/pages/guide/index"
          })
        }
      },
      function(error) {
        wx.hideLoading();
        wx.redirectTo({
          url: "/pages/guide/index"
        })
      }
    );
  },

  getUserInfo: function() {
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
        console.log(error)
      }
    );
  },

});