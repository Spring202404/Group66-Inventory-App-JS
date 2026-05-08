const assert = require("node:assert/strict");
const test = require("node:test");

const {
    initI18n,
    setLanguage,
    getCurrentLanguage,
    t
} = require("../public/build/babel/i18n.js");

class MemoryStorage {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return Object.prototype.hasOwnProperty.call(this.store, key)
            ? this.store[key]
            : null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    clear() {
        this.store = {};
    }
}

function createClassList() {
    const classes = new Set();

    return {
        toggle(className, force) {
            if (force) {
                classes.add(className);
            } else {
                classes.delete(className);
            }
        },
        contains(className) {
            return classes.has(className);
        }
    };
}

function createElement(dataset = {}) {
    return {
        dataset,
        textContent: "",
        attributes: {},
        listeners: {},
        classList: createClassList(),

        setAttribute(name, value) {
            this.attributes[name] = String(value);
        },

        getAttribute(name) {
            return this.attributes[name] || null;
        },

        addEventListener(type, handler) {
            this.listeners[type] = handler;
        }
    };
}

function setupI18nDom() {
    const titleElement = createElement({ i18n: "appTitle" });
    const placeholderElement = createElement({ i18nPlaceholder: "searchPlaceholder" });
    const ariaElement = createElement({ i18nAria: "increaseQuantity" });

    const englishButton = createElement({ langOption: "en" });
    const chineseButton = createElement({ langOption: "zh" });

    const documentListeners = {};

    global.document = {
        documentElement: { lang: "" },

        querySelectorAll(selector) {
            if (selector === "[data-i18n]") {
                return [titleElement];
            }

            if (selector === "[data-i18n-placeholder]") {
                return [placeholderElement];
            }

            if (selector === "[data-i18n-aria]") {
                return [ariaElement];
            }

            if (selector === "[data-lang-option]") {
                return [englishButton, chineseButton];
            }

            return [];
        },

        dispatchEvent(event) {
            (documentListeners[event.type] || []).forEach((handler) => handler(event));
        },

        addEventListener(type, handler) {
            documentListeners[type] = documentListeners[type] || [];
            documentListeners[type].push(handler);
        }
    };

    return {
        titleElement,
        placeholderElement,
        ariaElement,
        englishButton,
        chineseButton
    };
}

test.beforeEach(() => {
    global.localStorage = new MemoryStorage();
    delete global.document;
    delete global.CustomEvent;

    setLanguage("en");
});

// ===== i18n Tests =====

test("i18n returns English translations by default", () => {
    setLanguage("en");

    assert.equal(getCurrentLanguage(), "en");
    assert.equal(t("addProduct"), "Add Product");
    assert.equal(t("productLocationRequired"), "Please select a valid product location.");
});

test("i18n switches to Chinese translations", () => {
    setLanguage("zh");

    assert.equal(getCurrentLanguage(), "zh");
    assert.equal(t("addProduct"), "添加产品");
    assert.equal(t("productLocationRequired"), "请选择有效的产品位置。");
});

test("i18n falls back to English when language is invalid", () => {
    setLanguage("invalid-language");

    assert.equal(getCurrentLanguage(), "en");
    assert.equal(t("addProduct"), "Add Product");
});

test("i18n falls back to key name when translation key does not exist", () => {
    setLanguage("en");

    assert.equal(t("missingTranslationKey"), "missingTranslationKey");
});

test("i18n replaces template variables", () => {
    setLanguage("en");

    assert.equal(
        t("deleteProduct", { title: "Laptop" }),
        "Delete product Laptop"
    );

    setLanguage("zh");

    assert.equal(
        t("deleteProduct", { title: "Laptop" }),
        "删除产品 Laptop"
    );
});

test("setLanguage saves selected language to localStorage", () => {
    setLanguage("zh");

    assert.equal(localStorage.getItem("inventory-app-language"), "zh");
});

test("setLanguage works without document", () => {
    delete global.document;

    setLanguage("zh");

    assert.equal(getCurrentLanguage(), "zh");
    assert.equal(localStorage.getItem("inventory-app-language"), "zh");
});

test("initI18n applies text, placeholder, aria, and button states", () => {
    const elements = setupI18nDom();

    setLanguage("en");
    initI18n();

    assert.equal(global.document.documentElement.lang, "en");
    assert.equal(elements.titleElement.textContent, "Inventory App With JS & TailwindCSS");
    assert.equal(elements.placeholderElement.getAttribute("placeholder"), "Search...");
    assert.equal(elements.ariaElement.getAttribute("aria-label"), "Increase quantity");

    assert.equal(elements.englishButton.getAttribute("aria-pressed"), "true");
    assert.equal(elements.chineseButton.getAttribute("aria-pressed"), "false");

    assert.equal(elements.englishButton.classList.contains("bg-green-600"), true);
    assert.equal(elements.chineseButton.classList.contains("text-stone-200"), true);
});

test("language buttons switch language when clicked", () => {
    const elements = setupI18nDom();

    initI18n();

    elements.chineseButton.listeners.click();

    assert.equal(getCurrentLanguage(), "zh");
    assert.equal(global.document.documentElement.lang, "zh-CN");
    assert.equal(elements.titleElement.textContent, "库存管理应用");
    assert.equal(elements.placeholderElement.getAttribute("placeholder"), "搜索...");
    assert.equal(elements.chineseButton.getAttribute("aria-pressed"), "true");
});

test("setLanguage dispatches languagechange event with selected language", () => {
    setupI18nDom();

    let receivedLanguage = "";

    global.document.addEventListener("languagechange", (event) => {
        receivedLanguage = event.detail.language;
    });

    setLanguage("zh");

    assert.equal(receivedLanguage, "zh");
});