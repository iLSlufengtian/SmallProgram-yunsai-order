const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    marginHeight: app.globalData.statusBarHeight + 142,
    userInfo: null
  },
  ready: function() {
    var that = this;
    //获取本地缓存
    wx.getStorage({
      key: "userInfo",
      success: function(res) {
        that.setData({
          userInfo: res.data
        });
      },
      fail: function(res) {
        wx.redirectTo({
          url: "/pages/login/login"
        })
      },
    })
    // console.log(res.data);
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onTapModify: function() {
      wx.navigateTo({
        url: './mine/setpwd/index'
      });
    },
    uploadFile: function() {
      wx.navigateTo({
        url: './mine/file/index'
      });
    },

    onTapRecord: function () {
      //进入 导出预约记录
      wx.navigateTo({
        url: "/pages/mine/record/index"
      })
    },

    onTapAbout: function() {
      //进入 关于我们
        wx.navigateTo({
          url: "/pages/mine/aboutus/index"
        })
    },

    onTapLogout: function () {
      //退出登录
      wx.showLoading({
        title: '正在退出...',
      })
      wx.setStorage({
        key: "userInfo",
        data: null
      })

      setTimeout(() => {
        wx.hideLoading();
        wx.redirectTo({
          url: "/pages/login/login"
        })
      }, 300)
    },  

    onTapHeadImg() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'], //可选择原图或压缩后的图片
        sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
        success: res => {
          const filePath = res.tempFilePaths[0];

          wx.showLoading({
            title: '请稍等...',
          })
          var conf = {
            method: "POST",
            url: "uploadHeadImg",
            filePath: filePath
          };
          NetworkService.uploadFile(conf,
            function(res) {
              wx.hideLoading();
              if (res.code == 0) {


              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '暂无数据',
                })
              }
            },
            function(error) {
              wx.hideLoading();
              wx.showToast({
                title: "上传失败",
              })
            }
          );

        }
      });
    },

  }
})