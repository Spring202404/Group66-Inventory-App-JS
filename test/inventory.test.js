const assert = require("node:assert/strict");
const test = require("node:test");

const ProductView = require("../public/build/babel/productView.js").default;
const CategoryView = require("../public/build/babel/categoryView.js").default;
const { setLanguage } = require("../public/build/babel/i18n.js");

class MemoryStorage {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
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

function createElement(tagName = "div") {
    return {
        tagName: tagName.toUpperCase(),
        type: "",
        id: "",
        value: "",
        selected: false,
        dataset: {},
        innerText: "",
        textContent: "",
        className: "",
        disabled: false,
        children: [],
        attributes: {},
        listeners: {},
        classList: createClassList(),
        addEventListener(type, handler) {
            this.listeners[type] = handler;
        },
        append(...children) {
            this.children.push(...children);
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

function setupProductDom() {
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
        "#productError": createElement("p")
    };

    elements["#incQty"].id = "incQty";
    elements["#decQty"].id = "decQty";
    elements["#productQuantity"].innerText = "0";
    elements["#productLocations"].value = "none";
    elements["#categoriesSelect"].value = "none";
    elements["#sort"].value = "newest";

    const documentListeners = {};
    global.document = {
        documentElement: { lang: "en" },
        querySelector(selector) {
            return elements[selector];
        },
        querySelectorAll(selector) {
            return selector === ".toggleBtn" ? [elements["#incQty"], elements["#decQty"]] : [];
        },
        addEventListener(type, handler) {
            documentListeners[type] = documentListeners[type] || [];
            documentListeners[type].push(handler);
        },
        dispatchEvent(event) {
            (documentListeners[event.type] || []).forEach((handler) => handler(event));
        },
        createElement,
        createElementNS(_namespace, tagName) {
            return createElement(tagName);
        }
    };

    setLanguage("en");
    return elements;
}

function setupCategoryDom() {
    const elements = {
        "#categoryTitle": createElement("input"),
        "#categoryDescription": createElement("textarea"),
        "#categoryCanelBtn": createElement("button"),
        "#categoryAddNewBtn": createElement("button"),
        "#categoriesSelect": createElement("select")
    };

    const documentListeners = {};
    global.document = {
        documentElement: { lang: "en" },
        querySelector(selector) {
            return elements[selector];
        },
        querySelectorAll() {
            return [];
        },
        addEventListener(type, handler) {
            documentListeners[type] = documentListeners[type] || [];
            documentListeners[type].push(handler);
        },
        dispatchEvent(event) {
            (documentListeners[event.type] || []).forEach((handler) => handler(event));
        },
        createElement
    };

    setLanguage("en");
    return elements;
}

test.beforeEach(() => {
    global.localStorage = new MemoryStorage();
    global.alert = () => {};
});

test("product quantity cannot go below zero", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    view.setupApp();
    view.toggleProductQty({ currentTarget: elements["#decQty"] });

    assert.equal(elements["#productQuantity"].innerText, "0");
    assert.equal(elements["#decQty"].disabled, true);
});

test("product form rejects default location and category values", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    elements["#productTitle"].value = "Laptop";
    elements["#productLocations"].value = "none";
    elements["#categoriesSelect"].value = "none";
    view.addNewProduct();

    assert.equal(JSON.parse(localStorage.getItem("products") || "[]").length, 0);
    assert.equal(elements["#productError"].textContent, "Please select a valid product location.");
});

test("product validation and delete label can switch to Chinese", () => {
    const elements = setupProductDom();
    setLanguage("zh");
    const view = new ProductView();

    elements["#productTitle"].value = "Laptop";
    elements["#productLocations"].value = "none";
    elements["#categoriesSelect"].value = "none";
    view.addNewProduct();

    assert.equal(elements["#productError"].textContent, "请选择有效的产品位置。");

    view.showListedProducts([{
        id: 20,
        title: "Laptop",
        location: "BDG",
        category: "Hardware",
        persianDate: "2026/5/6",
        quantity: 1
    }]);

    const deleteButton = elements["#productsCenter"].children[0].children[5];
    assert.equal(deleteButton.getAttribute("aria-label"), "删除产品 Laptop");
});


test("product list renders user input as text and creates an accessible delete button", () => {
    const elements = setupProductDom();
    const view = new ProductView();
    const payload = "<img src=x onerror=alert(1)>";
    localStorage.setItem("products", JSON.stringify([{ id: 10, title: payload }]));

    view.showListedProducts([{
        id: 10,
        title: payload,
        location: "BDG",
        category: "Hardware",
        persianDate: "2026/5/4",
        quantity: 2
    }]);

    const productRow = elements["#productsCenter"].children[0];
    const titleCell = productRow.children[0];
    const deleteButton = productRow.children[5];

    assert.equal(titleCell.textContent, payload);
    assert.equal(titleCell.children.length, 0);
    assert.equal(deleteButton.tagName, "BUTTON");
    assert.equal(deleteButton.type, "button");
    assert.equal(deleteButton.getAttribute("aria-label"), `Delete product ${payload}`);

    let preventedDefault = false;
    deleteButton.listeners.keydown({
        key: "Enter",
        preventDefault() {
            preventedDefault = true;
        }
    });
    assert.equal(preventedDefault, true);
    assert.equal(JSON.parse(localStorage.getItem("products")).length, 0);
});

test("duplicate category updates are saved back to localStorage", () => {
    const elements = setupCategoryDom();
    localStorage.setItem("categories", JSON.stringify([
        { id: 1, title: "Food", description: "old", createdAt: "2026-05-01T00:00:00.000Z" }
    ]));
    const view = new CategoryView();

    elements["#categoryTitle"].value = " food ";
    elements["#categoryDescription"].value = "new";
    view.addNewCategory();

    const categories = JSON.parse(localStorage.getItem("categories"));
    assert.equal(categories.length, 1);
    assert.equal(categories[0].title, "food");
    assert.equal(categories[0].description, "new");
});
