"use strict";

var _productView = _interopRequireDefault(require("./productView.js"));
var _categoryView = _interopRequireDefault(require("./categoryView.js"));
var _i18n = require("./i18n.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
document.addEventListener("DOMContentLoaded", function () {
  (0, _i18n.initI18n)();
  var productView = new _productView["default"]();
  var categoryView = new _categoryView["default"]();
  categoryView.setupApp();
  productView.setupApp();
});
