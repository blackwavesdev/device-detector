"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDevice = void 0;
const detectDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const ua = userAgent.toLowerCase();
    const isMobile = /iphone|android.*mobile|windows phone/.test(ua);
    const isTablet = /ipad|android(?!.*mobile)/.test(ua);
    const isDesktop = !isMobile && !isTablet;
    let os = "Other";
    if (/windows nt/.test(ua))
        os = "Windows";
    else if (/macintosh|mac os x/.test(ua))
        os = "Mac OS";
    else if (/android/.test(ua))
        os = "Android";
    else if (/iphone|ipad|ipod/.test(ua))
        os = "iOS";
    else if (/linux/.test(ua))
        os = "Linux";
    let browser = "Other";
    if (/chrome|crios/.test(ua) && !/edge|edg/.test(ua))
        browser = "Chrome";
    else if (/safari/.test(ua) && !/chrome|crios/.test(ua))
        browser = "Safari";
    else if (/firefox/.test(ua))
        browser = "Firefox";
    else if (/edg/.test(ua))
        browser = "Edge";
    else if (/opera|opr/.test(ua))
        browser = "Opera";
    const getOSVersion = () => {
        var _a, _b;
        let match;
        if (os === "iOS") {
            match = userAgent.match(/OS (\d+[\._]\d+)?/);
            return match ? ((_a = match[1]) === null || _a === void 0 ? void 0 : _a.replace("_", ".")) || "" : "";
        }
        else if (os === "Android") {
            match = userAgent.match(/Android\s([0-9\.]+)/);
            return match ? match[1] : "";
        }
        else if (os === "Windows") {
            match = userAgent.match(/Windows NT ([0-9\.]+)/);
            return match ? match[1] : "";
        }
        else if (os === "Mac OS") {
            match = userAgent.match(/Mac OS X ([0-9_]+)/);
            return match ? ((_b = match[1]) === null || _b === void 0 ? void 0 : _b.replace("_", ".")) || "" : "";
        }
        return "";
    };
    const getBrowserVersion = () => {
        let match;
        if (browser === "Chrome") {
            match = userAgent.match(/Chrome\/([0-9\.]+)/);
        }
        else if (browser === "Safari") {
            match = userAgent.match(/Version\/([0-9\.]+)/);
        }
        else if (browser === "Firefox") {
            match = userAgent.match(/Firefox\/([0-9\.]+)/);
        }
        else if (browser === "Edge") {
            match = userAgent.match(/Edg\/([0-9\.]+)/);
        }
        else if (browser === "Opera") {
            match = userAgent.match(/Opera\/([0-9\.]+)|OPR\/([0-9\.]+)/);
        }
        return match ? match[1] || match[2] || "" : "";
    };
    const isTouchScreen = () => "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
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
        language: navigator.language,
        platform: navigator.platform,
        userAgent,
    };
};
exports.detectDevice = detectDevice;
