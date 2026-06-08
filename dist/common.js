"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["common"],{

/***/ "./src/services/feishu.ts":
/*!********************************!*\
  !*** ./src/services/feishu.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "REWARD_CONFIGS": function() { return /* binding */ REWARD_CONFIGS; },
/* harmony export */   "createUser": function() { return /* binding */ createUser; },
/* harmony export */   "fetchMyPrograms": function() { return /* binding */ fetchMyPrograms; },
/* harmony export */   "fetchPrograms": function() { return /* binding */ fetchPrograms; },
/* harmony export */   "fetchTodayStats": function() { return /* binding */ fetchTodayStats; },
/* harmony export */   "fetchTransactions": function() { return /* binding */ fetchTransactions; },
/* harmony export */   "fetchUserInfo": function() { return /* binding */ fetchUserInfo; },
/* harmony export */   "recordVisit": function() { return /* binding */ recordVisit; },
/* harmony export */   "redeemReward": function() { return /* binding */ redeemReward; },
/* harmony export */   "signIn": function() { return /* binding */ signIn; },
/* harmony export */   "submitProgram": function() { return /* binding */ submitProgram; },
/* harmony export */   "watchAdReward": function() { return /* binding */ watchAdReward; }
/* harmony export */ });
/* unused harmony exports checkUserSubmitted, redeemRankingBoost, updateUserInfo, fetchRecentStats, createTransaction, createRedemption, verifyRedemptionCode, useRedemptionCode */
/* harmony import */ var C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/taro */ "./node_modules/@tarojs/taro/index.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_feishu_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/config/feishu.json */ "./src/config/feishu.json");







var FEISHU_CONFIG = _config_feishu_json__WEBPACK_IMPORTED_MODULE_1__.feishu;
var FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';
var accessToken = '';
var tokenExpireAt = 0;

// ============================================
// 基础请求
// ============================================
function getAccessToken() {
  return _getAccessToken.apply(this, arguments);
}
function _getAccessToken() {
  _getAccessToken = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee() {
    var _res$data;
    var res;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(accessToken && Date.now() < tokenExpireAt)) {
            _context.n = 1;
            break;
          }
          return _context.a(2, accessToken);
        case 1:
          _context.n = 2;
          return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().request({
            url: "".concat(FEISHU_API_BASE, "/auth/v3/tenant_access_token/internal"),
            method: 'POST',
            data: {
              app_id: FEISHU_CONFIG.appId,
              app_secret: FEISHU_CONFIG.appSecret
            },
            header: {
              'Content-Type': 'application/json'
            }
          });
        case 2:
          res = _context.v;
          if (!(((_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.code) === 0)) {
            _context.n = 3;
            break;
          }
          accessToken = res.data.tenant_access_token;
          tokenExpireAt = Date.now() + (res.data.expire - 300) * 1000;
          return _context.a(2, accessToken);
        case 3:
          throw new Error('获取飞书凭证失败');
        case 4:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _getAccessToken.apply(this, arguments);
}
function feishuRequest(_x) {
  return _feishuRequest.apply(this, arguments);
} // ============================================
// 小程序/公众号 API
// ============================================
/** 获取排名列表（支持筛选和搜索） */
function _feishuRequest() {
  _feishuRequest = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee2(options) {
    var _res$data2;
    var token, res, _res$data3;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return getAccessToken();
        case 1:
          token = _context2.v;
          _context2.n = 2;
          return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().request({
            url: "".concat(FEISHU_API_BASE).concat(options.path),
            method: options.method,
            data: options.data,
            header: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(token)
            }
          });
        case 2:
          res = _context2.v;
          if (!(((_res$data2 = res.data) === null || _res$data2 === void 0 ? void 0 : _res$data2.code) !== 0)) {
            _context2.n = 3;
            break;
          }
          console.error('[Feishu] API error:', res.data);
          throw new Error(((_res$data3 = res.data) === null || _res$data3 === void 0 ? void 0 : _res$data3.msg) || '飞书 API 请求失败');
        case 3:
          return _context2.a(2, res.data);
      }
    }, _callee2);
  }));
  return _feishuRequest.apply(this, arguments);
}
function fetchPrograms(_x2, _x3) {
  return _fetchPrograms.apply(this, arguments);
}

