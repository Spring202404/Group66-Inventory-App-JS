const LANGUAGE_KEY = "inventory-app-language";

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

let currentLanguage = getSavedLanguage();

export function initI18n() {
    applyTranslations();
    setupLanguageButtons();
}

export function setLanguage(language) {
    currentLanguage = translations[language] ? language : "en";
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(LANGUAGE_KEY, currentLanguage);
    }
    if (typeof document === "undefined") return;
    applyTranslations();
    if (typeof document.dispatchEvent === "function") {
        const event = typeof CustomEvent === "function"
            ? new CustomEvent("languagechange", { detail: { language: currentLanguage } })
            : { type: "languagechange", detail: { language: currentLanguage } };
        document.dispatchEvent(event);
    }
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function t(key, replacements = {}) {
    const dictionary = translations[currentLanguage] || translations.en;
    const template = dictionary[key] || translations.en[key] || key;
    return Object.entries(replacements).reduce((value, [name, replacement]) => {
        return value.replace(`{${name}}`, replacement);
    }, template);
}

function getSavedLanguage() {
    if (typeof localStorage === "undefined") return "en";
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    return translations[savedLanguage] ? savedLanguage : "en";
}

function setupLanguageButtons() {
    document.querySelectorAll("[data-lang-option]").forEach((button) => {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.langOption);
        });
    });
}

function applyTranslations() {
    if (typeof document === "undefined") return;
    document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
        element.setAttribute("aria-label", t(element.dataset.i18nAria));
    });

    document.querySelectorAll("[data-lang-option]").forEach((button) => {
        const isSelected = button.dataset.langOption === currentLanguage;
        button.setAttribute("aria-pressed", String(isSelected));
        button.classList.toggle("bg-green-600", isSelected);
        button.classList.toggle("text-main", isSelected);
        button.classList.toggle("text-stone-200", !isSelected);
        button.classList.toggle("border-green-600", isSelected);
        button.classList.toggle("border-[#394247]", !isSelected);
    });
}
