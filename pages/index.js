const app = getApp()
var NetworkService = require("../utils/NetworkService.js")
Page({
  data: {
    type: null,
    tabsManager: [],
    tabsEngineer: [],
  },

  onShow: function(options) {
   
  },

  onLoad: function(options) {
    // onLoad 比 onReady 更早调用，后者为选中时屏幕闪动一下
    var roleType = options.roleType;
    if (!roleType) {
      return null
    }
    if (roleType == "manager") {
      this.setData({
        type: "manager",
        tabsManager: [{
          text: '房间列表',
          checked: true,
          icon: '/images/tab/home.png',
          selectedIcon: '/images/tab/home-active.png',
        }, {
          text: '处理记录',
          checked: false,
          icon: '/images/tab/record.png',
          selectedIcon: '/images/tab/record-active.png',
        }, {
          text: '我的',
          checked: false,
          icon: '/images/tab/me.png',
          selectedIcon: '/images/tab/me-active.png',
        }],
      })
    } else {
      this.setData({
        type: "normal",
        tabsNormal: [{
          text: '房间列表',
          checked: true,
          icon: '/images/tab/home.png',
          selectedIcon: '/images/tab/home-active.png',
        }, {
          text: '预约记录',
          checked: false,
          icon: '/images/tab/record.png',
          selectedIcon: '/images/tab/record-active.png',
        }, {
          text: '我的',
          checked: false,
          icon: '/images/tab/me.png',
          selectedIcon: '/images/tab/me-active.png',
        }],
      })
    }
  },


  selectTab: function(idx) {
    var arr = this.data.tabsManager;
    for (let index in arr) {
      if (index == idx) {
        arr[index].checked = true;
      } else {
        arr[index].checked = false;
      }
    };
    this.setData({
      tabsManager: arr,
    })
  },
  bindChange: function(e) {
    if (this.data.type == "manager") {
      var arr = this.data.tabsManager;
      var idx = e.currentTarget.dataset.idx;

      for (let index in arr) {
        if (index == idx) {
          arr[index].checked = true;
        } else {
          arr[index].checked = false;
        }
      };
      this.setData({
        tabsManager: arr,
      })
    } else {
      var arr = this.data.tabsNormal;
      var idx = e.currentTarget.dataset.idx;

      for (let index in arr) {
        if (index == idx) {
          arr[index].checked = true;
        } else {
          arr[index].checked = false;
        }
      };
      this.setData({
        tabsNormal: arr,
      })
    }
  },

})