const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 180,
    radioValues: [{
        'value': '待审批',
        'selected': true
      },
      {
        'value': '已审批',
        'selected': false
      },
      {
        'value': '我的',
        'selected': false
      },
    ],
    clazz: [],
    finishedDatas: [],
    dataLoaded: false,
    openDatas: [],
    processingDatas: [],
    deviceId: null,
    checkApplyId: null,
    userId: "",
    admin:"",
    leaseId: null,
    hiddenmodalput: true,
    hiddenmodalrefuse: true,
    hiddenmodalagree: true,
    description: '',
  },

  ready: function() {
    let that=this;
    that.queryRecord("0"); //待审批
    that.clazzStatus();

    //获取本地缓存
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          userId: res.data.id,
          admin: res.data.admin
        });
      },
      fail: function (res) {
       
      },
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 刷新
    refresh: function() {
      var that = this;
      that.queryRecord("0"); //待审批
      that.queryRecord("3"); //已审批
      that.queryRecord(); //我的预约

      // setTimeout(function() {
      that.selectComponent('#manageren').stopRefresh();
      // }, 1000)
    },

    queryRecord: function(type) {
      var that = this;
      wx.showLoading({
        title: '正在加载...',
      })
      var conf = {
        method: "GET",
        params: {
          // userId: that.data.userId,
          status: type,
        }
      };
      if(type =="3"){
        conf.params.admin = that.data.userId;
      }
      if(type != "0" && type != "3"){
        conf.params.userId = that.data.userId;
      }
          
      NetworkService.call("queryRecord", conf,
        function(res) {
          wx.hideLoading();
          if (res && res.code == 0) {
            var datas = res.data;
            for (var i = 0; i < datas.length; i++) {
              datas[i].context = JSON.parse(datas[i].context);
              datas[i].start = datas[i].context.startTime
              datas[i].startTime = util.dateFttt("yyyy-MM-dd hh:mm", datas[i].context.startTime)
              datas[i].gmtCreate = util.dateFttt("yyyy-MM-dd hh:mm", datas[i].gmtCreate);
              datas[i].finishTime = util.dateFtttt("hh:mm", datas[i].context.endTime)
            }
            //待审批
            if (type == "0") {
              that.setData({
                finishedDatas: datas,
                dataLoaded: true
              })
            }

            //已审批
            if (type == "3") {
              that.setData({
                processingDatas: datas,
              })
            }

            //我的
            if (type == null) {
              //判断距离现在是不是不足30分钟
              var now = new Date().getTime();
              for (var i = 0; i < res.data.length; i++) {
                if ((res.data[i].start - now) < 1800000) {
                  res.data[i].cancelAble = false;
                } else {
                  res.data[i].cancelAble = true;
                }
              }

              that.setData({
                openDatas: res.data,
              })
            }


          } else {
            wx.showToast({
              title: '请求网络失败',
            })
          }
        },
        function(error) {
          wx.hideLoading();
          wx.showToast({
            title: '请求网络失败！',
          })

        }
      );
    },


    clickcancelOrdered(e) {
      var that = this;
      var leaseid = e.currentTarget.dataset.leaseid;
      var deviceId = e.currentTarget.dataset.deviceid;
      var cancelable = e.currentTarget.dataset.cancelable;

      if (!cancelable) {
        return;
      }

      that.setData({
        deviceId: deviceId,
        leaseId: leaseid,
      }, () => {
        that.cancelOrdered()
      })
    },
    //取消预约
    cancelRecord: function() {
      var that = this;
      wx.showLoading({
        title: '请稍等...',
      })
      var conf = {
        method: "DELETE",
        urlParams: true,
        params: {
          id: that.data.deviceId,
          leaseId: that.data.leaseId,
        }
      };

      NetworkService.call("cancelRecord", conf,
        function(res) {
          wx.hideLoading();
          if (res && res.data) {
            wx.showToast({
              title: '取消成功',
            })
            that.queryRecord(); //我的预约
          } else {
            wx.showToast({
              title: '取消失败',
            })
          }
        },
        function(error) {
          wx.showToast({
            title: '取消失败',
          })
          wx.hideLoading();
        }
      );
    },


    cancelOrdered() {
      this.setData({
        hiddenmodalput: false
      })
    },

    //取消取消预订
    onTapCancel() {
      this.setData({
        hiddenmodalput: true,
      })
    },
    //确定取消预订
    onTapConfirm() {
      this.cancelRecord()
      this.setData({
        hiddenmodalput: true,
      })
    },

    //同意或者拒绝申请
    handleApply: function(type) {
      var that = this;
      wx.showLoading({
        title: '请稍等...',
      })
      var conf = {
        method: "POST",
        urlParams: true,
        params: {
          id: that.data.leaseId,
          auditStatus:type,
          auditRemark: that.data.description,
        }
      };

      NetworkService.call("handleApply", conf,
        function(res) {
          wx.hideLoading();
          if (res && res.data) {
            if (type==1){
              //同意申请
              wx.showToast({
                title: '审批成功',
              })
            }
            if (type == 2){
               //拒绝申请
              wx.showToast({
                title: '拒绝成功',
              })
            }

            that.queryRecord("0"); //待审批
            // 当点击确定按钮后，将拒绝原因清空
            that.setData({
              description:'',
            })
          } else {
            // 当另外管理者同意已审核的预约时，返回data为false
            wx.showToast({
              title: '该预约已被审核',
            })
          }
        },
        function(error) {
          wx.showToast({
            title: '操作失败',
          })
          wx.hideLoading();
        }
      );
    },

    bindDesInput:function(e){
      this.setData({
        description: e.detail.value,
      })
    },

    //同意申请
    clickagreeApply: function(e) {
      var id = e.currentTarget.dataset.agreeapplyid;
      this.setData({
        leaseId: id,
        hiddenmodalagree: false,
      })
    },

    //拒绝申请
    refuseApply: function(e) {
      var id = e.currentTarget.dataset.agreeapplyid;
      this.setData({
        leaseId: id,
        hiddenmodalrefuse: false,
      })
    },


    //取消拒绝申请
    onTapCancelrefuse() {
      this.setData({
        hiddenmodalrefuse: true,
      })
    },
    //确定拒绝申请
    onTapConfirmrefuse() {
      this.setData({
        hiddenmodalrefuse: true,
      }, () => {
        this.handleApply(2)
      })
    },

    //取消同意申请
    onTapCancelagree() {
      this.setData({
        hiddenmodalagree: true,
      })
    },
    //确定确定申请
    onTapConfirmagree() {
      this.setData({
        hiddenmodalagree: true,
      }, () => {
        this.handleApply(1)
      })

    },


    indexChanged: function(e) {
      // 点中的是组中第个元素
      var that = this;
      var index = e.target.dataset.index;
      // 读取原始的数组
      var radioValues = this.data.radioValues;
      for (var i = 0; i < radioValues.length; i++) {
        // 全部改为非选中
        radioValues[i].selected = false;
        // 当前那个改为选中
        radioValues[index].selected = true;

      }
      if (index == 0) {
        this.queryRecord(0); //待审批
      }
      if (index == 1) {
        this.queryRecord(3); //已审批
      }

      if (index == 2) {
        that.queryRecord(); //我的预约
      }
      // 写回数据
      this.setData({
        radioValues: radioValues
      });

      // clazz状态
      this.clazzStatus();
    },

    clazzStatus: function() {
      /* 此方法分别被加载时调用，点击某段时调用 */
      // class样式表如"selected last","selected"
      var clazz = [];
      // 参照数据源
      var radioValues = this.data.radioValues;
      for (var i = 0; i < radioValues.length; i++) {
        // 默认为空串，即普通按钮
        var cls = '';
        // 高亮，追回selected
        if (radioValues[i].selected) {
          cls += 'selected ';
        }
        // 最后个元素, 追加last
        if (i == radioValues.length - 1) {
          cls += 'last ';
        }
        //去掉尾部空格
        cls = cls.replace(/(\s*$)/g, '');
        clazz[i] = cls;
      }
      // 写回数据
      this.setData({
        clazz: clazz
      });
    },
  }
})