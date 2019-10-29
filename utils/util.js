const util = {
  isEmptyArr: (arr) => {
    if (arr && arr.length > 0 && arr != "null") {
      return false;
    }
    return true;
  },
  //时间格式化 yyyy-MM-dd hh:mm:ss变成long
  ftTimeLong(str) {
    if (!str) {
      return ""
    }
    var val = Date.parse(str);
    return new Date(val).getTime();;
  },


  /**
   * 时间格式化处理
   * MM/dd
   */
  dateFt: (fmt, long) => {
    var date = new Date(long);
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    date = null;
    return fmt;
  },

  /**
   * 时间格式化处理
   * MM-dd hh:mm
   */
  dateFtt: (fmt, long) => {
    if (!long) {
      return "";
    }
    var date = new Date(long); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var str = M + D + h + m;
    return str;
  },
  /**
   * 时间格式化处理
   * yyyy-MM-dd hh:mm:ss
   */
  dateFttt: (fmt, long) => {
    if (!long) {
      return "";
    }
    var date = new Date(long); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    // var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    // return Y + M + D + h + m + s;
    return Y + M + D + h + m;
  },

  /**
   * 时间格式化处理
   * hh:mm
   */
  dateFtttt: (fmt, long) => {
    var date = new Date(long);
    var sd = parseInt(date.getHours()); //小时
    var mm = date.getMinutes();
    if (mm == 0) {
      return sd + ":00"
    }
    if (mm < 10) {
      return sd + ":0" + mm
    }
    return sd + ":" + mm
  },
  
  /**
   * 时间格式化处理
   * yyy-MM-dd
   */
  dateFtp: (fmt, long) => {
    var date = new Date(long);
    var mm = date.getMonth() + 1 + "";
    var dd = date.getDate() + "";
    if (mm.length == 1) {
      mm = "0" + mm
    }
    if (dd.length == 1) {
      dd = "0" + dd
    }
    return date.getFullYear() + "/" + mm + "/" + dd
  },

 /**
   *获取今天
   * yyy-MM-dd
   */
  getToday:() => {
    var date = new Date();
    var mm = date.getMonth() + 1 + "";
    var dd = date.getDate() + "";
    if (mm.length == 1) {
      mm = "0" + mm
    }
    if (dd.length == 1) {
      dd = "0" + dd
    }
    return date.getFullYear() + "/" + mm + "/" + dd
  },

 /**
   *获取现在
   * hh:mm
   */
  getnow:()=>{
    var date = new Date();
    var sd = parseInt(date.getHours()); //小时
    var mm = date.getMinutes();
    if (mm == 0) {
      return sd + ":00"
    }
    return sd + ":" + mm
  },

  json2Form: (json) => {
    var str = [];
    for (var p in json) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
  },

  toQueryString: (obj) => {
    return obj ?
      Object.keys(obj).map(function(key) {
        // Object.keys(obj).sort().map(function (key) {
        var val = obj[key];
        if (Array.isArray(val)) {
          // return val.sort().map(function (val2) {
          return val.map(function(val2) {
            // return encodeURIComponent(key) + '=' + encodeURIComponent(util.NVL(val2, ''));
            return key + '=' + util.NVL(val2, '');
          }).join('&');
        }

        // return encodeURIComponent(key) + '=' + encodeURIComponent(util.NVL(val, ''));
        return key + '=' + util.NVL(val, '');
      }).join('&') :
      '';
  },

  NVL: function(str, def) {
    if (str === undefined || str === null) {
      return def;
    }
    return str;
  },

  toQuerySpring: (obj, url) => {
    var res = url;
    obj ? Object.keys(obj)
      .map(function(key) {
        var val = obj[key];
        var sd = "{" + key + "}";
        var index = res.indexOf(sd);
        if (index != -1) { //包含
          res = res.replace(sd, encodeURIComponent(val));
        } else {
          if (res.indexOf('?') > -1){
            res = res + "&" + key + "=" + val
          }else{
            res = res + "?" + key + "=" + val
          }
        }
      }) : '';
    return res;
  },

  toRelpaceSpring: (obj, url) => {
    var res = url;
    obj ? Object.keys(obj)
      .map(function (key) {
        var val = obj[key];
        var sd = "{" + key + "}";
        var index = res.indexOf(sd);
        if (index != -1) { //包含
          res = res.replace(sd, encodeURIComponent(val));
        }
      }) : '';
    return res;
  },

}
module.exports = util;