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
