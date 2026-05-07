// Cookie Banner Implementation
const COOKIE_CONSENT_KEY = "inventory-app-cookie-consent";
const COOKIE_ACCEPTED = "accepted";
const COOKIE_REJECTED = "rejected";

class CookieBanner {
    constructor() {
        this.banner = null;
        this.consentStatus = this.getConsentStatus();
    }

    getConsentStatus() {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        return stored || null;
    }

    setConsentStatus(status) {
        localStorage.setItem(COOKIE_CONSENT_KEY, status);
        this.consentStatus = status;
    }

    init() {
        if (!this.consentStatus) {
            this.createBanner();
            this.showBanner();
        }
    }

    createBanner() {
        const banner = document.createElement("div");
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
        
        const content = document.createElement("div");
        content.className = "grid gap-4 md:grid-cols-[1.9fr_auto] items-center px-5 py-5";
        content.style.display = "grid";
        content.style.gap = "16px";
        content.style.alignItems = "center";
        content.style.padding = "20px";
        
        const textContainer = document.createElement("div");
        textContainer.className = "flex-1 min-w-[250px] space-y-3";
        
        const title = document.createElement("h3");
        title.className = "text-slate-950 font-semibold text-base sm:text-lg";
        title.setAttribute("data-i18n", "cookieTitle");
        title.textContent = "Cookie Settings";
        
        const description = document.createElement("p");
        description.className = "text-slate-600 text-sm leading-6";
        description.setAttribute("data-i18n", "cookieDescription");
        description.textContent = "We use cookies to improve your experience and personalize content. Learn more in our ";
        
        const privacyLink = document.createElement("a");
        privacyLink.href = "privacy-policy.html";
        privacyLink.className = "text-emerald-600 hover:text-emerald-500 font-semibold underline decoration-emerald-300/80";
        privacyLink.setAttribute("data-i18n", "privacyPolicy");
        privacyLink.textContent = "privacy policy";
        privacyLink.target = "_blank";
        privacyLink.rel = "noopener noreferrer";
        
        description.appendChild(privacyLink);
        
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex justify-between items-center gap-3 w-full max-w-[320px]";
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";
        buttonContainer.style.alignItems = "center";
        buttonContainer.style.gap = "12px";
        buttonContainer.style.width = "100%";
        buttonContainer.style.maxWidth = "320px";
        
        const acceptBtn = document.createElement("button");
        acceptBtn.className = "inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300";
        acceptBtn.style.backgroundColor = "#16a34a";
        acceptBtn.style.color = "#ffffff";
        acceptBtn.style.border = "none";
        acceptBtn.style.cursor = "pointer";
        acceptBtn.style.padding = "10px 22px";
        acceptBtn.style.minWidth = "120px";
        acceptBtn.setAttribute("data-i18n", "acceptCookies");
        acceptBtn.textContent = "Accept";
        acceptBtn.addEventListener("click", () => this.acceptCookies());
        
        const rejectBtn = document.createElement("button");
        rejectBtn.className = "inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300";
        rejectBtn.style.backgroundColor = "#ffffff";
        rejectBtn.style.color = "#334155";
        rejectBtn.style.border = "1px solid #cbd5e1";
        rejectBtn.style.cursor = "pointer";
        rejectBtn.style.padding = "10px 22px";
        rejectBtn.style.minWidth = "120px";
        rejectBtn.setAttribute("data-i18n", "rejectCookies");
        rejectBtn.textContent = "Reject";
        rejectBtn.addEventListener("click", () => this.rejectCookies());
        
        textContainer.appendChild(title);
        textContainer.appendChild(description);
        buttonContainer.appendChild(rejectBtn);
        buttonContainer.appendChild(acceptBtn);
        content.appendChild(textContainer);
        content.appendChild(buttonContainer);
        banner.appendChild(content);
        
        this.banner = banner;
    }

    showBanner() {
        if (this.banner && !document.getElementById("cookie-banner")) {
            document.body.appendChild(this.banner);
        }
    }

    hideBanner() {
        if (this.banner) {
            this.banner.style.display = "none";
        }
    }

    acceptCookies() {
        this.setConsentStatus(COOKIE_ACCEPTED);
        this.enableAnalytics();
        this.hideBanner();
    }

    rejectCookies() {
        this.setConsentStatus(COOKIE_REJECTED);
        this.disableAnalytics();
        this.hideBanner();
    }

    enableAnalytics() {
        console.log("Analytics enabled");
    }

    disableAnalytics() {
        console.log("Analytics disabled");
    }

    hasAcceptedCookies() {
        return this.consentStatus === COOKIE_ACCEPTED;
    }

    hasRejectedCookies() {
        return this.consentStatus === COOKIE_REJECTED;
    }

    resetConsent() {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        this.consentStatus = null;
        this.init();
    }
}

// Make CookieBanner available globally
window.CookieBanner = CookieBanner;

// Translations
const translations = {
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
        deleteProduct: "Delete product {title}",
        cookieTitle: "Cookie Settings",
        cookieDescription: "We use cookies to enhance your experience. Learn more about our ",
        privacyPolicy: "privacy policy",
        acceptCookies: "Accept",
        rejectCookies: "Reject"
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
        deleteProduct: "删除产品 {title}",
        cookieTitle: "Cookie 设置",
        cookieDescription: "我们使用 Cookie 来增强您的体验。详细了解我们的",
        privacyPolicy: "隐私政策",
        acceptCookies: "接受",
        rejectCookies: "拒绝"
    }
};

// i18n implementation
let currentLanguage = (() => {
    if (typeof localStorage === 'undefined') return 'en';
    const stored = localStorage.getItem('inventory-app-language');
    return translations[stored] ? stored : 'en';
})();

function t(key, params = {}) {
    const lang = translations[currentLanguage] || translations.en;
    let text = lang[key] || translations.en[key] || key;
    
    Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
    });
    
    return text;
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('inventory-app-language', lang);
        }
        updateI18n();
        document.dispatchEvent(new Event('languagechange'));
    }
}

function updateI18n() {
    if (typeof document === 'undefined') return;
    
    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });
    
    document.querySelectorAll('[data-lang-option]').forEach(btn => {
        const isActive = btn.dataset.langOption === currentLanguage;
        btn.setAttribute('aria-pressed', String(isActive));
        btn.classList.toggle('bg-green-600', isActive);
        btn.classList.toggle('text-main', isActive);
        btn.classList.toggle('text-stone-200', !isActive);
        btn.classList.toggle('border-green-600', isActive);
        btn.classList.toggle('border-[#394247]', !isActive);
    });
}

function initI18n() {
    updateI18n();
    document.querySelectorAll('[data-lang-option]').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.langOption);
        });
    });
}

// Storage Service
class StorageService {
    static get getProducts() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    static getCategories() {
        return JSON.parse(localStorage.getItem('categories')) || [];
    }

    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    static saveCategories(categories) {
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    static removeProduct(id) {
        const products = this.getProducts.filter(p => p.id !== id);
        this.saveProducts(products);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n
    initI18n();
    
    // Initialize Cookie Banner
    const cookieBanner = new CookieBanner();
    cookieBanner.init();
    
    console.log('Application initialized successfully');
    console.log('CookieBanner available:', typeof window.CookieBanner !== 'undefined');
});
