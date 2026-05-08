"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CookieBanner = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var COOKIE_CONSENT_KEY = "inventory-app-cookie-consent";
var COOKIE_ACCEPTED = "accepted";
var COOKIE_REJECTED = "rejected";
var CookieBanner = exports.CookieBanner = /*#__PURE__*/function () {
  function CookieBanner() {
    _classCallCheck(this, CookieBanner);
    this.banner = null;
    this.consentStatus = this.getConsentStatus();
  }
  return _createClass(CookieBanner, [{
    key: "getConsentStatus",
    value: function getConsentStatus() {
      var stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      return stored || null;
    }
  }, {
    key: "setConsentStatus",
    value: function setConsentStatus(status) {
      localStorage.setItem(COOKIE_CONSENT_KEY, status);
      this.consentStatus = status;
    }
  }, {
    key: "init",
    value: function init() {
      // Only show banner if no consent decision has been made
      if (!this.consentStatus) {
        this.createBanner();
        this.showBanner();
      }
    }
  }, {
    key: "createBanner",
    value: function createBanner() {
      var _this = this;
      var banner = document.createElement("div");
      banner.id = "cookie-banner";
      banner.className = "fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white border border-slate-200 rounded-[28px] shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] z-50 w-[min(94%,760px)]";
      banner.style.position = "fixed";
      banner.style.bottom = "20px";
      banner.style.left = "50%";
      banner.style.transform = "translateX(-50%)";
      banner.style.backgroundColor = "#ffffff";
      banner.style.border = "1px solid #e2e8f0";
      banner.style.borderRadius = "28px";
      banner.style.boxShadow = "0 24px 60px -20px rgba(15,23,42,0.18)";
      banner.style.width = "min(94%, 760px)";
      banner.style.zIndex = "50";
      banner.style.padding = "0";
      var content = document.createElement("div");
      content.className = "grid gap-4 md:grid-cols-[1.9fr_auto] items-center px-5 py-5";
      content.style.display = "grid";
      content.style.gap = "16px";
      content.style.alignItems = "center";
      content.style.padding = "20px";
      var textContainer = document.createElement("div");
      textContainer.className = "flex-1 min-w-[250px] space-y-3";
      var title = document.createElement("h3");
      title.className = "text-slate-950 font-semibold text-base sm:text-lg";
      title.setAttribute("data-i18n", "cookieTitle");
      title.textContent = "Cookie Settings";
      var description = document.createElement("p");
      description.className = "text-slate-600 text-sm leading-6";
      description.setAttribute("data-i18n", "cookieDescription");
      description.textContent = "We use cookies to improve your experience and personalize content. Learn more in our ";
      var privacyLink = document.createElement("a");
      privacyLink.href = "privacy-policy.html";
      privacyLink.className = "text-emerald-600 hover:text-emerald-500 font-semibold underline decoration-emerald-300/80";
      privacyLink.setAttribute("data-i18n", "privacyPolicy");
      privacyLink.textContent = "privacy policy";
      privacyLink.target = "_blank";
      privacyLink.rel = "noopener noreferrer";
      description.appendChild(privacyLink);
      var buttonContainer = document.createElement("div");
      buttonContainer.className = "flex justify-between items-center gap-3 w-full max-w-[320px]";
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "space-between";
      buttonContainer.style.alignItems = "center";
      buttonContainer.style.gap = "12px";
      buttonContainer.style.width = "100%";
      buttonContainer.style.maxWidth = "320px";
      var acceptBtn = document.createElement("button");
      acceptBtn.className = "inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300";
      acceptBtn.style.backgroundColor = "#16a34a";
      acceptBtn.style.color = "#ffffff";
      acceptBtn.style.border = "none";
      acceptBtn.style.cursor = "pointer";
      acceptBtn.style.padding = "10px 22px";
      acceptBtn.style.minWidth = "120px";
      acceptBtn.setAttribute("data-i18n", "acceptCookies");
      acceptBtn.textContent = "Accept";
      acceptBtn.addEventListener("click", function () {
        return _this.acceptCookies();
      });
      var rejectBtn = document.createElement("button");
      rejectBtn.className = "inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300";
      rejectBtn.style.backgroundColor = "#ffffff";
      rejectBtn.style.color = "#334155";
      rejectBtn.style.border = "1px solid #cbd5e1";
      rejectBtn.style.cursor = "pointer";
      rejectBtn.style.padding = "10px 22px";
      rejectBtn.style.minWidth = "120px";
      rejectBtn.setAttribute("data-i18n", "rejectCookies");
      rejectBtn.textContent = "Reject";
      rejectBtn.addEventListener("click", function () {
        return _this.rejectCookies();
      });
      textContainer.appendChild(title);
      textContainer.appendChild(description);
      buttonContainer.appendChild(rejectBtn);
      buttonContainer.appendChild(acceptBtn);
      content.appendChild(textContainer);
      content.appendChild(buttonContainer);
      banner.appendChild(content);
      this.banner = banner;
    }
  }, {
    key: "showBanner",
    value: function showBanner() {
      if (this.banner && !document.getElementById("cookie-banner")) {
        document.body.appendChild(this.banner);
      }
    }
  }, {
    key: "hideBanner",
    value: function hideBanner() {
      if (this.banner) {
        this.banner.style.display = "none";
      }
    }
  }, {
    key: "acceptCookies",
    value: function acceptCookies() {
      this.setConsentStatus(COOKIE_ACCEPTED);
      // Enable analytics, tracking, etc.
      this.enableAnalytics();
      this.hideBanner();
    }
  }, {
    key: "rejectCookies",
    value: function rejectCookies() {
      this.setConsentStatus(COOKIE_REJECTED);
      // Disable analytics, tracking, etc.
      this.disableAnalytics();
      this.hideBanner();
    }
  }, {
    key: "enableAnalytics",
    value: function enableAnalytics() {
      // Placeholder for enabling third-party cookies/analytics
      console.log("Analytics enabled");
    }
  }, {
    key: "disableAnalytics",
    value: function disableAnalytics() {
      // Placeholder for disabling third-party cookies/analytics
      console.log("Analytics disabled");
    }

    // Check if user has accepted cookies
  }, {
    key: "hasAcceptedCookies",
    value: function hasAcceptedCookies() {
      return this.consentStatus === COOKIE_ACCEPTED;
    }

    // Check if user has rejected cookies
  }, {
    key: "hasRejectedCookies",
    value: function hasRejectedCookies() {
      return this.consentStatus === COOKIE_REJECTED;
    }

    // Reset consent (for testing or user preference reset)
  }, {
    key: "resetConsent",
    value: function resetConsent() {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      this.consentStatus = null;
      this.init();
    }
  }]);
}();
var _default = exports["default"] = CookieBanner;
