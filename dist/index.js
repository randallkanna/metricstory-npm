"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricStory = void 0;
Object.defineProperty(exports, "MetricStoryProvider", {
  enumerable: true,
  get: function get() {
    return _MetricStoryContext.MetricStoryProvider;
  }
});
exports.metricStory = void 0;
Object.defineProperty(exports, "useMetricStory", {
  enumerable: true,
  get: function get() {
    return _MetricStoryContext.useMetricStory;
  }
});
var _uuid = require("uuid");
var _MetricStoryContext = require("./MetricStoryContext");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var METRIC_STORY_BASE = 'https://api.metricstory.ai/api/v1/';
// const METRIC_STORY_BASE = 'http://localhost:8080/api/v1/';
var Storage = /*#__PURE__*/function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }
  _createClass(Storage, null, [{
    key: "getItem",
    value: function getItem(key) {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      } else {
        console.log("localStorage is not available in the current environment.");
        return null;
      }
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        console.log("localStorage is not available in the current environment.");
      }
    }
  }]);
  return Storage;
}();
var ENDPOINTS = {
  IDENTIFY: 'identify',
  INSIGHT: 'track'
};
var MetricStory = exports.MetricStory = /*#__PURE__*/function () {
  function MetricStory() {
    _classCallCheck(this, MetricStory);
    this.userId = null;
    this.isAnonymous = true;
  }
  _createClass(MetricStory, [{
    key: "init",
    value: function init(options) {
      this.token = options.token;
      var userData = this.getUserDataFromStorage();
      if (!userData) {
        this.userId = (0, _uuid.v4)();
        this.isAnonymous = true;
        this.saveUserDataToStorage(this.userId, this.isAnonymous);
        this.identify({
          userId: this.userId
        }); // Optional: Add more parameters as needed
      } else {
        this.userId = userData.userId;
        this.isAnonymous = userData.isAnonymous;
      }
      this.trackPageLoad();
    }
  }, {
    key: "getUserDataFromStorage",
    value: function getUserDataFromStorage() {
      var userDataString = Storage.getItem('metricStoryUserId');
      try {
        return JSON.parse(userDataString);
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
        return null;
      }
    }
  }, {
    key: "saveUserDataToStorage",
    value: function saveUserDataToStorage(userId, isAnonymous) {
      var userData = JSON.stringify({
        userId: userId,
        isAnonymous: isAnonymous
      });
      Storage.setItem('metricStoryUserId', userData);
    }
  }, {
    key: "trackPageViewManually",
    value: function trackPageViewManually(url, referrer) {
      url = url || window.location.pathname;
      referrer = referrer || document.referrer;
      this.track({
        event: 'PAGE_VIEW',
        properties: {
          domain: url,
          referrer: referrer,
          timestamp: new Date(),
          url: window.location.href
        }
      });
    }
  }, {
    key: "trackPageLoad",
    value: function trackPageLoad() {
      var pageUrl = window.location.pathname;
      var referrer = document.referrer;
      this.track({
        event: 'PAGE_LOAD',
        properties: {
          url: pageUrl,
          referrer: referrer
        }
      });
    }
  }, {
    key: "identify",
    value: function identify(params, callback) {
      /* Assume params includes a userId that serves as an identifier */
      if (!this.isAnonymous) return; // Avoid re-identifying already identified user

      this.isAnonymous = false;
      this.userId = params.userId;
      this.saveUserDataToStorage(this.userId, this.isAnonymous); // Update storage

      var data = _objectSpread(_objectSpread({}, params), {}, {
        url: window.location.href,
        token: this.token
      });
      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(this.token)
        },
        body: JSON.stringify(data)
      };
      fetch("".concat(METRIC_STORY_BASE).concat(ENDPOINTS.IDENTIFY), requestOptions).then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(function (responseData) {
        if (callback) callback(null, responseData);
      })["catch"](function (error) {
        console.error('Error fetching data:', error);
        if (callback) callback(error, null);
      });
    }
  }, {
    key: "track",
    value: function track(params, callback) {
      var data = _objectSpread(_objectSpread({}, params), {}, {
        userId: this.userId,
        token: this.token,
        url: window.location.href
      });
      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(this.token)
        },
        body: JSON.stringify(data)
      };
      fetch("".concat(METRIC_STORY_BASE).concat(ENDPOINTS.INSIGHT), requestOptions).then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(function (data) {
        if (callback) callback(null, data);
      })["catch"](function (error) {
        console.error('Error fetching data:', error);
        if (callback) callback(error, null);
      });
    }
  }]);
  return MetricStory;
}();
var metricStory = exports.metricStory = new MetricStory();