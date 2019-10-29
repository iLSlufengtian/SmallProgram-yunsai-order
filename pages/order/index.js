const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")
import urlHelper from "../../utils/urlHelper.js"
import {
  getTimes
} from './times'

Page({
  data: {
    marginHeight: app.globalData.statusBarHeight + 110,
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,

    showModal: false,
    showCalendar: false,
    showTimeSlot: true,

    roomid: null,
    roomName: null, //房间名字
    roomType: null, //大小房间
    roleType: null, //角色，管理员和普通用户，管理员可以不受限制的预约，普通用户必须预约今天和明天的。
    dayLegal: true, //预约的日期是否合法
    preGray: true,
    afterGray: false,

    currentDay: util.dateFtp("yyy-MM-dd", new Date().getTime()),
    timeSlot: getTimes(),

    topic: null,
    timeStr: null,
    startTime: null,
    endTime: null
  },

  onLoad: function(options) {
    console.log(options)
    var roomid = options.roomid;
    var name = options.name;
    var roomType = options.type;
    var roleType = options.role;

    this.setData({
      roomid: roomid,
      roomName: name,
      roomType: roomType,
      roleType: roleType//分为"manager"  staff
    })
  },

  bindTopicInput(e) {
    this.setData({
      topic: e.detail.value,
    })
  },

  onShow: function() {
    // this.getRoomDetail(this.data.currentDay);
  },

  doOrderRoom: function() {
    var that = this;
    if (!that.data.topic){
      wx.showToast({
        title: '主题不能为空',
      });
      return;
    }
    if (!that.data.startTime) {
      wx.showToast({
        title: '会议时间未选择',
      });
      return;
    }

    wx.showLoading({
      title: '请稍等...',
    })
    var conf = {
      urlParams: true,
      method: "POST",
      params: {
        id: that.data.roomid,
        startTime: util.ftTimeLong(that.data.startTime.replace(/\-/g, "/")), //2019-06-08 12:00:00
        endTime: util.ftTimeLong(that.data.endTime.replace(/\-/g, "/")), //2019-06-08 15:00:00
        context: JSON.stringify({
          "title": that.data.topic + "",
          // "companyName": 
        })
      }
    }
    NetworkService.call("orderRoom", conf,
      function(res) {
        wx.hideLoading();
        if (res && res.code == 0) {
          wx.showToast({
            title: '预约成功',
          });

          setTimeout(function () {
            wx.navigateBack()
          }, 500)
        } else {
          wx.showToast({
            title: res.message,
          });
        }
      },
      function(error) {
        wx.hideLoading();
      }
    );
  },

  getRoomDetail: function(str) {
    var that = this;
    
    var start = new Date(str).setHours(0, 0, 0, 0);
    var end = new Date(str).setHours(23, 59, 59, 999);
    var today = new Date().setHours(0, 0, 0, 0)

    if (today == start) {
    
      var one = new Date().setHours(6, 0, 0, 0);
      var now = new Date().getTime();
      var now30 = now + 1800000;
      // console.log("now: " + now)
      // console.log("now30: " + now30)
      that.setWhiteAndGray(today, one, now30);
    }

    if (today != start) {
      that.setWhite();
    }

    var conf = {
      urlParams: true,
      method: "GET",
      params: {
        id: that.data.roomid,
        startTime: start,
        endTime: end
      }
    }
    NetworkService.call("getRoomDetail", conf,
      function(res) {
        if (res && res.data) {
          var arr = res.data
          if (arr.length > 0) {
            arr.map((item, idx) => {
              that.setGrayAndYellow(str, item.startTime, item.endTime, item.status, item.companyName);
            })
          }
        }
      },
      function(error) {
        var sa = error;
      }
    );
  },

  onTapPre: function(e) {
    if (this.data.preGray == true) {
      return;
    }
    var stamp = new Date(this.data.currentDay).setHours(0, 0, 0, 0);
    var newStamp = stamp - (1000 * 60 * 60 * 24);
    var newCurrent = util.dateFtp("yyy-MM-dd", newStamp);
    var now = new Date().setHours(0, 0, 0, 0);
    if (this.data.roleType != "manager") {
      //不是管理员
      if (this.data.roomType == "large") {
        var max = now + 30 * 24 * 60 * 60 * 1000;
        if (max >= newStamp) {
          //所选日期在可预约日期里面
          this.setData({
            dayLegal: true, //选中的日期不合法
            currentDay: newCurrent,
            afterGray: false,
          }, () => {
            this.getRoomDetail(newCurrent);
          })
        }
        if (max < newStamp) {
          //所选日期不在可预约日期里面
          this.setData({
            dayLegal: false, //选中的日期不合法
            currentDay: newCurrent,
          }, () => {
            this.setGray();
          })
        }
      }

      if (this.data.roomType == "small") {
        var max = now + 2 * 24 * 60 * 60 * 1000;
        if (max > newStamp) {
          //所选日期在可预约日期里面
          this.setData({
            dayLegal: true, //选中的日期不合法
            currentDay: newCurrent,
            afterGray: false,
          }, () => {
            this.getRoomDetail(newCurrent);
          })
        }
        if (max <= newStamp) {
          //所选日期不在可预约日期里面
          this.setData({
            dayLegal: false, //选中的日期不合法
            currentDay: newCurrent,
          }, () => {
            this.setGray();
          })
        }
      }
    } else {
      this.setData({
        currentDay: newCurrent,
      }, () => {
        this.getRoomDetail(newCurrent);
      })
    }
  },

  onTapAft: function(e) {
    if (this.data.afterGray == true) {
      return;
    }
    var stamp = new Date(this.data.currentDay).setHours(0, 0, 0, 0);
    var newStamp = stamp + (1000 * 60 * 60 * 24);
    var newCurrent = util.dateFtp("yyy-MM-dd", newStamp);
    var now = new Date().setHours(0, 0, 0, 0);
    if (this.data.roleType != "manager") {
      //不是管理员
      if (this.data.roomType == "large") {
        var max = now + 30 * 24 * 60 * 60 * 1000;
        if (max > newStamp) {
          //所选日期在可预约日期里面
          this.setData({
            dayLegal: true, //选中的日期不合法
            currentDay: newCurrent,

          }, () => {
            this.getRoomDetail(newCurrent);
          })
        }
        if (max <= newStamp) {
          //所选日期不在可预约日期里面
          this.setData({
            dayLegal: false, //选中的日期不合法
            currentDay: newCurrent,
            afterGray: true,
          }, () => {
            this.setGray();
          })
        }
      }

      if (this.data.roomType == "small") {
        var max = now + 2 * 24 * 60 * 60 * 1000;
        if (max > newStamp) {
          //所选日期在可预约日期里面
          this.setData({
            dayLegal: true, //选中的日期不合法
            currentDay: newCurrent,
          }, () => {
            this.getRoomDetail(newCurrent);
          })
        }
        if (max <= newStamp) {
          //所选日期不在可预约日期里面
          this.setData({
            dayLegal: false, //选中的日期不合法
            currentDay: newCurrent,
            afterGray: true,
          }, () => {
            this.setGray();
          })
        }
      }
    } else {

      this.setData({
        currentDay: newCurrent,
      }, () => {
        this.getRoomDetail(newCurrent);
      })
    }
  },

  setGray() {
    var datas = this.data.timeSlot;
    for (let i = 0; i < datas.length; i++) {
      datas[i].imageType = 1;
      datas[i].imageSource = '/images/order/gray.png';
      datas[i].company = ""
    };
    this.setData({
      timeSlot: datas,
      preGray: false,
    })
  },

  setWhite() {
    var datas = this.data.timeSlot;
    for (let i = 0; i < datas.length; i++) {
      datas[i].imageType = 0;
      datas[i].imageSource = '/images/order/white.png';
      datas[i].company = ""
    };
    this.setData({
      timeSlot: datas,
      preGray: false,
    })
  },

  //设置白色和灰色
  setWhiteAndGray(today, start, end) {
    var datas = this.data.timeSlot;
    console.log("end: " + end)
    for (let i = 0; i < datas.length; i++) {
      //循环遍历每条选择时间段
      var arr = datas[i].timeList.split("~");
      var todayStr = util.dateFtp("yyy-MM-dd",today);
      // one: 选择时间段的开始  
      var one = util.ftTimeLong(todayStr + " " + arr[0]);
      // two: 选择时间段的结束    
      var two = util.ftTimeLong(todayStr + " " + arr[1]);
      if (one >= start && two < end) {
        datas[i].imageType = 1;
        datas[i].imageSource = '/images/order/gray.png';
        datas[i].company = ""
      } else {
        datas[i].imageType = 0;
        datas[i].imageSource = '/images/order/white.png';
        datas[i].company = ""
      }
    }
    this.setData({
      timeSlot: datas,
      preGray: true,
    })
  },

  // imageType 设置黄色和灰色
  // 0,白色，可预约
  // 1,灰色，已预约，
  // 2 黄色  正在审核的预约 
  // 3 绿色  我的预约
  setGrayAndYellow: function(str, start, end, status, companyName) {
    var datas = this.data.timeSlot;
    for (let i = 0; i < datas.length; i++) {
      var arr = datas[i].timeList.split("~");

      var one = util.ftTimeLong(str + " " + arr[0]);
      var two = util.ftTimeLong(str + " " + arr[1]);

      if (one >= start && two <= end) {
        if (status == 0) {
          //预占用状态
          datas[i].imageType = 2;
          datas[i].imageSource = '/images/order/yellow.png';
          datas[i].company = companyName
        }

        if (status == 1) {
          //已审核通过
          datas[i].imageType = 1;
          datas[i].imageSource = '/images/order/gray.png';
          datas[i].company = companyName
        }
      }
    }
    this.setData({
      timeSlot: datas
    })
  },

  confirmTimeSelect() {
    if (!this.data.dayLegal) {
      // 日期不合法
      var current = util.dateFtp("yyy-MM-dd", new Date().getTime());
      this.setData({
        showModal: false,
        currentDay: current,
        dayLegal: true,
        timeStr: null,
      }, () => {
        this.getRoomDetail(current);
      })
    } else {
      this.setData({
        showModal: false,
      }, () => {
        this.setTimeStr();
      })
    }
  },

  setTimeStr() {
    var datas = this.data.timeSlot;
    var currentDay = this.data.currentDay;
    var startIndex = null;
    var endIndex = null;
    for (let i = 0; i < datas.length; i++) {
      if (datas[i].imageType == 3) {
        if (startIndex == null) {
          startIndex = i;
        }
        endIndex = i;
      }
    }
    if (startIndex == null) {
      return;
    }

    var start = datas[startIndex].timeList;
    var end = datas[endIndex].timeList;
    var startArr = start.split("~")
    var endArr = end.split("~")

    var arr = currentDay.split("/");

    var startTime = startArr[0];
    var endTime = endArr[1];
    this.setData({
      timeStr: arr[0] + "年" + arr[1] + "月" + arr[2] + "日 " + startTime + "~" + endTime,
      showModal: false,
      startTime: currentDay + " " + startTime,
      endTime: currentDay + " " + endTime,
    })

  },

  // 0,白色，可预约
  // 1,灰色，已预约，
  // 2 黄色  正在审核的预约 
  // 3 绿色  我的预约
  onTapTimes: function(e) {
    var id = e.currentTarget.dataset.index
    var datas = this.data.timeSlot;
    if (datas[id].imageType == 0) {
      var sid;
      datas.map((item, idx) => {
        if (item.imageType == 3) {
          sid = idx; //获取第一次点击的id
        }
      })

      if (sid != null && id < sid) {
        for (let i = id; i < sid; i++) {
          if (datas[i].imageType == 1) {
            //已预约
            wx.showToast({
              title: '请选择连续时间段',
            })
            return;
          } else {
            datas[i].imageType = 3;
            datas[i].imageSource = '/images/order/green.png';
          }
        }
      }
      if (sid != null && sid < id) {
        for (let i = sid; i <= id; i++) {
          if (datas[i].imageType == 1) {
            //已预约
            wx.showToast({
              title: '请选择连续时间段',
            })
            return;
          } else {
            datas[i].imageType = 3;
            datas[i].imageSource = '/images/order/green.png';
          }
        }
      }

      if (sid == null) {
        datas[id].imageType = 3;
        datas[id].imageSource = '/images/order/green.png';
      }
      this.setData({
        timeSlot: datas
      })
      return;
    };

    if (datas[id].imageType == 3) {
      datas.map((item, idx) => {
        if (idx <= id && datas[idx].imageType == 3) {
          datas[idx].imageType = 0;
          datas[idx].imageSource = '/images/order/white.png';
        }
      })
      this.setData({
        timeSlot: datas
      })
      return;
    }
  },

  hideCalendar(event) {
    if (event.detail) {
      this.setData({
        currentDay: event.detail.date.replace(/-/g,'/'),
        showCalendar: false,
        showTimeSlot: true
      }, () => {
        this.onDaySelected();
      })
    } else {
      this.setData({
        showCalendar: false,
        showTimeSlot: true
      })
    }
  },

  onDaySelected() {
    //判断选中的天数和当前时间相比较分角色
    // 小房间只能提供今天，明天的预定，大房间只能提供一个月内的预定。管理员不受任何限制
    var stamp = new Date(this.data.currentDay).setHours(0, 0, 0, 0);
    var now = new Date().setHours(0, 0, 0, 0);
    if (this.data.roleType != "manager") {
      //不是管理员
      if (this.data.roomType == "large") {
        var max = now + 30 * 24 * 60 * 60 * 1000;
        if (stamp >= max) {
          this.setData({
            dayLegal: false, //选中的日期不合法
            afterGray: true,
          }, () => {
            this.setGray();
          })
          return;
        }
        if (!this.data.dayLegal) {
          this.setData({
            dayLegal: true, //选中的日期合法
            afterGray: false,
          })
        }
        this.getRoomDetail(this.data.currentDay);
      }

      if (this.data.roomType == "small") {
        var max = now + 2 * 24 * 60 * 60 * 1000;
        if (stamp >= max) {
          // 选中的日期不接受预约,所有的时间段置灰色。
          this.setData({
            dayLegal: false, //选中的日期是否接受预约
            afterGray: true,
          }, () => {
            this.setGray();
          })
          return;
        }
        // 选中的日期可以接受预约,请求线上的已预约信息
        if (!this.data.dayLegal) {
          this.setData({
            dayLegal: true, //选中的日期是否接受预约
            afterGray: false,
          })
        }
        this.getRoomDetail(this.data.currentDay);
      }
    } else {
      //是管理员
      this.getRoomDetail(this.data.currentDay);
    }
  },

  showCalendar() {
    this.setData({
      showCalendar: true,
      showTimeSlot: false
    })
  },
  showSlectModal(e) {
    this.showDelModal();
  },
  //关闭时间段选择
  closeTimeSelect() {
    this.hideDelModal();
  },
  showDelModal() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(800).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showModal: true
    })
    console.log("showsdk0")
    this.getRoomDetail(this.data.currentDay);

    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export() // export 方法每次调用后会清掉之前的动画操作。
      })
      console.log(this)
    }, 200)
  },

  hideDelModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModal: false
      })
      console.log(this)
    }.bind(this), 200)
  },


})