/** 检查用户是否已提交某类型 */
function _fetchPrograms() {
  _fetchPrograms = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee3(filter, search) {
    var _res$data4, filterParts, kw, filterStr, path, res, records, programs, _t;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          filterParts = [];
          if (filter && filter !== 'all') {
            filterParts.push("CurrentValue.[\u7C7B\u578B] = \"".concat(filter, "\""));
          }
          if (search && search.trim()) {
            kw = search.trim();
            filterParts.push("OR(CurrentValue.[\u540D\u79F0].Contains(\"".concat(kw, "\"),CurrentValue.[\u63CF\u8FF0].Contains(\"").concat(kw, "\"),CurrentValue.[\u63D0\u4EA4\u8005\u540D\u79F0].Contains(\"").concat(kw, "\"))"));
          }
          filterStr = filterParts.length > 0 ? filterParts.join(' AND ') : '';
          path = "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.programs, "/records").concat(filterStr ? "?filter=".concat(encodeURIComponent(filterStr)) : '');
          _context3.n = 1;
          return feishuRequest({
            method: 'GET',
            path: path
          });
        case 1:
          res = _context3.v;
          records = (res === null || res === void 0 || (_res$data4 = res.data) === null || _res$data4 === void 0 ? void 0 : _res$data4.items) || [];
          programs = records.map(mapRecordToProgram); // 排序：置顶优先，然后按创建时间倒序（新提交排前面）
          programs.sort(function (a, b) {
            if (a.isTop && !b.isTop) return -1;
            if (!a.isTop && b.isTop) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          return _context3.a(2, programs.map(function (p, i) {
            return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_4__["default"])((0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_4__["default"])({}, p), {}, {
              ranking: i + 1
            });
          }));
        case 2:
          _context3.p = 2;
          _t = _context3.v;
          console.error('[Feishu] Fetch programs error:', _t);
          return _context3.a(2, []);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return _fetchPrograms.apply(this, arguments);
}
function checkUserSubmitted(_x4, _x5) {
  return _checkUserSubmitted.apply(this, arguments);
}

/** 提交小程序/公众号（每人每类型只能提交一个） */
function _checkUserSubmitted() {
  _checkUserSubmitted = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee4(openid, type) {
    var _res$data5, filter, res, records, _t2;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          filter = "AND(CurrentValue.[\u63D0\u4EA4\u8005] = \"".concat(openid, "\", CurrentValue.[\u7C7B\u578B] = \"").concat(type, "\")");
          _context4.n = 1;
          return feishuRequest({
            method: 'GET',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.programs, "/records?filter=").concat(encodeURIComponent(filter))
          });
        case 1:
          res = _context4.v;
          records = (res === null || res === void 0 || (_res$data5 = res.data) === null || _res$data5 === void 0 ? void 0 : _res$data5.items) || [];
          return _context4.a(2, records.length > 0);
        case 2:
          _context4.p = 2;
          _t2 = _context4.v;
          console.error('[Feishu] Check user submitted error:', _t2);
          return _context4.a(2, false);
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return _checkUserSubmitted.apply(this, arguments);
}
function submitProgram(_x6) {
  return _submitProgram.apply(this, arguments);
}

/** 获取我提交的小程序 */
function _submitProgram() {
  _submitProgram = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee5(data) {
    var alreadySubmitted, typeLabel, _t3;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _context5.n = 1;
          return checkUserSubmitted(data.ownerOpenid, data.type);
        case 1:
          alreadySubmitted = _context5.v;
          if (!alreadySubmitted) {
            _context5.n = 2;
            break;
          }
          typeLabel = data.type === 'miniapp' ? '小程序' : '公众号';
          return _context5.a(2, {
            success: false,
            message: "\u4F60\u5DF2\u63D0\u4EA4\u8FC7".concat(typeLabel, "\uFF0C\u6BCF\u79CD\u7C7B\u578B\u53EA\u80FD\u63D0\u4EA4\u4E00\u4E2A")
          });
        case 2:
          _context5.n = 3;
          return feishuRequest({
            method: 'POST',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.programs, "/records"),
            data: {
              fields: {
                '名称': data.name,
                '类型': data.type,
                '描述': data.description,
                '提交者': data.ownerOpenid,
                '提交者名称': data.ownerName,
                '是否置顶': false,
                '创建时间': Date.now()
              }
            }
          });
        case 3:
          return _context5.a(2, {
            success: true
          });
        case 4:
          _context5.p = 4;
          _t3 = _context5.v;
          console.error('[Feishu] Submit program error:', _t3);
          return _context5.a(2, {
            success: false,
            message: '提交失败，请重试'
          });
      }
    }, _callee5, null, [[0, 4]]);
  }));
  return _submitProgram.apply(this, arguments);
}
function fetchMyPrograms(_x7) {
  return _fetchMyPrograms.apply(this, arguments);
}

/** 兑换排名置顶 */
function _fetchMyPrograms() {
  _fetchMyPrograms = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee6(openid) {
    var _res$data6, res, records, programs, _t4;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _context6.n = 1;
          return feishuRequest({
            method: 'GET',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.programs, "/records?filter=").concat(encodeURIComponent("CurrentValue.[\u63D0\u4EA4\u8005] = \"".concat(openid, "\"")))
          });
        case 1:
          res = _context6.v;
          records = (res === null || res === void 0 || (_res$data6 = res.data) === null || _res$data6 === void 0 ? void 0 : _res$data6.items) || [];
          programs = records.map(mapRecordToProgram);
          programs.sort(function (a, b) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          return _context6.a(2, programs.map(function (p, i) {
            return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_4__["default"])((0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_4__["default"])({}, p), {}, {
              ranking: i + 1
            });
          }));
        case 2:
          _context6.p = 2;
          _t4 = _context6.v;
          console.error('[Feishu] Fetch my programs error:', _t4);
          return _context6.a(2, []);
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return _fetchMyPrograms.apply(this, arguments);
}
function redeemRankingBoost(_x8, _x9) {
  return _redeemRankingBoost.apply(this, arguments);
}

// ============================================
// 用户 API
// ============================================

/** 获取用户信息 */
function _redeemRankingBoost() {
  _redeemRankingBoost = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee7(recordId, hours) {
    var _t5;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          _context7.n = 1;
          return feishuRequest({
            method: 'PUT',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.programs, "/records/").concat(recordId),
            data: {
              fields: {
                '是否置顶': true,
                '置顶到期时间': Date.now() + hours * 3600 * 1000
              }
            }
          });
        case 1:
          return _context7.a(2, true);
        case 2:
          _context7.p = 2;
          _t5 = _context7.v;
          console.error('[Feishu] Redeem ranking boost error:', _t5);
          return _context7.a(2, false);
      }
    }, _callee7, null, [[0, 2]]);
  }));
  return _redeemRankingBoost.apply(this, arguments);
}
function fetchUserInfo(_x0) {
  return _fetchUserInfo.apply(this, arguments);
}

