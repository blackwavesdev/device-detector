export type OS = "iOS" | "Android" | "Windows" | "Mac OS" | "Linux" | "Other";
export type Browser =
  | "Chrome"
  | "Safari"
  | "Firefox"
  | "Edge"
  | "Opera"
  | "Other";
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

export const detectDevice = (userAgentString?: string): DeviceInfo => {
  // Allow passing a custom UA string for server-side detection
  const userAgent =
    userAgentString ||
    (typeof navigator !== "undefined"
      ? navigator.userAgent || navigator.vendor || (window as any).opera
      : "");
  const ua = userAgent.toLowerCase();

  // Device type detection
  const isMobile =
    /iphone|ipod|android.*mobile|windows phone|blackberry|bb10|iemobile/i.test(
      ua
    );
  const isTablet = /ipad|android(?!.*mobile)|tablet|kindle|silk/i.test(ua);
  const isDesktop = !isMobile && !isTablet;

  // OS detection
  let os: OS = "Other";
  if (/windows nt|win32|win64/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x|mac_powerpc/i.test(ua)) os = "Mac OS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  // Browser detection
  let browser: Browser = "Other";
  if (/chrome|crios/i.test(ua) && !/edge|edg|opr|opera/i.test(ua))
    browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua))
    browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/edg|edge|edga|edgios|edg/i.test(ua)) browser = "Edge";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  // OS version extraction
  const getOSVersion = (): string => {
    const versionPatterns: Record<OS, RegExp> = {
      iOS: /os (\d+[._]\d+(?:[._]\d+)?)/i,
      Android: /android[ /-](\d+[._]\d+(?:[._]\d+)?)/i,
      Windows: /windows nt (\d+[._]\d+)/i,
      "Mac OS": /mac os x (\d+[._]\d+(?:[._]\d+)?)/i,
      Linux: /(?:linux|ubuntu)[ /](\d+[._]\d+(?:[._]\d+)?)/i,
      Other: /(?:rv:|version\/)(\d+[._]\d+(?:[._]\d+)?)/i,
    };

    const match = userAgent.match(versionPatterns[os]);
    if (!match) return "";

    return match[1]?.replace(/_/g, ".") || "";
  };

  // Browser version extraction
  const getBrowserVersion = (): string => {
    const versionPatterns: Record<Browser, RegExp[]> = {
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
      if (match) return match[1]?.replace(/_/g, ".");
    }

    return "";
  };

  // Touch screen detection
  const isTouchScreen = (): boolean => {
    if (typeof window === "undefined") return isMobile || isTablet;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  };

  // Language detection
  const getLanguage = (): string => {
    if (typeof navigator === "undefined") return "";
    return (
      navigator.language ||
      (navigator as any).userLanguage ||
      (navigator as any).browserLanguage ||
      (navigator as any).systemLanguage ||
      ""
    );
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
