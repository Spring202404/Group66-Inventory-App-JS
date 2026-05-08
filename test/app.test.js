const assert = require("node:assert/strict");
const test = require("node:test");

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

    removeItem(key) {
        delete this.store[key];
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

function createElement(tagName = "div", dataset = {}) {
    return {
        tagName: tagName.toUpperCase(),
        id: "",
        value: "",
        selected: false,
        dataset,
        innerText: "0",
        textContent: "",
        className: "",
        disabled: false,
        children: [],
        listeners: {},
        attributes: {},
        style: {},
        classList: createClassList(),

        addEventListener(type, handler) {
            this.listeners[type] = handler;
        },

        append(...children) {
            this.children.push(...children);
        },

        appendChild(child) {
            this.children.push(child);
        },

        replaceChildren(...children) {
            this.children = children;
        },

        setAttribute(name, value) {
            this.attributes[name] = String(value);
        },

        getAttribute(name) {
            return this.attributes[name] || null;
        }
    };
}

function setupAppDom() {
    const elements = {
        "#productTitle": createElement("input"),
        "#incQty": createElement("button"),
        "#decQty": createElement("button"),
        "#productLocations": createElement("select"),
        "#categoriesSelect": createElement("select"),
        "#addNewProductBtn": createElement("button"),
        "#productQuantity": createElement("p"),
        "#productsCenter": createElement("ul"),
        "#searchInput": createElement("input"),
        "#sort": createElement("select"),
        "#productError": createElement("p"),

        "#categoryTitle": createElement("input"),
        "#categoryDescription": createElement("textarea"),
        "#categoryCanelBtn": createElement("button"),
        "#categoryAddNewBtn": createElement("button")
    };

    elements["#incQty"].id = "incQty";
    elements["#decQty"].id = "decQty";
    elements["#productQuantity"].innerText = "0";
    elements["#productLocations"].value = "none";
    elements["#categoriesSelect"].value = "none";
    elements["#sort"].value = "newest";

    const i18nElements = [
        createElement("h1", { i18n: "appTitle" })
    ];

    const placeholderElements = [
        createElement("input", { i18nPlaceholder: "searchPlaceholder" })
    ];

    const ariaElements = [
        createElement("button", { i18nAria: "increaseQuantity" })
    ];

    const languageButtons = [
        createElement("button", { langOption: "en" }),
        createElement("button", { langOption: "zh" })
    ];

    const bodyChildren = [];
    const documentListeners = {};

    global.document = {
        documentElement: { lang: "" },

        body: {
            appendChild(element) {
                bodyChildren.push(element);
            }
        },

        querySelector(selector) {
            return elements[selector] || null;
        },

        querySelectorAll(selector) {
            if (selector === ".toggleBtn") {
                return [elements["#incQty"], elements["#decQty"]];
            }

            if (selector === "[data-i18n]") {
                return i18nElements;
            }

            if (selector === "[data-i18n-placeholder]") {
                return placeholderElements;
            }

            if (selector === "[data-i18n-aria]") {
                return ariaElements;
            }

            if (selector === "[data-lang-option]") {
                return languageButtons;
            }

            return [];
        },

        addEventListener(type, handler) {
            documentListeners[type] = documentListeners[type] || [];
            documentListeners[type].push(handler);
        },

        dispatchEvent(event) {
            (documentListeners[event.type] || []).forEach((handler) => handler(event));
        },

        createElement(tagName) {
            return createElement(tagName);
        },

        createElementNS(_namespace, tagName) {
            return createElement(tagName);
        },

        getElementById(id) {
            return bodyChildren.find((element) => element.id === id) || null;
        }
    };

    return {
        elements,
        bodyChildren,
        documentListeners,
        i18nElements,
        placeholderElements,
        ariaElements,
        languageButtons
    };
}

test.beforeEach(() => {
    global.localStorage = new MemoryStorage();
    global.alert = () => {};
    delete require.cache[require.resolve("../public/build/babel/app.js")];
});

// ===== App Tests =====

test("app initializes i18n, cookie banner, category view, and product view on DOMContentLoaded", () => {
    const dom = setupAppDom();

    require("../public/build/babel/app.js");

    assert.equal(typeof dom.documentListeners.DOMContentLoaded[0], "function");

    dom.documentListeners.DOMContentLoaded[0]();

    assert.equal(global.document.documentElement.lang, "en");

    assert.equal(dom.i18nElements[0].textContent, "Inventory App With JS & TailwindCSS");
    assert.equal(dom.placeholderElements[0].getAttribute("placeholder"), "Search...");
    assert.equal(dom.ariaElements[0].getAttribute("aria-label"), "Increase quantity");

    assert.equal(dom.bodyChildren.length, 1);
    assert.equal(dom.bodyChildren[0].id, "cookie-banner");

    assert.equal(dom.elements["#categoriesSelect"].children.length, 1);
    assert.equal(dom.elements["#categoriesSelect"].children[0].value, "none");

    assert.equal(dom.elements["#decQty"].disabled, true);
    assert.equal(dom.elements["#productsCenter"].children.length, 0);
});

test("app does not show cookie banner when cookie consent already exists", () => {
    const dom = setupAppDom();

    localStorage.setItem("inventory-app-cookie-consent", "accepted");

    require("../public/build/babel/app.js");

    dom.documentListeners.DOMContentLoaded[0]();

    assert.equal(dom.bodyChildren.length, 0);
    assert.equal(global.document.documentElement.lang, "en");
});