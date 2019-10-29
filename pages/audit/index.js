// pages/qrCode/orderDetail/index.js
var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    modalTitle: "拒绝原因",
    rejectReason: null,

    appyDetail: null,
    status: null, // unaudited 未审核，  reject 拒绝 , agree 通过
    showDetail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      bizInsId: options.bizInsId,
      userId: options.userId
    }, () => {
      this.getApplyDetail();
    })
  },

  onHide: function() {
    
   
  },

  getApplyDetail: function() {
    wx.showLoading({
      title: '请稍等...',
    })
    var that = this;
    var conf = {
      method: "GET",
      params: {
        bizInsId: that.data.bizInsId,
        userId: that.data.userId
      }
    };
    NetworkService.call("applyDetail", conf,
      function(res) {
        wx.hideLoading();
        if (res && res.code == 0) {
          res.data.startTime = util.dateFtt("MM-dd hh:mm", res.data.startTime);
          res.data.endTime = util.dateFtttt("hh:mm", res.data.endTime);
          var status;
          switch (res.data.status) {
            case 0:
              status = "unaudited";
              break;
            case 1:
              status = "agree";
              break;
            case 2:
              status = "reject";
              break;
          }
          that.setData({
            showDetail: true,
            appyDetail: res.data,
            status: status
          })
        }
        if (res && res.code == 12132){
          //该预约已被取消
          that.setData({
            showDetail: false,
          })
        }
      },
      function(error) {
        wx.hideLoading();
        wx.showToast({
          title: '请求网络失败',
        })
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

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

  // 同意申请
  tapBtnRight: function(e) {
    this.doAudit(1)
  },

  // 拒绝申请
  tapBtnLeft: function(e) {
    this.setData({
      hiddenmodalput: false,
    })
  },
  //拒绝原因-取消
  onTapCancel: function(e) {
    this.setData({
      hiddenmodalput: true,
    })
  },

  //拒绝原因-确认
  onTapReject: function(e) {
    this.doAudit(2, this.data.rejectReason)
  },

  doAudit(type, reason) {
    //type  1：通过，2: 不通过
    wx.showLoading({
      title: '请稍等...',
    })
    var that = this;
    var conf = {
      method: "POST",
      params: {
        bizInsId: that.data.bizInsId,
        userId: that.data.userId,
        auditStatus: type,
        auditRemark: reason, //拒绝原因
      }
    };
    NetworkService.call("applyAudit", conf,
      function(res) {
        wx.hideLoading();
        if (res && res.code == 0) {
          if (type == 1) {
            that.setData({
              status: "agree"
            })
          }
          if (type == 2) {
            that.setData({
              status: "reject",
              hiddenmodalput: true,
            })
          }
        }
      },
      function(error) {
        wx.hideLoading();
        var tips = error ? (error.message + '') : '失败'
        wx.showToast({
          title: tips
        })
      }
    );
  },
  //拒绝信息获取
  descriptionInput: function(e) {
    this.setData({
      rejectReason: e.detail.value,
    })
  },

})