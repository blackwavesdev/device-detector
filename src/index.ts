// src/index.ts
export type OS = "iOS" | "Android" | "Windows" | "Mac OS" | "Linux" | "Other";
export type Browser =
  | "Chrome"
  | "Safari"
  | "Firefox"
  | "Edge"
  | "Opera"
  | "Brave"
  | "Other";
export type DeviceType = "Mobile" | "Tablet" | "Desktop";
export type ConnectionType =
  | "wifi"
  | "cellular"
  | "ethernet"
  | "none"
  | "unknown";
export type EffectiveConnectionType =
  | "slow-2g"
  | "2g"
  | "3g"
  | "4g"
  | "5g"
  | "unknown";

export type DeviceInfo = {
  // Basic Info
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  userAgent: string;

  // OS Info
  os: OS;
  osVersion: string;
  platform: string;

  // Browser Info
  browser: Browser;
  browserVersion: string;
  isBrave: boolean;
  isPWA: boolean;
  isPrivateBrowsing: boolean;

  // Screen Info
  screen: {
    width: number;
    height: number;
    resolution: string;
    colorDepth: number;
    pixelRatio: number;
    orientation: "portrait" | "landscape";
  };

  // Hardware Info
  hardware: {
    cores: number;
    memory: number | null;
    model: string | null;
    vendor: string | null;
    webGLRenderer: string | null;
    webGLVersion: string | null;
  };

  // Network Info
  network: {
    type: ConnectionType;
    effectiveType: EffectiveConnectionType;
    downlink: number | null;
    rtt: number | null;
    saveData: boolean;
  };

  // Media Capabilities
  media: {
    webpSupport: boolean;
    avifSupport: boolean;
  };

  // Privacy
  privacy: {
    cookiesEnabled: boolean;
    doNotTrack: boolean;
  };

  // Localization
  language: string;
  timezone: string;
};

const detectOS = (ua: string): { os: OS; osVersion: string } => {
  let os: OS = "Other";
  let osVersion = "";

  if (/windows nt/i.test(ua)) {
    os = "Windows";
    const match = /Windows NT (\d+\.\d+)/i.exec(ua);
    osVersion = match?.[1] || "";
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "Mac OS";
    const match = /Mac OS X (\d+[._]\d+(?:[._]\d+)?)/i.exec(ua);
    osVersion = match?.[1]?.replace(/_/g, ".") || "";
  } else if (/android/i.test(ua)) {
    os = "Android";
    const match = /Android (\d+\.\d+(?:\.\d+)?)/i.exec(ua);
    osVersion = match?.[1] || "";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
    const match = /OS (\d+[._]\d+(?:[._]\d+)?)/i.exec(ua);
    osVersion = match?.[1]?.replace(/_/g, ".") || "";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  return { os, osVersion };
};

const detectBrowser = (
  ua: string
): { browser: Browser; version: string; isBrave: boolean } => {
  let browser: Browser = "Other";
  let version = "";
  let isBrave = false;

  // Test for Brave first as it mimics Chrome
  if ((navigator as any).brave || /brave/i.test(ua)) {
    browser = "Brave";
    isBrave = true;
  } else if (/edg|edge|edga|edgios|edg/i.test(ua)) {
    browser = "Edge";
  } else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) {
    browser = "Chrome";
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Firefox";
  } else if (/opera|opr/i.test(ua)) {
    browser = "Opera";
  }

  // Version detection
  const versionPatterns: Record<Browser, RegExp[]> = {
    Chrome: [/chrome\/(\d+\.\d+\.\d+\.\d+)/i, /chrome\/(\d+\.\d+)/i],
    Safari: [/version\/(\d+\.\d+(?:\.\d+)?)/i],
    Firefox: [/firefox\/(\d+\.\d+(?:\.\d+)?)/i],
    Edge: [/edg?\/(\d+\.\d+(?:\.\d+)?)/i],
    Opera: [/opr\/(\d+\.\d+(?:\.\d+)?)/i, /opera\/(\d+\.\d+(?:\.\d+)?)/i],
    Brave: [/brave\/(\d+\.\d+(?:\.\d+)?)/i],
    Other: [/(?:rv:|version\/)(\d+\.\d+(?:\.\d+)?)/i],
  };

  for (const pattern of versionPatterns[browser]) {
    const match = pattern.exec(ua);
    if (match) {
      version = match[1];
      break;
    }
  }

  return { browser, version, isBrave };
};

const getScreenInfo = () => {
  const width = window.screen.width;
  const height = window.screen.height;
  const orientation: "landscape" | "portrait" =
    width > height ? "landscape" : "portrait";
  return {
    width,
    height,
    resolution: `${width}x${height}`,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
    orientation,
  };
};

