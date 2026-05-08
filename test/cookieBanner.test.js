const assert = require("node:assert/strict");
const test = require("node:test");

const CookieBanner =
    require("../public/build/babel/cookieBanner.js").default;

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

function createElement(tagName = "div") {
    return {
        tagName: tagName.toUpperCase(),
        id: "",
        className: "",
        textContent: "",
        href: "",
        target: "",
        rel: "",
        children: [],
        listeners: {},
        attributes: {},

        style: {
            display: "",
            position: "",
            bottom: "",
            left: "",
            transform: "",
            backgroundColor: "",
            border: "",
            borderRadius: "",
            boxShadow: "",
            width: "",
            zIndex: "",
            padding: "",
            gap: "",
            alignItems: "",
            justifyContent: "",
            maxWidth: "",
            color: "",
            cursor: "",
            minWidth: ""
        },

        appendChild(child) {
            this.children.push(child);
        },

        append(child) {
            this.children.push(child);
        },

        addEventListener(type, handler) {
            this.listeners[type] = handler;
        },

        setAttribute(name, value) {
            this.attributes[name] = String(value);
        },

        getAttribute(name) {
            return this.attributes[name] || null;
        }
    };
}

function setupCookieDom() {
    const bodyChildren = [];

    global.document = {
        body: {
            appendChild(element) {
                bodyChildren.push(element);
            }
        },

        createElement,

        getElementById(id) {
            return bodyChildren.find((element) => element.id === id) || null;
        }
    };

    return {
        bodyChildren
    };
}

test.beforeEach(() => {
    global.localStorage = new MemoryStorage();

    global.console = {
        log() {}
    };
});

// ===== Cookie Banner Tests =====

test("cookie banner initializes with null consent status", () => {
    setupCookieDom();

    const banner = new CookieBanner();

    assert.equal(banner.consentStatus, null);
});

test("cookie banner reads saved accepted consent", () => {
    setupCookieDom();

    localStorage.setItem(
        "inventory-app-cookie-consent",
        "accepted"
    );

    const banner = new CookieBanner();

    assert.equal(banner.consentStatus, "accepted");
    assert.equal(banner.hasAcceptedCookies(), true);
    assert.equal(banner.hasRejectedCookies(), false);
});

test("cookie banner reads saved rejected consent", () => {
    setupCookieDom();

    localStorage.setItem(
        "inventory-app-cookie-consent",
        "rejected"
    );

    const banner = new CookieBanner();

    assert.equal(banner.consentStatus, "rejected");
    assert.equal(banner.hasAcceptedCookies(), false);
    assert.equal(banner.hasRejectedCookies(), true);
});

test("init creates and shows banner when no consent exists", () => {
    const dom = setupCookieDom();

    const banner = new CookieBanner();

    banner.init();

    assert.equal(dom.bodyChildren.length, 1);
    assert.equal(dom.bodyChildren[0].id, "cookie-banner");
});

test("init does not create banner when consent already exists", () => {
    const dom = setupCookieDom();

    localStorage.setItem(
        "inventory-app-cookie-consent",
        "accepted"
    );

    const banner = new CookieBanner();

    banner.init();

    assert.equal(dom.bodyChildren.length, 0);
});

test("createBanner builds banner structure correctly", () => {
    setupCookieDom();

    const banner = new CookieBanner();

    banner.createBanner();

    assert.equal(banner.banner.id, "cookie-banner");
    assert.equal(banner.banner.tagName, "DIV");
    assert.equal(
        banner.banner.style.position,
        "fixed"
    );

    assert.equal(
        banner.banner.children.length,
        1
    );
});

test("banner contains privacy policy link", () => {
    setupCookieDom();

    const banner = new CookieBanner();

    banner.createBanner();

    const content = banner.banner.children[0];
    const textContainer = content.children[0];
    const description = textContainer.children[1];
    const privacyLink = description.children[0];

    assert.equal(
        privacyLink.href,
        "privacy-policy.html"
    );

    assert.equal(
        privacyLink.target,
        "_blank"
    );

    assert.equal(
        privacyLink.rel,
        "noopener noreferrer"
    );
});

test("acceptCookies stores accepted consent and hides banner", () => {
    setupCookieDom();

    const banner = new CookieBanner();

    banner.createBanner();

    let analyticsEnabled = false;

    banner.enableAnalytics = () => {
        analyticsEnabled = true;
    };

    banner.acceptCookies();

    assert.equal(
        localStorage.getItem("inventory-app-cookie-consent"),
        "accepted"
    );

    assert.equal(
        banner.hasAcceptedCookies(),
        true
    );

    assert.equal(
        analyticsEnabled,
        true
    );

    assert.equal(
        banner.banner.style.display,
        "none"
    );
});

test("rejectCookies stores rejected consent and hides banner", () => {
    setupCookieDom();

    const banner = new CookieBanner();

    banner.createBanner();

    let analyticsDisabled = false;

    banner.disableAnalytics = () => {
        analyticsDisabled = true;
    };

    banner.rejectCookies();

    assert.equal(
        localStorage.getItem("inventory-app-cookie-consent"),
        "rejected"
    );

    assert.equal(
        banner.hasRejectedCookies(),
        true
    );

    assert.equal(
        analyticsDisabled,
        true
    );

    assert.equal(
        banner.banner.style.display,
        "none"
    );
});

test("showBanner appends banner only once", () => {
    const dom = setupCookieDom();

    const banner = new CookieBanner();

    banner.createBanner();

    banner.showBanner();
    banner.showBanner();

    assert.equal(dom.bodyChildren.length, 1);
});

test("hideBanner hides existing banner", () => {
    setupCookieDom();

    const banner = new CookieBanner();

    banner.createBanner();

    banner.hideBanner();

    assert.equal(
        banner.banner.style.display,
        "none"
    );
});

test("hideBanner safely handles missing banner", () => {
    setupCookieDom();

    const banner = new CookieBanner();

    assert.doesNotThrow(() => {
        banner.hideBanner();
    });
});

test("resetConsent clears localStorage and reinitializes banner", () => {
    const dom = setupCookieDom();

    localStorage.setItem(
        "inventory-app-cookie-consent",
        "accepted"
    );

    const banner = new CookieBanner();

    banner.resetConsent();

    assert.equal(
        localStorage.getItem("inventory-app-cookie-consent"),
        null
    );

    assert.equal(
        banner.consentStatus,
        null
    );

    assert.equal(
        dom.bodyChildren.length,
        1
    );
});

test("accept and reject buttons trigger correct actions", () => {
    setupCookieDom();

    const banner = new CookieBanner();

    banner.createBanner();

    const content = banner.banner.children[0];
    const buttonContainer = content.children[1];

    const rejectBtn = buttonContainer.children[0];
    const acceptBtn = buttonContainer.children[1];

    acceptBtn.listeners.click();

    assert.equal(
        banner.hasAcceptedCookies(),
        true
    );

    banner.resetConsent();

    rejectBtn.listeners.click();

    assert.equal(
        banner.hasRejectedCookies(),
        true
    );
});

test("default analytics methods do not throw errors", () => {
    setupCookieDom();

    const banner = new CookieBanner();

    assert.doesNotThrow(() => {
        banner.enableAnalytics();
    });

    assert.doesNotThrow(() => {
        banner.disableAnalytics();
    });
});