/** 创建用户 */
function _fetchUserInfo() {
  _fetchUserInfo = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee8(openid) {
    var _res$data7, res, records, _t6;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return feishuRequest({
            method: 'GET',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.users, "/records?filter=").concat(encodeURIComponent("CurrentValue.[openid] = \"".concat(openid, "\"")))
          });
        case 1:
          res = _context8.v;
          records = (res === null || res === void 0 || (_res$data7 = res.data) === null || _res$data7 === void 0 ? void 0 : _res$data7.items) || [];
          return _context8.a(2, records.length > 0 ? mapRecordToUser(records[0]) : null);
        case 2:
          _context8.p = 2;
          _t6 = _context8.v;
          console.error('[Feishu] Fetch user info error:', _t6);
          return _context8.a(2, null);
      }
    }, _callee8, null, [[0, 2]]);
  }));
  return _fetchUserInfo.apply(this, arguments);
}
function createUser(_x1, _x10, _x11) {
  return _createUser.apply(this, arguments);
}

/** 更新用户信息 */
function _createUser() {
  _createUser = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee9(openid, nickname, avatar) {
    var _t7;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          _context9.n = 1;
          return feishuRequest({
            method: 'POST',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.users, "/records"),
            data: {
              fields: {
                'openid': openid,
                '昵称': nickname || '新用户',
                '头像': avatar || '',
                '星尘余额': 0,
                '签到日期': '',
                '创建时间': Date.now()
              }
            }
          });
        case 1:
          return _context9.a(2, fetchUserInfo(openid));
        case 2:
          _context9.p = 2;
          _t7 = _context9.v;
          console.error('[Feishu] Create user error:', _t7);
          return _context9.a(2, null);
      }
    }, _callee9, null, [[0, 2]]);
  }));
  return _createUser.apply(this, arguments);
}
function updateUserInfo(_x12, _x13) {
  return _updateUserInfo.apply(this, arguments);
}

// ============================================
// 每日统计 API（核心优化表）
// ============================================

/** 获取用户某天的统计记录 */
function _updateUserInfo() {
  _updateUserInfo = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee0(openid, updates) {
    var _res$data8, res, records, fields, _t8;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          _context0.n = 1;
          return feishuRequest({
            method: 'GET',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.users, "/records?filter=").concat(encodeURIComponent("CurrentValue.[openid] = \"".concat(openid, "\"")))
          });
        case 1:
          res = _context0.v;
          records = (res === null || res === void 0 || (_res$data8 = res.data) === null || _res$data8 === void 0 ? void 0 : _res$data8.items) || [];
          if (!(records.length === 0)) {
            _context0.n = 2;
            break;
          }
          return _context0.a(2, false);
        case 2:
          fields = {};
          if (updates.nickname !== undefined) fields['昵称'] = updates.nickname;
          if (updates.avatar !== undefined) fields['头像'] = updates.avatar;
          if (updates.stardustBalance !== undefined) fields['星尘余额'] = updates.stardustBalance;
          if (updates.signInDates !== undefined) fields['签到日期'] = updates.signInDates.join(',');
          _context0.n = 3;
          return feishuRequest({
            method: 'PUT',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.users, "/records/").concat(records[0].recordId),
            data: {
              fields: fields
            }
          });
        case 3:
          return _context0.a(2, true);
        case 4:
          _context0.p = 4;
          _t8 = _context0.v;
          console.error('[Feishu] Update user info error:', _t8);
          return _context0.a(2, false);
      }
    }, _callee0, null, [[0, 4]]);
  }));
  return _updateUserInfo.apply(this, arguments);
}
function fetchDailyStat(_x14, _x15) {
  return _fetchDailyStat.apply(this, arguments);
}
/** 创建或更新每日统计 */
function _fetchDailyStat() {
  _fetchDailyStat = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee1(openid, date) {
    var _res$data9, filter, res, records, f, _t9;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          _context1.p = 0;
          filter = "AND(CurrentValue.[\u65E5\u671F] = \"".concat(date, "\", CurrentValue.[\u7528\u6237openid] = \"").concat(openid, "\")");
          _context1.n = 1;
          return feishuRequest({
            method: 'GET',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.dailyStats, "/records?filter=").concat(encodeURIComponent(filter))
          });
        case 1:
          res = _context1.v;
          records = (res === null || res === void 0 || (_res$data9 = res.data) === null || _res$data9 === void 0 ? void 0 : _res$data9.items) || [];
          if (!(records.length === 0)) {
            _context1.n = 2;
            break;
          }
          return _context1.a(2, null);
        case 2:
          f = records[0].fields || {};
          return _context1.a(2, {
            recordId: records[0].recordId,
            visits: f['访问次数'] || 0,
            visited: f['被访问次数'] || 0
          });
        case 3:
          _context1.p = 3;
          _t9 = _context1.v;
          console.error('[Feishu] Fetch daily stat error:', _t9);
          return _context1.a(2, null);
      }
    }, _callee1, null, [[0, 3]]);
  }));
  return _fetchDailyStat.apply(this, arguments);
}
function upsertDailyStat(_x16, _x17, _x18) {
  return _upsertDailyStat.apply(this, arguments);
}
/** 获取用户今日统计 */
function _upsertDailyStat() {
  _upsertDailyStat = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee10(openid, date, updates) {
    var existing, fields, _t0;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          _context10.n = 1;
          return fetchDailyStat(openid, date);
        case 1:
          existing = _context10.v;
          if (!existing) {
            _context10.n = 3;
            break;
          }
          fields = {};
          if (updates.visitDelta) fields['访问次数'] = existing.visits + updates.visitDelta;
          if (updates.visitedDelta) fields['被访问次数'] = existing.visited + updates.visitedDelta;
          _context10.n = 2;
          return feishuRequest({
            method: 'PUT',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.dailyStats, "/records/").concat(existing.recordId),
            data: {
              fields: fields
            }
          });
        case 2:
          _context10.n = 4;
          break;
        case 3:
          _context10.n = 4;
          return feishuRequest({
            method: 'POST',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.dailyStats, "/records"),
            data: {
              fields: {
                '日期': date,
                '用户openid': openid,
                '访问次数': updates.visitDelta || 0,
                '被访问次数': updates.visitedDelta || 0
              }
            }
          });
        case 4:
          return _context10.a(2, true);
        case 5:
          _context10.p = 5;
          _t0 = _context10.v;
          console.error('[Feishu] Upsert daily stat error:', _t0);
          return _context10.a(2, false);
      }
    }, _callee10, null, [[0, 5]]);
  }));
  return _upsertDailyStat.apply(this, arguments);
}
function fetchTodayStats(_x19) {
  return _fetchTodayStats.apply(this, arguments);
}

