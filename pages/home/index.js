const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")

Component({
  properties: {},
  data: {
    marginHeight: app.globalData.statusBarHeight + 126,
    delBtnWidth: 180, //删除按钮宽度单位（rpx）
    list: [],
    name: "",
    showModal: true,
    hiddenmodalput: true,
    modalTitle: "查询时间段",
    taskDate: null,
    taskStartTime: '06:00',
    taskEndTime: '23:59',
    searchTime: null,
    searchStartDateTime: null,
    searchEndDateTime: null,
    currentDate: null,
    roleName: null,
  },
  ready: function() {
    this.listRooms();

    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        if (res && res.data) {
          that.setData({
            roleName: res.data.roleName == "AUDIT" ? "manager" : "normal" //管理员和普通用户
          })
        }
      }
    });
  },
  methods: {
    onTapFilterImg: function(e) {
      var curDate = util.getToday();
      this.setData({
        hiddenmodalput: false,
        taskDate: curDate,
        currentDate: curDate,
      })
    },

    onTapCancel: function(e) {
      this.setData({
        hiddenmodalput: true,
      })
    },

    onTapConfirm: function(e) {
      var that = this;
      this.setData({
        hiddenmodalput: true,
        searchStartDateTime: this.data.taskDate + ' ' + this.data.taskStartTime + ':00',
        searchEndDateTime: this.data.taskDate + ' ' + this.data.taskEndTime + ':00',
        searchTime: this.data.taskDate + ' ' + this.data.taskStartTime + '~' + this.data.taskEndTime + '',
      }, () => {
        wx.navigateTo({
          url: '/pages/home/filter/index?str=' + that.data.searchTime,
        })
      })
    },


    bindDateChange(e) {
      console.log('picker发送选择改变，携带值为')
      var start = e.detail.value;
      console.log(e.detail.value)
      this.setData({
        taskDate: start,
      })
    },

    bindTimeChange1(e) {
      console.log('picker发送选择改变，携带值为')
      var start = e.detail.value;
      this.setData({
        taskStartTime: start,
      })
    },

    bindTimeChange2(e) {
      console.log('picker发送选择改变，携带值为')
      var end = e.detail.value;
      this.setData({
        taskEndTime: end,
      })
    },

    listRooms: function() {
      wx.showLoading({
        title: '请稍等...',
      })
      var that = this;
      NetworkService.call("listRooms", null,
        function(res) {
          if (res && res.data) {
            var datas = res.data.list;
            // console.log(datas)
            // datas.splice(8, 5);
            // console.log(datas)
            setTimeout(function() {
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
        },
        function(error) {
          wx.showToast({
            title: '请求网络失败',
          })
          wx.hideLoading();
        }
      );
    },


    onTapRoom: function(e) {
      var index = e.currentTarget.dataset.index
      console.log(this.data.list[index].id);
      console.log(this.data.list[index].name);
    },


    onTapRoom: function(e) {
      // wx.navigateTo({ url: '/pages/audit/index' })
      // wx.navigateTo({ url: '/pages/qrCode/index' })
      console.log(e.currentTarget.dataset);
      var roomid = e.currentTarget.dataset.roomid;
      var name = e.currentTarget.dataset.name;
      var type = e.currentTarget.dataset.type;
      if (type == "small_room") {
        wx.navigateTo({
          url: './order/index?roomid=' + roomid + "&name=" + name + "&type=small" + "&role=" + this.data.roleName
        });
      } else {
        wx.navigateTo({
          url: './order/index?roomid=' + roomid + "&name=" + name + "&type=large" + "&role=" + this.data.roleName
        });
      }
    },

  }
})