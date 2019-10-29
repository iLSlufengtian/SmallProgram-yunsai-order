const app = getApp()
var NetworkService = require("../../../utils/NetworkService.js")
var util = require("../../../utils/util.js")
import urlHelper from "../../../utils/urlHelper.js"
Page({
  data: {
    marginHeight: getApp().globalData.statusBarHeight + 96,

    oldPwd: null,
    newPwd: null,
    newPwdAgin: null,
    userId:null,
  },
  // modifyPwd
  onReady: function() {


  },

  onLoad: function(options) {
    var that=this;

    wx.getStorage({ //获取本地缓存
      key: "userInfo",
      success: function (res) {
        that.setData({
          userId:res.data.id
        })
      },
      fail: function (res) {
       
      },
    })
  },

  onShow() {

  },

  modifyPwd() {
    var that = this;
    if (!that.data.oldPwd) {
      wx.showToast({
        title: '原密码不能为空',
      })
      return;
    }
    if (!that.data.newPwd) {
      wx.showToast({
        title: '新密码不能为空',
      })
      return;
    }
    if (!that.data.newPwdAgin) {
      wx.showToast({
        title: '请再次输入新密码',
      })
      return;
    }

    if (that.data.newPwdAgin != that.data.newPwd) {
      wx.showToast({
        title: '两次密码不一致',
      })
      return;
    }

    var conf = {
      method: "PUT",
      urlParams:true,
      isForm:true,
      params: {
        newPassword: that.data.newPwd,
        oldPassword: that.data.oldPwd,
        id: that.data.userId
      }
    };
    NetworkService.call("modifyPwd", conf,
      function(res) {
        if (res.code == 0) {
          wx.showToast({
            title:'密码修改成功',
          })
          wx.redirectTo({
            url: "/pages/login/login"
          })
        }else{
          wx.showToast({
            title:res.message+'',
          })
        }
      },
      function(error) {
        wx.showToast({
          title:"网络错误"
        })
      }
    );
  },

  bindOldPwdInput: function(e) {
    this.setData({
      oldPwd: e.detail.value
    });
  },

  bindNewPwdInput: function(e) {
    this.setData({
      newPwd: e.detail.value
    });
  },

  bindNewPwdAginInput: function(e) {
    this.setData({
      newPwdAgin: e.detail.value
    });
  },

  onTapMessage: function(e) {
    wx.navigateTo({
      url: '../pinglun/index'
    });
  },

})