/** 获取用户多日统计（用于"我的"页面展示） */
function _fetchTodayStats() {
  _fetchTodayStats = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee11(openid) {
    var today, stat;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          today = getTodayStr();
          _context11.n = 1;
          return fetchDailyStat(openid, today);
        case 1:
          stat = _context11.v;
          return _context11.a(2, stat ? {
            visits: stat.visits,
            visited: stat.visited
          } : {
            visits: 0,
            visited: 0
          });
      }
    }, _callee11);
  }));
  return _fetchTodayStats.apply(this, arguments);
}
function fetchRecentStats(_x20) {
  return _fetchRecentStats.apply(this, arguments);
}

// ============================================
// 核心业务：访问互助（优化为2次飞书请求）
// ============================================

/**
 * 访问互助 - 点击他人小程序时调用
 * 优化：仅2次飞书请求
 *   1. 更新访问者每日统计 + 星尘余额（并行）
 *   2. 更新被访问者每日统计（并行）
 * 不再单独记录交易，减少请求次数
 */
function _fetchRecentStats() {
  _fetchRecentStats = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee12(openid) {
    var days,
      _res$data0,
      res,
      records,
      stats,
      _args12 = arguments,
      _t1;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          days = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : 7;
          _context12.p = 1;
          _context12.n = 2;
          return feishuRequest({
            method: 'GET',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.dailyStats, "/records?filter=").concat(encodeURIComponent("CurrentValue.[\u7528\u6237openid] = \"".concat(openid, "\"")))
          });
        case 2:
          res = _context12.v;
          records = (res === null || res === void 0 || (_res$data0 = res.data) === null || _res$data0 === void 0 ? void 0 : _res$data0.items) || [];
          stats = records.map(function (r) {
            var f = r.fields || {};
            return {
              date: f['日期'] || '',
              visits: f['访问次数'] || 0,
              visited: f['被访问次数'] || 0
            };
          }).filter(function (s) {
            return s.date;
          }).sort(function (a, b) {
            return b.date.localeCompare(a.date);
          });
          return _context12.a(2, stats.slice(0, days));
        case 3:
          _context12.p = 3;
          _t1 = _context12.v;
          console.error('[Feishu] Fetch recent stats error:', _t1);
          return _context12.a(2, []);
      }
    }, _callee12, null, [[1, 3]]);
  }));
  return _fetchRecentStats.apply(this, arguments);
}
function recordVisit(_x21, _x22) {
  return _recordVisit.apply(this, arguments);
}

// ============================================
// 签到 API（2次请求：更新用户 + 更新统计）
// ============================================
function _recordVisit() {
  _recordVisit = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee14(visitorOpenid, ownerOpenid) {
    var today, reward, _yield$Promise$all, _yield$Promise$all2, visitorStatOk, ownerStatOk, userOk, _t10;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          _context14.p = 0;
          today = getTodayStr();
          reward = 3; // 并行执行：更新访问者统计 + 更新被访问者统计 + 更新访问者星尘
          _context14.n = 1;
          return Promise.all([upsertDailyStat(visitorOpenid, today, {
            visitDelta: 1
          }), upsertDailyStat(ownerOpenid, today, {
            visitedDelta: 1
          }), (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee13() {
            var user;
            return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context13) {
              while (1) switch (_context13.n) {
                case 0:
                  _context13.n = 1;
                  return fetchUserInfo(visitorOpenid);
                case 1:
                  user = _context13.v;
                  if (user) {
                    _context13.n = 2;
                    break;
                  }
                  return _context13.a(2, false);
                case 2:
                  return _context13.a(2, updateUserInfo(visitorOpenid, {
                    stardustBalance: user.stardustBalance + reward
                  }));
              }
            }, _callee13);
          }))()]);
        case 1:
          _yield$Promise$all = _context14.v;
          _yield$Promise$all2 = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_5__["default"])(_yield$Promise$all, 3);
          visitorStatOk = _yield$Promise$all2[0];
          ownerStatOk = _yield$Promise$all2[1];
          userOk = _yield$Promise$all2[2];
          return _context14.a(2, {
            success: visitorStatOk,
            stardustEarned: reward
          });
        case 2:
          _context14.p = 2;
          _t10 = _context14.v;
          console.error('[Feishu] Record visit error:', _t10);
          return _context14.a(2, {
            success: false,
            stardustEarned: 0
          });
      }
    }, _callee14, null, [[0, 2]]);
  }));
  return _recordVisit.apply(this, arguments);
}
function signIn(_x23) {
  return _signIn.apply(this, arguments);
}

