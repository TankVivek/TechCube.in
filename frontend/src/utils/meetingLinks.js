/** Matches Google Meet, Zoom, Jitsi, Talky, and native TechCube video-call URLs */
export const MEETING_URL_REGEX =
  /(https?:\/\/(?:meet\.google\.com|meet\.jit\.si|zoom\.us|talky\.io)\/[a-z0-9_.-]+|https?:\/\/[^\s]+\/video-call\/[a-zA-Z0-9_-]+)/i;

export function extractMeetingUrl(text) {
  if (!text) return null;
  const match = text.match(MEETING_URL_REGEX);
  return match ? match[1] : null;
}

export function getMeetingTheme(url) {
  const isTechCube = url.includes("/video-call/");
  const isJitsi = url.includes("jit.si");
  const isZoom = url.includes("zoom.us");
  const isTalky = url.includes("talky.io");

  if (isTechCube) {
    return {
      bg: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      border: "border-blue-200/60 dark:border-blue-800/40",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconText: "text-blue-600 dark:text-blue-400",
      title: "TechCube Video Call",
      subtitle: "Secure 1-to-1 support call",
      btn: "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
      sameTab: true,
    };
  }

  if (isJitsi) {
    return {
      bg: "from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20",
      border: "border-purple-200/60 dark:border-purple-800/40",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconText: "text-purple-600 dark:text-purple-400",
      title: "Secure Video Call",
      subtitle: "Jitsi Meet is ready",
      btn: "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
      sameTab: false,
    };
  }

  if (isZoom) {
    return {
      bg: "from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20",
      border: "border-blue-200/60 dark:border-blue-800/40",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconText: "text-blue-600 dark:text-blue-400",
      title: "Zoom Meeting",
      subtitle: "Zoom is ready",
      btn: "from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700",
      sameTab: false,
    };
  }

  if (isTalky) {
    return {
      bg: "from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20",
      border: "border-pink-200/60 dark:border-pink-800/40",
      iconBg: "bg-pink-100 dark:bg-pink-900/40",
      iconText: "text-pink-600 dark:text-pink-400",
      title: "Video Call",
      subtitle: "Talky.io is ready",
      btn: "from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700",
      sameTab: false,
    };
  }

  return {
    bg: "from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20",
    border: "border-teal-200/60 dark:border-teal-800/40",
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconText: "text-teal-600 dark:text-teal-400",
    title: "Video Support Call",
    subtitle: "Google Meet is ready",
    btn: "from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700",
    sameTab: false,
  };
}
