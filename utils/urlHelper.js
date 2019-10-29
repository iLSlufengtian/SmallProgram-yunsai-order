var util = require('./util.js');

const appConfig = {
  // DOMAIN: 'http://40.73.40.158:8901/api/v2/secure/',//测试版地址
  //DOMAIN: 'http://192.168.43.180:8901/api/v2/', //测试版地址
  // DOMAIN: 'https://ilab.implementation.ilabservice.com/api/v2/secure/',//正式版地址
  // DOMAIN:'https://janssen.docker.ilabservice.cloud/api/v2/',
  DOMAIN:'https://janssen.wechat.ilabservice.com/yskj/api/v2/',
};

const urlMap = {
  "login": "unsecure/login", //登录 POST
  "listRooms": "secure/customer/monitor_target_lab_device", //房间列表
  "handleApply": "secure/customer/monitor_target_lab_device/audit/lease/{id}", //审核通过 1,同意，2拒绝
  //"login":"/unsecure/customer/verify/verification/{code}/purpose/{purpose}", //登录 POST
  "queryRecord": "secure/customer/monitor_target_lab_device/lease", //新增查询所有预约记录的API GET
  "checkRecord": "secure/customer/monitor_target_lab_device/{id}/lease/{leaseId}", //管理员权限 审核预约记录 PUT
  "sendCode": "unsecure/customer/send/verification",//新增发送手机验证码 POST
  "customerVerify": "unsecure/customer/verify/verification/{code}", //验证手机号与验证码 // POST
  "me": "secure/customer/me", //查询个人信息 GET
  "cancelRecord": "secure/customer/monitor_target_lab_device/{id}/lease/{leaseId}", //取消预约记录 DELETE
  "getRoomDetail": "secure/customer/monitor_target_lab_device/{id}/lease/occupied/time", //查询制订房间预约情况 get
  "orderRoom": "secure/customer/monitor_target_lab_device/{id}/lease", //申请预约时间 post
  "queryRooms": "secure/customer/lab_device/lease/condition/null/relationship/null/start/{startTime}/end/{endTime}", //查询某时间段可租赁的房间
  "applyDetail": "unsecure/customer/audit/info", //审核之前，查询预约详情的接口 get
  "applyAudit": "unsecure/customer/audit/action", //:审核通过或者不通过 post 
  "getQrcode": "unsecure/customer/audit/result", //审核通过详情页面 get
  "uploadHeadImg": "secure/customer/me/avatar", //上传头像 post
  "getKey":"unsecure/wechat/yskj/key",//获取key
};
const urlHelper = {
  getUrlWithParams: (key, params) => {
    var url = appConfig.DOMAIN + urlMap[key];

    var paramStr = '';
    if (params) {
      paramStr = util.toQueryString(params);
      paramStr = ((url.indexOf('?') > -1) ?
        '&' :
        '?') + paramStr;
    }
    return url + paramStr;
  },


  getUrl: (key) => {
    let url = urlMap[key];
    return appConfig.DOMAIN + url;
  },
  getTrueUrl: (url) => {
    return appConfig.DOMAIN + url;
  },

  getSprWithParams: (key, params) => {
    var url = urlMap[key];

    var paramStr = '';
    if (params) {
      paramStr = util.toQuerySpring(params, url);
    }
    var sd = appConfig.DOMAIN + paramStr;
    return sd
  },

  replaceWithParams: (key, params) => {
    var url = urlMap[key];
    var paramStr = '';
    if (params) {
      paramStr = util.toRelpaceSpring(params, url);
    }
    var sd = appConfig.DOMAIN + paramStr;
    return sd
  },

  getBaseDomain: () => {
    return appConfig.DOMAIN;
  },

}
module.exports = urlHelper;