// ============================================
// 看广告 API（2次请求：获取用户 + 更新星尘）
// ============================================
function _signIn() {
  _signIn = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee15(openid) {
    var user, today, newDates, continuousDays, reward, _t11;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          _context15.p = 0;
          _context15.n = 1;
          return fetchUserInfo(openid);
        case 1:
          user = _context15.v;
          if (user) {
            _context15.n = 2;
            break;
          }
          return _context15.a(2, {
            success: false,
            stardustEarned: 0,
            continuousDays: 0
          });
        case 2:
          today = getTodayStr();
          if (!user.signInDates.includes(today)) {
            _context15.n = 3;
            break;
          }
          return _context15.a(2, {
            success: false,
            stardustEarned: 0,
            continuousDays: 0
          });
        case 3:
          newDates = [].concat((0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_6__["default"])(user.signInDates), [today]);
          continuousDays = getContinuousDays(newDates);
          reward = 10;
          _context15.n = 4;
          return updateUserInfo(openid, {
            signInDates: newDates,
            stardustBalance: user.stardustBalance + reward
          });
        case 4:
          return _context15.a(2, {
            success: true,
            stardustEarned: reward,
            continuousDays: continuousDays
          });
        case 5:
          _context15.p = 5;
          _t11 = _context15.v;
          console.error('[Feishu] Sign in error:', _t11);
          return _context15.a(2, {
            success: false,
            stardustEarned: 0,
            continuousDays: 0
          });
      }
    }, _callee15, null, [[0, 5]]);
  }));
  return _signIn.apply(this, arguments);
}
function watchAdReward(_x24) {
  return _watchAdReward.apply(this, arguments);
}

// ============================================
// 兑换 API
// ============================================
function _watchAdReward() {
  _watchAdReward = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee16(openid) {
    var user, reward, _t12;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          _context16.p = 0;
          _context16.n = 1;
          return fetchUserInfo(openid);
        case 1:
          user = _context16.v;
          if (user) {
            _context16.n = 2;
            break;
          }
          return _context16.a(2, {
            success: false,
            stardustEarned: 0
          });
        case 2:
          reward = 5;
          _context16.n = 3;
          return updateUserInfo(openid, {
            stardustBalance: user.stardustBalance + reward
          });
        case 3:
          return _context16.a(2, {
            success: true,
            stardustEarned: reward
          });
        case 4:
          _context16.p = 4;
          _t12 = _context16.v;
          console.error('[Feishu] Watch ad reward error:', _t12);
          return _context16.a(2, {
            success: false,
            stardustEarned: 0
          });
      }
    }, _callee16, null, [[0, 4]]);
  }));
  return _watchAdReward.apply(this, arguments);
}
function redeemReward(_x25, _x26) {
  return _redeemReward.apply(this, arguments);
}

// ============================================
// 交易记录 API
// ============================================
function _redeemReward() {
  _redeemReward = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee17(openid, reward) {
    var user, typeLabel, _t13;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          _context17.p = 0;
          _context17.n = 1;
          return fetchUserInfo(openid);
        case 1:
          user = _context17.v;
          if (!(!user || user.stardustBalance < reward.stardustCost)) {
            _context17.n = 2;
            break;
          }
          return _context17.a(2, null);
        case 2:
          _context17.n = 3;
          return updateUserInfo(openid, {
            stardustBalance: user.stardustBalance - reward.stardustCost
          });
        case 3:
          typeLabel = reward.type === 'ranking_boost' ? '排名置顶' : '现金红包';
          _context17.n = 4;
          return createTransaction({
            userOpenid: openid,
            type: reward.type === 'ranking_boost' ? 'redeem_top' : 'redeem_redpacket',
            amount: -reward.stardustCost,
            description: "\u5151\u6362".concat(typeLabel, " ").concat(reward.value).concat(reward.unit)
          });
        case 4:
          return _context17.a(2, createRedemption({
            userOpenid: openid,
            type: reward.type,
            amount: reward.type === 'red_packet' ? reward.value : 0,
            stardustCost: reward.stardustCost
          }));
        case 5:
          _context17.p = 5;
          _t13 = _context17.v;
          console.error('[Feishu] Redeem reward error:', _t13);
          return _context17.a(2, null);
      }
    }, _callee17, null, [[0, 5]]);
  }));
  return _redeemReward.apply(this, arguments);
}
function createTransaction(_x27) {
  return _createTransaction.apply(this, arguments);
}
function _createTransaction() {
  _createTransaction = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee18(transaction) {
    var _t14;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context18) {
      while (1) switch (_context18.p = _context18.n) {
        case 0:
          _context18.p = 0;
          _context18.n = 1;
          return feishuRequest({
            method: 'POST',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.transactions, "/records"),
            data: {
              fields: {
                '用户openid': transaction.userOpenid,
                '类型': transaction.type,
                '金额': transaction.amount,
                '描述': transaction.description,
                '创建时间': Date.now()
              }
            }
          });
        case 1:
          return _context18.a(2, true);
        case 2:
          _context18.p = 2;
          _t14 = _context18.v;
          console.error('[Feishu] Create transaction error:', _t14);
          return _context18.a(2, false);
      }
    }, _callee18, null, [[0, 2]]);
  }));
  return _createTransaction.apply(this, arguments);
}
function fetchTransactions(_x28) {
  return _fetchTransactions.apply(this, arguments);
}

