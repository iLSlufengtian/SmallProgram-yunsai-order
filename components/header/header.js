
Component({
  properties: {
    title: {
      type: String // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    },
    showBack: {
      type: Boolean
    },
    roleName: {
      type: String //判断来源
    }

    
  },
  data: {
    statusbarHieght: getApp().globalData.statusBarHeight

  },

  attached: function() {


  },
  methods: {
    backAction: function(type) {
      // var params = {
      //   value:12,
      //   type:"shit"
      // }
      //根据需要返回调用执行父组件的方法
      var params=null;
      this.triggerEvent('myevent', params) //myevent自定义名称事件，父组件中使用
     
      wx.navigateBack()
    },
  }

});