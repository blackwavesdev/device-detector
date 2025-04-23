export type DeviceInfo = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    os: "iOS" | "Android" | "Windows" | "Mac OS" | "Linux" | "Other";
    osVersion: string;
    browser: "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" | "Other";
    browserVersion: string;
    deviceType: "Mobile" | "Tablet" | "Desktop";
    isTouchScreen: boolean;
    language: string;
    platform: string;
    userAgent: string;
};
export declare const detectDevice: () => DeviceInfo;
