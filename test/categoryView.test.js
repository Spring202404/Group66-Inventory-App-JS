const assert = require("node:assert/strict");
const test = require("node:test");

const CategoryView = require("../public/build/babel/categoryView.js").default;
const Storage = require("../public/build/babel/storage.js").default;
const { setLanguage } = require("../public/build/babel/i18n.js");

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

function createElement(tagName = "div") {
    return {
        tagName: tagName.toUpperCase(),
        id: "",
        value: "",
        selected: false,
        textContent: "",
        children: [],
        listeners: {},

        addEventListener(type, handler) {
            this.listeners[type] = handler;
        },

        append(...children) {
            this.children.push(...children);
        },

        replaceChildren(...children) {
            this.children = children;
        }
    };
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
    global.alertMessage = "";

    global.alert = (message) => {
        global.alertMessage = message;
    };
});

// ===== CategoryView Tests =====

test("category view initializes DOM elements and event listeners", () => {
    const elements = setupCategoryDom();

    new CategoryView();

    assert.equal(typeof elements["#categoryAddNewBtn"].listeners.click, "function");
    assert.equal(typeof elements["#categoryCanelBtn"].listeners.click, "function");
});

test("setupApp renders saved categories into select options", () => {
    const elements = setupCategoryDom();

    Storage.saveCategories([
        { id: 1, title: "Food", description: "Daily items" },
        { id: 2, title: "Tech", description: "Electronic items" }
    ]);

    const view = new CategoryView();
    view.setupApp();

    assert.equal(elements["#categoriesSelect"].children.length, 3);
    assert.equal(elements["#categoriesSelect"].children[0].value, "none");
    assert.equal(elements["#categoriesSelect"].children[0].textContent, "- select category -");
    assert.equal(elements["#categoriesSelect"].children[1].value, "Food");
    assert.equal(elements["#categoriesSelect"].children[2].value, "Tech");
});

test("addNewCategory adds a valid new category", () => {
    const elements = setupCategoryDom();
    const view = new CategoryView();

    elements["#categoryTitle"].value = " Food ";
    elements["#categoryDescription"].value = " Daily items ";

    view.addNewCategory();

    const categories = Storage.getCategories();

    assert.equal(categories.length, 1);
    assert.equal(categories[0].title, "Food");
    assert.equal(categories[0].description, "Daily items");
    assert.equal(typeof categories[0].id, "number");
    assert.equal(typeof categories[0].createdAt, "string");

    assert.equal(elements["#categoryTitle"].value, "");
    assert.equal(elements["#categoryDescription"].value, "");

    assert.equal(elements["#categoriesSelect"].children.length, 2);
    assert.equal(elements["#categoriesSelect"].children[1].value, "Food");
});

test("addNewCategory rejects short category title", () => {
    const elements = setupCategoryDom();
    const view = new CategoryView();

    elements["#categoryTitle"].value = "A";
    elements["#categoryDescription"].value = "Invalid";

    view.addNewCategory();

    assert.deepEqual(Storage.getCategories(), []);
    assert.equal(global.alertMessage, "Category title must be at least 2 characters.");
});

test("addNewCategory updates duplicate category instead of creating a new one", () => {
    const elements = setupCategoryDom();

    Storage.saveCategories([
        {
            id: 1,
            title: "Food",
            description: "Old description",
            createdAt: "2026-05-01T00:00:00.000Z"
        }
    ]);

    const view = new CategoryView();

    elements["#categoryTitle"].value = " food ";
    elements["#categoryDescription"].value = "New description";

    view.addNewCategory();

    const categories = Storage.getCategories();

    assert.equal(categories.length, 1);
    assert.equal(categories[0].title, "food");
    assert.equal(categories[0].description, "New description");
    assert.equal(categories[0].id, 1);

    assert.equal(global.alertMessage, "This category name already exists, so the description was updated.");
    assert.equal(elements["#categoryTitle"].value, "");
    assert.equal(elements["#categoryDescription"].value, "");
});

test("cancel button clears category form with blank spaces", () => {
    const elements = setupCategoryDom();

    new CategoryView();

    elements["#categoryTitle"].value = "Food";
    elements["#categoryDescription"].value = "Daily items";

    elements["#categoryCanelBtn"].listeners.click();

    assert.equal(elements["#categoryTitle"].value, " ");
    assert.equal(elements["#categoryDescription"].value, " ");
});

test("resetCategoryForm clears category inputs", () => {
    const elements = setupCategoryDom();
    const view = new CategoryView();

    elements["#categoryTitle"].value = "Food";
    elements["#categoryDescription"].value = "Daily items";

    view.resetCategoryForm();

    assert.equal(elements["#categoryTitle"].value, "");
    assert.equal(elements["#categoryDescription"].value, "");
});

test("instantCtgUpdate trims category titles and replaces old options", () => {
    const elements = setupCategoryDom();
    const view = new CategoryView();

    const oldOption = createElement("option");
    oldOption.value = "Old";
    elements["#categoriesSelect"].append(oldOption);

    view.instantCtgUpdate([
        { id: 1, title: " Food ", description: "Daily items" },
        { id: 2, title: " Tech ", description: "Electronic items" }
    ]);

    assert.equal(elements["#categoriesSelect"].children.length, 3);
    assert.equal(elements["#categoriesSelect"].children[0].value, "none");
    assert.equal(elements["#categoriesSelect"].children[1].value, "Food");
    assert.equal(elements["#categoriesSelect"].children[1].textContent, "Food");
    assert.equal(elements["#categoriesSelect"].children[2].value, "Tech");
    assert.equal(elements["#categoriesSelect"].children[2].textContent, "Tech");
});

test("languagechange event refreshes category select text", () => {
    const elements = setupCategoryDom();

    Storage.saveCategories([
        { id: 1, title: "Food", description: "Daily items" }
    ]);

    new CategoryView();

    setLanguage("zh");
    global.document.dispatchEvent({ type: "languagechange" });

    assert.equal(elements["#categoriesSelect"].children[0].textContent, "- 选择分类 -");
    assert.equal(elements["#categoriesSelect"].children[1].value, "Food");
});