// ============================================
// 兑换码 API
// ============================================
function _fetchTransactions() {
  _fetchTransactions = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee19(openid) {
    var pageSize,
      _res$data1,
      res,
      records,
      _args19 = arguments,
      _t15;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context19) {
      while (1) switch (_context19.p = _context19.n) {
        case 0:
          pageSize = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : 20;
          _context19.p = 1;
          _context19.n = 2;
          return feishuRequest({
            method: 'GET',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.transactions, "/records?filter=").concat(encodeURIComponent("CurrentValue.[\u7528\u6237openid] = \"".concat(openid, "\"")), "&pageSize=").concat(pageSize)
          });
        case 2:
          res = _context19.v;
          records = (res === null || res === void 0 || (_res$data1 = res.data) === null || _res$data1 === void 0 ? void 0 : _res$data1.items) || [];
          return _context19.a(2, records.map(mapRecordToTransaction).sort(function (a, b) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }));
        case 3:
          _context19.p = 3;
          _t15 = _context19.v;
          console.error('[Feishu] Fetch transactions error:', _t15);
          return _context19.a(2, []);
      }
    }, _callee19, null, [[1, 3]]);
  }));
  return _fetchTransactions.apply(this, arguments);
}
function createRedemption(_x29) {
  return _createRedemption.apply(this, arguments);
}
function _createRedemption() {
  _createRedemption = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee20(redemption) {
    var _res$data10, code, res, _t16;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context20) {
      while (1) switch (_context20.p = _context20.n) {
        case 0:
          _context20.p = 0;
          code = generateRedemptionCode();
          _context20.n = 1;
          return feishuRequest({
            method: 'POST',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.redemptions, "/records"),
            data: {
              fields: {
                '用户openid': redemption.userOpenid,
                '类型': redemption.type,
                '兑换码': code,
                '金额': redemption.amount || 0,
                '星尘花费': redemption.stardustCost || 0,
                '状态': 'unused',
                '创建时间': Date.now()
              }
            }
          });
        case 1:
          res = _context20.v;
          return _context20.a(2, {
            id: (res === null || res === void 0 || (_res$data10 = res.data) === null || _res$data10 === void 0 || (_res$data10 = _res$data10.record) === null || _res$data10 === void 0 ? void 0 : _res$data10.recordId) || '',
            userOpenid: redemption.userOpenid || '',
            type: redemption.type || 'red_packet',
            code: code,
            amount: redemption.amount || 0,
            stardustCost: redemption.stardustCost || 0,
            status: 'unused',
            createdAt: new Date().toISOString()
          });
        case 2:
          _context20.p = 2;
          _t16 = _context20.v;
          console.error('[Feishu] Create redemption error:', _t16);
          return _context20.a(2, null);
      }
    }, _callee20, null, [[0, 2]]);
  }));
  return _createRedemption.apply(this, arguments);
}
function verifyRedemptionCode(_x30) {
  return _verifyRedemptionCode.apply(this, arguments);
}
function _verifyRedemptionCode() {
  _verifyRedemptionCode = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee21(code) {
    var _res$data11, res, records, _t17;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context21) {
      while (1) switch (_context21.p = _context21.n) {
        case 0:
          _context21.p = 0;
          _context21.n = 1;
          return feishuRequest({
            method: 'GET',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.redemptions, "/records?filter=").concat(encodeURIComponent("CurrentValue.[\u5151\u6362\u7801] = \"".concat(code, "\"")))
          });
        case 1:
          res = _context21.v;
          records = (res === null || res === void 0 || (_res$data11 = res.data) === null || _res$data11 === void 0 ? void 0 : _res$data11.items) || [];
          return _context21.a(2, records.length > 0 ? mapRecordToRedemption(records[0]) : null);
        case 2:
          _context21.p = 2;
          _t17 = _context21.v;
          console.error('[Feishu] Verify redemption code error:', _t17);
          return _context21.a(2, null);
      }
    }, _callee21, null, [[0, 2]]);
  }));
  return _verifyRedemptionCode.apply(this, arguments);
}
function useRedemptionCode(_x31) {
  return _useRedemptionCode.apply(this, arguments);
}

// ============================================
// 奖励配置
// ============================================
function _useRedemptionCode() {
  _useRedemptionCode = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee22(recordId) {
    var _t18;
    return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context22) {
      while (1) switch (_context22.p = _context22.n) {
        case 0:
          _context22.p = 0;
          _context22.n = 1;
          return feishuRequest({
            method: 'PUT',
            path: "/bitable/v1/apps/".concat(FEISHU_CONFIG.bitableAppToken, "/tables/").concat(FEISHU_CONFIG.tables.redemptions, "/records/").concat(recordId),
            data: {
              fields: {
                '状态': 'used',
                '使用时间': Date.now()
              }
            }
          });
        case 1:
          return _context22.a(2, true);
        case 2:
          _context22.p = 2;
          _t18 = _context22.v;
          console.error('[Feishu] Use redemption code error:', _t18);
          return _context22.a(2, false);
      }
    }, _callee22, null, [[0, 2]]);
  }));
  return _useRedemptionCode.apply(this, arguments);
}
var REWARD_CONFIGS = [{
  id: 'reward_001',
  type: 'ranking_boost',
  name: '排名置顶',
  description: '让你的小程序/公众号在首页置顶展示',
  stardustCost: 100,
  value: 24,
  unit: '小时'
}, {
  id: 'reward_002',
  type: 'ranking_boost',
  name: '排名置顶',
  description: '让你的小程序/公众号在首页置顶展示',
  stardustCost: 250,
  value: 72,
  unit: '小时'
}, {
  id: 'reward_003',
  type: 'red_packet',
  name: '现金红包',
  description: '兑换现金红包，添加微信领取',
  stardustCost: 200,
  value: 1,
  unit: '元'
}, {
  id: 'reward_004',
  type: 'red_packet',
  name: '现金红包',
  description: '兑换现金红包，添加微信领取',
  stardustCost: 500,
  value: 3,
  unit: '元'
}];

// ============================================
// 辅助函数
// ============================================

function generateRedemptionCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = 'HELP-';
  for (var i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += '-';
  for (var _i = 0; _i < 4; _i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
function getTodayStr() {
  var now = new Date();
  return "".concat(now.getFullYear(), "-").concat(String(now.getMonth() + 1).padStart(2, '0'), "-").concat(String(now.getDate()).padStart(2, '0'));
}
function getContinuousDays(signInDates) {
  if (signInDates.length === 0) return 0;
  var sorted = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_6__["default"])(signInDates).sort().reverse();
  var today = getTodayStr();
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yStr = "".concat(yesterday.getFullYear(), "-").concat(String(yesterday.getMonth() + 1).padStart(2, '0'), "-").concat(String(yesterday.getDate()).padStart(2, '0'));
  if (sorted[0] !== today && sorted[0] !== yStr) return 0;
  var c = 1;
  for (var i = 1; i < sorted.length; i++) {
    if ((new Date(sorted[i - 1]).getTime() - new Date(sorted[i]).getTime()) / 86400000 === 1) c++;else break;
  }
  return c;
}
function mapRecordToProgram(record) {
  var f = record.fields || {};
  var isTop = !!f['是否置顶'];
  var topExpire = f['置顶到期时间'];
  var topExpired = isTop && topExpire && Number(topExpire) < Date.now();
  return {
    id: record.recordId,
    name: f['名称'] || '',
    type: f['类型'] || 'miniapp',
    description: f['描述'] || '',
    avatar: '',
    ownerName: f['提交者名称'] || '',
    ownerOpenid: f['提交者'] || '',
    ranking: 0,
    isTop: topExpired ? false : isTop,
    topExpireAt: f['置顶到期时间'],
    createdAt: f['创建时间'] || ''
  };
}
function mapRecordToUser(record) {
  var f = record.fields || {};
  return {
    openid: f['openid'] || '',
    nickname: f['昵称'] || '新用户',
    avatar: f['头像'] || '',
    stardustBalance: f['星尘余额'] || 0,
    ranking: 0,
    signInDates: f['签到日期'] ? String(f['签到日期']).split(',').filter(Boolean) : [],
    createdAt: f['创建时间'] || ''
  };
}
function mapRecordToTransaction(record) {
  var f = record.fields || {};
  return {
    id: record.recordId,
    userOpenid: f['用户openid'] || '',
    type: f['类型'] || 'sign_in',
    amount: f['金额'] || 0,
    description: f['描述'] || '',
    createdAt: f['创建时间'] || ''
  };
}
function mapRecordToRedemption(record) {
  var f = record.fields || {};
  return {
    id: record.recordId,
    userOpenid: f['用户openid'] || '',
    type: f['类型'] || 'red_packet',
    code: f['兑换码'] || '',
    amount: f['金额'] || 0,
    stardustCost: f['星尘花费'] || 0,
    status: f['状态'] || 'unused',
    createdAt: f['创建时间'] || '',
    usedAt: f['使用时间']
  };
}

/***/ }),

/***/ "./src/store/userContext.tsx":
/*!***********************************!*\
  !*** ./src/store/userContext.tsx ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UserProvider": function() { return /* binding */ UserProvider; },
/* harmony export */   "useUser": function() { return /* binding */ useUser; }
/* harmony export */ });
/* harmony import */ var C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/taro */ "./node_modules/@tarojs/taro/index.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_feishu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/services/feishu */ "./src/services/feishu.ts");
/* harmony import */ var _config_feishu_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/config/feishu.json */ "./src/config/feishu.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/cjs/react-jsx-runtime.production.min.js");









