// pages/home/filter/index.js
const app = getApp()
var NetworkService = require("../../../utils/NetworkService.js")
var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchTime:null,
    marginHeight: app.globalData.statusBarHeight + 126,
    roleName: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var startTime = new Date(options.str.slice(0, 15).replace(/-/g, '/')).getTime();
    var endTime = options.str.slice(0, 10) + ' ' + options.str.slice(17);
    endTime = new Date(endTime.replace(/-/g, '/')).getTime();
    this.setData({
      searchTime:options.str,
    })
    this.queryRooms(startTime, endTime);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res && res.data) {
          that.setData({
            roleName: res.data.roleName == "AUDIT" ? "manager" : "normal" //管理员和普通用户
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  
  // 引用查询房间接口
  queryRooms: function (startTime, endTime) {
    let conf = {
      method: "GET",
      urlParams: true,
      params: {
        startTime: startTime,
        endTime: endTime
      }
    }
    var that = this;
    NetworkService.call("queryRooms", conf,
      function (res) {
        if (res && res.data) {
          var datas = res.data.list;
          setTimeout(function () {
            wx.hideLoading();
            that.setData({
              list: datas
            })
          }, 500)
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '请求网络失败',
          })
        }
      }, function (err) {
      }
    );
  },

  onTapRoom: function (e) {
    var roomid = e.currentTarget.dataset.roomid;
    var name = e.currentTarget.dataset.name;
    var type = e.currentTarget.dataset.type;

    if (type == "small_room") {
      wx.navigateTo({
        url: '../../order/index?roomid=' + roomid + "&name=" + name + "&type=small" + "&role=" + this.data.roleName
      });
    } else {
      wx.navigateTo({
        url: '../../order/index?roomid=' + roomid + "&name=" + name + "&type=large" + "&role=" + this.data.roleName
      });
    }
  },

  
})