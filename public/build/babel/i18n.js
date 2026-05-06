"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentLanguage = getCurrentLanguage;
exports.initI18n = initI18n;
exports.setLanguage = setLanguage;
exports.t = t;
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var LANGUAGE_KEY = "inventory-app-language";
var translations = {
  en: {
    appTitle: "Inventory App With JS & TailwindCSS",
    languageLabel: "Language",
    english: "English",
    chinese: "中文",
    addNewCategory: "Add New Category",
    title: "Title",
    description: "Description",
    cancel: "Cancel",
    addCategory: "Add Category",
    addNewProduct: "Add New Product",
    quantity: "Quantity",
    location: "Location",
    category: "Category",
    selectLocation: "- select location -",
    selectCategory: "- select category -",
    addProduct: "Add Product",
    productsList: "Products List",
    searchPlaceholder: "Search...",
    newest: "Newest",
    oldest: "Oldest",
    sortAZ: "A-Z",
    sortZA: "Z-A",
    decreaseQuantity: "Decrease quantity",
    increaseQuantity: "Increase quantity",
    productTitleTooShort: "Product title must be at least 2 characters.",
    productLocationRequired: "Please select a valid product location.",
    productCategoryRequired: "Please select a valid product category.",
    productQuantityNegative: "Product quantity cannot be negative.",
    categoryTitleTooShort: "Category title must be at least 2 characters.",
    categoryUpdated: "This category name already exists, so the description was updated.",
    deleteProduct: "Delete product {title}"
  },
  zh: {
    appTitle: "库存管理应用",
    languageLabel: "语言",
    english: "English",
    chinese: "中文",
    addNewCategory: "添加新分类",
    title: "名称",
    description: "描述",
    cancel: "取消",
    addCategory: "添加分类",
    addNewProduct: "添加新产品",
    quantity: "数量",
    location: "位置",
    category: "分类",
    selectLocation: "- 选择位置 -",
    selectCategory: "- 选择分类 -",
    addProduct: "添加产品",
    productsList: "产品列表",
    searchPlaceholder: "搜索...",
    newest: "最新",
    oldest: "最旧",
    sortAZ: "A-Z",
    sortZA: "Z-A",
    decreaseQuantity: "减少数量",
    increaseQuantity: "增加数量",
    productTitleTooShort: "产品名称至少需要 2 个字符。",
    productLocationRequired: "请选择有效的产品位置。",
    productCategoryRequired: "请选择有效的产品分类。",
    productQuantityNegative: "产品数量不能为负数。",
    categoryTitleTooShort: "分类名称至少需要 2 个字符。",
    categoryUpdated: "该分类名称已存在，因此已更新它的描述。",
    deleteProduct: "删除产品 {title}"
  }
};
var currentLanguage = getSavedLanguage();
function initI18n() {
  applyTranslations();
  setupLanguageButtons();
}
function setLanguage(language) {
  currentLanguage = translations[language] ? language : "en";
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  }
  if (typeof document === "undefined") return;
  applyTranslations();
  if (typeof document.dispatchEvent === "function") {
    var event = typeof CustomEvent === "function" ? new CustomEvent("languagechange", {
      detail: {
        language: currentLanguage
      }
    }) : {
      type: "languagechange",
      detail: {
        language: currentLanguage
      }
    };
    document.dispatchEvent(event);
  }
}
function getCurrentLanguage() {
  return currentLanguage;
}
function t(key) {
  var replacements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var dictionary = translations[currentLanguage] || translations.en;
  var template = dictionary[key] || translations.en[key] || key;
  return Object.entries(replacements).reduce(function (value, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      replacement = _ref2[1];
    return value.replace("{".concat(name, "}"), replacement);
  }, template);
}
function getSavedLanguage() {
  if (typeof localStorage === "undefined") return "en";
  var savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  return translations[savedLanguage] ? savedLanguage : "en";
}
function setupLanguageButtons() {
  document.querySelectorAll("[data-lang-option]").forEach(function (button) {
    button.addEventListener("click", function () {
      setLanguage(button.dataset.langOption);
    });
  });
}
function applyTranslations() {
  if (typeof document === "undefined") return;
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function (element) {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-lang-option]").forEach(function (button) {
    var isSelected = button.dataset.langOption === currentLanguage;
    button.setAttribute("aria-pressed", String(isSelected));
    button.classList.toggle("bg-green-600", isSelected);
    button.classList.toggle("text-main", isSelected);
    button.classList.toggle("text-stone-200", !isSelected);
    button.classList.toggle("border-green-600", isSelected);
    button.classList.toggle("border-[#394247]", !isSelected);
  });
}
