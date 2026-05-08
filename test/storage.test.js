const assert = require("node:assert/strict");
const test = require("node:test");

const Storage = require("../public/build/babel/storage.js").default;

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

test.beforeEach(() => {
    global.localStorage = new MemoryStorage();
});

// ===== Storage Tests =====

test("storage returns empty products array when localStorage has no products", () => {
    assert.deepEqual(Storage.getProducts, []);
});

test("storage saves and retrieves products", () => {
    const products = [
        { id: 1, title: "Laptop", quantity: 2 },
        { id: 2, title: "Mouse", quantity: 5 }
    ];

    Storage.saveProducts(products);

    assert.deepEqual(Storage.getProducts, products);
});

test("storage returns empty categories array when localStorage has no categories", () => {
    assert.deepEqual(Storage.getCategories(), []);
});

test("storage saves and retrieves categories", () => {
    const categories = [
        { id: 1, title: "Food", description: "Daily items" },
        { id: 2, title: "Tech", description: "Electronic items" }
    ];

    Storage.saveCategories(categories);

    assert.deepEqual(Storage.getCategories(), categories);
});

test("storage removes product by id", () => {
    const products = [
        { id: 1, title: "Laptop", quantity: 2 },
        { id: 2, title: "Mouse", quantity: 5 },
        { id: 3, title: "Keyboard", quantity: 1 }
    ];

    Storage.saveProducts(products);
    Storage.removeProduct(2);

    assert.deepEqual(Storage.getProducts, [
        { id: 1, title: "Laptop", quantity: 2 },
        { id: 3, title: "Keyboard", quantity: 1 }
    ]);
});

test("storage keeps products unchanged when removing a non-existing id", () => {
    const products = [
        { id: 1, title: "Laptop", quantity: 2 }
    ];

    Storage.saveProducts(products);
    Storage.removeProduct(999);

    assert.deepEqual(Storage.getProducts, products);
});