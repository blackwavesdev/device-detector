export const detectDevice = (userAgentString) => {
    // Allow passing a custom UA string for server-side detection
    const userAgent = userAgentString ||
        (typeof navigator !== "undefined"
            ? navigator.userAgent || navigator.vendor || window.opera
            : "");
    const ua = userAgent.toLowerCase();
    // Device type detection
    const isMobile = /iphone|ipod|android.*mobile|windows phone|blackberry|bb10|iemobile/i.test(ua);
    const isTablet = /ipad|android(?!.*mobile)|tablet|kindle|silk/i.test(ua);
    const isDesktop = !isMobile && !isTablet;
    // OS detection
    let os = "Other";
    if (/windows nt|win32|win64/i.test(ua))
        os = "Windows";
    else if (/macintosh|mac os x|mac_powerpc/i.test(ua))
        os = "Mac OS";
    else if (/android/i.test(ua))
        os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua))
        os = "iOS";
    else if (/linux/i.test(ua))
        os = "Linux";
    // Browser detection
    let browser = "Other";
    if (/chrome|crios/i.test(ua) && !/edge|edg|opr|opera/i.test(ua))
        browser = "Chrome";
    else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua))
        browser = "Safari";
    else if (/firefox|fxios/i.test(ua))
        browser = "Firefox";
    else if (/edg|edge|edga|edgios|edg/i.test(ua))
        browser = "Edge";
    else if (/opera|opr/i.test(ua))
        browser = "Opera";
    // OS version extraction
    const getOSVersion = () => {
        const versionPatterns = {
            iOS: /os (\d+[._]\d+(?:[._]\d+)?)/i,
            Android: /android[ /-](\d+[._]\d+(?:[._]\d+)?)/i,
            Windows: /windows nt (\d+[._]\d+)/i,
            "Mac OS": /mac os x (\d+[._]\d+(?:[._]\d+)?)/i,
            Linux: /(?:linux|ubuntu)[ /](\d+[._]\d+(?:[._]\d+)?)/i,
            Other: /(?:rv:|version\/)(\d+[._]\d+(?:[._]\d+)?)/i,
        };
        const match = userAgent.match(versionPatterns[os]);
        if (!match)
            return "";
        return match[1]?.replace(/_/g, ".") || "";
    };
    // Browser version extraction
    const getBrowserVersion = () => {
        const versionPatterns = {
            Chrome: [
                /chrome\/(\d+[._]\d+[._]\d+[._]\d+)/i,
                /chrome\/(\d+[._]\d+[._]\d+)/i,
                /chrome\/(\d+[._]\d+)/i,
            ],
            Safari: [/version\/(\d+[._]\d+[._]\d+)/i, /version\/(\d+[._]\d+)/i],
            Firefox: [/firefox\/(\d+[._]\d+[._]\d+)/i, /firefox\/(\d+[._]\d+)/i],
            Edge: [/edg?\/(\d+[._]\d+[._]\d+)/i, /edg?\/(\d+[._]\d+)/i],
            Opera: [/opr\/(\d+[._]\d+[._]\d+)/i, /opera\/(\d+[._]\d+)/i],
            Other: [/(?:rv:|version\/)(\d+[._]\d+(?:[._]\d+)?)/i],
        };
        const patterns = versionPatterns[browser];
        for (const pattern of patterns) {
            const match = userAgent.match(pattern);
            if (match)
                return match[1]?.replace(/_/g, ".");
        }
        return "";
    };
    // Touch screen detection
    const isTouchScreen = () => {
        if (typeof window === "undefined")
            return isMobile || isTablet;
        return ("ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0);
    };
    // Language detection
    const getLanguage = () => {
        if (typeof navigator === "undefined")
            return "";
        return (navigator.language ||
            navigator.userLanguage ||
            navigator.browserLanguage ||
            navigator.systemLanguage ||
            "");
    };
    return {
        isMobile,
        isTablet,
        isDesktop,
        os,
        osVersion: getOSVersion(),
        browser,
        browserVersion: getBrowserVersion(),
        deviceType: isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop",
        isTouchScreen: isTouchScreen(),
        language: getLanguage(),
        platform: typeof navigator !== "undefined" ? navigator.platform : "",
        userAgent,
    };
};
