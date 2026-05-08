const assert = require("node:assert/strict");
const test = require("node:test");

const ProductView = require("../public/build/babel/productView.js").default;
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
            return selector === ".toggleBtn"
                ? [elements["#incQty"], elements["#decQty"]]
                : [];
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

test.beforeEach(() => {
    global.localStorage = new MemoryStorage();
    global.alert = () => {};
});

// ===== ProductView Tests =====

test("product quantity increases when increment button is clicked", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    view.toggleProductQty({ currentTarget: elements["#incQty"] });

    assert.equal(elements["#productQuantity"].innerText, "1");
    assert.equal(elements["#decQty"].disabled, false);
});

test("product quantity cannot go below zero", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    view.toggleProductQty({ currentTarget: elements["#decQty"] });

    assert.equal(elements["#productQuantity"].innerText, "0");
    assert.equal(elements["#decQty"].disabled, true);
});

test("product form rejects short product title", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    elements["#productTitle"].value = "A";
    elements["#productLocations"].value = "BDG";
    elements["#categoriesSelect"].value = "Hardware";
    elements["#productQuantity"].innerText = "1";

    view.addNewProduct();

    assert.deepEqual(Storage.getProducts, []);
    assert.equal(elements["#productError"].textContent, "Product title must be at least 2 characters.");
});

test("product form rejects default location value", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    elements["#productTitle"].value = "Laptop";
    elements["#productLocations"].value = "none";
    elements["#categoriesSelect"].value = "Hardware";
    elements["#productQuantity"].innerText = "1";

    view.addNewProduct();

    assert.deepEqual(Storage.getProducts, []);
    assert.equal(elements["#productError"].textContent, "Please select a valid product location.");
});

test("product form rejects default category value", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    elements["#productTitle"].value = "Laptop";
    elements["#productLocations"].value = "BDG";
    elements["#categoriesSelect"].value = "none";
    elements["#productQuantity"].innerText = "1";

    view.addNewProduct();

    assert.deepEqual(Storage.getProducts, []);
    assert.equal(elements["#productError"].textContent, "Please select a valid product category.");
});

test("valid product can be added and form is reset", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    elements["#productTitle"].value = "Laptop";
    elements["#productLocations"].value = "BDG";
    elements["#categoriesSelect"].value = "Hardware";
    elements["#productQuantity"].innerText = "3";

    view.addNewProduct();

    const products = Storage.getProducts;

    assert.equal(products.length, 1);
    assert.equal(products[0].title, "Laptop");
    assert.equal(products[0].location, "BDG");
    assert.equal(products[0].category, "Hardware");
    assert.equal(products[0].quantity, 3);

    assert.equal(elements["#productTitle"].value, "");
    assert.equal(elements["#productLocations"].value, "none");
    assert.equal(elements["#categoriesSelect"].value, "none");
    assert.equal(elements["#productQuantity"].innerText, "0");
    assert.equal(elements["#productError"].textContent, "");
});

test("search products filters by title case-insensitively", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    Storage.saveProducts([
        { id: 1, title: "Laptop", location: "BDG", category: "Tech", quantity: 1 },
        { id: 2, title: "Apple", location: "Home", category: "Food", quantity: 2 }
    ]);

    view.searchProducts("lap");

    assert.equal(elements["#productsCenter"].children.length, 1);
    assert.equal(elements["#productsCenter"].children[0].children[0].textContent, "Laptop");
});

test("sortBySelect sorts products from A to Z", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    Storage.saveProducts([
        { id: 1, title: "Zebra", location: "A", category: "C", quantity: 1 },
        { id: 2, title: "Apple", location: "A", category: "C", quantity: 1 }
    ]);

    view.sortBySelect("A-Z");

    assert.equal(elements["#productsCenter"].children[0].children[0].textContent, "Apple");
    assert.equal(elements["#productsCenter"].children[1].children[0].textContent, "Zebra");
});

test("sortBySelect sorts products from Z to A", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    Storage.saveProducts([
        { id: 1, title: "Apple", location: "A", category: "C", quantity: 1 },
        { id: 2, title: "Zebra", location: "A", category: "C", quantity: 1 }
    ]);

    view.sortBySelect("Z-A");

    assert.equal(elements["#productsCenter"].children[0].children[0].textContent, "Zebra");
    assert.equal(elements["#productsCenter"].children[1].children[0].textContent, "Apple");
});

test("sortBySelect sorts newest and oldest products", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    Storage.saveProducts([
        { id: 1, title: "Old", location: "A", category: "C", quantity: 1 },
        { id: 3, title: "New", location: "A", category: "C", quantity: 1 }
    ]);

    view.sortBySelect("newest");
    assert.equal(elements["#productsCenter"].children[0].children[0].textContent, "New");

    view.sortBySelect("oldest");
    assert.equal(elements["#productsCenter"].children[0].children[0].textContent, "Old");
});

