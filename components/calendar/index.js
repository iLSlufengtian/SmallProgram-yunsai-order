var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
import {getFestivals } from './festival'
var timer; 
Component({
  properties: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    date:{
      type: String //日期
    },
    roomtype:{
      type:String// large  small 两种
    },
  },

  data: {
    weekStr: ['日', '一', '二', '三', '四', '五', '六'],
    dateList: [],
    maxMonth: 17, //最多渲染月数
    sFtv: getFestivals(),
  },
  attached: function() {
    this.createDateListData();
  },
  
  methods: {
    onTapBack:function(){
      this.triggerEvent('myevent', null)
    },
    createDateListData: function() {
      var dateList = [];
      var now = new Date();
      /*
        设置日期为 年-月-01,否则可能会出现跨月的问题
        比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
          原因是由于2月份没有31号，顺推下去变成了了03-03
      */
      try {
        now = new Date(now.getFullYear(), now.getMonth(), 1);
        for (var i = 0; i < this.data.maxMonth; i++) {
          var momentDate = Moment(now).add(this.data.maxMonth - (this.data.maxMonth - i), 'month').date;
          var year = momentDate.getFullYear();
          var month = momentDate.getMonth() + 1;

          var days = [];
          var totalDay = this.getTotalDayByMonth(year, month);
          var week = this.getWeek(year, month, 1);
          //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
          //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
          for (var j = -week + 1; j <= totalDay; j++) {
            var tempWeek = -1;
            if (j > 0)
              tempWeek = this.getWeek(year, month, j);
            var clazz = '';
            if (tempWeek == 0 || tempWeek == 6)
              clazz = 'week'
            if (j < DATE_DAY && year == DATE_YEAR && month == DATE_MONTH)
              //当天之前的日期不可用
              clazz = 'unavailable ' + clazz;
            else
              clazz = '' + clazz
            days.push({
              day: j,
              class: clazz
            })
          }
          var dateItem = {
            id: year + '-' + month,
            year: year,
            month: month,
            days: days
          }

          dateList.push(dateItem);
        }
        var sFtv = this.data.sFtv;
        var date = this.properties.date;

        var current = date.split("-");

        for (let i = 0; i < dateList.length; i++) { 
           //加入公历节日
          // for (let k = 0; k < sFtv.length; k++) {
          //   if (dateList[i].month == sFtv[k].month) {
          //     let days = dateList[i].days;
          //     for (let j = 0; j < days.length; j++) {
          //       if (days[j].day == sFtv[k].day) {
          //         days[j].daytext = sFtv[k].name
          //       }
          //     }
          //   }
          // }

          //判断选中日期
          if (dateList[i].year == current[0] && dateList[i].month == current[1]){
            let days = dateList[i].days;
            for (let g = 0; g < days.length; g++) {
              if (days[g].day == current[2]) {
                days[g].selected = true;
              }

            }
          }

          //置灰今天之前的日期
          if (dateList[i].month == DATE_MONTH && dateList[i].year == DATE_YEAR){
            for (let k = 0; k < dateList[i].days.length; k++) {
              if (dateList[i].days[k].day == DATE_DAY) {
                dateList[i].days[k].daytext="今天";
              }
              if (dateList[i].days[k].day < DATE_DAY) {
                dateList[i].days[k].gray =true
              }
            }
          }
        }
      } catch (exception) {
        let a = 100;
      }
      this.setData({
        dateList: dateList
      });
      DATE_LIST = dateList;
    },
    /*
     * 获取月的总天数
     */
    getTotalDayByMonth: function(year, month) {
      month = parseInt(month, 10);
      var d = new Date(year, month, 0);
      return d.getDate();
    },
    /*
     * 获取月的第一天是星期几
     */
    getWeek: function(year, month, day) {
      var d = new Date(year, month - 1, day);
      return d.getDay();
    },

    onPressDate: function (e) {
      var that=this;
      var { year, month, day } = e.currentTarget.dataset;
      //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
      if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0) return;

      var tempMonth = month;
      var tempDay = day;

      if (month < 10) tempMonth = '0' + month
      if (day < 10) tempDay = '0' + day
      var date = year + '-' + tempMonth + '-' + tempDay;
      var arr = that.data.dateList;
      //渲染点击样式
      for (var i = 0; i < arr.length; i++) {
        var dateItem = arr[i];
        var id = dateItem.id;
        var days = dateItem.days;

        if (id === year + '-' + month) {
          for (var j = 0; j < days.length; j++) {
            if (days[j].day == day) {
              arr[i].days[j].selected = true;
            }else{
              arr[i].days[j].selected = false;
            }
          }
        }else{
          for (var j = 0; j < days.length; j++) {
              arr[i].days[j].selected = false;
          }
        }
      }
      that.setData({
        dateList: arr
      });

      timer = setTimeout(function () {
        that.triggerEvent('myevent', {date: date})
      }, 300);
    },
  }
})