const getHardwareInfo = () => {
  const canvas = document.createElement("canvas");
  const gl = (canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  let webGLRenderer = null;
  let webGLVersion = null;

  if (gl) {
    try {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      webGLRenderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER);
      webGLVersion = gl.getParameter(gl.VERSION);
    } catch (e) {
      console.warn("Could not get WebGL info:", e);
    }
  }

  return {
    cores: navigator.hardwareConcurrency || 0,
    memory: (navigator as any).deviceMemory || null,
    model: null, // Will be filled in detectDevice
    vendor: null, // Will be filled in detectDevice
    webGLRenderer,
    webGLVersion,
  };
};

const getNetworkInfo = () => {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;
  return {
    type: connection?.type || "unknown",
    effectiveType: connection?.effectiveType || "unknown",
    downlink: connection?.downlink || null,
    rtt: connection?.rtt || null,
    saveData: connection?.saveData || false,
  };
};

const getMediaCapabilities = async () => {
  const webpSupport = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src =
      "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
  });

  const avifSupport = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
  });

  return {
    webpSupport: webpSupport as boolean,
    avifSupport: avifSupport as boolean,
  };
};

export const detectDevice = async (
  userAgentString?: string
): Promise<DeviceInfo> => {
  const userAgent =
    userAgentString ||
    (typeof navigator !== "undefined"
      ? navigator.userAgent || navigator.vendor || (window as any).opera
      : "");

  const ua = userAgent.toLowerCase();
  const isMobile =
    /iphone|ipod|android.*mobile|windows phone|blackberry|bb10|iemobile/i.test(
      ua
    );
  const isTablet = /ipad|android(?!.*mobile)|tablet|kindle|silk/i.test(ua);
  const isDesktop = !isMobile && !isTablet;

  // OS Detection
  const { os, osVersion } = detectOS(ua);

  // Browser Detection
  const { browser, version: browserVersion, isBrave } = detectBrowser(ua);

  // Device model/vendor detection
  let deviceModel = null;
  let deviceVendor = null;

  if (/iphone|ipad|ipod/i.test(ua)) {
    deviceVendor = "Apple";
    const match = /(iPhone|iPad|iPod)[\s\/](\d+)/i.exec(ua);
    if (match) deviceModel = match[1] + " " + match[2];
  } else if (/samsung/i.test(ua)) {
    deviceVendor = "Samsung";
  } else if (/huawei/i.test(ua)) {
    deviceVendor = "Huawei";
  } else if (/xiaomi|redmi|poco/i.test(ua)) {
    deviceVendor = "Xiaomi";
  }

  // Screen info
  const screenInfo =
    typeof window !== "undefined"
      ? getScreenInfo()
      : {
          width: 0,
          height: 0,
          resolution: "0x0",
          colorDepth: 0,
          pixelRatio: 1,
          orientation: "portrait" as "portrait",
        };

  // Hardware info
  const hardwareInfo =
    typeof navigator !== "undefined"
      ? getHardwareInfo()
      : {
          cores: 0,
          memory: null,
          model: null,
          vendor: null,
          webGLRenderer: null,
          webGLVersion: null,
        };

  // Network info
  const networkInfo =
    typeof navigator !== "undefined"
      ? getNetworkInfo()
      : {
          type: "unknown",
          effectiveType: "unknown",
          downlink: null,
          rtt: null,
          saveData: false,
        };

  // Media capabilities
  const mediaCapabilities =
    typeof window !== "undefined"
      ? await getMediaCapabilities()
      : { webpSupport: false, avifSupport: false };

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType: isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop",
    userAgent,

    os,
    osVersion,
    platform: typeof navigator !== "undefined" ? navigator.platform : "",

    browser,
    browserVersion,
    isBrave,
    isPWA: window.matchMedia("(display-mode: standalone)").matches,
    isPrivateBrowsing:
      !!(window as any).webkitRequestFileSystem ||
      !!(window as any).RequestFileSystem,

    screen: screenInfo,
    hardware: {
      ...hardwareInfo,
      model: deviceModel,
      vendor: deviceVendor,
    },
    network: networkInfo,
    media: mediaCapabilities,

    privacy: {
      cookiesEnabled:
        typeof navigator !== "undefined" ? navigator.cookieEnabled : false,
      doNotTrack:
        typeof navigator !== "undefined"
          ? navigator.doNotTrack === "1" || (window as any).doNotTrack === "1"
          : false,
    },

    language:
      typeof navigator !== "undefined"
        ? navigator.language || (navigator as any).userLanguage || ""
        : "",
    timezone:
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "",
  };
};

// Export default for convenience
export default detectDevice;
