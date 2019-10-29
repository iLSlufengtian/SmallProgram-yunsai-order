var app = getApp();
var util = require('./util.js');
import urlHelper from "./urlHelper.js"
var token = wx.getStorageSync('token');

const DEFAULT_REQUEST_CONF = {
  url: "",
  trueUrl: null,
  urlParams: false, //用来对付url中间有参数
  params: null,
  method: "GET",
  isForm: false,
};

function call(urlKey, conf, doSuccess, doFail) {
  //对token进行处理
  if (!token) {
    token = wx.getStorageSync('token');
  }
  //对method进行处理
  let method = ((conf && conf.method) || 'GET').toUpperCase();
  //对url进行处理
  var url, params;
  if (method === 'GET' || method === 'DELETE') {
    if (conf && conf.trueUrl) {
      //传过来的地址不需特殊处理
      url = urlHelper.getTrueUrl(urlKey);
    } else {
      if (conf && conf.params) {
        if (conf.urlParams == true) {
          //拼接方式不一样了，地址里面不用添加参数名，直接添加参数值
          url = urlHelper.getSprWithParams(urlKey, conf.params);
        } else {
          url = urlHelper.getUrlWithParams(urlKey, conf.params);
        }
      } else {
        url = urlHelper.getUrl(urlKey);
      }
    }
    params = null;
  } else if (method === 'POST' || method === 'PUT') {
    if (conf.trueUrl) {
      //传过来的地址不需特殊处理
      url = urlHelper.getTrueUrl(urlKey);
    } else {
      if (conf.urlParams == true) {
        url = urlHelper.replaceWithParams(urlKey, conf.params);
      } else {
        url = urlHelper.getUrl(urlKey);
      }
    }
    params = conf.params;
    if (conf.isForm) {
      params = util.json2Form(conf.params);
    }
  }
  //对header进行处理
  var header = {
    "content-type": "application/json;charset=UTF-8",
    "Cache-Control": "no-cache",
    "X-Authorization": "Bearer " + token,
    "x-language": "chinese"
  }
  if (conf && conf.isForm) {
    header["content-type"] = "application/x-www-form-urlencoded"
  }

  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: url,
    header: header,
    data: params,
    method: method,
    success: function(res) {
      console.log(url);
      console.log(res.data);
      //参数值为res.data,直接将返回的数据传入
      if (res.statusCode == "200") {
        doSuccess(res.data);
      } else {
        doFail(res);
      }

      // if (res.statusCode == "401") {
      //   wx.redirectTo({
      //     url: "/pages/login/login"
      //   })
      // }

    },
    fail: function() {
      doFail();
    },
  })
}

const DEFAULT_UPLOAD_CONF = {
  trueUrl: true,
  url: "",
  filePath: "filePath",
  name: 'image',
  formData: {
    'type': "type",
    'description': "上传检测记录"
  }
};

//上传文件，图片等等
function uploadFile(conf, doSuccess, doFail) {
  console.log(token)
  if (!token) {
    token = wx.getStorageSync('token');
    console.log(token)
  }
  let url;
  if (conf.trueUrl) {
    //传过来的地址不需特殊处理
    url = urlHelper.getTrueUrl(conf.url);
  } else {
    url = urlHelper.getUrl(conf.url);
  };
  wx.uploadFile({
    url: url,
    filePath: conf.filePath,
    // name: conf.name,
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data",
      "X-Authorization": "Bearer " + token,
      "x-language": "chinese"
    },
    formData: conf.formData,
    success: function(res) {
      var jsonObj = JSON.parse(res.data);
      console.log("url==" + url);
      console.log("res==" + res.data);

      if (jsonObj.code == 0) {
        doSuccess(jsonObj);
      } else {
        doFail(jsonObj);
      }
    },
    fail: function(e) {
      console.log(e);
      doFail(e);
    },
    complete: function() {
      console.log("uploadFile--complete");
    }
  })
}

function setToken(tokenK) {
  token = tokenK
}

function getToken() {
  return token;
}

/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js")  加载
 * 在引入引入文件的时候"  "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */
module.exports.call = call;
module.exports.uploadFile = uploadFile;
module.exports.setToken = setToken;
module.exports.getToken = getToken;