"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _storage = _interopRequireDefault(require("./storage.js"));
var _i18n = require("./i18n.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ProductView = exports["default"] = /*#__PURE__*/function () {
  function ProductView() {
    var _this = this;
    _classCallCheck(this, ProductView);
    // variables
    this.pdtTitle = document.querySelector("#productTitle");
    this.pdtIncQty = document.querySelector("#incQty");
    this.pdtDecQty = document.querySelector("#decQty");
    this.pdtLocation = document.querySelector("#productLocations");
    this.ctgSelect = document.querySelector("#categoriesSelect");
    this.pdtAddNew = document.querySelector("#addNewProductBtn");
    this.pdtQty = document.querySelector("#productQuantity");
    this.productCenter = document.querySelector("#productsCenter");
    this.toggleBtns = document.querySelectorAll(".toggleBtn");
    this.searchInput = document.querySelector("#searchInput");
    this.sortSelect = document.querySelector("#sort");
    this.productError = document.querySelector("#productError");
    // event listeners
    this.pdtAddNew.addEventListener("click", function () {
      _this.addNewProduct();
    });
    this.toggleBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        _this.toggleProductQty(e);
      });
    });
    this.searchInput.addEventListener("keyup", function (e) {
      _this.searchProducts(e.target.value);
    });
    this.sortSelect.addEventListener("change", function (e) {
      _this.sortBySelect(e.target.value);
    });
    document.addEventListener("languagechange", function () {
      _this.showProductError("");
      _this.sortBySelect(_this.sortSelect.value);
    });
  }
  return _createClass(ProductView, [{
    key: "setupApp",
    value: function setupApp() {
      this.updateQuantityControls();
      this.sortBySelect(this.sortSelect.value);
    }
  }, {
    key: "addNewProduct",
    value: function addNewProduct() {
      var validationMessage = this.validateProductForm();
      if (validationMessage) {
        this.showProductError(validationMessage);
        return;
      }
      var newProduct = {
        id: new Date().getTime(),
        title: this.pdtTitle.value.trim(),
        quantity: this.getCurrentQuantity(),
        location: this.pdtLocation.value,
        category: this.ctgSelect.value,
        persianDate: new Date().toLocaleDateString("fa-IR")
      };
      var pdtList = _storage["default"].getProducts;
      pdtList.push(newProduct);
      _storage["default"].saveProducts(pdtList);
      this.resetProductForm();
      this.showProductError("");
      this.sortBySelect(this.sortSelect.value);
    }
  }, {
    key: "showListedProducts",
    value: function showListedProducts(productList) {
      var _this2 = this;
      this.productCenter.replaceChildren();
      productList.forEach(function (product) {
        var listItem = document.createElement("li");
        listItem.className = "flex items-center justify-between w-full py-2 bg-blue-400/ text-white font-medium ss:min-w-[500px] ss:overflow-x-auto";
        listItem.append(_this2.createProductText(product.title), _this2.createProductText(product.location), _this2.createProductText(product.category), _this2.createProductText(product.persianDate, "basis-[16%] font-vazir ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]"), _this2.createProductText(product.quantity, "border-2 border-slate-400 p-1 rounded-2xl ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]"), _this2.createDeleteButton(product));
        _this2.productCenter.append(listItem);
      });
    }
  }, {
    key: "toggleProductQty",
    value: function toggleProductQty(e) {
      var currentQuantity = this.getCurrentQuantity();
      switch (e.currentTarget.id) {
        case "incQty":
          this.setQuantity(currentQuantity + 1);
          break;
        case "decQty":
          this.setQuantity(Math.max(0, currentQuantity - 1));
          break;
      }
    }
  }, {
    key: "deleteProduct",
    value: function deleteProduct(productId) {
      _storage["default"].removeProduct(productId);
      this.sortBySelect(this.sortSelect.value);
    }
  }, {
    key: "searchProducts",
    value: function searchProducts(searchTerm) {
      var addedProducts = _storage["default"].getProducts;
      var normalizedSearchTerm = searchTerm.toLowerCase().trim();
      var filteredProducts = addedProducts.filter(function (product) {
        return product.title.toLowerCase().trim().includes(normalizedSearchTerm);
      });
      this.showListedProducts(filteredProducts);
    }
  }, {
    key: "sortBySelect",
    value: function sortBySelect(sortType) {
      var saveProducts = _storage["default"].getProducts;
      var sortedProducts = [];
      if (sortType === "newest") {
        sortedProducts = saveProducts.slice().sort(function (a, b) {
          return b.id - a.id;
        });
      } else if (sortType === "oldest") {
        sortedProducts = saveProducts.slice().sort(function (a, b) {
          return a.id - b.id;
        });
      } else if (sortType === "A-Z") {
        sortedProducts = saveProducts.slice().sort(function (a, b) {
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });
      } else if (sortType === "Z-A") {
        sortedProducts = saveProducts.slice().sort(function (a, b) {
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        }).reverse();
      } else {
        sortedProducts = saveProducts.slice();
      }
      this.showListedProducts(sortedProducts);
    }
  }, {
    key: "validateProductForm",
    value: function validateProductForm() {
      if (this.pdtTitle.value.trim().length < 2) {
        return (0, _i18n.t)("productTitleTooShort");
      }
      if (this.pdtLocation.value === "none") {
        return (0, _i18n.t)("productLocationRequired");
      }
      if (this.ctgSelect.value === "none") {
        return (0, _i18n.t)("productCategoryRequired");
      }
      if (this.getCurrentQuantity() < 0) {
        return (0, _i18n.t)("productQuantityNegative");
      }
      return "";
    }
  }, {
    key: "resetProductForm",
    value: function resetProductForm() {
      this.pdtTitle.value = "";
      this.setQuantity(0);
      this.pdtLocation.value = "none";
      this.ctgSelect.value = "none";
    }
  }, {
    key: "getCurrentQuantity",
    value: function getCurrentQuantity() {
      var quantity = Number(this.pdtQty.innerText);
      return Number.isFinite(quantity) ? quantity : 0;
    }
  }, {
    key: "setQuantity",
    value: function setQuantity(quantity) {
      this.pdtQty.innerText = String(Math.max(0, quantity));
      this.updateQuantityControls();
    }
  }, {
    key: "updateQuantityControls",
    value: function updateQuantityControls() {
      this.pdtDecQty.disabled = this.getCurrentQuantity() === 0;
      this.pdtDecQty.classList.toggle("opacity-50", this.pdtDecQty.disabled);
      this.pdtDecQty.classList.toggle("cursor-not-allowed", this.pdtDecQty.disabled);
    }
  }, {
    key: "showProductError",
    value: function showProductError(message) {
      if (!this.productError) return;
      this.productError.textContent = message;
      this.productError.classList.toggle("hidden", !message);
    }
  }, {
    key: "createProductText",
    value: function createProductText(value) {
      var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]";
      var text = document.createElement("p");
      text.className = className;
      text.textContent = value;
      return text;
    }
  }, {
    key: "createDeleteButton",
    value: function createDeleteButton(product) {
      var _this3 = this;
      var deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "pdt-dlt-btn flex items-center justify-center text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-main rounded";
      deleteButton.setAttribute("aria-label", (0, _i18n.t)("deleteProduct", {
        title: product.title
      }));
      deleteButton.addEventListener("click", function () {
        return _this3.deleteProduct(Number(product.id));
      });
      deleteButton.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          _this3.deleteProduct(Number(product.id));
        }
      });
      deleteButton.append(this.createDeleteIcon());
      return deleteButton;
    }
  }, {
    key: "createDeleteIcon",
    value: function createDeleteIcon() {
      var svgNamespace = "http://www.w3.org/2000/svg";
      var icon = document.createElementNS(svgNamespace, "svg");
      icon.setAttribute("class", "stroke-current dd:h-6 dd:w-6 ss:h-5 ss:w-5");
      icon.setAttribute("fill", "none");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("stroke-width", "1.5");
      icon.setAttribute("aria-hidden", "true");
      var path = document.createElementNS(svgNamespace, "path");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("d", "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0");
      icon.append(path);
      return icon;
    }
  }]);
}();
