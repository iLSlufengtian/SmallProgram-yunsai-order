// pages/mine/aboutus/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email:'',
    startData:'请选择开始日期',
    endData:"请选择结束日期"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  bindEmailInput(e) {
    var val = e.detail.value;
    this.setData({
      email: e.detail.value
    })
  },

  bindStartDateChange(e){
    var val = e.detail.value;
    this.setData({
      startData:e.detail.value
    })
  },

  bindEndDateChange(e) {
    var val = e.detail.value;
    this.setData({
      endData: e.detail.value
    })
  },

  apply:function(){

    if(this.data.email===''){
      wx.showToast({
        title: '邮箱不能为空',
      })
    } else if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.data.email))){
      wx.showToast({
        title: '邮箱格式有误',
      })
      }else if(this.data.startData==='请选择开始日期'){
      wx.showToast({
        title: '请选择开始日期',
      })
    }else if(this.data.endData==='请选择结束日期'){
      wx.showToast({
        title: '请选择结束日期',
      })
    }else if (this.data.startData < this.data.endData){
      wx.showToast({
        title: '提交申请成功',
      })
    }else{
      wx.showToast({
        title: '提交申请失败！',
      })
    }
  },
})