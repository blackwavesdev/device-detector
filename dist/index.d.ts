export type OS = "iOS" | "Android" | "Windows" | "Mac OS" | "Linux" | "Other";
export type Browser = "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" | "Brave" | "Other";
export type DeviceType = "Mobile" | "Tablet" | "Desktop";
export type ConnectionType = "wifi" | "cellular" | "ethernet" | "none" | "unknown";
export type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g" | "5g" | "unknown";
export type DeviceInfo = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    deviceType: DeviceType;
    userAgent: string;
    mediaCapabilities?: any;
    os: OS;
    osVersion: string;
    platform: string;
    deviceModel: string | null;
    deviceVendor: string | null;
    networkInfo?: {
        type: ConnectionType;
        effectiveType: EffectiveConnectionType;
        downlink: number | null;
        rtt: number | null;
        saveData: boolean;
    };
    hardwareInfo?: {
        cores: number;
        memory: number | null;
        model: string | null;
        vendor: string | null;
        webGLRenderer: string | null;
        webGLVersion: string | null;
    };
    browser: Browser;
    browserVersion: string;
    isBrave: boolean;
    isPWA: boolean;
    isPrivateBrowsing: boolean;
    screen?: {
        width: number;
        height: number;
        resolution: string;
        colorDepth: number;
        pixelRatio: number;
        orientation: "portrait" | "landscape";
    };
    hardware?: {
        cores: number;
        memory: number | null;
        model: string | null;
        vendor: string | null;
        webGLRenderer: string | null;
        webGLVersion: string | null;
    };
    network?: {
        type: ConnectionType;
        effectiveType: EffectiveConnectionType;
        downlink: number | null;
        rtt: number | null;
        saveData: boolean;
    };
    media?: {
        webpSupport: boolean;
        avifSupport: boolean;
    };
    privacy?: {
        cookiesEnabled: boolean;
        doNotTrack: boolean;
    };
    language: string;
    timezone: string;
};
export declare const detectDevice: (userAgentString?: string) => Promise<DeviceInfo>;
export default detectDevice;
