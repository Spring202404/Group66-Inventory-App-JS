const COOKIE_CONSENT_KEY = "inventory-app-cookie-consent";
const COOKIE_ACCEPTED = "accepted";
const COOKIE_REJECTED = "rejected";

export class CookieBanner {
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
        // Only show banner if no consent decision has been made
        if (!this.consentStatus) {
            this.createBanner();
            this.showBanner();
        }
    }

    createBanner() {
        const banner = document.createElement("div");
        banner.id = "cookie-banner";
        banner.className = "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 w-[min(92%,720px)]";
        
        const content = document.createElement("div");
        content.className = "px-4 py-4 flex items-center justify-between gap-4 flex-wrap";
        
        const textContainer = document.createElement("div");
        textContainer.className = "flex-1 min-w-[250px]";
        
        const title = document.createElement("h3");
        title.className = "text-white font-semibold mb-2 text-sm";
        title.setAttribute("data-i18n", "cookieTitle");
        title.textContent = "Cookie Settings";
        
        const description = document.createElement("p");
        description.className = "text-gray-300 text-sm";
        description.setAttribute("data-i18n", "cookieDescription");
        description.textContent = "We use cookies to enhance your experience. Learn more about our ";
        
        const privacyLink = document.createElement("a");
        privacyLink.href = "privacy-policy.html";
        privacyLink.className = "text-green-500 hover:text-green-400 underline";
        privacyLink.setAttribute("data-i18n", "privacyPolicy");
        privacyLink.textContent = "privacy policy";
        privacyLink.target = "_blank";
        privacyLink.rel = "noopener noreferrer";
        
        description.appendChild(privacyLink);
        
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex gap-3 flex-wrap";
        
        const acceptBtn = document.createElement("button");
        acceptBtn.className = "bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors text-sm";
        acceptBtn.setAttribute("data-i18n", "acceptCookies");
        acceptBtn.textContent = "Accept";
        acceptBtn.addEventListener("click", () => this.acceptCookies());
        
        const rejectBtn = document.createElement("button");
        rejectBtn.className = "bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg transition-colors text-sm";
        rejectBtn.setAttribute("data-i18n", "rejectCookies");
        rejectBtn.textContent = "Reject";
        rejectBtn.addEventListener("click", () => this.rejectCookies());
        
        textContainer.appendChild(title);
        textContainer.appendChild(description);
        buttonContainer.appendChild(acceptBtn);
        buttonContainer.appendChild(rejectBtn);
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
        // Enable analytics, tracking, etc.
        this.enableAnalytics();
        this.hideBanner();
    }

    rejectCookies() {
        this.setConsentStatus(COOKIE_REJECTED);
        // Disable analytics, tracking, etc.
        this.disableAnalytics();
        this.hideBanner();
    }

    enableAnalytics() {
        // Placeholder for enabling third-party cookies/analytics
        console.log("Analytics enabled");
    }

    disableAnalytics() {
        // Placeholder for disabling third-party cookies/analytics
        console.log("Analytics disabled");
    }

    // Check if user has accepted cookies
    hasAcceptedCookies() {
        return this.consentStatus === COOKIE_ACCEPTED;
    }

    // Check if user has rejected cookies
    hasRejectedCookies() {
        return this.consentStatus === COOKIE_REJECTED;
    }

    // Reset consent (for testing or user preference reset)
    resetConsent() {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        this.consentStatus = null;
        this.init();
    }
}

export default CookieBanner;