var defaultUser = {
  openid: '',
  nickname: '新用户',
  avatar: '',
  stardustBalance: 0,
  ranking: 0,
  signInDates: [],
  createdAt: ''
};
var initialState = {
  userInfo: defaultUser,
  transactions: [],
  isLoading: false,
  initialized: false
};
function userReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_INFO':
      return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_5__["default"])({}, state), {}, {
        userInfo: action.payload
      });
    case 'SET_TRANSACTIONS':
      return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_5__["default"])({}, state), {}, {
        transactions: action.payload
      });
    case 'SET_LOADING':
      return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_5__["default"])({}, state), {}, {
        isLoading: action.payload
      });
    case 'SET_INITIALIZED':
      return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_5__["default"])({}, state), {}, {
        initialized: action.payload
      });
    default:
      return state;
  }
}
var UserContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined);
function UserProvider(_ref) {
  var children = _ref.children;
  var _useReducer = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(userReducer, initialState),
    _useReducer2 = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];

  // 从飞书刷新用户信息
  var refreshUser = /*#__PURE__*/function () {
    var _ref2 = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_7__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().m(function _callee() {
      var user, _t;
      return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (state.userInfo.openid) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            _context.p = 1;
            _context.n = 2;
            return (0,_services_feishu__WEBPACK_IMPORTED_MODULE_2__.fetchUserInfo)(state.userInfo.openid);
          case 2:
            user = _context.v;
            if (user) {
              dispatch({
                type: 'SET_USER_INFO',
                payload: user
              });
            }
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            console.error('[UserContext] Refresh user error:', _t);
          case 4:
            return _context.a(2);
        }
      }, _callee, null, [[1, 3]]);
    }));
    return function refreshUser() {
      return _ref2.apply(this, arguments);
    };
  }();

  // 从飞书刷新交易记录
  var refreshTransactions = /*#__PURE__*/function () {
    var _ref3 = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_7__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().m(function _callee2() {
      var transactions, _t2;
      return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            if (state.userInfo.openid) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            _context2.p = 1;
            _context2.n = 2;
            return (0,_services_feishu__WEBPACK_IMPORTED_MODULE_2__.fetchTransactions)(state.userInfo.openid);
          case 2:
            transactions = _context2.v;
            dispatch({
              type: 'SET_TRANSACTIONS',
              payload: transactions
            });
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            console.error('[UserContext] Refresh transactions error:', _t2);
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 3]]);
    }));
    return function refreshTransactions() {
      return _ref3.apply(this, arguments);
    };
  }();

  // 确保用户存在（不存在则创建）
  var ensureUser = /*#__PURE__*/function () {
    var _ref4 = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_7__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().m(function _callee3(openid) {
      var user, _t3;
      return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            _context3.n = 1;
            return (0,_services_feishu__WEBPACK_IMPORTED_MODULE_2__.fetchUserInfo)(openid);
          case 1:
            user = _context3.v;
            if (user) {
              _context3.n = 3;
              break;
            }
            _context3.n = 2;
            return (0,_services_feishu__WEBPACK_IMPORTED_MODULE_2__.createUser)(openid);
          case 2:
            user = _context3.v;
          case 3:
            if (user) {
              dispatch({
                type: 'SET_USER_INFO',
                payload: user
              });
            }
            return _context3.a(2, user);
          case 4:
            _context3.p = 4;
            _t3 = _context3.v;
            console.error('[UserContext] Ensure user error:', _t3);
            return _context3.a(2, null);
        }
      }, _callee3, null, [[0, 4]]);
    }));
    return function ensureUser(_x) {
      return _ref4.apply(this, arguments);
    };
  }();

  // 通过 Vercel 接口用 code 换取真实 openid
  var getRealOpenId = /*#__PURE__*/function () {
    var _ref5 = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_7__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().m(function _callee4(code) {
      var _res$data, url, res, _t4;
      return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            url = _config_feishu_json__WEBPACK_IMPORTED_MODULE_3__.wx.getOpenIdUrl;
            if (!(!url || url === 'YOUR_VERCEL_URL/api/getOpenId')) {
              _context4.n = 1;
              break;
            }
            console.warn('[UserContext] Vercel URL not configured, using fallback');
            return _context4.a(2, null);
          case 1:
            _context4.n = 2;
            return _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().request({
              url: "".concat(url, "?code=").concat(code),
              method: 'GET'
            });
          case 2:
            res = _context4.v;
            if (!((_res$data = res.data) !== null && _res$data !== void 0 && _res$data.openid)) {
              _context4.n = 3;
              break;
            }
            return _context4.a(2, res.data.openid);
          case 3:
            console.error('[UserContext] Get openid failed:', res.data);
            return _context4.a(2, null);
          case 4:
            _context4.p = 4;
            _t4 = _context4.v;
            console.error('[UserContext] Get openid error:', _t4);
            return _context4.a(2, null);
        }
      }, _callee4, null, [[0, 4]]);
    }));
    return function getRealOpenId(_x2) {
      return _ref5.apply(this, arguments);
    };
  }();

  // 初始化：获取真实 openid 并加载数据
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var init = /*#__PURE__*/function () {
      var _ref6 = (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_7__["default"])(/*#__PURE__*/(0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().m(function _callee5() {
        var openid, loginRes, user, transactions, _t5;
        return (0,C_Users_23815_Documents_person_help_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              if (!state.initialized) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2);
            case 1:
              dispatch({
                type: 'SET_LOADING',
                payload: true
              });
              _context5.p = 2;
              // 先尝试本地缓存的 openid
              openid = _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().getStorageSync('user_openid');
              if (openid) {
                _context5.n = 5;
                break;
              }
              _context5.n = 3;
              return _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().login();
            case 3:
              loginRes = _context5.v;
              if (!loginRes.code) {
                _context5.n = 5;
                break;
              }
              _context5.n = 4;
              return getRealOpenId(loginRes.code);
            case 4:
              openid = _context5.v;
              if (openid) {
                _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setStorageSync('user_openid', openid);
              }
            case 5:
              if (!openid) {
                _context5.n = 8;
                break;
              }
              _context5.n = 6;
              return ensureUser(openid);
            case 6:
              user = _context5.v;
              if (!user) {
                _context5.n = 8;
                break;
              }
              _context5.n = 7;
              return (0,_services_feishu__WEBPACK_IMPORTED_MODULE_2__.fetchTransactions)(openid);
            case 7:
              transactions = _context5.v;
              dispatch({
                type: 'SET_TRANSACTIONS',
                payload: transactions
              });
            case 8:
              _context5.n = 10;
              break;
            case 9:
              _context5.p = 9;
              _t5 = _context5.v;
              console.error('[UserContext] Init error:', _t5);
            case 10:
              _context5.p = 10;
              dispatch({
                type: 'SET_LOADING',
                payload: false
              });
              dispatch({
                type: 'SET_INITIALIZED',
                payload: true
              });
              return _context5.f(10);
            case 11:
              return _context5.a(2);
          }
        }, _callee5, null, [[2, 9, 10, 11]]);
      }));
      return function init() {
        return _ref6.apply(this, arguments);
      };
    }();
    init();
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(UserContext.Provider, {
    value: {
      state: state,
      dispatch: dispatch,
      refreshUser: refreshUser,
      refreshTransactions: refreshTransactions,
      ensureUser: ensureUser
    },
    children: children
  });
}
function useUser() {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

/***/ }),

/***/ "./src/config/feishu.json":
/*!********************************!*\
  !*** ./src/config/feishu.json ***!
  \********************************/
/***/ (function(module) {

module.exports = JSON.parse('{"feishu":{"appId":"cli_aaac1ee737789ceb","appSecret":"xWjH0JIWxn8AohSgG0Embf33w486xQgF","bitableAppToken":"TyRGwIxQribxTpkf3wLc5zlMnk2","tables":{"programs":"tbll1Mq4qKm2Equo","users":"tblRgW0HtCDcCLD7","dailyStats":"tblAR32i1QcThZve","transactions":"tblppWavBRYQTPdC","redemptions":"tblrDQYGo150YENU"}},"wx":{"getOpenIdUrl":"YOUR_VERCEL_URL/api/getOpenId"}}');

/***/ })

}]);
//# sourceMappingURL=common.js.map