test("sortBySelect keeps original order for unknown sort type", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    Storage.saveProducts([
        { id: 1, title: "First", location: "A", category: "C", quantity: 1 },
        { id: 2, title: "Second", location: "A", category: "C", quantity: 1 }
    ]);

    view.sortBySelect("unknown");

    assert.equal(elements["#productsCenter"].children[0].children[0].textContent, "First");
    assert.equal(elements["#productsCenter"].children[1].children[0].textContent, "Second");
});

test("updateProductQuantity increases and decreases product quantity safely", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    Storage.saveProducts([
        { id: 1, title: "Laptop", location: "BDG", category: "Tech", quantity: 1 }
    ]);

    view.updateProductQuantity(1, 1);
    assert.equal(Storage.getProducts[0].quantity, 2);

    view.updateProductQuantity(1, -5);
    assert.equal(Storage.getProducts[0].quantity, 0);
});

test("deleteProduct removes selected product", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    Storage.saveProducts([
        { id: 1, title: "Laptop", location: "BDG", category: "Tech", quantity: 1 },
        { id: 2, title: "Mouse", location: "BDG", category: "Tech", quantity: 1 }
    ]);

    view.deleteProduct(1);

    assert.equal(Storage.getProducts.length, 1);
    assert.equal(Storage.getProducts[0].title, "Mouse");
});

test("formatProductDate uses createdAt, persianDate, or empty string", () => {
    setupProductDom();
    const view = new ProductView();

    assert.equal(
        view.formatProductDate({ createdAt: new Date("2026-05-08T00:00:00.000Z").getTime() }),
        "2026-05-08"
    );

    assert.equal(
        view.formatProductDate({ persianDate: "2026/5/8" }),
        "2026/5/8"
    );

    assert.equal(
        view.formatProductDate({}),
        ""
    );
});

test("product list renders user input as text and creates accessible controls", () => {
    const elements = setupProductDom();
    const view = new ProductView();
    const payload = "<img src=x onerror=alert(1)>";

    view.showListedProducts([
        {
            id: 10,
            title: payload,
            location: "BDG",
            category: "Hardware",
            createdAt: new Date("2026-05-04T00:00:00.000Z").getTime(),
            quantity: 2
        }
    ]);

    const productRow = elements["#productsCenter"].children[0];
    const titleCell = productRow.children[0];
    const quantityControls = productRow.children[4];
    const deleteButton = productRow.children[5];

    assert.equal(titleCell.textContent, payload);
    assert.equal(titleCell.children.length, 0);

    assert.equal(quantityControls.children[0].tagName, "BUTTON");
    assert.equal(quantityControls.children[0].getAttribute("aria-label"), `Decrease quantity of ${payload}`);
    assert.equal(quantityControls.children[2].getAttribute("aria-label"), `Increase quantity of ${payload}`);

    assert.equal(deleteButton.tagName, "BUTTON");
    assert.equal(deleteButton.type, "button");
    assert.equal(deleteButton.getAttribute("aria-label"), `Delete product ${payload}`);
});

test("delete button supports click, Enter, and Space activation", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    Storage.saveProducts([
        { id: 10, title: "Laptop", location: "BDG", category: "Hardware", quantity: 2 }
    ]);

    view.showListedProducts([
        { id: 10, title: "Laptop", location: "BDG", category: "Hardware", quantity: 2 }
    ]);

    const deleteButton = elements["#productsCenter"].children[0].children[5];

    let preventedEnter = false;
    deleteButton.listeners.keydown({
        key: "Enter",
        preventDefault() {
            preventedEnter = true;
        }
    });

    assert.equal(preventedEnter, true);
    assert.deepEqual(Storage.getProducts, []);

    Storage.saveProducts([
        { id: 11, title: "Mouse", location: "BDG", category: "Hardware", quantity: 2 }
    ]);

    view.showListedProducts([
        { id: 11, title: "Mouse", location: "BDG", category: "Hardware", quantity: 2 }
    ]);

    const secondDeleteButton = elements["#productsCenter"].children[0].children[5];

    let preventedSpace = false;
    secondDeleteButton.listeners.keydown({
        key: " ",
        preventDefault() {
            preventedSpace = true;
        }
    });

    assert.equal(preventedSpace, true);
    assert.deepEqual(Storage.getProducts, []);
});

test("languagechange event clears product error and refreshes list", () => {
    const elements = setupProductDom();
    const view = new ProductView();

    elements["#productError"].textContent = "Old error";
    elements["#sort"].value = "newest";

    Storage.saveProducts([
        { id: 1, title: "Laptop", location: "BDG", category: "Tech", quantity: 1 }
    ]);

    global.document.dispatchEvent({ type: "languagechange" });

    assert.equal(elements["#productError"].textContent, "");
    assert.equal(elements["#productsCenter"].children.length, 1);
});