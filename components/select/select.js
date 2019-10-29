// components/select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    },
    propArray: {
      type: Array,
    },
    sWidth: {
      type: Number // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    },
    sHeight: {
      type: Number // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    },
    multiple: {
      type: Boolean
    },
    borderColor: {
      type: String,
      value: '#efefef',
    },
    textColor: {
      type: String,
      value: '#3e3e3e',
    },
    showFirst: {
      type: Boolean, //显示第一个值
    },
    firstValueId:{
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false, //初始option不显示
    nowText: "请选择", //初始内容
    animationData: {}, //右边箭头的动画
    ids: [],
    propArray: [],
  },
  ready: function() {
    var saks = this.properties.sWidth;
    var ss = this.properties.sHeight;
    var arr = this.properties.propArray;

    if (this.properties.showFirst==true && this.properties.firstValueId !=null) {
      var idx=null;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == this.properties.firstValueId) {
          idx = i;
          this.setData({
            nowText: arr[i].text,
            id: [arr[i].id],
          });
        }
      }
      if(idx !=null) {
        arr.splice(idx, 1);
        this.setData({
          propArray: arr,
        });
      }
    } else {
      this.setData({
        propArray: arr
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getIds: function() {
      return this.data.ids;
    },

    //option的显示与否
    selectToggle: function() {
      var nowShow = this.data.selectShow; //获取当前option显示的状态
      //创建动画
      var animation = wx.createAnimation({
        timingFunction: "ease"
      })
      this.animation = animation;
      if (nowShow) {
        animation.rotate(0).step();
        this.setData({
          animationData: animation.export()
        })
      } else {
        animation.rotate(180).step();
        this.setData({
          animationData: animation.export()
        })
      }
      this.setData({
        selectShow: !nowShow
      })
    },
    //设置内容
    setText: function(e) {
      var nowData = this.data.propArray; //当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
      var nowIdx = e.target.dataset.index; //当前点击的索引
      var ids = this.data.ids;
      var nowText = this.data.nowText;
      if (this.properties.multiple) {
        if (nowText == "请选择") {
          nowText = nowData[nowIdx].text
          ids.push(nowData[nowIdx].id);

          nowData[nowIdx].checked = true;
        } else {
          var index = ids.indexOf(nowData[nowIdx].id);
          if (index != -1) {
            //已经含有
            ids.splice(index, 1);
            nowData[nowIdx].checked = false;

            nowText = null;
            for (var i = 0; i < nowData.length; i++) {
              if (nowData[i].checked) {
                if (nowText) {
                  nowText = nowText + "," + nowData[i].text
                } else {
                  nowText = nowData[i].text
                }
              }
            }
            if (!nowText) {
              nowText = "请选择"
            }
          } else {
            //不含有
            ids.push(nowData[nowIdx].id);
            nowData[nowIdx].checked = true;
            nowText = nowText + "," + nowData[nowIdx].text
          }
        }
      } else {
        nowText = nowData[nowIdx].text; //当前点击的内容
        ids = [nowData[nowIdx].id];
      }
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      this.animation.rotate(0).step();
      this.setData({
        selectShow: false,
        propArray: nowData,
        nowText: nowText,
        ids: ids,
        animationData: this.animation.export()
      })

      this.triggerEvent('selectEvent', {
        ids: ids
      }) //myevent自定义名称事件，父组件中使用
    },

  }
})