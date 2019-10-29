const app = getApp()
var NetworkService = require("../../../utils/NetworkService.js")
var util = require("../../../utils/util.js")
import urlHelper from "../../../utils/urlHelper.js"
Page({
  data: {
    marginHeight: getApp().globalData.statusBarHeight + 96,
   
  },
  onReady: function() {

  },

  onLoad: function(options) {
  

  },

  onShow() {

  },
  onTapMsg:function(){

  },

  bindAccountInput: function(e) {
    var that = this
    that.setData({
      userName: e.detail.value
    })
  },
  bindCompanyInput: function(e) {
    var that = this
    that.setData({
      company: e.detail.value
    })
  },
  bindHaoInput: function(e) {
    var that = this
    that.setData({
      hao: e.detail.value
    })
  },
  bindPoneInput: function(e) {
    var that = this
    that.setData({
      phone: e.detail.value
    })
  },


})