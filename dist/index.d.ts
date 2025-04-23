export type OS = "iOS" | "Android" | "Windows" | "Mac OS" | "Linux" | "Other";
export type Browser = "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" | "Other";
export type DeviceType = "Mobile" | "Tablet" | "Desktop";
export type DeviceInfo = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    os: OS;
    osVersion: string;
    browser: Browser;
    browserVersion: string;
    deviceType: DeviceType;
    isTouchScreen: boolean;
    language: string;
    platform: string;
    userAgent: string;
};
export declare const detectDevice: (userAgentString?: string) => DeviceInfo;
